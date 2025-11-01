/**
 * Chatwoot All Conversations View
 *
 * Displays all conversations across all channels/inboxes.
 * Shows conversation list + message viewer in 3-panel layout.
 */

import React from "react";
import { Stack } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "../components/chatwoot-conversation-list";
import { ChatwootMessageViewer } from "../components/chatwoot-message-viewer";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";

export const AllConversationsView: React.FC = () => {
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
    updateConversationInList,
    selectedConversation,
    handleConversationSelect,
    handleBack,
  } = useChatwootProvider();

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
            onConversationUpdate={updateConversationInList}
            currentStatusFilter={filters.status}
          />
        ) : (
          <PanelContent padding="lg">
            <EmptyState
              title="No conversation selected"
              description="Choose a conversation from the list to start viewing messages"
            />
          </PanelContent>
        )}
      </Panel>
    </Stack>
  );
};
