/**
 * Chatwoot My Inbox View
 *
 * Displays conversations assigned to the current agent with status "open".
 * This is the agent's personal workspace, showing only their assigned conversations.
 */

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Stack, Box, Divider, Typography, useTheme } from "@mui/material";
import { Panel, PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
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
  const theme = useTheme();
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

  // Phase 1: Custom header with title and subheader
  const listHeader = useMemo(() => {
    return (
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          My Tickets
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
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
  }, [conversationCount, conversationsLoading.initialLoading, theme]);

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
        {/* Phase 1: Custom Header */}
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
            hideHeader={true} // Hide default header since we have custom header
            hideAssigneeAvatars={true} // Phase 3: Hide assignee avatars in My Inbox
          />
        </Box>
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
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={handleToggleSidebar}
              />
            </Box>

            {/* Divider between message viewer and detail panel - only show when sidebar is visible */}
            {isSidebarVisible && (
              <Divider orientation="vertical" flexItem sx={{ borderColor: theme.palette.divider }} />
            )}

            {/* Right Detail Panel - conditionally rendered */}
            {isSidebarVisible && (
              <ChatwootConversationDetailPanel
                key={selectedConversation.id}
                conversation={selectedConversation}
                accountId={currentAccountId || undefined}
                inboxes={inboxes}
                onConversationUpdate={updateConversationInList}
              />
            )}
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
