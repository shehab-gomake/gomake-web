import React, { useState } from "react";
import { Box, Paper, List, Alert, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRecoilValue } from "recoil";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversationListItem } from "./chatwoot-conversation-list-item";
import { ChatwootConversationListHeader } from "./chatwoot-conversation-list-header";
import { ChatwootConversationFilters } from "./chatwoot-conversation-filters";
import { useInfiniteScroll } from "@/widgets/frontdesk/hooks/use-infinite-scroll";
import { LoadingOverlay } from "@/widgets/frontdesk/components/shared";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, ChatwootConversationsLoadingState } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
// New Chatwoot-specific loading and empty states
import { ConversationListSkeleton } from "./skeletons";
import { NoConversationsEmptyState, ErrorState } from "./empty-states";

interface ChatwootConversationListProps {
  conversations: any[];
  selectedConversationId?: string | number;
  onConversationSelect: (conversation: any) => void;
  loading?: boolean | ChatwootConversationsLoadingState;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchDisabled?: boolean;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
  inboxes?: ChatwootInbox[];
  inboxesLoading?: boolean;
  onNextClick?: () => void;
}

export const ChatwootConversationList: React.FC<ChatwootConversationListProps> = React.memo(({
  conversations,
  selectedConversationId,
  onConversationSelect,
  loading: loadingProp = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  onSearch,
  searchQuery,
  searchDisabled = false,
  filters = {},
  onFiltersChange = () => {},
  inboxes = [],
  inboxesLoading = false,
  onNextClick,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  // Extract granular loading states
  const loadingState: ChatwootConversationsLoadingState = typeof loadingProp === 'boolean'
    ? { initialLoading: loadingProp, filtering: false, loadingMore: false }
    : loadingProp;

  const { initialLoading, filtering, loadingMore } = loadingState;
  const isAnyLoading = initialLoading || filtering || loadingMore;

  // Get counts from API response (stored in atom)
  const counts = useRecoilValue(chatwootConversationCountsAtom);

  // Get current status from filters
  const currentStatus = filters.status ? (Array.isArray(filters.status) ? filters.status[0] : filters.status) : undefined;

  // Check if filters are applied (for empty state messaging)
  const hasActiveFilters = Boolean(
    filters.status ||
    filters.assignee_type ||
    filters.inbox_id ||
    filters.team_id ||
    filters.labels
  );

  // Determine filter context for empty state messaging
  const getFilterContext = () => {
    if (filters.assignee_type === "me") return "mine";
    if (filters.assignee_type === "unassigned") return "unassigned";
    if (currentStatus) return currentStatus;
    return undefined;
  };

  // Clear filters handler - resets to default filter state
  const handleClearFilters = () => {
    // Reset to default values: Mine tab + Open status
    onFiltersChange({
      assignee_type: ConversationAssigneeType.ME,
      status: ConversationStatus.OPEN,
      page: 1,
      // Explicitly clear all other filters by not including them
    });
  };

  // Infinite scroll setup
  const sentinelRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore: hasMore,
    loading: isAnyLoading,
    threshold: 200,
    enabled: !!onLoadMore && hasMore,
  });

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        backgroundColor: neutralColor(0),
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
      }}
    >
      {/* Custom Header */}
      <ChatwootConversationListHeader
        status={currentStatus as ConversationStatus}
        filters={filters}
        onFiltersChange={onFiltersChange}
        conversations={conversations}
        mineCount={counts.mine}
        unassignedCount={counts.unassigned}
        allCount={counts.all}
        onNextClick={onNextClick}
        onClearFilters={handleClearFilters}
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0),
          px: 0,
          position: "relative",
        }}
      >
        {/* Beautiful Loading Overlay - Only show for filtering, not initial load */}
        {/* This prevents the "refresh screen" effect when switching views */}
        <LoadingOverlay loading={filtering && conversations.length > 0} message="Updating conversations..." />

        {error ? (
          // Error State with retry option
          <ErrorState
            title="Failed to load conversations"
            message="We couldn't load your conversations. Please check your connection and try again."
            error={error}
            onRetry={onRefresh}
          />
        ) : initialLoading && conversations.length === 0 ? (
          // Initial loading state with skeleton (only on first load with no data)
          <ConversationListSkeleton count={8} />
        ) : conversations.length === 0 ? (
          // Empty state with context-aware messaging
          <NoConversationsEmptyState
            filterContext={getFilterContext()}
            hasFilters={hasActiveFilters}
            onRefresh={onRefresh}
            onClearFilters={handleClearFilters}
          />
        ) : (
          // Conversation list
          <List
            sx={{
              py: 0,
              backgroundColor: neutralColor(0),
            }}
          >
            {conversations.map((conversation) => (
              <ChatwootConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onConversationSelect}
                inboxes={inboxes}
                inboxesLoading={inboxesLoading}
              />
            ))}

            {/* Infinite scroll sentinel element */}
            <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

            {/* Show skeleton at bottom when loading more */}
            {loadingMore && hasMore && (
              <Box sx={{ py: 1 }}>
                <ConversationListSkeleton count={3} />
              </Box>
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-render prevention

  // Deep compare loading state (can be boolean or object)
  const loadingEqual = typeof prevProps.loading === 'boolean' && typeof nextProps.loading === 'boolean'
    ? prevProps.loading === nextProps.loading
    : typeof prevProps.loading === 'object' && typeof nextProps.loading === 'object'
    ? prevProps.loading.initialLoading === nextProps.loading.initialLoading &&
      prevProps.loading.filtering === nextProps.loading.filtering &&
      prevProps.loading.loadingMore === nextProps.loading.loadingMore
    : false;

  return (
    prevProps.conversations === nextProps.conversations &&
    prevProps.selectedConversationId === nextProps.selectedConversationId &&
    loadingEqual &&
    prevProps.error === nextProps.error &&
    prevProps.hasMore === nextProps.hasMore &&
    prevProps.searchQuery === nextProps.searchQuery &&
    prevProps.searchDisabled === nextProps.searchDisabled &&
    prevProps.filters === nextProps.filters &&
    prevProps.inboxes === nextProps.inboxes &&
    prevProps.inboxesLoading === nextProps.inboxesLoading &&
    prevProps.onLoadMore === nextProps.onLoadMore &&
    prevProps.onRefresh === nextProps.onRefresh &&
    prevProps.onSearch === nextProps.onSearch &&
    prevProps.onFiltersChange === nextProps.onFiltersChange &&
    prevProps.onConversationSelect === nextProps.onConversationSelect &&
    prevProps.onNextClick === nextProps.onNextClick
  );
});
