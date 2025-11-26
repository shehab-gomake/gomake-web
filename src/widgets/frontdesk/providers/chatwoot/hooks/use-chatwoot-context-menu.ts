/**
 * Chatwoot Context Menu Hook
 *
 * Provides context menu actions and handlers for Chatwoot conversations.
 * Implements optimistic updates and conditional logic based on conversation state.
 *
 * Now uses centralized resource hooks to eliminate duplicate API calls.
 *
 * @see CONTEXT_MENU_API_DOCUMENTATION.md
 */

import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootTeams, useChatwootInboxAgents } from "./resources";
import { useConversationAssignmentActions } from "./actions/use-conversation-assignment-actions";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { prepareAgentsForAssignment } from "../utils/agent-helpers";
import { useChatwootConversationUpdater } from "./use-chatwoot-conversation-updater";
import { useChatwootRouter } from "./use-chatwoot-router";
import { RouteBuilder, buildRoutePath } from "@/widgets/frontdesk/routing/route-builder";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootContextMenu");

/**
 * Simple notification utility
 * Note: In production, this should integrate with a toast library (notistack, react-toastify, etc.)
 * For now, it logs to console in development and can be extended to show UI notifications
 */
const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
  if (process.env.NODE_ENV !== "production") {
    logger.info(`Notification [${type.toUpperCase()}]: ${message}`);
  }
  // TODO: Integrate with toast library when available
  // Example: toast[type](message);
};

/**
 * Context Menu Action Definition
 */
export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  divider?: boolean;
  submenu?: ContextMenuAction[];
  disabled?: boolean;
  requiresAdmin?: boolean;
}

/**
 * Priority Levels
 */
export type PriorityLevel = "urgent" | "high" | "medium" | "low" | null;

/**
 * Conversation Status
 */
export type ConversationStatusType = "open" | "resolved" | "pending" | "snoozed";

/**
 * Custom hook for Chatwoot conversation context menu
 */
