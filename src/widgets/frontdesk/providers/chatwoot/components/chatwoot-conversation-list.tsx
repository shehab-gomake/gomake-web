import React from "react";
import { Box, Paper, List, Alert } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ConversationListHeader } from "../../email/components/conversation/conversation-list-header";
import { ConversationListEmpty } from "../../email/components/conversation/conversation-list-empty";
import { ConversationListLoading } from "../../email/components/conversation/conversation-list-loading";
import { ChatwootConversationListItem } from "./chatwoot-conversation-list-item";
import { useInfiniteScroll } from "@/widgets/frontdesk/hooks/use-infinite-scroll";
import { InfiniteScrollLoader } from "@/widgets/frontdesk/components/shared";

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
}) => {
  const { neutralColor } = useGomakeTheme();

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
      <ConversationListHeader
        selectedLabel={null}
        onSearch={onSearch}
        searchQuery={searchQuery}
        searchDisabled={searchDisabled}
      />

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", px: 1 }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : loading && conversations.length === 0 ? (
          <ConversationListLoading />
        ) : conversations.length === 0 ? (
          <ConversationListEmpty selectedLabel={null} />
        ) : (
          <List sx={{ py: 1 }}>
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

