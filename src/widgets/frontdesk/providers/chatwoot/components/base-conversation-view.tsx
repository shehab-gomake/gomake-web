/**
 * Base Conversation View Component
 *
 * Reusable component for displaying conversations with message viewer.
 * Eliminates code duplication across all conversation views
 * (All Conversations, Channels, Mentions, Unattended).
 *
 * Redesigned with:
 * - 12-column responsive grid
 * - 24px gutter spacing between columns
 * - 14px card radius with soft shadows
 * - 8px vertical rhythm
 * - Modern premium SaaS aesthetic
 *
 * Layout: [List] [Content + Detail]
 * Both list and detail are always mounted (matches Chatwoot pattern).
 * This prevents duplicate provider calls and maintains scroll/filter state.
 */

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Inbox as InboxIcon } from "@mui/icons-material";
import {
  PanelContent,
  EmptyState,
  colorTokens,
  layoutTokens,
  shadowTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";
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

export const BaseConversationView: React.FC<BaseConversationViewProps> = ({
  emptyState,
  messageViewerProps,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

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

  const [showComposeModal, setShowComposeModal] = useState(false);

  // Sidebar visibility state - persist to localStorage
  const [isSidebarVisible, setIsSidebarVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatwoot-sidebar-visible");
      return saved !== null ? saved === "true" : true; // Default to visible
    }
    return true;
  });

  // Save sidebar visibility preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "chatwoot-sidebar-visible",
        String(isSidebarVisible)
      );
    }
  }, [isSidebarVisible]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

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
        icon={<InboxIcon />}
        title={emptyState.title}
        description={emptyState.description}
      />
    ),
    [emptyState.title, emptyState.description]
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backgroundColor: colorTokens.neutral[100],
        gap: `${layoutTokens.columnGap.default}px`, // Use design system gutter
        padding: `${semanticSpacing.container.md}px`, // Use design system container padding
        direction: dir, // RTL support
      }}
    >
      {/* Conversation List Panel */}
      <Box
        sx={{
          width: layoutTokens.panel.conversationList.default,
          minWidth: layoutTokens.panel.conversationList.default,
          height: "100%",
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${layoutTokens.card.radius}px`, // Use design system card radius
          boxShadow: shadowTokens.card, // Use design system shadow
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: shadowTokens.cardHover, // Use design system hover shadow
          },
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
        />
      </Box>

      {/* Message Viewer Panel */}
      <Box
        sx={{
          flex: 1,
          height: "100%",
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${layoutTokens.card.radius}px`,
          boxShadow: shadowTokens.card,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          transition: "box-shadow 0.2s ease",
        }}
      >
        {selectedConversation ? (
          <Stack
            direction="row"
            spacing={0}
            sx={{ height: "100%", overflow: "hidden" }}
          >
            {/* Main Message Area */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <ChatwootMessageViewer
                conversation={selectedConversation}
                accountId={currentAccountId || undefined}
                onBack={handleBack}
                onConversationUpdate={updateConversationInList}
                currentStatusFilter={
                  Array.isArray(filters.status)
                    ? filters.status[0]
                    : filters.status
                }
                inboxes={inboxes}
                inboxesLoading={inboxesLoading}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={handleToggleSidebar}
                {...messageViewerProps}
              />
            </Box>

            {/* Right Detail Panel - conditionally rendered */}
            {isSidebarVisible && (
              <Box
                sx={{
                  width: layoutTokens.panel.detailSidebar.default,
                  minWidth: layoutTokens.panel.detailSidebar.default,
                  borderLeft: `1px solid ${colorTokens.semantic.border.light}`,
                  backgroundColor: colorTokens.semantic.background.primary,
                }}
              >
                <ChatwootConversationDetailPanel
                  key={selectedConversation.id}
                  conversation={selectedConversation}
                  accountId={currentAccountId || undefined}
                  inboxes={inboxes}
                  onConversationUpdate={updateConversationInList}
                />
              </Box>
            )}
          </Stack>
        ) : (
          <PanelContent padding="lg" sx={{ direction: dir }}>
            {emptyStateContent}
          </PanelContent>
        )}
      </Box>

      {/* Compose Conversation Modal */}
      <ComposeConversationModal
        open={showComposeModal}
        onClose={handleComposeClose}
        onSuccess={handleComposeSuccess}
        accountId={currentAccountId}
      />
    </Box>
  );
};
