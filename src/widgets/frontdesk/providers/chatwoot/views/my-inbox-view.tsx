/**
 * Chatwoot My Inbox View
 *
 * Displays conversations assigned to the current agent with status "open".
 * This is the agent's personal workspace, showing only their assigned conversations.
 *
 * Redesigned with:
 * - 12-column responsive grid
 * - 24px gutter spacing between columns
 * - 14px card radius with soft shadows
 * - 8px vertical rhythm
 * - Modern premium SaaS aesthetic
 */

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Stack, Box, Typography } from "@mui/material";
import { 
  PanelContent, 
  EmptyState, 
  colorTokens,
  layoutTokens,
  gridConfig,
  radiusTokens,
  shadowTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";
import { ChatwootConversationList } from "../components/chatwoot-conversation-list";
import { ChatwootMessageViewer } from "../components/chatwoot-message-viewer";
import { ChatwootConversationDetailPanel } from "../components/chatwoot-conversation-detail-panel";
import { ComposeConversationModal } from "../components/compose/ComposeConversationModal";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { useChatwootRouter } from "../hooks/use-chatwoot-router";
import { ConversationStatus, ConversationAssigneeType } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { NoConversationsEmptyState } from "../components/empty-states/no-conversations-empty-state";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

export const MyInboxView: React.FC = () => {
  const router = useChatwootRouter();
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
      localStorage.setItem("chatwoot-sidebar-visible", String(isSidebarVisible));
    }
  }, [isSidebarVisible]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarVisible((prev) => !prev);
  }, []);

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
  } = useChatwootProvider();

  // Phase 2: Apply default filters on mount and ensure they're set
  useEffect(() => {
    const currentRoute = router.currentRoute;
    
    // Only set filters if they're not already set correctly for My Inbox
    if (currentRoute?.view === ChatwootView.MY_INBOX) {
      const needsStatusUpdate = !currentRoute.filters?.status || currentRoute.filters.status !== ConversationStatus.OPEN;
      const needsAssigneeUpdate = !currentRoute.filters?.assigneeType || currentRoute.filters.assigneeType !== ConversationAssigneeType.ME;
      
      if (needsStatusUpdate || needsAssigneeUpdate) {
        router.updateFilters({
          ...currentRoute.filters,
          status: ConversationStatus.OPEN,
          assigneeType: ConversationAssigneeType.ME,
        });
      }
    }
  }, [router]);

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

  // Phase 1: Calculate conversation count for subheader
  const conversationCount = useMemo(() => {
    return conversations.length;
  }, [conversations.length]);

  // Phase 3: Custom empty state for "all caught up"
  const emptyStateContent = useMemo(() => {
    if (conversationsLoading.initialLoading) {
      return null; // Will show loading skeleton
    }

    if (conversations.length === 0) {
      return (
        <NoConversationsEmptyState
          filterContext="mine"
          hasFilters={false}
          onRefresh={refresh}
        />
      );
    }

    return (
      <EmptyState 
        icon="inbox" 
        title="No conversation selected" 
        description="Choose a conversation from the list to start viewing messages" 
      />
    );
  }, [conversations.length, conversationsLoading.initialLoading, refresh]);

  // Phase 1: Custom header with title and subheader (modern styling)
  const listHeader = useMemo(() => {
    return (
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${colorTokens.neutral[100]}`,
          backgroundColor: colorTokens.semantic.background.primary,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            color: colorTokens.semantic.text.primary,
            mb: 0.5,
            letterSpacing: "-0.01em",
          }}
        >
          My Tickets
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.semantic.text.secondary,
            fontSize: "0.8125rem",
          }}
        >
          {conversationsLoading.initialLoading
            ? "Loading your conversations..."
            : conversationCount === 0
            ? "You're all caught up! No open conversations assigned to you."
            : `Showing ${conversationCount} open conversation${conversationCount === 1 ? "" : "s"} assigned to you`}
        </Typography>
      </Box>
    );
  }, [conversationCount, conversationsLoading.initialLoading]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backgroundColor: colorTokens.neutral[100],
        gap: `${layoutTokens.columnGap.default}px`,        // Use design system gutter
        padding: `${semanticSpacing.container.md}px`,      // Use design system container padding
      }}
    >
      {/* Conversation List Panel */}
      <Box
        sx={{
          width: layoutTokens.panel.conversationList.default,
          minWidth: layoutTokens.panel.conversationList.default,
          height: "100%",
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${layoutTokens.card.radius}px`,   // Use design system card radius
          boxShadow: shadowTokens.card,                    // Use design system shadow
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: shadowTokens.cardHover,             // Use design system hover shadow
          },
        }}
      >
        {/* Custom Header */}
        {listHeader}

        {/* Conversation List */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
            hideHeader={true}
            hideAssigneeAvatars={true}
          />
        </Box>
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
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={handleToggleSidebar}
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
          <PanelContent padding="lg">{emptyStateContent}</PanelContent>
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
