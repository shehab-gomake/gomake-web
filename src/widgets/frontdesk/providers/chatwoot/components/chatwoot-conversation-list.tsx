import React, { useState, useMemo } from "react";
import { Box, Paper, List, Alert } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationListEmpty } from "../../email/components/conversation/conversation-list-empty";
import { ConversationListLoading } from "../../email/components/conversation/conversation-list-loading";
import { ChatwootConversationListItem } from "./chatwoot-conversation-list-item";
import { ChatwootConversationListHeader } from "./chatwoot-conversation-list-header";
import { ChatwootConversationFilters } from "./chatwoot-conversation-filters";
import { useInfiniteScroll } from "@/widgets/frontdesk/hooks/use-infinite-scroll";
import { InfiniteScrollLoader } from "@/widgets/frontdesk/components/shared";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface ChatwootConversationListProps {
  conversations: any[];
  selectedConversationId?: string | number;
  onConversationSelect: (conversation: any) => void;
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  searchDisabled?: boolean;
  filters?: Partial<ConversationListParams>;
  onFiltersChange?: (filters: Partial<ConversationListParams>) => void;
}

export const ChatwootConversationList: React.FC<ChatwootConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  loading = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  onSearch,
  searchQuery,
  searchDisabled = false,
  filters = {},
  onFiltersChange = () => {},
}) => {
  const { neutralColor } = useGomakeTheme();

  // Calculate counts
  const counts = useMemo(() => {
    const mine = conversations.filter((c) => c.meta?.assignee?.id).length;
    const unassigned = conversations.filter((c) => !c.meta?.assignee?.id).length;
    const all = conversations.length;
    return { mine, unassigned, all };
  }, [conversations]);

  // Get current status from filters
  const currentStatus = filters.status 
    ? (Array.isArray(filters.status) ? filters.status[0] : filters.status)
    : undefined;

  // Infinite scroll setup
  const sentinelRef = useInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore: hasMore,
    loading: loading,
    threshold: 200,
    enabled: !!onLoadMore && hasMore,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Custom Header */}
      <ChatwootConversationListHeader
        status={currentStatus as ConversationStatus}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onFilterClick={() => setFilterMenuOpen(true)}
        onSortClick={() => setSortMenuOpen(true)}
        conversations={conversations}
        mineCount={counts.mine}
        unassignedCount={counts.unassigned}
        allCount={counts.all}
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0), // Light background
          px: 1,
        }}
      >
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : loading && conversations.length === 0 ? (
          <ConversationListLoading />
        ) : conversations.length === 0 ? (
          <ConversationListEmpty selectedLabel={null} />
        ) : (
          <List
            sx={{
              py: 1,
              backgroundColor: neutralColor(0), // Light background
            }}
          >
            {conversations.map((conversation) => (
              <ChatwootConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={conversation.id === selectedConversationId}
                onSelect={onConversationSelect}
              />
            ))}

            {/* Infinite scroll sentinel element */}
            <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />

            {/* Loading indicator at bottom */}
            {loading && conversations.length > 0 && <InfiniteScrollLoader />}
          </List>
        )}
      </Box>
    </Paper>
  );
};

