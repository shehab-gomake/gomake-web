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
import { useRecoilState, useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";
import {
  chatwootSelectedAccountAtom,
  chatwootConversationsAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootAgents, useChatwootTeams, useChatwootInboxAgents } from "./resources";
import { useConversationAssignmentActions } from "./actions/use-conversation-assignment-actions";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { prepareAgentsForAssignment } from "../utils/agent-helpers";

/**
 * Simple notification utility
 * TODO: Replace with proper toast library when available
 */
const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // TODO: Integrate with toast library (notistack, react-toastify, etc.)
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
export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | null;

/**
 * Conversation Status
 */
export type ConversationStatusType = 'open' | 'resolved' | 'pending' | 'snoozed';

/**
 * Custom hook for Chatwoot conversation context menu
 */
export const useChatwootContextMenu = (conversation: ChatwootConversation | null) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);

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

  /**
   * Update a conversation in the list (optimistic update)
   */
  const updateConversationInList = useCallback(
    (updatedConversation: Partial<ChatwootConversation>) => {
      if (!conversation?.id) return;

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversation.id
            ? { ...conv, ...updatedConversation }
            : conv
        )
      );

      // Update selected conversation if it's the one being modified
      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, ...updatedConversation } : prev
        );
      }
    },
    [conversation?.id, setConversations, selectedConversation?.id, setSelectedConversation]
  );

  /**
   * Remove a conversation from the list
   */
  const removeConversationFromList = useCallback(
    (conversationId: number) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

      // Clear selected conversation if it's the one being deleted
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    },
    [setConversations, selectedConversation?.id, setSelectedConversation]
  );

  // Use centralized assignment actions hook (must be after updateConversationInList is defined)
  const { handleAssignAgent: handleAssignAgentAction, handleAssignTeam: handleAssignTeamAction } = useConversationAssignmentActions({
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
        updateConversationInList({ unread_count: markAsRead ? 0 : 1 });

        if (markAsRead) {
          await chatwootService.conversations.markConversationAsRead(accountId, conversation.id);
        } else {
          await chatwootService.conversations.markConversationAsUnread(accountId, conversation.id);
        }

        showNotification(`Conversation marked as ${action}`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversationInList({ unread_count: conversation.unread_count });
        showNotification(`Failed to mark conversation as ${action}`, "error");
        console.error(`Failed to mark conversation as ${action}:`, error);
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
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      const oldStatus = conversation.status;

      try {
        // Optimistic update
        updateConversationInList({ status, ...(snoozedUntil && { snoozed_until: new Date(snoozedUntil).getTime() }) });

        await chatwootService.conversations.updateConversationStatus(accountId, conversation.id, {
          status,
          ...(snoozedUntil && { snoozed_until: snoozedUntil }),
        });

        showNotification(`Conversation ${status}`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversationInList({ status: oldStatus });
        showNotification(`Failed to update conversation status`, "error");
        console.error("Failed to update conversation status:", error);
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
        updateConversationInList({ priority: priority || undefined });

        await chatwootService.conversations.updateConversationPriority(accountId, conversation.id, { priority });

        const priorityLabel = priority || 'none';
        showNotification(`Priority set to ${priorityLabel}`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversationInList({ priority: oldPriority });
        showNotification(`Failed to update priority`, "error");
        console.error("Failed to update priority:", error);
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
      const agentData = assigneeId
        ? agents.find(a => a.id === assigneeId)
        : undefined;

      // Use centralized hook with proper agent data
      await handleAssignAgentAction(assigneeId, agentData ? {
        id: agentData.id!,
        name: agentData.name,
        email: agentData.email,
        thumbnail: agentData.thumbnail,
      } : undefined);
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
      const teamData = teamId
        ? teams.find(t => t.id === teamId)
        : undefined;

      // Use centralized hook with proper team data
      await handleAssignTeamAction(teamId, teamData ? {
        id: teamData.id!,
        name: teamData.name,
        description: teamData.description,
      } : undefined);
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
        updateConversationInList({ labels });

        await chatwootService.conversations.addConversationLabels(accountId, conversation.id, labels);

        showNotification(`Labels updated`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversationInList({ labels: oldLabels });
        showNotification(`Failed to update labels`, "error");
        console.error("Failed to update labels:", error);
      }
    },
    [accountId, conversation, updateConversationInList]
  );

  /**
   * Handle Delete Conversation (Admin Only)
   */
  const handleDeleteConversation = useCallback(
    async () => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      // Confirm deletion
      const confirmed = window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      );

      if (!confirmed) return;

      try {
        // Optimistically remove from list
        removeConversationFromList(conversation.id);

        await chatwootService.conversations.deleteConversation(accountId, conversation.id);

        showNotification("Conversation deleted", "success");
      } catch (error: any) {
        // TODO: Re-add to list on failure (requires proper state management)
        showNotification(`Failed to delete conversation`, "error");
        console.error("Failed to delete conversation:", error);
      }
    },
    [accountId, conversation, removeConversationFromList]
  );

  /**
   * Handle Copy Conversation Link
   */
  const handleCopyLink = useCallback(() => {
    if (!accountId || !conversation?.id) return;

    const hostUrl = window.location.origin;
    const conversationUrl = `${hostUrl}/frontdesk/chatwoot?conversation=${conversation.id}`;

    navigator.clipboard.writeText(conversationUrl).then(
      () => {
        showNotification("Conversation link copied to clipboard", "success");
      },
      (error) => {
        showNotification("Failed to copy link", "error");
        console.error("Failed to copy link:", error);
      }
    );
  }, [accountId, conversation]);

  /**
   * Handle Open in New Tab
   */
  const handleOpenInNewTab = useCallback(() => {
    if (!accountId || !conversation?.id) return;

    const hostUrl = window.location.origin;
    const conversationUrl = `${hostUrl}/frontdesk/chatwoot?conversation=${conversation.id}`;
    window.open(conversationUrl, "_blank");
  }, [accountId, conversation]);

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
      id: hasUnread ? 'mark-read' : 'mark-unread',
      label: hasUnread ? 'Mark as read' : 'Mark as unread',
      icon: hasUnread ? 'mail' : 'mail-unread',
    });

    // Separator
    actions.push({ id: 'divider-1', label: '', divider: true });

    // 2. Status Actions - only show statuses that are not current
    if (status !== 'resolved') {
      actions.push({
        id: 'resolve',
        label: 'Resolve',
        icon: 'checkmark',
      });
    }

    if (status !== 'open') {
      actions.push({
        id: 'reopen',
        label: 'Reopen',
        icon: 'arrow-redo',
      });
    }

    if (status !== 'pending') {
      actions.push({
        id: 'pending',
        label: 'Mark as pending',
        icon: 'book-clock',
      });
    }

    // 3. Snooze - only for open conversations
    if (status === 'open') {
      actions.push({
        id: 'snooze',
        label: 'Snooze',
        icon: 'snooze',
      });
    }

    // Separator
    actions.push({ id: 'divider-2', label: '', divider: true });

    // 4. Priority Submenu
    const priorities: PriorityLevel[] = ['urgent', 'high', 'medium', 'low', null];
    const currentPriority = conversation.priority || null;
    const prioritySubmenu: ContextMenuAction[] = priorities
      .filter((p) => p !== currentPriority)
      .map((p) => ({
        id: `priority-${p || 'none'}`,
        label: p ? p.charAt(0).toUpperCase() + p.slice(1) : 'None',
      }));

    actions.push({
      id: 'priority',
      label: 'Set priority',
      icon: 'warning',
      submenu: prioritySubmenu,
    });

    // 5. Assign Label (placeholder - needs label data)
    actions.push({
      id: 'assign-label',
      label: 'Assign label',
      icon: 'tag',
      disabled: true, // TODO: Enable when label data is available
    });

    // 6. Assign Agent Submenu
    // Use processedAgents which are already sorted by availability (online → busy → offline)
    const currentAssigneeId = conversation.meta?.assignee?.id;
    const agentSubmenu: ContextMenuAction[] = [
      { id: 'assign-agent-none', label: 'Unassign' },
      ...processedAgents
        .filter((agent) => agent.id !== currentAssigneeId)
        .map((agent) => ({
          id: `assign-agent-${agent.id}`,
          label: agent.name || agent.email || `Agent ${agent.id}`,
        }))
    ];

    actions.push({
      id: 'assign-agent',
      label: 'Assign agent',
      icon: 'person-add',
      disabled: processedAgents.length === 0 || agentsLoading,
      submenu: agentSubmenu,
    });

    // 7. Assign Team Submenu
    const teamSubmenu: ContextMenuAction[] = [
      { id: 'assign-team-none', label: 'Unassign' },
      ...teams.map((team) => ({
        id: `assign-team-${team.id}`,
        label: team.name || `Team ${team.id}`,
      }))
    ];

    actions.push({
      id: 'assign-team',
      label: 'Assign team',
      icon: 'people-team-add',
      disabled: teams.length === 0 || agentsLoading,
      submenu: teamSubmenu,
    });

    // Separator
    actions.push({ id: 'divider-3', label: '', divider: true });

    // 8. Open in New Tab
    actions.push({
      id: 'open-new-tab',
      label: 'Open in new tab',
      icon: 'open',
    });

    // 9. Copy Conversation Link
    actions.push({
      id: 'copy-link',
      label: 'Copy conversation link',
      icon: 'copy',
    });

    // 10. Delete (Admin Only)
    // TODO: Check user role when profile includes role information
    actions.push({
      id: 'delete',
      label: 'Delete conversation',
      icon: 'delete',
      requiresAdmin: true,
      // disabled: !isAdmin, // TODO: Implement when we have user role
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
        case 'mark-read':
          await handleMarkReadUnread(true);
          break;
        case 'mark-unread':
          await handleMarkReadUnread(false);
          break;
        case 'resolve':
          await handleUpdateStatus('resolved');
          break;
        case 'reopen':
          await handleUpdateStatus('open');
          break;
        case 'pending':
          await handleUpdateStatus('pending');
          break;
        case 'snooze':
          // TODO: Show snooze dialog to select time
          showNotification('Snooze dialog not yet implemented', "info");
          break;
        case 'priority-urgent':
          await handleSetPriority('urgent');
          break;
        case 'priority-high':
          await handleSetPriority('high');
          break;
        case 'priority-medium':
          await handleSetPriority('medium');
          break;
        case 'priority-low':
          await handleSetPriority('low');
          break;
        case 'priority-none':
          await handleSetPriority(null);
          break;
        case 'assign-label':
          // TODO: Show label selector
          showNotification('Label assignment not yet implemented', "info");
          break;
        case 'open-new-tab':
          handleOpenInNewTab();
          break;
        case 'copy-link':
          handleCopyLink();
          break;
        case 'delete':
          await handleDeleteConversation();
          break;
        default:
          // Handle agent assignment submenu items
          if (actionId.startsWith('assign-agent-')) {
            const agentIdStr = actionId.replace('assign-agent-', '');
            const agentId = agentIdStr === 'none' ? null : parseInt(agentIdStr, 10);
            await handleAssignAgent(agentId);
            break;
          }

          // Handle team assignment submenu items
          if (actionId.startsWith('assign-team-')) {
            const teamIdStr = actionId.replace('assign-team-', '');
            const teamId = teamIdStr === 'none' ? null : parseInt(teamIdStr, 10);
            await handleAssignTeam(teamId);
            break;
          }

          console.warn(`Unknown action: ${actionId}`);
      }
    },
    [
      conversation,
      handleMarkReadUnread,
      handleUpdateStatus,
      handleSetPriority,
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
