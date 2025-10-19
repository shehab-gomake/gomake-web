import { useState, useEffect, useCallback, useRef } from "react";
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

  // Track last fetched conversation to prevent duplicate fetches
  const lastFetchedRef = useRef<string | null>(null);
  const fetchInProgressRef = useRef(false);

  // Fetch conversation details when conversation changes
  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (conversation && accountId) {
        // Check if the conversation object already has full messages (from fetchConversation)
        // This happens when navigating from notifications
        const conversationWithMessages = conversation as any;
        if (conversationWithMessages.messages && Array.isArray(conversationWithMessages.messages) && conversationWithMessages.messages.length > 0) {
          console.log('[Message Viewer] Conversation already has full messages, using cached data:', conversation.id);
          setMessages(conversationWithMessages.messages);
          setLoading(false);
          lastFetchedRef.current = conversation.id;
          return;
        }

        // Skip if already fetching this conversation
        if (fetchInProgressRef.current && lastFetchedRef.current === conversation.id) {
          console.log('[Message Viewer] Fetch already in progress for:', conversation.id);
          return;
        }

        // Skip if we just fetched this conversation
        if (lastFetchedRef.current === conversation.id && messages.length > 0) {
          console.log('[Message Viewer] Conversation already fetched, skipping:', conversation.id);
          return;
        }

        console.log('[Message Viewer] Fetching conversation details:', conversation.id);

        // Clear old messages immediately to prevent flash of previous content
        setMessages([]);
        setLoading(true);
        fetchInProgressRef.current = true;
        lastFetchedRef.current = conversation.id;

        try {
          const conversationDetail = await emailApiClient.getConversationDetail(accountId, conversation.id);
          setMessages(conversationDetail.messages);
          console.log('[Message Viewer] Successfully fetched', conversationDetail.messages.length, 'messages');
        } catch (error) {
          console.error("[Message Viewer] Failed to fetch conversation details:", error);
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
          fetchInProgressRef.current = false;
        }
      } else {
        setMessages([]);
        setLoading(false);
        lastFetchedRef.current = null;
        fetchInProgressRef.current = false;
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
