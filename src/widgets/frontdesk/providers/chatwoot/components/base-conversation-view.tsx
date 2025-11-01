/**
 * Base Conversation View Component
 *
 * Reusable component for displaying conversations with message viewer.
 * Eliminates code duplication across all conversation views
 * (All Conversations, Channels, Mentions, Unattended).
 */

import React from "react";
import { Stack } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "./chatwoot-conversation-list";
import { ChatwootMessageViewer } from "./chatwoot-message-viewer";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface BaseConversationViewProps {
  /** Empty state configuration when no conversation is selected */
  emptyState: {
    title: string;
    description: string;
  };
  /** Additional props to pass to ChatwootMessageViewer */
  messageViewerProps?: {
    onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
  };
}

export const BaseConversationView: React.FC<BaseConversationViewProps> = ({
  emptyState,
  messageViewerProps,
}) => {
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
            currentStatusFilter={Array.isArray(filters.status) ? filters.status[0] : filters.status}
            {...messageViewerProps}
          />
        ) : (
          <PanelContent padding="lg">
            <EmptyState
              title={emptyState.title}
              description={emptyState.description}
            />
          </PanelContent>
        )}
      </Panel>
    </Stack>
  );
};
