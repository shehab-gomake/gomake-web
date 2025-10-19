import { useState, useEffect, useCallback } from "react";
import { EmailConversation, EmailMessage } from "../types/email.types";
import { emailApiClient } from "../utils/email-api-client";

interface UseMessageViewerProps {
  conversation: EmailConversation | null;
  accountId?: string;
  onSendReply?: (text: string, replyAll?: boolean) => Promise<boolean>;
}

export const useMessageViewer = ({ conversation, accountId, onSendReply }: UseMessageViewerProps) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInlineReply, setShowInlineReply] = useState(false);
  const [isReplyAll, setIsReplyAll] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Fetch conversation details when conversation changes
  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (conversation && accountId) {
        // Clear old messages immediately to prevent flash of previous content
        setMessages([]);
        setLoading(true);

        try {
          const conversationDetail = await emailApiClient.getConversationDetail(accountId, conversation.id);
          setMessages(conversationDetail.messages);
        } catch (error) {
          console.error("Failed to fetch conversation details:", error);
          // Fallback to single message display
          // lastMessage.from is now an array
          setMessages([
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
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        setMessages([]);
        setLoading(false);
      }
    };

    fetchConversationDetails();
  }, [conversation?.id, accountId]);  // Only depend on conversation.id, not the whole object

  const handleInlineReply = useCallback(async () => {
    const text = replyText.trim();
    if (!text || !onSendReply) return;

    const success = await onSendReply(text, isReplyAll);
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
