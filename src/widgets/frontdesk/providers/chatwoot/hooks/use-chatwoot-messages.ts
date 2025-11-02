import { useState, useEffect, useCallback } from "react";
import { chatwootService } from "@/services/frontdesk";
import { ChatwootConversation, ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootMessages");

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
      let apiMessages: ChatwootMessage[] = [];
      let fullConversation: ChatwootConversation | null = null;
      
      // First, check if conversation already has messages
      if (conversation.messages && conversation.messages.length > 0) {
        apiMessages = conversation.messages;
        fullConversation = conversation;
      } else {
        // Fetch full conversation details - this includes all messages
        const conversationDetails = await chatwootService.conversations.getConversationDetails(
          accountId,
          conversation.id
        );
        
        fullConversation = conversationDetails?.data || conversationDetails?.payload || conversation;
        
        if (fullConversation?.messages && fullConversation.messages.length > 0) {
          apiMessages = fullConversation.messages;
        }
      }

      // Use full conversation for metadata (additional_attributes, meta, etc.)
      const conversationToUse = fullConversation || conversation;

      // Keep ALL messages including activity messages (message_type 2)
      // Activity messages show status changes, priority changes, assignments, etc.
      // They are rendered as centered ActivityBubbles by ChatwootMessageItem
      let sortedMessages = Array.isArray(apiMessages) ? apiMessages : [];

      // Debug: Log message types received from API
      console.log('[use-chatwoot-messages] Messages from API:', {
        total: apiMessages?.length || 0,
        byType: apiMessages?.reduce((acc: any, msg: any) => {
          const type = msg.message_type ?? 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}),
        activityMessages: apiMessages?.filter((m: any) => m.message_type === 2).map((m: any) => ({
          id: m.id,
          content: m.content?.substring(0, 80),
        })),
      });

      // Sort by created_at timestamp
      sortedMessages = [...sortedMessages].sort((a, b) => (a.created_at || 0) - (b.created_at || 0));

      // Get the recipient email for original message
      // Original email was sent TO this address (the account/inbox email)
      // We can get it from any reply message's to_emails, or use a default
      let recipientEmail = "";
      if (sortedMessages.length > 0) {
        // Check last message (most recent reply) for to_emails
        const lastMsg = sortedMessages[sortedMessages.length - 1];
        recipientEmail = lastMsg.content_attributes?.to_emails?.[0] ||
                         lastMsg.content_attributes?.email?.to ||
                         "";
      }
      
      // If still no recipient, we'll skip showing "To:" in original email

      // If we have conversation metadata with mail_subject, create the original email message
      // as the first message if it doesn't exist
      if (conversationToUse.additional_attributes?.mail_subject) {
        // Check if first message already has this subject
        const firstMsgSubject = sortedMessages[0]?.content_attributes?.email?.subject || 
                                sortedMessages[0]?.content_attributes?.subject;
        
        if (!firstMsgSubject || firstMsgSubject !== conversationToUse.additional_attributes.mail_subject) {
          // Try multiple sources for original email content
          let originalContent = "";
          
          // 1. Check last_non_activity_message - this might be the original
          if (conversationToUse.last_non_activity_message?.content && 
              conversationToUse.last_non_activity_message.message_type !== 1) {
            originalContent = conversationToUse.last_non_activity_message.content;
          }
          // 2. Check first message if it looks like original email (short, doesn't say "response")
          else if (sortedMessages.length > 0) {
            const firstMsg = sortedMessages[0];
            if (firstMsg.content && 
                firstMsg.content.length < 200 && 
                !firstMsg.content.toLowerCase().includes("response") &&
                firstMsg.message_type === 0) {
              originalContent = firstMsg.content;
              // Remove it from sorted messages to avoid duplication
              sortedMessages = sortedMessages.slice(1);
            }
          }
          
          // Determine recipient email - original email was sent TO the inbox/account
          // We can infer from reply messages which email the conversation is about
          const inferredRecipient = recipientEmail || "";
          
          // Create the original email message from conversation metadata
          const originalEmailMessage: ChatwootMessage = {
            id: `original-${conversationToUse.id}`, // Unique ID
            content: originalContent, 
            content_type: "text",
            content_attributes: {
              email: {
                subject: conversationToUse.additional_attributes.mail_subject,
                ...(inferredRecipient && { to: inferredRecipient }),
              },
            },
            message_type: 0, // Incoming (from customer)
            created_at: conversationToUse.additional_attributes?.initiated_at?.timestamp 
              ? new Date(conversationToUse.additional_attributes.initiated_at.timestamp).getTime() / 1000
              : (conversationToUse.created_at || conversationToUse.timestamp || (sortedMessages[0]?.created_at || Date.now() / 1000)),
            sender: conversationToUse.meta?.sender ? {
              name: conversationToUse.meta.sender.name,
              email: conversationToUse.meta.sender.email,
              avatar_url: conversationToUse.meta.sender.thumbnail || "",
            } : undefined,
          };
          
          sortedMessages.unshift(originalEmailMessage);
        }
      }

      setMessages(sortedMessages);
    } catch (err: any) {
      logger.error("Failed to load messages", err);
      setError(err?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [conversation, accountId]);

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

