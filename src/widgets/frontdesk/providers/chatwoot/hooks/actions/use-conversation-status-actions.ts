/**
 * Conversation Status Actions Hook
 * Handles status changes (open, resolved, pending, snoozed) and read/unread states
 */

import { useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";

export type ConversationStatusType = "open" | "resolved" | "pending" | "snoozed";

interface UseConversationStatusActionsProps {
  accountId: number | null;
  conversation: ChatwootConversation | null;
  updateConversation: (updates: Partial<ChatwootConversation>) => void;
}

export const useConversationStatusActions = ({
  accountId,
  conversation,
  updateConversation,
}: UseConversationStatusActionsProps) => {
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
      const originalUnreadCount = conversation.unread_count;

      try {
        // Optimistic update
        updateConversation({ unread_count: markAsRead ? 0 : 1 });

        if (markAsRead) {
          await chatwootService.conversations.markConversationAsRead(accountId, conversation.id);
        } else {
          await chatwootService.conversations.markConversationAsUnread(accountId, conversation.id);
        }

        showNotification(`Conversation marked as ${action}`, "success");
      } catch (error: any) {
        // Revert on failure
        updateConversation({ unread_count: originalUnreadCount });
        showNotification(`Failed to mark conversation as ${action}`, "error");
        console.error(`Failed to mark conversation as ${action}:`, error);
      }
    },
    [accountId, conversation, updateConversation]
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
        updateConversation({
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
      } catch (error: any) {
        // Revert on failure
        updateConversation({ status: oldStatus });
        
        const errorMessage = error.message || "Failed to update conversation status";
        showNotification(errorMessage, "error");
        console.error("Failed to update conversation status:", {
          conversationId: conversation.id,
          oldStatus,
          newStatus: status,
          error: errorMessage,
        });
      }
    },
    [accountId, conversation, updateConversation]
  );

  return {
    handleMarkReadUnread,
    handleUpdateStatus,
  };
};
