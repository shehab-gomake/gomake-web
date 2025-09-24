import { useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { directMessagesWebSocketService } from "@/services/websocket/direct-messages-websocket.service";
import { directMessagesService } from "@/services/api-service/frontdesk/providers/internal/direct-messages.service";
import {
  dmConnectionState,
  dmConnectedState,
  dmCurrentUserState,
  dmConversationsState,
  dmActiveConversationIdState,
  dmMessagesState,
  dmUnreadCountsState,
  dmOnlineUsersState,
  dmUserPresenceState,
  dmTypingUsersState,
  dmIsTypingState,
  dmDraftState,
  dmErrorState,
  dmIsLoadingState,
  dmIsSendingState,
  dmIsLoadingHistoryState,
  dmIsLoadingConversationsState,
  dmUserSuggestionsState,
  dmIsLoadingSuggestionsState,
  dmMessageCursorsState,
  dmActiveConversationSelector,
  dmActiveMessagesSelector,
  dmActiveDraftSelector,
  dmActiveTypingUsersSelector,
  dmTotalUnreadCountSelector,
  dmSortedConversationsSelector,
  dmOnlineUsersWithPresenceSelector,
  dmOtherMembersSelector,
  dmSearchQueryState,
  dmFilteredConversationsSelector,
} from "@/store/direct-messages";
import {
  Conversation,
  ConversationMember,
  DMMessage,
  DMSendMessageEvent,
  DMNewMessageEvent,
  DMMessageConfirmedEvent,
  DMUserTypingEvent,
  DMPresenceData,
  CreateConversationRequest,
  DMUnreadCountUpdatedEvent,
} from "@/widgets/frontdesk/providers/internal/types/direct-messages.types";
import { useUserProfile } from "@/hooks/use-user-profile";
import { internalDirectMessagesAtom } from "@/store/frontdesk";

export const useDirectMessages = () => {
  const [connectionStatus, setConnectionStatus] = useRecoilState(dmConnectionState);
  const [connected, setConnected] = useRecoilState(dmConnectedState);
  const [currentUser, setCurrentUser] = useRecoilState(dmCurrentUserState);
  const [conversations, setConversations] = useRecoilState(dmConversationsState);
  const [activeConversationId, setActiveConversationId] = useRecoilState(dmActiveConversationIdState);
  const [messages, setMessages] = useRecoilState(dmMessagesState);
  const [unreadCounts, setUnreadCounts] = useRecoilState(dmUnreadCountsState);
  const [onlineUsers, setOnlineUsers] = useRecoilState(dmOnlineUsersState);
  const [userPresence, setUserPresence] = useRecoilState(dmUserPresenceState);
  const [typingUsers, setTypingUsers] = useRecoilState(dmTypingUsersState);
  const [isTyping, setIsTyping] = useRecoilState(dmIsTypingState);
  const [draft, setDraft] = useRecoilState(dmDraftState);
  const setError = useSetRecoilState(dmErrorState);
  const setFrontdeskDirectMessages = useSetRecoilState(internalDirectMessagesAtom);
  const [isLoading, setIsLoading] = useRecoilState(dmIsLoadingState);
  const [isSending, setIsSending] = useRecoilState(dmIsSendingState);
  const [isLoadingHistory, setIsLoadingHistory] = useRecoilState(dmIsLoadingHistoryState);
  const [isLoadingConversations, setIsLoadingConversations] = useRecoilState(dmIsLoadingConversationsState);
  const [userSuggestions, setUserSuggestions] = useRecoilState(dmUserSuggestionsState);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useRecoilState(dmIsLoadingSuggestionsState);
  const [messageCursors, setMessageCursors] = useRecoilState(dmMessageCursorsState);

  const { profileState: userProfile } = useUserProfile();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const joinedConversationsRef = useRef<Set<string>>(new Set());

  // Selectors
  const activeConversation = useRecoilValue(dmActiveConversationSelector);
  const activeMessages = useRecoilValue(dmActiveMessagesSelector);
  const activeDraft = useRecoilValue(dmActiveDraftSelector);
  const activeTypingUsers = useRecoilValue(dmActiveTypingUsersSelector);
  const totalUnreadCount = useRecoilValue(dmTotalUnreadCountSelector);
  const sortedConversations = useRecoilValue(dmSortedConversationsSelector);
  const onlineUsersWithPresence = useRecoilValue(dmOnlineUsersWithPresenceSelector);
  const otherMembers = useRecoilValue(dmOtherMembersSelector);

  useEffect(() => {
    setFrontdeskDirectMessages(sortedConversations);
  }, [sortedConversations, setFrontdeskDirectMessages]);

  // Ensure we are subscribed to all known conversations whenever the list changes
  useEffect(() => {
    const joinAllConversations = async () => {
      if (!directMessagesWebSocketService.isConnected()) {
        return;
      }

      for (const conversation of conversations) {
        if (!conversation?.id) continue;
        if (joinedConversationsRef.current.has(conversation.id)) continue;

        try {
          await directMessagesWebSocketService.joinConversation({ conversationId: conversation.id });
          joinedConversationsRef.current.add(conversation.id);
        } catch (error) {
          console.error('[DM] Failed to join conversation room during sync:', conversation.id, error);
        }
      }
    };

    joinAllConversations();
  }, [conversations]);

  // Initialize connection
  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting");
      setIsLoading(true);
      setError(null);

      await directMessagesWebSocketService.connect();
      setConnectionStatus("connected");
      setConnected(true);

      // Clear joined cache on fresh connection so we can rejoin rooms
      joinedConversationsRef.current.clear();

      // Load initial conversations
      await loadConversations();

      // Get initial presence data
      const presenceData = await directMessagesWebSocketService.getPresence();
      if (presenceData) {
        setUserPresence(presenceData);
        setOnlineUsers(Object.keys(presenceData));
      }
    } catch (error: any) {
      console.error("Failed to connect to DM service:", error);
      setConnectionStatus("error");
      setError(error.message || "Failed to connect to DM service");
    } finally {
      setIsLoading(false);
    }
  }, [setConnectionStatus, setConnected, setError, setIsLoading, setUserPresence, setOnlineUsers]);

  // Disconnect
  const disconnect = useCallback(() => {
    directMessagesWebSocketService.disconnect();
    setConnectionStatus("disconnected");
    setConnected(false);
    joinedConversationsRef.current.clear();
  }, [setConnectionStatus, setConnected]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setError(null);

      const response = await directMessagesService.listConversations({
        limit: 50,
        offset: 0,
        includeArchived: false,
      });

      // Filter out any invalid conversations before setting
      const validConversations = response.conversations.filter(conv => conv && conv.id);
      console.log('Loaded conversations:', validConversations);
      setConversations(validConversations);
      
      // Update unread counts
      const unreadMap: Record<string, number> = {};
      validConversations.forEach(conv => {
        unreadMap[conv.id] = conv.unreadCount || 0;
      });
      setUnreadCounts(unreadMap);

      // Join rooms for all loaded conversations to receive live updates
      if (directMessagesWebSocketService.isConnected()) {
        await Promise.all(validConversations.map(async (conv) => {
          if (!conv.id) return;
          if (joinedConversationsRef.current.has(conv.id)) return;
          try {
            await directMessagesWebSocketService.joinConversation({ conversationId: conv.id });
            joinedConversationsRef.current.add(conv.id);
          } catch (joinError) {
            console.error('[DM] Failed to join conversation room:', conv.id, joinError);
          }
        }));
      }
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      setError(error.message || "Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [setIsLoadingConversations, setError, setConversations, setUnreadCounts]);

  // Load message history for a conversation
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

        // Enrich messages with user data from presence
        const enrichedMessages = response.messages.map((msg) => {
          // Check if this is the current user's message
          if (currentUser && msg.userId === currentUser.userId) {
            return {
              ...msg,
              userEmail: currentUser.email || msg.userEmail || '',
              userName: currentUser.name || msg.userName || 'You',
            };
          }
          
          // Check presence data for other users
          const presence = userPresence[msg.userId];
          if (presence) {
            return {
              ...msg,
              userEmail: presence.email || msg.userEmail || '',
              userName: presence.name || msg.userName || presence.email || 'User',
            };
          }
          
          // If no presence data, use what we have from the message
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
    [setIsLoadingHistory, setError, setMessages, setMessageCursors, userPresence, currentUser]
  );

  // Load more messages (for infinite scroll)
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

  // Select conversation
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      try {
        setError(null);
        setActiveConversationId(conversation.id);

        // Populate user presence from conversation members
        if (conversation.members && conversation.members.length > 0) {
          const presenceUpdate: Record<string, DMPresenceData> = {};
          conversation.members.forEach(member => {
            if (!userPresence[member.userId]) {
              presenceUpdate[member.userId] = {
                userId: member.userId,
                email: member.email,
                firstName: member.firstName,
                lastName: member.lastName,
                name: member.name || `${member.firstName} ${member.lastName}`.trim() || member.email,
                status: 'offline', // Default status, will be updated by WebSocket
                lastSeen: new Date().toISOString(),
                timestamp: new Date().toISOString(),
              };
            }
          });
          
          if (Object.keys(presenceUpdate).length > 0) {
            setUserPresence(prev => ({ ...prev, ...presenceUpdate }));
          }
        }

        // Join conversation room for real-time updates
        const isSocketConnected = directMessagesWebSocketService.isConnected();
        if (isSocketConnected && !joinedConversationsRef.current.has(conversation.id)) {
          await directMessagesWebSocketService.joinConversation({
            conversationId: conversation.id,
          });
          joinedConversationsRef.current.add(conversation.id);
        }

        // Clear unread count for this conversation
        setUnreadCounts((prev) => ({ ...prev, [conversation.id]: 0 }));

        setConversations((prev) => prev.map((conv) => (
          conv.id === conversation.id
            ? { ...conv, unreadCount: 0 }
            : conv
        )));

        // Mark as read
        await directMessagesService.markAsRead(conversation.id, {
          lastReadAt: new Date().toISOString(),
        });

        // Load message history if we don't have messages yet
        const currentMessages = messages[conversation.id] || [];
        if (currentMessages.length === 0) {
          await loadMessageHistory(conversation.id);
        }
      } catch (error: any) {
        console.error("Failed to select conversation:", error);
        setError(error.message || "Failed to select conversation");
      }
    },
    [setError, setActiveConversationId, setUnreadCounts, setUserPresence, userPresence, messages, loadMessageHistory, connected]
  );

  // Create new conversation
  const createConversation = useCallback(
    async (data: CreateConversationRequest): Promise<Conversation | null> => {
      try {
        console.log('[DM] Creating conversation with data:', data);
        setError(null);
        const response = await directMessagesService.createConversation(data);
        console.log('[DM] Create conversation response:', response);
        
        // Add to conversations list (ensure the conversation is valid)
        if (response.conversation && response.conversation.id) {
          console.log('[DM] Adding conversation to list:', response.conversation.id);
          setConversations((prev) => [response.conversation, ...prev]);

          if (directMessagesWebSocketService.isConnected() && !joinedConversationsRef.current.has(response.conversation.id)) {
            try {
              await directMessagesWebSocketService.joinConversation({ conversationId: response.conversation.id });
              joinedConversationsRef.current.add(response.conversation.id);
            } catch (joinError) {
              console.error('[DM] Failed to join room for new conversation:', response.conversation.id, joinError);
            }
          }
        }
        
        // Select the new conversation
        console.log('[DM] Selecting new conversation:', response.conversation.id);
        await selectConversation(response.conversation);
        
        return response.conversation;
      } catch (error: any) {
        console.error("[DM] Failed to create conversation:", error);
        setError(error.message || "Failed to create conversation");
        return null;
      }
    },
    [setError, setConversations, selectConversation]
  );

  // Start direct message with a user
  const startDirectMessage = useCallback(
    async (userId: string): Promise<Conversation | null> => {
      console.log('[DM] Starting direct message with user:', userId);
      console.log('[DM] Current user:', currentUser);
      
      if (!currentUser || currentUser.userId === userId) {
        console.warn('[DM] Cannot start DM - invalid current user or same user');
        return null;
      }

      // Check if conversation already exists
      const existingConversation = conversations.find(
        conv => conv && conv.id && conv.type === 'DM' && 
        conv.members?.some(member => member && member.userId === userId) &&
        conv.members?.some(member => member && member.userId === currentUser.userId)
      );

      if (existingConversation) {
        console.log('[DM] Found existing conversation:', existingConversation.id);
        await selectConversation(existingConversation);
        return existingConversation;
      }

      // Create new conversation
      console.log('[DM] Creating new conversation with participant:', userId);
      return await createConversation({
        participantIds: [userId],
      });
    },
    [currentUser, conversations, selectConversation, createConversation]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      console.log('[DM] Sending message:', { activeConversationId, content, currentUser });
      
      if (!activeConversationId || !content.trim() || !currentUser) {
        console.warn('[DM] Cannot send message - missing required data');
        return false;
      }

      try {
        setIsSending(true);
        setError(null);

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('[DM] Generated tempId:', tempId);

        // Create optimistic message for immediate UI update
        const optimisticMessage: DMMessage = {
          id: tempId,
          conversationId: activeConversationId,
          userId: currentUser.userId,
          userEmail: currentUser.email,
          userName: currentUser.name,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          tempId,
          metadata: { type: "text" },
        };

        // Add optimistic message to UI immediately
        setMessages((prev) => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), optimisticMessage],
        }));

        // Send message through WebSocket
        const messageData: DMSendMessageEvent = {
          conversationId: activeConversationId,
          content: content.trim(),
          tempId,
          metadata: { type: "text" },
        };
        
        console.log('[DM] Emitting dm:sendMessage with data:', messageData);
        directMessagesWebSocketService.sendMessage(messageData);

        // Clear draft for this conversation
        setDraft((prev) => ({ ...prev, [activeConversationId]: "" }));
        
        // Stop typing indicator when message is sent
        if (isTyping) {
          setIsTyping(false);
          directMessagesWebSocketService.stopTyping({ conversationId: activeConversationId });
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
    [activeConversationId, currentUser, setIsSending, setError, setDraft, setMessages, isTyping, setIsTyping]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!activeConversationId || isTyping) return;

    setIsTyping(true);
    directMessagesWebSocketService.startTyping({ conversationId: activeConversationId });

    // Stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [activeConversationId, isTyping, setIsTyping]);

  const stopTyping = useCallback(() => {
    if (!activeConversationId || !isTyping) return;

    setIsTyping(false);
    directMessagesWebSocketService.stopTyping({ conversationId: activeConversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [activeConversationId, isTyping, setIsTyping]);

  // Update draft and handle typing
  const updateDraft = useCallback(
    (conversationId: string, content: string) => {
      setDraft((prev) => ({ ...prev, [conversationId]: content }));

      if (content.trim() && conversationId === activeConversationId) {
        startTyping();
      } else if (!content.trim()) {
        stopTyping();
      }
    },
    [activeConversationId, setDraft, startTyping, stopTyping]
  );

  // Load user suggestions
  const loadUserSuggestions = useCallback(
    async (query?: string) => {
      try {
        setIsLoadingSuggestions(true);
        const suggestions = await directMessagesService.getUserSuggestions(query, {
          limit: 10,
          onlineOnly: true,
        });
        setUserSuggestions(suggestions);
      } catch (error: any) {
        console.error("Failed to load user suggestions:", error);
        setError(error.message || "Failed to load user suggestions");
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [setIsLoadingSuggestions, setUserSuggestions, setError]
  );

  // Event handlers
  useEffect(() => {
    if (!connected) return;

    // Message handlers
    const handleNewMessage = (message: DMNewMessageEvent) => {
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
        
        if (currentUser && message.userId === currentUser.userId) {
          userEmail = currentUser.email || '';
          userName = currentUser.name || '';
        } else {
          const presence = userPresence[message.userId];
          if (presence) {
            userEmail = presence.email || '';
            userName = presence.name || '';
          }
        }
        
        const newMessage: DMMessage = {
          id: message.messageId,
          conversationId: message.conversationId,
          userId: message.userId,
          userEmail,
          userName,
          content: message.content,
          createdAt: message.timestamp,
          tempId: message.tempId,
          metadata: { type: "text" },
        };

        return {
          ...prev,
          [message.conversationId]: [...conversationMessages, newMessage],
        };
      });

      const isActiveConversation = message.conversationId === activeConversationId;
      const isOwnMessage = message.userId === currentUser?.userId;

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
    };

    const handleMessageConfirmed = (data: DMMessageConfirmedEvent) => {
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
    };

    // Typing handlers with auto-cleanup
    const handleUserTyping = (data: DMUserTypingEvent) => {
      const timeoutKey = `${data.conversationId}-${data.userId}`;
      
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        const conversationTypers = newTypingUsers[data.conversationId] || [];

        if (data.isTyping) {
          if (!conversationTypers.includes(data.userId)) {
            newTypingUsers[data.conversationId] = [...conversationTypers, data.userId];
          }
          
          // Clear any existing timeout for this user
          if (typingTimeouts.current[timeoutKey]) {
            clearTimeout(typingTimeouts.current[timeoutKey]);
          }
          
          // Set auto-cleanup after 5 seconds (in case stop event is missed)
          typingTimeouts.current[timeoutKey] = setTimeout(() => {
            setTypingUsers((prev) => {
              const updatedTypers = { ...prev };
              updatedTypers[data.conversationId] = (updatedTypers[data.conversationId] || [])
                .filter((id) => id !== data.userId);
              return updatedTypers;
            });
            delete typingTimeouts.current[timeoutKey];
          }, 5000);
          
        } else {
          // User stopped typing
          newTypingUsers[data.conversationId] = conversationTypers.filter((id) => id !== data.userId);
          
          // Clear the timeout if it exists
          if (typingTimeouts.current[timeoutKey]) {
            clearTimeout(typingTimeouts.current[timeoutKey]);
            delete typingTimeouts.current[timeoutKey];
          }
        }

        return newTypingUsers;
      });
    };

    // Presence handlers
    const handleUserOnline = (data: any) => {
      console.log("Received userOnline event (direct messages):", data);
      setOnlineUsers((prev) => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
      
      if (data.userId) {
        setUserPresence((prev) => ({
          ...prev,
          [data.userId]: {
            userId: data.userId,
            email: data.email || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            status: "online",
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }));
      }
    };

    const handleUserOffline = (data: any) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      if (data.userId) {
        setUserPresence((prev) => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            status: "offline",
            lastSeen: data.lastSeen,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }));
      }
    };

    // Connection handlers
    const handleConnect = () => {
      setConnectionStatus("connected");
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
      setConnected(false);
    };

    const handleError = (error: string) => {
      setConnectionStatus("error");
      setError(error);
    };

    const handleUnreadCountUpdated = (data: DMUnreadCountUpdatedEvent) => {
      console.log('[DM] Unread count updated:', data);
      setUnreadCounts((prev) => {
        if (prev[data.conversationId] === data.unreadCount) {
          return prev;
        }
        return {
          ...prev,
          [data.conversationId]: data.unreadCount,
        };
      });

      setConversations((prev) => prev.map((conv) => {
        if (conv.id !== data.conversationId) {
          return conv;
        }

        if (conv.unreadCount === data.unreadCount) {
          return conv;
        }

        return {
          ...conv,
          unreadCount: data.unreadCount,
        };
      }));
    };

    // Conversation update handler
    const handleConversationUpdated = (data: any) => {
      console.log('[DM] Conversation updated:', data);
      // Update conversation's lastMessageAt and lastMessage
      setConversations((prev) => {
        return prev.map(conv => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              lastMessageAt: data.lastMessageAt,
              lastMessage: data.lastMessage,
            };
          }
          return conv;
        });
      });
    };

    // Register event listeners
    directMessagesWebSocketService.onNewMessage(handleNewMessage);
    directMessagesWebSocketService.onMessageConfirmed(handleMessageConfirmed);
    directMessagesWebSocketService.onUserTyping(handleUserTyping);
    directMessagesWebSocketService.onUserOnline(handleUserOnline);
    directMessagesWebSocketService.onUserOffline(handleUserOffline);
    directMessagesWebSocketService.onConnect(handleConnect);
    directMessagesWebSocketService.onDisconnect(handleDisconnect);
    directMessagesWebSocketService.onError(handleError);
    directMessagesWebSocketService.onConversationUpdated(handleConversationUpdated);
    directMessagesWebSocketService.onUnreadCountUpdated(handleUnreadCountUpdated);

    // Cleanup
    return () => {
      directMessagesWebSocketService.removeAllListeners();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Clear all typing timeouts
      Object.values(typingTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [
    connected,
    activeConversationId,
    currentUser,
    userPresence,
    setMessages,
    setUnreadCounts,
    setConversations,
    setOnlineUsers,
    setUserPresence,
    setTypingUsers,
    setConnectionStatus,
    setConnected,
    setError,
  ]);

  // Auto-connect on mount
  useEffect(() => {
    const userId = userProfile?.id || userProfile?.userId;
    if (userProfile && userId && !connected && connectionStatus === "disconnected") {
      connect();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userProfile, connected, connectionStatus, connect]);

  // Set current user from global state
  useEffect(() => {
    const userId = userProfile?.id || userProfile?.userId;
    if (userProfile && userId && !currentUser) {
      setCurrentUser({
        userId: userId,
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        name: `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || userProfile.email || "User",
        isArchived: false,
        isFavorite: false,
        role: 'member',
      });
    }
  }, [userProfile, currentUser, setCurrentUser]);

  return {
    // Connection state
    connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    isLoadingConversations,
    error: useRecoilValue(dmErrorState),

    // Data
    currentUser,
    conversations: sortedConversations,
    activeConversation,
    activeConversationId,
    messages: activeMessages,
    allMessages: messages,
    unreadCounts,
    totalUnreadCount,
    onlineUsers,
    onlineUsersWithPresence,
    userPresence,
    typingUsers: activeTypingUsers,
    allTypingUsers: typingUsers,
    isTyping,
    draft: activeDraft,
    allDrafts: draft,
    isSending,
    otherMembers,

    // User suggestions
    userSuggestions,
    isLoadingSuggestions,

    // Actions
    connect,
    disconnect,
    loadConversations,
    selectConversation,
    createConversation,
    startDirectMessage,
    sendMessage,
    loadMessageHistory,
    loadMoreMessages,
    startTyping,
    stopTyping,
    updateDraft,
    loadUserSuggestions,
    setActiveConversationId,
    setError,
    
    // Pagination state
    messageCursors,
  };
};
