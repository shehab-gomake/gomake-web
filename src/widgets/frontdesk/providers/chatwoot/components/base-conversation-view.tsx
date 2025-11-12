/**
 * Base Conversation View Component
 *
 * Reusable component for displaying conversations with message viewer.
 * Eliminates code duplication across all conversation views
 * (All Conversations, Channels, Mentions, Unattended).
 *
 * Layout: [List] [Divider] [Detail OR EmptyState]
 * Both list and detail are always mounted (matches Chatwoot pattern).
 * This prevents duplicate provider calls and maintains scroll/filter state.
 */

import React, { useMemo, useCallback, useState } from "react";
import { Stack, Box, Divider, useTheme } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "./chatwoot-conversation-list";
import { ChatwootMessageViewer } from "./chatwoot-message-viewer";
import { ChatwootConversationDetailPanel } from "./chatwoot-conversation-detail-panel";
import { ComposeConversationModal } from "./compose/ComposeConversationModal";
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
  // Single provider call - prevents duplicate inbox fetches
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
  const [showComposeModal, setShowComposeModal] = useState(false);

  // Handle compose button click
  const handleComposeClick = useCallback(() => {
    setShowComposeModal(true);
  }, []);

  // Handle compose modal close
  const handleComposeClose = useCallback(() => {
    setShowComposeModal(false);
  }, []);

  // Handle successful conversation creation
  const handleComposeSuccess = useCallback(
    (conversationId: number) => {
      setShowComposeModal(false);
      // Navigate to the newly created conversation
      router.navigateToConversation(conversationId.toString());
      // Refresh conversation list to show the new conversation
      refresh();
    },
    [router, refresh]
  );

  // Memoize empty state to prevent unnecessary re-renders
  const emptyStateContent = useMemo(
    () => (
      <EmptyState
        icon="inbox"
        title={emptyState.title}
        description={emptyState.description}
      />
    ),
    [emptyState.title, emptyState.description]
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
      {/* Conversation List - Always visible */}
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
          onComposeClick={handleComposeClick}
        />
      </Panel>

      {/* Divider between list and viewer */}
      <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />

      {/* Message Viewer - Conditionally show detail or empty state */}
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
              key={selectedConversation.id}
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

      {/* Compose Conversation Modal */}
      <ComposeConversationModal
        open={showComposeModal}
        onClose={handleComposeClose}
        onSuccess={handleComposeSuccess}
        accountId={currentAccountId}
      />
    </Stack>
  );
};
