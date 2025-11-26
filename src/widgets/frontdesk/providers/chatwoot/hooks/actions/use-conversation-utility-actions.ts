/**
 * Conversation Utility Actions Hook
 * Handles utility actions like copy link, open in new tab, delete, etc.
 */

import { useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { showNotification } from "../utils/notification-utils";
import { useChatwootRouter } from "../use-chatwoot-router";
import { RouteBuilder, buildRoutePath } from "@/widgets/frontdesk/routing/route-builder";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";

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
  const { currentRoute, currentView, currentFilters } = useChatwootRouter();

  /**
   * Build a shareable link for the conversation
   * Preserves current view context and filters so the link opens in the same state
   */
  const buildConversationLink = useCallback(() => {
    if (!conversation?.id) return null;

    // Build route with current view, conversation, channel, and filters
    const channelId = currentRoute?.channelId || (conversation.inbox_id ? String(conversation.inbox_id) : undefined);
    const route = RouteBuilder.chatwoot(
      currentView || ChatwootView.MY_INBOX,
      String(conversation.id),
      channelId,
      currentFilters
    );
    const path = buildRoutePath(route);
    return `${window.location.origin}${path}`;
  }, [conversation?.id, conversation?.inbox_id, currentView, currentRoute?.channelId, currentFilters]);

  /**
   * Handle Copy Link
   */
  const handleCopyLink = useCallback(async () => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot copy link: Missing account or conversation", "error");
      return;
    }

    const link = buildConversationLink();
    if (!link) {
      showNotification("Cannot copy link: Failed to build URL", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      showNotification("Link copied to clipboard", "success");
    } catch (error) {
      showNotification("Failed to copy link", "error");
      console.error("Failed to copy link:", error);
    }
  }, [accountId, conversation?.id, buildConversationLink]);

  /**
   * Handle Open in New Tab
   */
  const handleOpenInNewTab = useCallback(() => {
    if (!accountId || !conversation?.id) {
      showNotification("Cannot open: Missing account or conversation", "error");
      return;
    }

    const link = buildConversationLink();
    if (!link) {
      showNotification("Cannot open: Failed to build URL", "error");
      return;
    }

    window.open(link, "_blank");
  }, [accountId, conversation?.id, buildConversationLink]);

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
