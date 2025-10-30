import { useState, useEffect, useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import { ChatwootConversation, ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

interface UseChatwootMessagesProps {
  conversation: ChatwootConversation | null;
  accountId?: number | null;
}

export const useChatwootMessages = ({ conversation, accountId }: UseChatwootMessagesProps) => {
  const [messages, setMessages] = useState<ChatwootMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!conversation?.id || !accountId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to get messages from conversation details first
      const conversationDetails = await chatwootService.conversations.getConversationDetails(
        accountId,
        conversation.id
      );
      
      const fetchedMessages = conversationDetails?.data?.messages || 
                              conversationDetails?.payload?.messages || 
                              conversation.messages || [];

      // If no messages in details, fetch from messages endpoint
      if (fetchedMessages.length === 0) {
        const messagesResponse = await chatwootService.messages.listMessages(
          accountId,
          conversation.id
        );
        
        const apiMessages = messagesResponse?.payload || 
                           messagesResponse?.data?.payload ||
                           messagesResponse?.data || 
                           [];

        const sortedMessages = Array.isArray(apiMessages) 
          ? [...apiMessages].sort((a, b) => (a.created_at || 0) - (b.created_at || 0))
          : [];
        setMessages(sortedMessages);
      } else {
        const sortedMessages = Array.isArray(fetchedMessages)
          ? [...fetchedMessages].sort((a, b) => (a.created_at || 0) - (b.created_at || 0))
          : [];
        setMessages(sortedMessages);
      }
    } catch (err: any) {
      console.error("Failed to load Chatwoot messages:", err);
      setError(err?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversation?.id, accountId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    refresh: loadMessages,
  };
};

