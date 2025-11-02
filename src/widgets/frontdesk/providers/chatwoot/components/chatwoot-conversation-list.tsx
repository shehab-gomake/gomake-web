import React, { useState } from "react";
import { Box, Paper, List, Alert, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRecoilValue } from "recoil";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationListEmpty } from "../../email/components/conversation/conversation-list-empty";
import { ConversationListLoading } from "../../email/components/conversation/conversation-list-loading";
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
import { chatwootConversationCountsAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

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
  inboxes?: ChatwootInbox[];
  inboxesLoading?: boolean;
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
  inboxes = [],
  inboxesLoading = false,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  // Get counts from API response (stored in atom)
  const counts = useRecoilValue(chatwootConversationCountsAtom);

  // Get current status from filters
  const currentStatus = filters.status ? (Array.isArray(filters.status) ? filters.status[0] : filters.status) : undefined;

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
      />

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: neutralColor(0), // Light background
          px: 0.5,
          position: "relative",
        }}
      >
        {/* Beautiful Loading Overlay - Shows in list area when switching tabs */}
        <LoadingOverlay loading={loading} message="Loading conversations..." />

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
              py: 0.5,
              backgroundColor: neutralColor(0), // Light background
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
          </List>
        )}
      </Box>
    </Paper>
  );
};
