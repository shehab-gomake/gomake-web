/**
 * Base Conversation View Component
 *
 * Reusable component for displaying conversations with message viewer.
 * Eliminates code duplication across all conversation views
 * (All Conversations, Channels, Mentions, Unattended).
 */

import React, { useMemo, useCallback } from "react";
import { Stack, Box, Divider, useTheme } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "./chatwoot-conversation-list";
import { ChatwootMessageViewer } from "./chatwoot-message-viewer";
import { ChatwootConversationDetailPanel } from "./chatwoot-conversation-detail-panel";
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

export const BaseConversationView: React.FC<BaseConversationViewProps> = ({ emptyState, messageViewerProps }) => {
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
    inboxes,
    inboxesLoading,
    router,
  } = useChatwootProvider();

  const theme = useTheme();

  // Memoize empty state to prevent unnecessary re-renders
  const emptyStateContent = useMemo(
    () => (
      <EmptyState
        icon="inbox"
        title="No ticket selected"
        description="Select a ticket from the list to view messages"
      />
    ),
    []
  );

  // Handler to navigate to next conversation
  const handleNextConversation = useCallback(() => {
    if (!selectedConversation || conversations.length === 0) {
      return;
    }

    // Find current conversation index
    const currentIndex = conversations.findIndex((conv) => conv.id === selectedConversation.id);

    // If not found or at the end, do nothing
    if (currentIndex === -1 || currentIndex === conversations.length - 1) {
      return;
    }

    // Get next conversation
    const nextConversation = conversations[currentIndex + 1];
    if (nextConversation) {
      // Navigate using router ONLY - this will update URL and trigger useEffect to update Recoil
      // No need to call handleConversationSelect separately (prevents double state update)
      const inboxId = nextConversation.inbox_id?.toString();
      router.navigateToConversation(nextConversation.id.toString(), inboxId);
    }
  }, [selectedConversation, conversations, router]);

  return (
    <Stack direction="row" spacing={0} sx={{ height: "100%", p: 0 }}>
      {/* Conversation List */}
      <Panel
        elevation={1}
        border="none"
        sx={{
          width: 400,
          minWidth: 350,
          maxWidth: 500,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "background.paper",
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
          inboxes={inboxes}
          inboxesLoading={inboxesLoading}
          onNextClick={handleNextConversation}
        />
      </Panel>

      {/* Divider between list and viewer */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />

      {/* Message Viewer */}
      <Panel
        elevation={1}
        border="none"
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          backgroundColor: "background.paper",
        }}
      >
        {selectedConversation ? (
          <Stack direction="row" spacing={0} sx={{ height: "100%", overflow: "hidden" }}>
            {/* Main Message Area */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
              <ChatwootMessageViewer
                conversation={selectedConversation}
                accountId={currentAccountId || undefined}
                onBack={handleBack}
                onConversationUpdate={updateConversationInList}
                currentStatusFilter={Array.isArray(filters.status) ? filters.status[0] : filters.status}
                inboxes={inboxes}
                inboxesLoading={inboxesLoading}
                {...messageViewerProps}
              />
            </Box>

            {/* Divider between message viewer and detail panel */}
            <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />

            {/* Right Detail Panel */}
            <ChatwootConversationDetailPanel
              conversation={selectedConversation}
              accountId={currentAccountId || undefined}
              inboxes={inboxes}
              onConversationUpdate={updateConversationInList}
            />
          </Stack>
        ) : (
          <PanelContent padding="lg">{emptyStateContent}</PanelContent>
        )}
      </Panel>
    </Stack>
  );
};