export const useChatwootContextMenu = (conversation: ChatwootConversation | null) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  // Get router context for building proper conversation links
  const { currentRoute, currentView, currentFilters } = useChatwootRouter();

  // Get current user profile for presence updates
  const { profile } = useChatwootProfile();

  // Use centralized resource hooks - no more duplicate fetching!
  // Use inbox-specific agents (includes inbox members + administrators)
  // Pass conversation.id to trigger refetch when switching conversations
  const inboxId = conversation?.inbox_id;
  const conversationId = conversation?.id;
  const { verifiedAgents: agents, loading: agentsLoading } = useChatwootInboxAgents(accountId, inboxId, conversationId);
  const { teams } = useChatwootTeams(accountId);

  // Process agents with Chatwoot's pattern: update presence + sort by availability
  // Don't include "None" option here - we'll add it manually in the submenu
  const processedAgents = useMemo(() => {
    if (!accountId) return agents;
    return prepareAgentsForAssignment(agents, profile, accountId, false);
  }, [agents, profile, accountId]);

  // Use cache-aware updater for mutations
  const { updateConversation: updateConversationCache, removeConversation: removeConversationCache } =
    useChatwootConversationUpdater();

  /**
   * Update a conversation in the list (cache-aware)
   */
  const updateConversationInList = useCallback(
    (conversationId: number, updatedConversation: Partial<ChatwootConversation>) => {
      updateConversationCache(conversationId, updatedConversation);
    },
    [updateConversationCache]
  );

  /**
   * Remove a conversation from the list (cache-aware)
   */
  const removeConversationFromList = useCallback(
    (conversationId: number) => {
      removeConversationCache(conversationId);
    },
    [removeConversationCache]
  );

  // Use centralized assignment actions hook (must be after updateConversationInList is defined)
  const { handleAssignAgent: handleAssignAgentAction, handleAssignTeam: handleAssignTeamAction } =
    useConversationAssignmentActions({
      accountId,
      conversation,
      updateConversation: updateConversationInList,
    });

  /**
   * Handle Mark as Read/Unread
   */
  const handleMarkReadUnread = useCallback(
    async (markAsRead: boolean) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      const action = markAsRead ? "read" : "unread";

      try {
        // Optimistic update
        updateConversationInList(conversation.id, { unread_count: markAsRead ? 0 : 1 });

        if (markAsRead) {
          await chatwootService.conversations.markConversationAsRead(accountId, conversation.id);
        } else {
          await chatwootService.conversations.markConversationAsUnread(accountId, conversation.id);
        }

        showNotification(`Conversation marked as ${action}`, "success");
      } catch (error) {
        // Revert on failure
        updateConversationInList(conversation.id, { unread_count: conversation.unread_count });
        showNotification(`Failed to mark conversation as ${action}`, "error");
        logger.error(`Failed to mark conversation as ${action}`, error instanceof Error ? error : new Error(String(error)));
      }
    },
    [accountId, conversation, updateConversationInList]
  );

  /**
   * Handle Status Change (Open, Resolved, Pending, Snoozed)
   */
  const handleUpdateStatus = useCallback(
    async (status: ConversationStatusType, snoozedUntil?: string) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot update status: Missing account or conversation", "error");
        return;
      }

      const oldStatus = conversation.status;

      // User-friendly status messages
      const statusMessages = {
        open: "reopened",
        resolved: "marked as resolved",
        pending: "marked as pending",
        snoozed: snoozedUntil ? "snoozed until specified time" : "snoozed until next reply",
      };

      try {
        // Optimistic update - immediately update UI
        updateConversationInList(conversation.id, {
          status,
          ...(snoozedUntil && { snoozed_until: new Date(snoozedUntil).getTime() }),
        });

        // Make API call
        const response = await chatwootService.conversations.updateConversationStatus(accountId, conversation.id, {
          status,
          ...(snoozedUntil && { snoozed_until: snoozedUntil }),
        });

        // Verify success
        if (response.payload?.success) {
          const message = statusMessages[status] || status;
          showNotification(`Conversation ${message}`, "success");
        } else {
          throw new Error("Status update failed: Unexpected response from server");
        }
      } catch (error) {
        // Revert on failure
        updateConversationInList(conversation.id, { status: oldStatus });
        
        const errorMessage = error instanceof Error ? error.message : "Failed to update conversation status";
        showNotification(errorMessage, "error");
        logger.error("Failed to update conversation status", error instanceof Error ? error : new Error(String(error)));
      }
    },
    [accountId, conversation, updateConversationInList]
  );

  /**
   * Handle Priority Change
   */
  const handleSetPriority = useCallback(
    async (priority: PriorityLevel) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      const oldPriority = conversation.priority;

      try {
        // Optimistic update
        updateConversationInList(conversation.id, { priority: priority || undefined });

        await chatwootService.conversations.updateConversationPriority(accountId, conversation.id, { priority });

        const priorityLabel = priority || "none";
        showNotification(`Priority set to ${priorityLabel}`, "success");
      } catch (error) {
        // Revert on failure
        updateConversationInList(conversation.id, { priority: oldPriority });
        showNotification(`Failed to update priority`, "error");
        logger.error("Failed to update priority", error instanceof Error ? error : new Error(String(error)));
      }
    },
    [accountId, conversation, updateConversationInList]
  );

  /**
   * Handle Assign Agent
   * Now uses centralized assignment actions hook
   */
  const handleAssignAgent = useCallback(
    async (assigneeId: number | null) => {
      // Find agent data for optimistic update
      const agentData = assigneeId ? agents.find((a) => a.id === assigneeId) : undefined;

      // Use centralized hook with proper agent data
      await handleAssignAgentAction(
        assigneeId,
        agentData
          ? {
              id: agentData.id!,
              name: agentData.name,
              email: agentData.email,
              thumbnail: agentData.thumbnail,
            }
          : undefined
      );
    },
    [agents, handleAssignAgentAction]
  );

  /**
   * Handle Assign Team
   * Now uses centralized assignment actions hook
   */
  const handleAssignTeam = useCallback(
    async (teamId: number | null) => {
      // Find team data for optimistic update
      const teamData = teamId ? teams.find((t) => t.id === teamId) : undefined;

      // Use centralized hook with proper team data
      await handleAssignTeamAction(
        teamId,
        teamData
          ? {
              id: teamData.id!,
              name: teamData.name,
              description: teamData.description,
            }
          : undefined
      );
    },
    [teams, handleAssignTeamAction]
  );

  /**
   * Handle Assign Label
   */
  const handleAssignLabel = useCallback(
    async (labels: string[]) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      const oldLabels = conversation.labels || [];

      try {
        // Optimistic update
        updateConversationInList(conversation.id, { labels });

        await chatwootService.conversations.addConversationLabels(accountId, conversation.id, labels);

        showNotification(`Labels updated`, "success");
      } catch (error) {
        // Revert on failure
        updateConversationInList(conversation.id, { labels: oldLabels });
        showNotification(`Failed to update labels`, "error");
        logger.error("Failed to update labels", error instanceof Error ? error : new Error(String(error)));
      }
    },
    [accountId, conversation, updateConversationInList]
  );

  /**
   * Handle Delete Conversation (Admin Only)
   */
  const handleDeleteConversation = useCallback(async () => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot perform action: Missing account or conversation", "error");
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.");

    if (!confirmed) return;

    try {
      // Optimistically remove from list
      removeConversationFromList(conversation.id);

      await chatwootService.conversations.deleteConversation(accountId, conversation.id);

        showNotification("Conversation deleted", "success");
      } catch (error) {
        // Note: Re-adding to list on failure would require proper state management
        // For now, the optimistic update remains removed
        showNotification(`Failed to delete conversation`, "error");
        logger.error("Failed to delete conversation", error instanceof Error ? error : new Error(String(error)));
    }
  }, [accountId, conversation, removeConversationFromList]);

  /**
   * Build a shareable link for the conversation
   * Preserves current view context and filters so the link opens in the same state
   */
  const buildConversationLink = useCallback(() => {
    if (!conversation?.id) return null;

    // Build route with current view, conversation, channel, and filters
    const channelId = currentRoute?.channelId || (conversation.inbox_id ? String(conversation.inbox_id) : undefined);
    const route = RouteBuilder.chatwoot(currentView || ChatwootView.MY_INBOX, String(conversation.id), channelId, currentFilters);
    const path = buildRoutePath(route);
    return `${window.location.origin}${path}`;
  }, [conversation?.id, conversation?.inbox_id, currentView, currentRoute?.channelId, currentFilters]);

  /**
   * Handle Copy Conversation Link
   */
  const handleCopyLink = useCallback(() => {
    if (!accountId || !conversation?.id) return;

    const conversationUrl = buildConversationLink();
    if (!conversationUrl) {
      showNotification("Failed to build conversation link", "error");
      return;
    }

    navigator.clipboard.writeText(conversationUrl).then(
      () => {
        showNotification("Conversation link copied to clipboard", "success");
      },
      (error) => {
        showNotification("Failed to copy link", "error");
        logger.error("Failed to copy link", error instanceof Error ? error : new Error(String(error)));
      }
    );
  }, [accountId, conversation?.id, buildConversationLink]);

  /**
   * Handle Open in New Tab
   */
  const handleOpenInNewTab = useCallback(() => {
    if (!accountId || !conversation?.id) return;

    const conversationUrl = buildConversationLink();
    if (!conversationUrl) {
      showNotification("Failed to build conversation link", "error");
      return;
    }

    window.open(conversationUrl, "_blank");
  }, [accountId, conversation?.id, buildConversationLink]);

  /**
   * Get available actions based on conversation state
   */
  const availableActions = useMemo((): ContextMenuAction[] => {
    if (!conversation) return [];

    const actions: ContextMenuAction[] = [];
    const status = conversation.status;
    const hasUnread = (conversation.unread_count || 0) > 0;

    // 1. Mark as Read/Unread
    actions.push({
      id: hasUnread ? "mark-read" : "mark-unread",
      label: hasUnread ? "Mark as read" : "Mark as unread",
      icon: hasUnread ? "mail" : "mail-unread",
    });

    // Separator
    actions.push({ id: "divider-1", label: "", divider: true });

    // 2. Status Actions - only show statuses that are not current
    if (status !== "resolved") {
      actions.push({
        id: "resolve",
        label: "Resolve",
        icon: "checkmark",
      });
    }

    if (status !== "open") {
      actions.push({
        id: "reopen",
        label: "Reopen",
        icon: "arrow-redo",
      });
    }

    if (status !== "pending") {
      actions.push({
        id: "pending",
        label: "Mark as pending",
        icon: "book-clock",
      });
    }

    // Separator
    actions.push({ id: "divider-2", label: "", divider: true });

    // 4. Priority Submenu
    const priorities: PriorityLevel[] = ["urgent", "high", "medium", "low", null];
    const currentPriority = conversation.priority || null;
    const prioritySubmenu: ContextMenuAction[] = priorities
      .filter((p) => p !== currentPriority)
      .map((p) => ({
        id: `priority-${p || "none"}`,
        label: p ? p.charAt(0).toUpperCase() + p.slice(1) : "None",
      }));

    actions.push({
      id: "priority",
      label: "Set priority",
      icon: "warning",
      submenu: prioritySubmenu,
    });

    // 5. Assign Label
    // Note: Currently disabled - enable when label management is implemented
    actions.push({
      id: "assign-label",
      label: "Assign label",
      icon: "tag",
      disabled: true,
    });

    // 6. Assign Agent Submenu
    // Use processedAgents which are already sorted by availability (online → busy → offline)
    const currentAssigneeId = conversation.meta?.assignee?.id;
    const availableAgents = processedAgents
      .filter((agent) => agent.id !== currentAssigneeId)
      .map((agent) => ({
        id: `assign-agent-${agent.id}`,
        label: agent.name || agent.email || `Agent ${agent.id}`,
      }));

    const agentSubmenu: ContextMenuAction[] = [
      { id: "assign-agent-none", label: "Unassign" },
      ...(availableAgents.length > 0 ? [{ id: "assign-agent-divider", label: "", divider: true }] : []),
      ...availableAgents,
    ];

    actions.push({
      id: "assign-agent",
      label: "Assign agent",
      icon: "person-add",
      disabled: processedAgents.length === 0 || agentsLoading,
      submenu: agentSubmenu,
    });

    // 7. Assign Team Submenu
    const availableTeams = teams.map((team) => ({
      id: `assign-team-${team.id}`,
      label: team.name || `Team ${team.id}`,
    }));

    const teamSubmenu: ContextMenuAction[] = [
      { id: "assign-team-none", label: "Unassign" },
      ...(availableTeams.length > 0 ? [{ id: "assign-team-divider", label: "", divider: true }] : []),
      ...availableTeams,
    ];

    actions.push({
      id: "assign-team",
      label: "Assign team",
      icon: "people-team-add",
      disabled: teams.length === 0 || agentsLoading,
      submenu: teamSubmenu,
    });

    // Separator
    actions.push({ id: "divider-3", label: "", divider: true });

    // 8. Open in New Tab
    actions.push({
      id: "open-new-tab",
      label: "Open in new tab",
      icon: "open",
    });

    // 9. Copy Conversation Link
    actions.push({
      id: "copy-link",
      label: "Copy conversation link",
      icon: "copy",
    });

    // 10. Delete (Admin Only)
    // Note: Admin check should be implemented when user role information is available in profile
    actions.push({
      id: "delete",
      label: "Delete conversation",
      icon: "delete",
      requiresAdmin: true,
    });

    return actions;
  }, [conversation, processedAgents, teams, agentsLoading]);

  /**
   * Main action handler - routes to appropriate handler based on action ID
   */
  const handleAction = useCallback(
    async (actionId: string) => {
      if (!conversation) return;

      switch (actionId) {
        case "mark-read":
          await handleMarkReadUnread(true);
          break;
        case "mark-unread":
          await handleMarkReadUnread(false);
          break;
        case "resolve":
          await handleUpdateStatus("resolved");
          break;
        case "reopen":
          await handleUpdateStatus("open");
          break;
        case "pending":
          await handleUpdateStatus("pending");
          break;
        case "priority-urgent":
          await handleSetPriority("urgent");
          break;
        case "priority-high":
          await handleSetPriority("high");
          break;
        case "priority-medium":
          await handleSetPriority("medium");
          break;
        case "priority-low":
          await handleSetPriority("low");
          break;
        case "priority-none":
          await handleSetPriority(null);
          break;
        case "assign-label":
          // Label assignment will be implemented when label management is available
          showNotification("Label assignment not yet implemented", "info");
          break;
        case "open-new-tab":
          handleOpenInNewTab();
          break;
        case "copy-link":
          handleCopyLink();
          break;
        case "delete":
          await handleDeleteConversation();
          break;
        default:
          // Handle agent assignment submenu items
          if (actionId.startsWith("assign-agent-")) {
            const agentIdStr = actionId.replace("assign-agent-", "");
            // Skip divider actions
            if (agentIdStr === "divider") break;
            const agentId = agentIdStr === "none" ? null : parseInt(agentIdStr, 10);
            await handleAssignAgent(agentId);
            break;
          }

          // Handle team assignment submenu items
          if (actionId.startsWith("assign-team-")) {
            const teamIdStr = actionId.replace("assign-team-", "");
            // Skip divider actions
            if (teamIdStr === "divider") break;
            const teamId = teamIdStr === "none" ? null : parseInt(teamIdStr, 10);
            await handleAssignTeam(teamId);
            break;
          }

          logger.warn(`Unknown action: ${actionId}`);
      }
    },
    [
      conversation,
      handleMarkReadUnread,
      handleUpdateStatus,
      handleSetPriority,
      handleAssignAgent,
      handleAssignTeam,
      handleOpenInNewTab,
      handleCopyLink,
      handleDeleteConversation,
    ]
  );

  return {
    actions: availableActions,
    handleAction,
    // Expose individual handlers for advanced use cases
    handlers: {
      markReadUnread: handleMarkReadUnread,
      updateStatus: handleUpdateStatus,
      setPriority: handleSetPriority,
      assignAgent: handleAssignAgent,
      assignTeam: handleAssignTeam,
      assignLabel: handleAssignLabel,
      deleteConversation: handleDeleteConversation,
      copyLink: handleCopyLink,
      openInNewTab: handleOpenInNewTab,
    },
  };
};
