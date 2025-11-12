import { useState, useEffect, useCallback, useRef } from "react";
import { chatwootService } from "@/services/frontdesk";
import { ChatwootConversation, ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { createLogger } from "@/services/frontdesk/utils/logger";
import { DEFAULT_PAGE_SIZE } from "../constants";

const logger = createLogger("useChatwootMessages");

interface UseChatwootMessagesProps {
  conversation: ChatwootConversation | null;
  accountId?: number | null;
}

interface MessagePagination {
  hasMoreOlder: boolean;
  hasMoreNewer: boolean;
  oldestMessageId: number | null;
  newestMessageId: number | null;
  isLoadingMore: boolean;
}

export const useChatwootMessages = ({ conversation, accountId }: UseChatwootMessagesProps) => {
  const [messages, setMessages] = useState<ChatwootMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MessagePagination>({
    hasMoreOlder: false,
    hasMoreNewer: false,
    oldestMessageId: null,
    newestMessageId: null,
    isLoadingMore: false,
  });

  // Fetch deduplication: Prevent concurrent duplicate requests
  const isFetchingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  
  // Track previous conversation ID to preserve messages during transition
  const previousConversationIdRef = useRef<number | null>(null);
  const previousMessagesRef = useRef<ChatwootMessage[]>([]);

  /**
   * Load initial batch of messages for a conversation
   */
  const loadMessages = useCallback(async () => {
    if (!conversation?.id || !accountId) {
      // Clear messages only if conversation is actually null (not just switching)
      if (!conversation) {
        setMessages([]);
        previousMessagesRef.current = [];
        previousConversationIdRef.current = null;
        setPagination({
          hasMoreOlder: false,
          hasMoreNewer: false,
          oldestMessageId: null,
          newestMessageId: null,
          isLoadingMore: false,
        });
      }
      return;
    }

    // Check if this is a conversation switch
    const isConversationSwitch = previousConversationIdRef.current !== null && 
                                  previousConversationIdRef.current !== conversation.id;

    // Prevent duplicate concurrent requests
    if (isFetchingRef.current) {
      logger.debug("Load messages already in progress, skipping duplicate call");
      return;
    }

    // Preserve previous messages during transition for smooth UX
    if (isConversationSwitch && previousMessagesRef.current.length > 0) {
      // Keep showing previous messages until new ones load
      setMessages(previousMessagesRef.current);
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Load initial batch of messages using listMessages API with pagination
      const response = await chatwootService.messages.listMessages(
        accountId,
        conversation.id
      );

      let apiMessages: ChatwootMessage[] = response.payload || [];

      // Debug: Log message types received from API
      logger.debug("Messages from API:", {
        total: apiMessages.length,
        conversationId: conversation.id,
        byType: apiMessages.reduce((acc: any, msg: any) => {
          const type = msg.message_type ?? "unknown";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}),
      });

      // Sort by created_at timestamp
      let sortedMessages = [...apiMessages].sort((a, b) => (a.created_at || 0) - (b.created_at || 0));

      // Get the recipient email for original message
      let recipientEmail = "";
      if (sortedMessages.length > 0) {
        const lastMsg = sortedMessages[sortedMessages.length - 1];
        recipientEmail =
          lastMsg.content_attributes?.to_emails?.[0] ||
          (lastMsg.content_attributes?.email as any)?.to ||
          "";
      }

      // If we have conversation metadata with mail_subject, create the original email message
      // as the first message if it doesn't exist
      if (conversation.additional_attributes?.mail_subject) {
        const firstMsgSubject =
          (sortedMessages[0]?.content_attributes?.email as any)?.subject ||
          sortedMessages[0]?.content_attributes?.subject;

        if (!firstMsgSubject || firstMsgSubject !== conversation.additional_attributes.mail_subject) {
          // Try multiple sources for original email content
          let originalContent = "";

          // 1. Check last_non_activity_message - this might be the original
          if (
            conversation.last_non_activity_message?.content &&
            conversation.last_non_activity_message.message_type !== 1
          ) {
            originalContent = conversation.last_non_activity_message.content;
          }
          // 2. Check first message if it looks like original email
          else if (sortedMessages.length > 0) {
            const firstMsg = sortedMessages[0];
            if (
              firstMsg.content &&
              firstMsg.content.length < 200 &&
              !firstMsg.content.toLowerCase().includes("response") &&
              firstMsg.message_type === 0
            ) {
              originalContent = firstMsg.content;
              // Remove it from sorted messages to avoid duplication
              sortedMessages = sortedMessages.slice(1);
            }
          }

          // Create the original email message from conversation metadata
          const originalEmailMessage: ChatwootMessage = {
            id: -(conversation.id || 0), // Negative ID to avoid conflicts with real messages
            content: originalContent,
            content_type: "text",
            content_attributes: {
              email: {
                subject: conversation.additional_attributes.mail_subject,
                ...(recipientEmail && { to: recipientEmail }),
              } as any,
            },
            message_type: 0, // Incoming (from customer)
            created_at: conversation.additional_attributes?.initiated_at?.timestamp
              ? new Date(conversation.additional_attributes.initiated_at.timestamp).getTime() / 1000
              : Number(conversation.created_at) ||
                Number(conversation.timestamp) ||
                (sortedMessages[0]?.created_at || Date.now() / 1000),
            sender: conversation.meta?.sender
              ? {
                  name: conversation.meta.sender.name,
                  email: conversation.meta.sender.email,
                  avatar_url: conversation.meta.sender.avatar_url || "",
                }
              : undefined,
          };

          sortedMessages.unshift(originalEmailMessage);
        }
      }

      // Update messages and track for next transition
      setMessages(sortedMessages);
      previousMessagesRef.current = sortedMessages;
      previousConversationIdRef.current = conversation.id;

      // Update pagination cursors
      if (sortedMessages.length > 0) {
        setPagination({
          oldestMessageId: sortedMessages[0].id || null,
          newestMessageId: sortedMessages[sortedMessages.length - 1].id || null,
          // Assume there might be more older messages if we got a full page
          hasMoreOlder: sortedMessages.length >= DEFAULT_PAGE_SIZE,
          hasMoreNewer: false,
          isLoadingMore: false,
        });
      }

      // Mark conversation as read after loading messages
      try {
        await chatwootService.conversations.markConversationAsRead(accountId, conversation.id);
        logger.debug("Marked conversation as read", { conversationId: conversation.id });
      } catch (readError) {
        // Don't fail the whole operation if marking as read fails
        logger.warn("Failed to mark conversation as read", readError);
      }
    } catch (err: any) {
      logger.error("Failed to load messages", err);
      setError(err?.message || "Failed to load messages");
      // Only clear messages on error if we don't have previous messages to show
      if (previousMessagesRef.current.length === 0) {
        setMessages([]);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [conversation, accountId]);

  /**
   * Load more older messages (pagination)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!conversation?.id || !accountId || !pagination.oldestMessageId || !pagination.hasMoreOlder) {
      return false;
    }

    // Prevent duplicate concurrent requests
    if (isLoadingMoreRef.current || pagination.isLoadingMore) {
      logger.debug("Load more messages already in progress, skipping duplicate call");
      return false;
    }

    isLoadingMoreRef.current = true;
    setPagination((prev) => ({ ...prev, isLoadingMore: true }));
    setError(null);

    try {
      // Load older messages before the oldest message ID
      const response = await chatwootService.messages.listMessages(accountId, conversation.id, {
        before: pagination.oldestMessageId,
      });

      const olderMessages: ChatwootMessage[] = response.payload || [];

      if (olderMessages.length > 0) {
        // Sort the older messages
        const sortedOlderMessages = [...olderMessages].sort(
          (a, b) => (a.created_at || 0) - (b.created_at || 0)
        );

        // Prepend to existing messages (deduplicate by ID)
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = sortedOlderMessages.filter((m) => !existingIds.has(m.id));
          return [...newMessages, ...prev];
        });

        // Update pagination cursors
        setPagination((prev) => ({
          ...prev,
          oldestMessageId: sortedOlderMessages[0].id || prev.oldestMessageId,
          hasMoreOlder: olderMessages.length >= DEFAULT_PAGE_SIZE,
          isLoadingMore: false,
        }));

        logger.debug(`Loaded ${olderMessages.length} older messages`, {
          conversationId: conversation.id,
        });

        return true;
      } else {
        // No more messages
        setPagination((prev) => ({
          ...prev,
          hasMoreOlder: false,
          isLoadingMore: false,
        }));
        return false;
      }
    } catch (err: any) {
      logger.error("Failed to load more messages", err);
      setError(err?.message || "Failed to load more messages");
      setPagination((prev) => ({ ...prev, isLoadingMore: false }));
      return false;
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [conversation, accountId, pagination.oldestMessageId, pagination.hasMoreOlder, pagination.isLoadingMore]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    error,
    refresh: loadMessages,
    loadMoreMessages,
    hasMoreMessages: pagination.hasMoreOlder,
    isLoadingMore: pagination.isLoadingMore,
  };
};
