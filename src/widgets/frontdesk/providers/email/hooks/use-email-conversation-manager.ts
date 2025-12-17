import { useState, useCallback } from "react";
import { EmailConversation, EmailDraft } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";
import { safeDecodeHtml } from "../utils/html-decode";
import { useFrontDeskRouter } from "@/widgets/frontdesk/routing/hooks/use-frontdesk-router";

interface UseEmailConversationManagerProps {
  selectedAccountId?: string;
  onRefresh: () => void;
  onMarkAsRead?: (conversationId: string) => Promise<void>;
}

export const useEmailConversationManager = ({ selectedAccountId, onRefresh, onMarkAsRead }: UseEmailConversationManagerProps) => {
  const [selectedConversation, setSelectedConversation] = useState<EmailConversation | null>(null);
  const { goToEmailConversation, navigate, RouteBuilder } = useFrontDeskRouter();

  /**
   * Internal function to select a conversation (state update only, no URL change)
   * Use this when the selection is triggered by URL changes to avoid circular updates
   */
  const selectConversation = useCallback(async (conversation: EmailConversation) => {
    console.log('[Email Conversation Manager] Selecting conversation (state only):', conversation.id);
    setSelectedConversation(conversation);
    
    // Mark conversation as read when opened (if unread)
    if (!conversation.isRead && onMarkAsRead && selectedAccountId) {
      try {
        console.log('[Email Conversation Manager] Marking conversation as read:', conversation.id);
        await onMarkAsRead(conversation.id);
      } catch (error) {
        console.error('[Email Conversation Manager] Failed to mark conversation as read:', error);
      }
    }
  }, [onMarkAsRead, selectedAccountId]);

  /**
   * Public function to select a conversation (updates state AND URL)
   * Use this when the selection is triggered by user clicks
   */
  const handleConversationSelect = useCallback(async (conversation: EmailConversation) => {
    console.log('[Email Conversation Manager] User selected conversation:', conversation.id);
    await selectConversation(conversation);
    // Update URL to reflect conversation selection
    goToEmailConversation(conversation.id);
  }, [selectConversation, goToEmailConversation]);

  const handleBack = useCallback(() => {
    setSelectedConversation(null);
    // Navigate back to email list (no conversation selected)
    navigate(RouteBuilder.email());
  }, [navigate, RouteBuilder]);

  const handleReply = useCallback(
    async (conversation: EmailConversation) => {
      if (!selectedAccountId) {
        console.error("No account selected");
        return;
      }

      // Use the last message from the conversation for reply
      const lastMessage = conversation.lastMessage;

      // lastMessage.from is now an array of EmailRecipient
      const fromSender = lastMessage.from?.[0];
      const senderDisplay = fromSender?.name || fromSender?.email || "Unknown";

      const draft: EmailDraft = {
        to: lastMessage.from || [],
        cc: [],
        bcc: [],
        subject: `Re: ${safeDecodeHtml(conversation.subject)}`,
        text: `\n\n---\nOn ${conversation.lastMessage.date}, ${senderDisplay} wrote:\n${safeDecodeHtml(
          conversation.lastMessage.snippet
        )}`,
        html: "",
        replyToMessageId: lastMessage.id,
        threadId: lastMessage.threadId,
      };

      return draft;
    },
    [selectedAccountId]
  );

  const handleSendReply = useCallback(
    async (text: string) => {
      if (!selectedConversation || !selectedAccountId) return false;

      try {
        // Use the last message from the conversation for reply
        const lastMessage = selectedConversation.lastMessage;

        // Convert from array to string array for API (backend expects string[])
        const toEmails = lastMessage.from?.map(recipient => recipient.email) || [];

        const response = await emailApiClient.sendEmail(selectedAccountId, {
          to: toEmails,
          cc: [],
          bcc: [],
          subject: `Re: ${selectedConversation.subject}`,
          text: text,
          html: "",
          replyToMessageId: lastMessage.id,
          threadId: lastMessage.threadId,
        });

        if (response.success) {
          onRefresh();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Failed to send reply:", error);
        return false;
      }
    },
    [selectedConversation, selectedAccountId, onRefresh]
  );

  return {
    selectedConversation,
    selectConversation,        // Internal: state-only update (for URL-triggered changes)
    handleConversationSelect,  // Public: state + URL update (for user clicks)
    handleBack,
    handleReply,
    handleSendReply,
  };
};
