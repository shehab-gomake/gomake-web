/**
 * Chatwoot Channels View
 *
 * Displays conversations filtered by a specific channel/inbox.
 * When a specific channel is selected from the sidebar, shows only that channel's conversations.
 */

import React from "react";
import { Stack } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "../components/chatwoot-conversation-list";
import { ChatwootMessageViewer } from "../components/chatwoot-message-viewer";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";

export const ChannelsView: React.FC = () => {
  const {
    selectedAccountId: currentAccountId,
    conversations,
    conversationsLoading,
    conversationsError,
    hasMore,
    loadMore,
    refresh,
    filters,
    handleFiltersChange,
    selectedConversation,
    handleConversationSelect,
    handleBack,
  } = useChatwootProvider();

  // The provider hook automatically filters by selectedInboxId when set
  // This view shows conversations for the currently selected channel/inbox

  return (
    <Stack direction="row" spacing={2} sx={{ height: "100%", p: 2 }}>
      {/* Conversation List */}
      <Panel
        elevation={0}
        border="default"
        sx={{
          width: 400,
          minWidth: 350,
          maxWidth: 500,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ChatwootConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onConversationSelect={handleConversationSelect}
          loading={conversationsLoading}
          error={conversationsError}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onRefresh={refresh}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Panel>

      {/* Message Viewer */}
      <Panel
        elevation={0}
        border="default"
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
        }}
      >
        {selectedConversation ? (
          <ChatwootMessageViewer
            conversation={selectedConversation}
            accountId={currentAccountId || undefined}
            onBack={handleBack}
          />
        ) : (
          <PanelContent padding="lg">
            <EmptyState
              title="No conversation selected"
              description="Choose a conversation from this channel to start messaging"
            />
          </PanelContent>
        )}
      </Panel>
    </Stack>
  );
};
