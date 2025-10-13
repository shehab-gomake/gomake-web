import { useState, useEffect, useCallback } from "react";
import { UnifiedMessage, emailToUnified, ticketToUnified } from "@/widgets/frontdesk/utils/message-transformer";
import { emailApiClient } from "@/widgets/frontdesk/providers/email/utils/email-api-client";

interface UseConversationViewerProps {
  provider: "email" | "ticket";
  conversation: any | null; // EmailConversation | TicketWithDetails
  accountId?: string; // Required for email
  onSendReply?: (text: string, options?: any) => Promise<boolean>;
}

/**
 * Unified conversation viewer hook based on email's useMessageViewer pattern.
 *
 * Features:
 * - Fetches and displays messages from any provider
 * - Transforms provider-specific messages to UnifiedMessage format
 * - Manages inline reply state
 * - Handles sending replies
 * - Clean, simple state management
 *
 * Supported providers:
 * - Email: Fetches conversation details via API
 * - Ticket: Uses ticket.conversation.messages directly
 * - Future: DMs, WhatsApp, etc.
 */
export const useConversationViewer = ({
  provider,
  conversation,
  accountId,
  onSendReply,
}: UseConversationViewerProps) => {
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInlineReply, setShowInlineReply] = useState(false);
  const [isReplyAll, setIsReplyAll] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation) {
        setMessages([]);
        return;
      }

      setLoading(true);
      try {
        if (provider === "email" && accountId) {
          // Email provider: Fetch full conversation details
          const conversationDetail = await emailApiClient.getConversationDetail(accountId, conversation.id);
          const unifiedMessages = conversationDetail.messages.map((msg: any) =>
            emailToUnified(msg, accountId)
          );
          setMessages(unifiedMessages);
        } else if (provider === "ticket") {
          // Ticket provider: Use messages from ticket.conversation
          if (conversation.conversation?.messages) {
            const unifiedMessages = conversation.conversation.messages.map((msg: any) =>
              ticketToUnified(msg, conversation)
            );
            setMessages(unifiedMessages);
          } else {
            console.warn("[useConversationViewer] Ticket conversation missing messages:", conversation.id);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error(`[useConversationViewer] Failed to fetch ${provider} messages:`, error);
        // Fallback to basic display if fetch fails
        if (provider === "email" && conversation.lastMessage) {
          const fallbackMessage = emailToUnified(
            {
              id: conversation.lastMessage.id,
              threadId: conversation.lastMessage.threadId,
              subject: conversation.subject,
              from: conversation.lastMessage.from || [],
              to: conversation.lastMessage.to || [],
              date: conversation.lastMessage.date,
              text: conversation.lastMessage.snippet,
              snippet: conversation.lastMessage.snippet,
              isRead: conversation.lastMessage.isRead,
              isStarred: false,
              hasAttachments: false,
            },
            accountId
          );
          setMessages([fallbackMessage]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation, provider, accountId]);

  const handleInlineReply = useCallback(async () => {
    const text = replyText.trim();
    if (!text || !onSendReply) return;

    const success = await onSendReply(text, { replyAll: isReplyAll });
    if (success) {
      setReplyText("");
      setShowInlineReply(false);
    }
  }, [replyText, isReplyAll, onSendReply]);

  const handleReply = useCallback(() => {
    setShowInlineReply(true);
    setIsReplyAll(false);
  }, []);

  const handleReplyAll = useCallback(() => {
    setShowInlineReply(true);
    setIsReplyAll(true);
  }, []);

  const handleCancelReply = useCallback(() => {
    setShowInlineReply(false);
    setReplyText("");
  }, []);

  return {
    messages,
    loading,
    showInlineReply,
    isReplyAll,
    replyText,
    setReplyText,
    handleReply,
    handleReplyAll,
    handleCancelReply,
    handleInlineReply,
  };
};
