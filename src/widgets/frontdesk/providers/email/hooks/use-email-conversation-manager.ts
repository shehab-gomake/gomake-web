import { useState, useCallback } from "react";
import { EmailConversation, EmailDraft } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";
import { safeDecodeHtml } from "../utils/html-decode";
import { useFrontDeskRouter } from "@/widgets/frontdesk/routing/hooks/use-frontdesk-router";

interface UseEmailConversationManagerProps {
  selectedAccountId?: string;
  onRefresh: () => void;
}

export const useEmailConversationManager = ({ selectedAccountId, onRefresh }: UseEmailConversationManagerProps) => {
  const [selectedConversation, setSelectedConversation] = useState<EmailConversation | null>(null);
  const { goToEmailConversation, navigate, RouteBuilder } = useFrontDeskRouter();

  const handleConversationSelect = useCallback((conversation: EmailConversation) => {
    setSelectedConversation(conversation);
    // Update URL to reflect conversation selection
    goToEmailConversation(conversation.id);
  }, [goToEmailConversation]);

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
    handleConversationSelect,
    handleBack,
    handleReply,
    handleSendReply,
  };
};
