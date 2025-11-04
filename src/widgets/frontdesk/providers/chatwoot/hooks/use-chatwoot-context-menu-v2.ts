/**
 * Chatwoot Context Menu Hook (Refactored v2)
 *
 * Provides context menu actions and handlers for Chatwoot conversations.
 * Now uses modular action hooks for better organization and testability.
 *
 * @see CONTEXT_MENU_API_DOCUMENTATION.md
 */

import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootSelectedAccountAtom,
  chatwootConversationsAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootAgents, useChatwootTeams } from "./resources";
import {
  useConversationStatusActions,
  useConversationAssignmentActions,
  useConversationPriorityActions,
  useConversationUtilityActions,
  type ConversationStatusType,
  type PriorityLevel,
} from "./actions";

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
 * Custom hook for Chatwoot conversation context menu
 */
export const useChatwootContextMenu = (conversation: ChatwootConversation | null) => {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [conversations, setConversations] = useRecoilState(chatwootConversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);

  // Use centralized resource hooks
  const { agents, loading: agentsLoading } = useChatwootAgents(accountId);
  const { teams } = useChatwootTeams(accountId);

  /**
   * Update a conversation in the list (optimistic update)
   */
  const updateConversationInList = useCallback(
    (updatedConversation: Partial<ChatwootConversation>) => {
      if (!conversation?.id) return;

      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversation.id ? { ...conv, ...updatedConversation } : conv))
      );

      // Update selected conversation if it's the one being modified
      if (selectedConversation?.id === conversation.id) {
        setSelectedConversation((prev) => (prev ? { ...prev, ...updatedConversation } : prev));
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

  // Use modular action hooks
  const statusActions = useConversationStatusActions({
    accountId,
    conversation,
    updateConversation: updateConversationInList,
  });

  const assignmentActions = useConversationAssignmentActions({
    accountId,
    conversation,
    updateConversation: updateConversationInList,
  });

  const priorityActions = useConversationPriorityActions({
    accountId,
    conversation,
    updateConversation: updateConversationInList,
  });

  const utilityActions = useConversationUtilityActions({
    accountId,
    conversation,
    removeConversation: removeConversationFromList,
  });

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

    // 3. Snooze - only for open conversations
    if (status === "open") {
      actions.push({
        id: "snooze",
        label: "Snooze",
        icon: "snooze",
      });
    }

    // Separator
    actions.push({ id: "divider-2", label: "", divider: true });

    // 4. Priority Submenu
    actions.push({
      id: "priority",
      label: "Priority",
      icon: "flag",
      submenu: [
        { id: "priority-urgent", label: "Urgent", icon: "flag" },
        { id: "priority-high", label: "High", icon: "flag" },
        { id: "priority-medium", label: "Medium", icon: "flag" },
        { id: "priority-low", label: "Low", icon: "flag" },
        { id: "priority-none", label: "None", icon: "close" },
      ],
    });

    // 5. Assign Agent Submenu
    if (!agentsLoading && agents.length > 0) {
      actions.push({
        id: "assign-agent",
        label: "Assign agent",
        icon: "person",
        submenu: [
          { id: "assign-agent-unassign", label: "Unassign", icon: "person-remove" },
          { id: "divider-agents", label: "", divider: true },
          ...agents.map((agent) => ({
            id: `assign-agent-${agent.id}`,
            label: agent.name || agent.email || `Agent ${agent.id}`,
            icon: "person",
          })),
        ],
      });
    }

    // 6. Assign Team Submenu
    if (teams.length > 0) {
      actions.push({
        id: "assign-team",
        label: "Assign team",
        icon: "people",
        submenu: [
          { id: "assign-team-unassign", label: "Unassign", icon: "people-remove" },
          { id: "divider-teams", label: "", divider: true },
          ...teams.map((team) => ({
            id: `assign-team-${team.id}`,
            label: team.name || `Team ${team.id}`,
            icon: "people",
          })),
        ],
      });
    }

    // Separator
    actions.push({ id: "divider-3", label: "", divider: true });

    // 7. Copy Link
    actions.push({
      id: "copy-link",
      label: "Copy link",
      icon: "link",
    });

    // 8. Open in New Tab
    actions.push({
      id: "open-new-tab",
      label: "Open in new tab",
      icon: "open-outline",
    });

    // Separator
    actions.push({ id: "divider-4", label: "", divider: true });

    // 9. Delete (Admin Only)
    actions.push({
      id: "delete",
      label: "Delete",
      icon: "trash",
      requiresAdmin: true,
    });

    return actions;
  }, [conversation, agents, agentsLoading, teams]);

  /**
   * Handle action execution
   */
  const handleAction = useCallback(
    async (actionId: string) => {
      if (!conversation) return;

      // Status Actions
      if (actionId === "mark-read") {
        await statusActions.handleMarkReadUnread(true);
      } else if (actionId === "mark-unread") {
        await statusActions.handleMarkReadUnread(false);
      } else if (actionId === "resolve") {
        await statusActions.handleUpdateStatus("resolved");
      } else if (actionId === "reopen") {
        await statusActions.handleUpdateStatus("open");
      } else if (actionId === "pending") {
        await statusActions.handleUpdateStatus("pending");
      } else if (actionId === "snooze") {
        // TODO: Show snooze time picker
        await statusActions.handleUpdateStatus("snoozed");
      }
      // Priority Actions
      else if (actionId.startsWith("priority-")) {
        const priorityStr = actionId.replace("priority-", "");
        const priority: PriorityLevel = priorityStr === "none" ? null : (priorityStr as PriorityLevel);
        await priorityActions.handleSetPriority(priority);
      }
      // Assignment Actions
      else if (actionId.startsWith("assign-agent-")) {
        if (actionId === "assign-agent-unassign") {
          await assignmentActions.handleAssignAgent(null);
        } else {
          const agentId = parseInt(actionId.replace("assign-agent-", ""));
          await assignmentActions.handleAssignAgent(agentId);
        }
      } else if (actionId.startsWith("assign-team-")) {
        if (actionId === "assign-team-unassign") {
          await assignmentActions.handleAssignTeam(null);
        } else {
          const teamId = parseInt(actionId.replace("assign-team-", ""));
          await assignmentActions.handleAssignTeam(teamId);
        }
      }
      // Utility Actions
      else if (actionId === "copy-link") {
        await utilityActions.handleCopyLink();
      } else if (actionId === "open-new-tab") {
        utilityActions.handleOpenInNewTab();
      } else if (actionId === "delete") {
        await utilityActions.handleDeleteConversation();
      }
    },
    [conversation, statusActions, priorityActions, assignmentActions, utilityActions]
  );

  return {
    actions: availableActions,
    handleAction,
    agents,
    teams,
    agentsLoading,
  };
};
