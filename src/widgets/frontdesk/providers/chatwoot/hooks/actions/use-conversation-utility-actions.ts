/**
 * Conversation Utility Actions Hook
 * Handles utility actions like copy link, open in new tab, delete, etc.
 */

import { useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";

interface UseConversationUtilityActionsProps {
  accountId: number | null;
  conversation: ChatwootConversation | null;
  removeConversation: (conversationId: number) => void;
}

export const useConversationUtilityActions = ({
  accountId,
  conversation,
  removeConversation,
}: UseConversationUtilityActionsProps) => {
  /**
   * Handle Copy Link
   */
  const handleCopyLink = useCallback(async () => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot copy link: Missing account or conversation", "error");
      return;
    }

    const link = `${window.location.origin}/app/accounts/${accountId}/conversations/${conversation.id}`;

    try {
      await navigator.clipboard.writeText(link);
      showNotification("Link copied to clipboard", "success");
    } catch (error) {
      showNotification("Failed to copy link", "error");
      console.error("Failed to copy link:", error);
    }
  }, [accountId, conversation?.id]);

  /**
   * Handle Open in New Tab
   */
  const handleOpenInNewTab = useCallback(() => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot open: Missing account or conversation", "error");
      return;
    }

    const link = `${window.location.origin}/app/accounts/${accountId}/conversations/${conversation.id}`;
    window.open(link, "_blank");
  }, [accountId, conversation?.id]);

  /**
   * Handle Delete Conversation (Admin Only)
   */
  const handleDeleteConversation = useCallback(async () => {
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
      await chatwootService.conversations.deleteConversation(accountId, conversation.id);

      showNotification("Conversation deleted", "success");

      // Remove from list
      removeConversation(conversation.id);
    } catch (error: any) {
      showNotification("Failed to delete conversation", "error");
      console.error("Failed to delete conversation:", error);
    }
  }, [accountId, conversation?.id, removeConversation]);

  /**
   * Handle Mute Conversation
   * TODO: Implement when mute/unmute API endpoints are available
   */
  const handleMuteConversation = useCallback(async () => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot perform action: Missing account or conversation", "error");
      return;
    }

    // TODO: Uncomment when API is available
    // try {
    //   await chatwootService.conversations.muteConversation(accountId, conversation.id);
    //   showNotification("Conversation muted", "success");
    // } catch (error: any) {
    //   showNotification("Failed to mute conversation", "error");
    //   console.error("Failed to mute conversation:", error);
    // }

    showNotification("Mute feature coming soon", "info");
  }, [accountId, conversation?.id]);

  /**
   * Handle Unmute Conversation
   * TODO: Implement when mute/unmute API endpoints are available
   */
  const handleUnmuteConversation = useCallback(async () => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot perform action: Missing account or conversation", "error");
      return;
    }

    // TODO: Uncomment when API is available
    // try {
    //   await chatwootService.conversations.unmuteConversation(accountId, conversation.id);
    //   showNotification("Conversation unmuted", "success");
    // } catch (error: any) {
    //   showNotification("Failed to unmute conversation", "error");
    //   console.error("Failed to unmute conversation:", error);
    // }

    showNotification("Unmute feature coming soon", "info");
  }, [accountId, conversation?.id]);

  return {
    handleCopyLink,
    handleOpenInNewTab,
    handleDeleteConversation,
    handleMuteConversation,
    handleUnmuteConversation,
  };
};
