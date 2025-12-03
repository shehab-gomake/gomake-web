import React from "react";
import { Box, Paper } from "@mui/material";
import { useRecoilValue } from "recoil";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationListItem } from "./chatwoot-conversation-list-item";
import { ChatwootConversationListHeader } from "./chatwoot-conversation-list-header";
import { LoadingOverlay } from "@/widgets/frontdesk/components/shared";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootConversationCountsAtom, ChatwootConversationsLoadingState } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { ConversationListSkeleton } from "./skeletons";
import { NoConversationsEmptyState, ErrorState } from "./empty-states";
import { Virtuoso } from "react-virtuoso";
import { CHATWOOT_CONSTANTS } from "../config/constants";

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
  hideHeader?: boolean;
  hideAssigneeAvatars?: boolean;
}

export const ChatwootConversationList: React.FC<ChatwootConversationListProps> = React.memo(
  ({
    conversations,
    selectedConversationId,
    onConversationSelect,
    loading: loadingProp = false,
    error,
    hasMore = false,
    onLoadMore,
    onRefresh,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSearch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchQuery,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchDisabled = false,
    filters = {},
    onFiltersChange = () => {},
    inboxes = [],
    inboxesLoading = false,
    hideHeader = false,
    hideAssigneeAvatars = false,
  }) => {
    // Extract granular loading states
    const loadingState: ChatwootConversationsLoadingState =
      typeof loadingProp === "boolean" ? { initialLoading: loadingProp, filtering: false, loadingMore: false } : loadingProp;

    const { initialLoading, filtering, loadingMore } = loadingState;

    const counts = useRecoilValue(chatwootConversationCountsAtom);

    const currentStatus = filters.status ? (Array.isArray(filters.status) ? filters.status[0] : filters.status) : undefined;

    const hasActiveFilters = Boolean(
      filters.status || filters.assignee_type || filters.inbox_id || filters.team_id || filters.labels
    );

    const getFilterContext = () => {
      if (filters.assignee_type === "me") return "mine";
      if (filters.assignee_type === "unassigned") return "unassigned";
      if (currentStatus) return currentStatus;
      return undefined;
    };

    const handleClearFilters = () => {
      onFiltersChange({
        assignee_type: ConversationAssigneeType.ME,
        status: ConversationStatus.OPEN,
        page: 1,
      });
    };

    return (
      <Paper
        elevation={hideHeader ? 0 : 2}
        sx={{
          height: "100%",
          borderRadius: hideHeader ? 0 : radiusTokens.lg,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: colorTokens.semantic.background.primary,
          boxShadow: hideHeader ? "none" : shadowTokens.sm,
        }}
      >
        {!hideHeader && (
          <ChatwootConversationListHeader
            status={currentStatus as ConversationStatus}
            filters={filters}
            onFiltersChange={onFiltersChange}
            conversations={conversations}
            mineCount={counts.mine}
            unassignedCount={counts.unassigned}
            allCount={counts.all}
            onClearFilters={handleClearFilters}
          />
        )}

        <Box
          sx={{
            flex: 1,
            overflow: "hidden", // Virtuoso handles scrolling
            backgroundColor: colorTokens.semantic.background.primary,
            px: 0,
            position: "relative",
          }}
        >
          <LoadingOverlay loading={filtering && conversations.length > 0} message="Updating conversations..." />

          {error ? (
            <ErrorState
              title="Failed to load conversations"
              message="We couldn't load your conversations. Please check your connection and try again."
              error={error}
              onRetry={onRefresh}
            />
          ) : initialLoading && conversations.length === 0 ? (
            <ConversationListSkeleton count={8} />
          ) : conversations.length === 0 ? (
            <NoConversationsEmptyState
              filterContext={getFilterContext()}
              hasFilters={hasActiveFilters}
              onRefresh={onRefresh}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <Virtuoso
              style={{ height: "100%", width: "100%" }}
              data={conversations}
              endReached={() => {
                if (hasMore && !loadingMore && !filtering && !initialLoading) {
                  onLoadMore?.();
                }
              }}
              overscan={200}
              itemContent={(index, conversation) => (
                <ChatwootConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={conversation.id === selectedConversationId}
                  onSelect={onConversationSelect}
                  inboxes={inboxes}
                  inboxesLoading={inboxesLoading}
                  hideAssigneeAvatar={hideAssigneeAvatars}
                />
              )}
              components={{
                Footer: () =>
                  loadingMore ? (
                    <Box sx={{ py: 1 }}>
                      <ConversationListSkeleton count={1} />
                    </Box>
                  ) : null,
              }}
            />
          )}
        </Box>
      </Paper>
    );
  },
  (prevProps, nextProps) => {
    const loadingEqual =
      typeof prevProps.loading === "boolean" && typeof nextProps.loading === "boolean"
        ? prevProps.loading === nextProps.loading
        : typeof prevProps.loading === "object" && typeof nextProps.loading === "object"
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
      prevProps.hideHeader === nextProps.hideHeader &&
      prevProps.hideAssigneeAvatars === nextProps.hideAssigneeAvatars &&
      prevProps.onLoadMore === nextProps.onLoadMore &&
      prevProps.onRefresh === nextProps.onRefresh &&
      prevProps.onSearch === nextProps.onSearch &&
      prevProps.onFiltersChange === nextProps.onFiltersChange &&
      prevProps.onConversationSelect === nextProps.onConversationSelect
    );
  }
);
