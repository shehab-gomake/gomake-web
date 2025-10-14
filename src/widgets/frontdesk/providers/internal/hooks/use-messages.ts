import { useCallback, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { directMessagesWebSocketService } from '@/services/frontdesk/websocket/direct-messages-websocket.service';
import { directMessagesService } from '@/services/frontdesk/api/direct-messages.service';
import {
  dmMessagesState,
  dmMessageCursorsState,
  dmUnreadCountsState,
  dmConversationsState,
  dmIsSendingState,
  dmIsLoadingHistoryState,
  dmErrorState,
  dmActiveMessagesSelector,
} from '@/store/direct-messages';
import {
  DMMessage,
  DMNewMessageEvent,
  DMMessageConfirmedEvent,
  DMSendMessageEvent,
} from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';

/**
 * Hook for managing messages
 *
 * Extracted from monolithic use-direct-messages.ts as part of Phase 5 Part 2
 *
 * Responsibilities:
 * - Message loading and pagination
 * - Message sending with optimistic updates
 * - Message event handling (new message, confirmed)
 * - Message enrichment with user data
 * - Unread count updates
 * - Message history infinite scroll
 */
export function useMessages(deps: {
  activeConversationId: string | null;
  currentUser: any;
  userPresence: Record<string, any>;
  stopTyping: (conversationId: string) => void;
  clearDraft: (conversationId: string) => void;
  isTyping: boolean;
}) {
  // State
  const [messages, setMessages] = useRecoilState(dmMessagesState);
  const [messageCursors, setMessageCursors] = useRecoilState(dmMessageCursorsState);
  const [isSending, setIsSending] = useRecoilState(dmIsSendingState);
  const [isLoadingHistory, setIsLoadingHistory] = useRecoilState(dmIsLoadingHistoryState);
  const setError = useSetRecoilState(dmErrorState);
  const setUnreadCounts = useSetRecoilState(dmUnreadCountsState);
  const setConversations = useSetRecoilState(dmConversationsState);

  // Selectors
  const activeMessages = useRecoilValue(dmActiveMessagesSelector);

  // Refs
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Load message history for a conversation with pagination support
   */
  const loadMessageHistory = useCallback(
    async (conversationId: string, options?: { before?: string; after?: string; limit?: number }) => {
      try {
        setIsLoadingHistory(true);
        setError(null);

        const response = await directMessagesService.listMessages(conversationId, {
          limit: options?.limit || 50,
          before: options?.before,
          after: options?.after,
        });

        // Enrich messages with user data
        const enrichedMessages = response.messages.map((msg) => {
          // If message already has complete user data from backend, use it
          if (msg.user && msg.user.name) {
            return {
              ...msg,
              userEmail: msg.user.email || msg.userEmail || '',
              userName: msg.user.name || msg.userName || '',
            };
          }

          // Fallback: Check if this is the current user's message
          if (deps.currentUser && msg.userId === deps.currentUser.userId) {
            return {
              ...msg,
              userEmail: msg.userEmail || deps.currentUser.email || '',
              userName: msg.userName || deps.currentUser.name || 'You',
            };
          }

          // Fallback: Check presence data for other users (for older messages)
          const presence = deps.userPresence[msg.userId];
          if (presence) {
            return {
              ...msg,
              userEmail: msg.userEmail || presence.email || '',
              userName: msg.userName || presence.name || presence.email || 'User',
            };
          }

          // Last resort: use what we have from the message
          return {
            ...msg,
            userEmail: msg.userEmail || '',
            userName: msg.userName || msg.userEmail || 'User',
          };
        });

        setMessages((prev) => {
          const existingMessages = prev[conversationId] || [];

          if (options?.before) {
            // Prepending older messages (scrolling up)
            // Deduplicate by message ID
            const existingIds = new Set(existingMessages.map(m => m.id));
            const newMessages = enrichedMessages.filter(m => !existingIds.has(m.id));
            return {
              ...prev,
              [conversationId]: [...newMessages, ...existingMessages],
            };
          } else if (options?.after) {
            // Appending newer messages (catching up)
            const existingIds = new Set(existingMessages.map(m => m.id));
            const newMessages = enrichedMessages.filter(m => !existingIds.has(m.id));
            return {
              ...prev,
              [conversationId]: [...existingMessages, ...newMessages],
            };
          } else {
            // Initial load - replace all
            return {
              ...prev,
              [conversationId]: enrichedMessages,
            };
          }
        });

        // Update pagination cursors
        if (enrichedMessages.length > 0) {
          setMessageCursors((prev) => {
            const currentCursor = prev[conversationId] || { hasMoreOlder: true, hasMoreNewer: false };

            if (options?.before) {
              // Loading older messages
              return {
                ...prev,
                [conversationId]: {
                  ...currentCursor,
                  oldestMessageId: enrichedMessages[0].id,
                  hasMoreOlder: response.hasMore,
                },
              };
            } else if (options?.after) {
              // Loading newer messages
              return {
                ...prev,
                [conversationId]: {
                  ...currentCursor,
                  newestMessageId: enrichedMessages[enrichedMessages.length - 1].id,
                  hasMoreNewer: response.hasMore,
                },
              };
            } else {
              // Initial load
              return {
                ...prev,
                [conversationId]: {
                  oldestMessageId: enrichedMessages[0].id,
                  newestMessageId: enrichedMessages[enrichedMessages.length - 1].id,
                  hasMoreOlder: response.hasMore,
                  hasMoreNewer: false,
                },
              };
            }
          });
        }

        console.log(`Loaded ${response.messages.length} messages for conversation ${conversationId}`);
        return response.hasMore;
      } catch (error: any) {
        console.error("Failed to load message history:", error);
        setError(error.message || "Failed to load message history");
        return false;
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [setIsLoadingHistory, setError, setMessages, setMessageCursors, deps.userPresence, deps.currentUser]
  );

  /**
   * Load more messages (for infinite scroll)
   */
  const loadMoreMessages = useCallback(
    async (conversationId: string): Promise<boolean> => {
      const cursor = messageCursors[conversationId];
      if (!cursor?.oldestMessageId || !cursor.hasMoreOlder) {
        return false;
      }

      return await loadMessageHistory(conversationId, {
        before: cursor.oldestMessageId,
        limit: 50,
      });
    },
    [messageCursors, loadMessageHistory]
  );

  /**
   * Send message with optimistic updates
   */
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      console.log('[DM] Sending message:', { activeConversationId: deps.activeConversationId, content, currentUser: deps.currentUser });

      if (!deps.activeConversationId || !content.trim() || !deps.currentUser) {
        console.warn('[DM] Cannot send message - missing required data');
        return false;
      }

      try {
        setIsSending(true);
        setError(null);

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        console.log('[DM] Generated tempId:', tempId);

        // Create optimistic message for immediate UI update
        const optimisticMessage: DMMessage = {
          id: tempId,
          conversationId: deps.activeConversationId,
          userId: deps.currentUser.userId,
          userEmail: deps.currentUser.email,
          userName: deps.currentUser.name,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          tempId,
          metadata: { type: "text" },
        };

        // Add optimistic message to UI immediately
        setMessages((prev) => ({
          ...prev,
          [deps.activeConversationId]: [...(prev[deps.activeConversationId] || []), optimisticMessage],
        }));

        // Send message through WebSocket
        const messageData: DMSendMessageEvent = {
          conversationId: deps.activeConversationId,
          content: content.trim(),
          tempId,
          metadata: { type: "text" },
        };

        console.log('[DM] Emitting dm:sendMessage with data:', messageData);
        directMessagesWebSocketService.sendMessage(messageData);

        // Clear draft for this conversation
        deps.clearDraft(deps.activeConversationId);

        // Stop typing indicator when message is sent
        if (deps.isTyping) {
          deps.stopTyping(deps.activeConversationId);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }

        setIsSending(false);
        return true;
      } catch (error: any) {
        console.error("Failed to send message:", error);
        setError(error.message || "Failed to send message");
        setIsSending(false);
        return false;
      }
    },
    [deps.activeConversationId, deps.currentUser, deps.clearDraft, deps.stopTyping, deps.isTyping, setIsSending, setError, setMessages]
  );

  /**
   * Handle new message event from WebSocket
   */
  const handleNewMessage = useCallback((message: DMNewMessageEvent) => {
    console.log('[DM] Received new message event:', message);

    setMessages((prev) => {
      const conversationMessages = prev[message.conversationId] || [];

      // Check if this is our own message that was already added optimistically
      const existingOptimisticMessage = conversationMessages.find(
        (msg) => msg.tempId && msg.content === message.content && msg.userId === message.userId
      );

      if (existingOptimisticMessage) {
        // Replace the optimistic message with the confirmed one
        return {
          ...prev,
          [message.conversationId]: conversationMessages.map((msg) =>
            msg.tempId === existingOptimisticMessage.tempId
              ? { ...msg, id: message.messageId, tempId: undefined, createdAt: message.timestamp }
              : msg
          ),
        };
      }

      // Otherwise, add the new message
      // Enrich with user data
      let userEmail = '';
      let userName = '';
      let user = undefined;

      // First priority: Use embedded user object from backend
      if (message.user && message.user.name) {
        userEmail = message.user.email || '';
        userName = message.user.name || '';
        user = message.user;
      }
      // Fallback: Check if this is the current user's message
      else if (deps.currentUser && message.userId === deps.currentUser.userId) {
        userEmail = deps.currentUser.email || '';
        userName = deps.currentUser.name || '';
      }
      // Fallback: Check presence data for other users
      else {
        const presence = deps.userPresence[message.userId];
        if (presence) {
          userEmail = presence.email || '';
          userName = presence.name || '';
        }
      }

      const newMessage: DMMessage = {
        id: message.messageId,
        conversationId: message.conversationId,
        userId: message.userId || message.user?.id || '',
        userEmail,
        userName,
        content: message.content,
        createdAt: message.timestamp,
        tempId: message.tempId,
        metadata: { type: "text" },
        user,
      };

      return {
        ...prev,
        [message.conversationId]: [...conversationMessages, newMessage],
      };
    });

    const isActiveConversation = message.conversationId === deps.activeConversationId;
    const isOwnMessage = message.userId === deps.currentUser?.userId;

    if (!isActiveConversation && !isOwnMessage) {
      setUnreadCounts((prev) => {
        const nextCount = (prev[message.conversationId] || 0) + 1;
        return {
          ...prev,
          [message.conversationId]: nextCount,
        };
      });
    }

    // Update conversation's lastMessageAt to trigger re-sort
    setConversations((prev) => {
      return prev.map(conv => {
        if (conv.id === message.conversationId) {
          console.log('[DM] Updating conversation lastMessageAt:', message.conversationId);
          const shouldIncrementUnread = !isActiveConversation && !isOwnMessage;
          return {
            ...conv,
            lastMessageAt: message.timestamp,
            unreadCount: shouldIncrementUnread
              ? (conv.unreadCount || 0) + 1
              : conv.unreadCount,
          };
        }
        return conv;
      });
    });
  }, [deps.activeConversationId, deps.currentUser, deps.userPresence, setMessages, setUnreadCounts, setConversations]);

  /**
   * Handle message confirmed event from WebSocket
   */
  const handleMessageConfirmed = useCallback((data: DMMessageConfirmedEvent) => {
    console.log('[DM] Message confirmed:', data);

    // Replace temp message with confirmed message
    setMessages((prev) => {
      const conversationMessages = prev[data.conversationId] || [];
      return {
        ...prev,
        [data.conversationId]: conversationMessages.map((msg) =>
          msg.tempId === data.tempId
            ? { ...msg, id: data.messageId, tempId: undefined, createdAt: data.timestamp }
            : msg
        ),
      };
    });

    // Update conversation's lastMessageAt when our message is confirmed
    setConversations((prev) => {
      return prev.map(conv => {
        if (conv.id === data.conversationId) {
          console.log('[DM] Updating conversation lastMessageAt on message confirm:', data.conversationId);
          return {
            ...conv,
            lastMessageAt: data.timestamp,
          };
        }
        return conv;
      });
    });

    console.log("Message confirmed:", data);
  }, [setMessages, setConversations]);

  return {
    // State
    messages,
    activeMessages,
    messageCursors,
    isSending,
    isLoadingHistory,

    // Actions
    loadMessageHistory,
    loadMoreMessages,
    sendMessage,

    // Event handlers (for WebSocket event registration)
    handleNewMessage,
    handleMessageConfirmed,
  };
}

export type UseMessagesResult = ReturnType<typeof useMessages>;