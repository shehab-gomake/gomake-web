/**
 * Chatwoot Unattended View
 *
 * Displays unassigned or unattended conversations that need attention.
 * Uses the same layout as All Conversations but filters for unassigned conversations.
 */

import React from "react";
import { Stack } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "../components/chatwoot-conversation-list";
import { ChatwootMessageViewer } from "../components/chatwoot-message-viewer";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";

export const UnattendedView: React.FC = () => {
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

  // TODO: Add unattended filtering logic
  // Need to filter by assignee_type=none or unassigned status
  // This may require updating the useChatwootProvider hook to support different filter modes

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
              description="Choose an unattended conversation to start responding"
            />
          </PanelContent>
        )}
      </Panel>
    </Stack>
  );
};
