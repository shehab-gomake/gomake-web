/**
 * Conversation Priority Actions Hook
 * Handles priority level changes
 */

import { useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";

export type PriorityLevel = "urgent" | "high" | "medium" | "low" | null;

interface UseConversationPriorityActionsProps {
  accountId: number | null;
  conversation: ChatwootConversation | null;
  updateConversation: (updates: Partial<ChatwootConversation>) => void;
}

export const useConversationPriorityActions = ({
  accountId,
  conversation,
  updateConversation,
}: UseConversationPriorityActionsProps) => {
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
        updateConversation({ priority: priority || undefined });

        await chatwootService.conversations.updateConversationPriority(accountId, conversation.id, { priority });

        const priorityLabel = priority || "none";
        showNotification(`Priority set to ${priorityLabel}`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversation({ priority: oldPriority });
        showNotification(`Failed to update priority`, "error");
        console.error("Failed to update priority:", error);
      }
    },
    [accountId, conversation, updateConversation]
  );

  return {
    handleSetPriority,
  };
};
