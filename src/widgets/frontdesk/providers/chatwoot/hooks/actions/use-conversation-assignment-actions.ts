/**
 * Conversation Assignment Actions Hook
 * Handles agent and team assignments, and label management
 */

import { useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";

interface UseConversationAssignmentActionsProps {
  accountId: number | null;
  conversation: ChatwootConversation | null;
  updateConversation: (updates: Partial<ChatwootConversation>) => void;
}

export const useConversationAssignmentActions = ({
  accountId,
  conversation,
  updateConversation,
}: UseConversationAssignmentActionsProps) => {
  /**
   * Handle Assign Agent
   */
  const handleAssignAgent = useCallback(
    async (assigneeId: number | null) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      try {
        await chatwootService.conversations.assignAgent(accountId, conversation.id, assigneeId);

        const actionLabel = assigneeId ? "Agent assigned" : "Agent unassigned";
        showNotification(actionLabel, "success");

        // TODO: Update conversation assignee in state when we have agent data
      } catch (error: any) {
        showNotification(`Failed to assign agent`, "error");
        console.error("Failed to assign agent:", error);
      }
    },
    [accountId, conversation]
  );

  /**
   * Handle Assign Team
   */
  const handleAssignTeam = useCallback(
    async (teamId: number | null) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      try {
        await chatwootService.conversations.assignTeam(accountId, conversation.id, teamId);

        const actionLabel = teamId ? "Team assigned" : "Team unassigned";
        showNotification(actionLabel, "success");

        // TODO: Update conversation team in state when we have team data
      } catch (error: any) {
        showNotification(`Failed to assign team`, "error");
        console.error("Failed to assign team:", error);
      }
    },
    [accountId, conversation]
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
        updateConversation({ labels });

        await chatwootService.conversations.addConversationLabels(accountId, conversation.id, labels);

        showNotification(`Labels updated`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversation({ labels: oldLabels });
        showNotification(`Failed to update labels`, "error");
        console.error("Failed to update labels:", error);
      }
    },
    [accountId, conversation, updateConversation]
  );

  return {
    handleAssignAgent,
    handleAssignTeam,
    handleAssignLabel,
  };
};
