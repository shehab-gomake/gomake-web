/**
 * Conversation Assignment Actions Hook
 * Handles agent and team assignments, and label management
 */

import { useCallback, useState } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";

interface UseConversationAssignmentActionsProps {
  accountId: number | null;
  conversation: ChatwootConversation | null;
  updateConversation: (conversationId: number, updates: Partial<ChatwootConversation>) => void;
}

export const useConversationAssignmentActions = ({
  accountId,
  conversation,
  updateConversation,
}: UseConversationAssignmentActionsProps) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssigningTeam, setIsAssigningTeam] = useState(false);

  /**
   * Handle Assign Agent
   * Updates conversation state with new assignee after successful API call
   */
  const handleAssignAgent = useCallback(
    async (assigneeId: number | null, agentData?: { id: number; name?: string; email?: string; thumbnail?: string }) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      setIsAssigning(true);
      const previousAssignee = conversation.meta?.assignee;

      try {
        // Optimistic update if we have agent data
        if (agentData) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              assignee: assigneeId ? agentData : null,
            },
          });
        }

        const response = await chatwootService.conversations.assignAgent(accountId, conversation.id, assigneeId);

        // Update with server response
        if (response.meta?.assignee !== undefined) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              assignee: response.meta.assignee,
            },
          });
        }

        const actionLabel = assigneeId ? "Agent assigned" : "Agent unassigned";
        showNotification(actionLabel, "success");
      } catch (error: any) {
        // Revert optimistic update on failure
        if (agentData) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              assignee: previousAssignee,
            },
          });
        }
        showNotification(`Failed to assign agent`, "error");
        console.error("Failed to assign agent:", error);
      } finally {
        setIsAssigning(false);
      }
    },
    [accountId, conversation, updateConversation]
  );

  /**
   * Handle Assign Team
   * Updates conversation state with new team after successful API call
   */
  const handleAssignTeam = useCallback(
    async (teamId: number | null, teamData?: { id: number; name?: string; description?: string }) => {
      if (!accountId || !conversation?.id) {
        showNotification("Cannot perform action: Missing account or conversation", "error");
        return;
      }

      setIsAssigningTeam(true);
      const previousTeam = conversation.meta?.team;

      try {
        // Optimistic update if we have team data
        if (teamData) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              team: teamId ? teamData : null,
            },
          });
        }

        const response = await chatwootService.conversations.assignTeam(accountId, conversation.id, teamId);

        // Update with server response
        if (response.meta?.team !== undefined) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              team: response.meta.team,
            },
          });
        }

        const actionLabel = teamId ? "Team assigned" : "Team unassigned";
        showNotification(actionLabel, "success");
      } catch (error: any) {
        // Revert optimistic update on failure
        if (teamData) {
          updateConversation(conversation.id, {
            meta: {
              ...conversation.meta,
              team: previousTeam,
            },
          });
        }
        showNotification(`Failed to assign team`, "error");
        console.error("Failed to assign team:", error);
      } finally {
        setIsAssigningTeam(false);
      }
    },
    [accountId, conversation, updateConversation]
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
        updateConversation(conversation.id, { labels });

        await chatwootService.conversations.addConversationLabels(accountId, conversation.id, labels);

        showNotification(`Labels updated`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversation(conversation.id, { labels: oldLabels });
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
    isAssigning,
    isAssigningTeam,
  };
};
