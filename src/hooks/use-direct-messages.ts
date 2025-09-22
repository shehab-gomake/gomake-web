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
} from "@/widgets/frontdesk/providers/internal/types/direct-messages.types";
import { useUserProfile } from "@/hooks/use-user-profile";

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
  const [isLoading, setIsLoading] = useRecoilState(dmIsLoadingState);
  const [isSending, setIsSending] = useRecoilState(dmIsSendingState);
  const [isLoadingHistory, setIsLoadingHistory] = useRecoilState(dmIsLoadingHistoryState);
  const [isLoadingConversations, setIsLoadingConversations] = useRecoilState(dmIsLoadingConversationsState);
  const [userSuggestions, setUserSuggestions] = useRecoilState(dmUserSuggestionsState);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useRecoilState(dmIsLoadingSuggestionsState);

  const { profileState: userProfile } = useUserProfile();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Selectors
  const activeConversation = useRecoilValue(dmActiveConversationSelector);
  const activeMessages = useRecoilValue(dmActiveMessagesSelector);
  const activeDraft = useRecoilValue(dmActiveDraftSelector);
  const activeTypingUsers = useRecoilValue(dmActiveTypingUsersSelector);
  const totalUnreadCount = useRecoilValue(dmTotalUnreadCountSelector);
  const sortedConversations = useRecoilValue(dmSortedConversationsSelector);
  const onlineUsersWithPresence = useRecoilValue(dmOnlineUsersWithPresenceSelector);
  const otherMembers = useRecoilValue(dmOtherMembersSelector);

  // Initialize connection
  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting");
      setIsLoading(true);
      setError(null);

      await directMessagesWebSocketService.connect();
      setConnectionStatus("connected");
      setConnected(true);

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

      setConversations(response.conversations);
      
      // Update unread counts
      const unreadMap: Record<string, number> = {};
      response.conversations.forEach(conv => {
        unreadMap[conv.id] = conv.unreadCount || 0;
      });
      setUnreadCounts(unreadMap);
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      setError(error.message || "Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [setIsLoadingConversations, setError, setConversations, setUnreadCounts]);

  // Load message history for a conversation
  const loadMessageHistory = useCallback(
    async (conversationId: string) => {
      try {
        setIsLoadingHistory(true);
        setError(null);

        const response = await directMessagesService.listMessages(conversationId, {
          limit: 50,
        });

        setMessages((prev) => ({
          ...prev,
          [conversationId]: response.messages,
        }));

        console.log(`Loaded ${response.messages.length} messages for conversation ${conversationId}`);
      } catch (error: any) {
        console.error("Failed to load message history:", error);
        setError(error.message || "Failed to load message history");
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [setIsLoadingHistory, setError, setMessages]
  );

  // Select conversation
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      try {
        setError(null);
        setActiveConversationId(conversation.id);

        // Join conversation room for real-time updates
        if (connected) {
          await directMessagesWebSocketService.joinConversation({
            conversationId: conversation.id,
          });
        }

        // Clear unread count for this conversation
        setUnreadCounts((prev) => ({ ...prev, [conversation.id]: 0 }));

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
    [setError, setActiveConversationId, setUnreadCounts, messages, loadMessageHistory, connected]
  );

  // Create new conversation
  const createConversation = useCallback(
    async (data: CreateConversationRequest): Promise<Conversation | null> => {
      try {
        setError(null);
        const response = await directMessagesService.createConversation(data);
        
        // Add to conversations list
        setConversations((prev) => [response.conversation, ...prev]);
        
        // Select the new conversation
        await selectConversation(response.conversation);
        
        return response.conversation;
      } catch (error: any) {
        console.error("Failed to create conversation:", error);
        setError(error.message || "Failed to create conversation");
        return null;
      }
    },
    [setError, setConversations, selectConversation]
  );

  // Start direct message with a user
  const startDirectMessage = useCallback(
    async (userId: string): Promise<Conversation | null> => {
      if (!currentUser || currentUser.userId === userId) return null;

      // Check if conversation already exists
      const existingConversation = conversations.find(
        conv => conv.type === 'DM' && 
        conv.members?.some(member => member.userId === userId) &&
        conv.members?.some(member => member.userId === currentUser.userId)
      );

      if (existingConversation) {
        await selectConversation(existingConversation);
        return existingConversation;
      }

      // Create new conversation
      return await createConversation({
        participantIds: [userId],
      });
    },
    [currentUser, conversations, selectConversation, createConversation]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!activeConversationId || !content.trim() || !currentUser) return false;

      try {
        setIsSending(true);
        setError(null);

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

        directMessagesWebSocketService.sendMessage(messageData);

        // Clear draft for this conversation
        setDraft((prev) => ({ ...prev, [activeConversationId]: "" }));

        setIsSending(false);
        return true;
      } catch (error: any) {
        console.error("Failed to send message:", error);
        setError(error.message || "Failed to send message");
        setIsSending(false);
        return false;
      }
    },
    [activeConversationId, currentUser, setIsSending, setError, setDraft, setMessages]
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
        const newMessage: DMMessage = {
          id: message.messageId,
          conversationId: message.conversationId,
          userId: message.userId,
          userEmail: '', // Will be filled from presence data
          userName: '', // Will be filled from presence data
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

      // Update unread count if not in active conversation
      if (message.conversationId !== activeConversationId && message.userId !== currentUser?.userId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.conversationId]: (prev[message.conversationId] || 0) + 1,
        }));
      }
    };

    const handleMessageConfirmed = (data: DMMessageConfirmedEvent) => {
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

      console.log("Message confirmed:", data);
    };

    // Typing handlers
    const handleUserTyping = (data: DMUserTypingEvent) => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        const conversationTypers = newTypingUsers[data.conversationId] || [];

        if (data.isTyping) {
          if (!conversationTypers.includes(data.userId)) {
            newTypingUsers[data.conversationId] = [...conversationTypers, data.userId];
          }
        } else {
          newTypingUsers[data.conversationId] = conversationTypers.filter((id) => id !== data.userId);
        }

        return newTypingUsers;
      });
    };

    // Presence handlers
    const handleUserOnline = (data: any) => {
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

    // Register event listeners
    directMessagesWebSocketService.onNewMessage(handleNewMessage);
    directMessagesWebSocketService.onMessageConfirmed(handleMessageConfirmed);
    directMessagesWebSocketService.onUserTyping(handleUserTyping);
    directMessagesWebSocketService.onUserOnline(handleUserOnline);
    directMessagesWebSocketService.onUserOffline(handleUserOffline);
    directMessagesWebSocketService.onConnect(handleConnect);
    directMessagesWebSocketService.onDisconnect(handleDisconnect);
    directMessagesWebSocketService.onError(handleError);

    // Cleanup
    return () => {
      directMessagesWebSocketService.removeAllListeners();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [
    connected,
    activeConversationId,
    currentUser?.userId,
    setMessages,
    setUnreadCounts,
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
    startTyping,
    stopTyping,
    updateDraft,
    loadUserSuggestions,
    setActiveConversationId,
    setError,
  };
};