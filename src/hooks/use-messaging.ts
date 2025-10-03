import { useEffect, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { messagingService } from "@/services/websocket/messaging-service";
import {
  messagingConnectionState,
  messagingConnectedState,
  messagingCurrentUserState,
  messagingChannelsState,
  messagingActiveChannelIdState,
  messagingMessagesState,
  messagingUnreadCountsState,
  messagingOnlineUsersState,
  messagingUserPresenceState,
  messagingTypingUsersState,
  messagingIsTypingState,
  messagingDraftState,
  messagingErrorState,
  messagingIsLoadingState,
  messagingIsSendingState,
  messagingIsLoadingHistoryState,
} from "@/store/messaging";
import {
  DMMessage as Message,
  Conversation as Channel,
  ConversationMember as User,
  DMPresenceData as PresenceData,
} from "@/widgets/frontdesk/providers/internal/types";

// Define missing types that were removed
interface TypingIndicator {
  userId: string;
  userEmail: string;
  userName: string;
  conversationId: string;
  isTyping: boolean;
}

interface SendMessageData {
  conversationId: string;
  content: string;
  recipientId?: string;
  tempId?: string;
  messageId?: string;
  metadata?: {
    type: 'text' | 'file' | 'image';
  };
}

interface MessageConfirmedData {
  tempId: string;
  messageId: string;
  conversationId: string;
  timestamp?: string;
}
import { useUserProfile } from "@/hooks/use-user-profile";

export const useMessaging = () => {
  const [connectionStatus, setConnectionStatus] = useRecoilState(messagingConnectionState);
  const [connected, setConnected] = useRecoilState(messagingConnectedState);
  const [currentUser, setCurrentUser] = useRecoilState(messagingCurrentUserState);
  const [channels, setChannels] = useRecoilState(messagingChannelsState);
  const [activeChannelId, setActiveChannelId] = useRecoilState(messagingActiveChannelIdState);
  const [messages, setMessages] = useRecoilState(messagingMessagesState);
  const [unreadCounts, setUnreadCounts] = useRecoilState(messagingUnreadCountsState);
  const [onlineUsers, setOnlineUsers] = useRecoilState(messagingOnlineUsersState);
  const [userPresence, setUserPresence] = useRecoilState(messagingUserPresenceState);
  const [typingUsers, setTypingUsers] = useRecoilState(messagingTypingUsersState);
  const [isTyping, setIsTyping] = useRecoilState(messagingIsTypingState);
  const [draft, setDraft] = useRecoilState(messagingDraftState);
  const setError = useSetRecoilState(messagingErrorState);
  const [isLoading, setIsLoading] = useRecoilState(messagingIsLoadingState);
  const [isSending, setIsSending] = useRecoilState(messagingIsSendingState);
  const [isLoadingHistory, setIsLoadingHistory] = useRecoilState(messagingIsLoadingHistoryState);

  const { profileState: userProfile } = useUserProfile();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize connection
  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting");
      setIsLoading(true);
      setError(null);

      // Token is handled internally by messagingService.connect()
      await messagingService.connect();

      setConnectionStatus("connected");
      setConnected(true);

      // Auto-join general channel
      if (activeChannelId) {
        await messagingService.joinChannel({ conversationId: activeChannelId });
      }

      // Get initial presence data
      const presenceResponse = await messagingService.getPresence();
      if (presenceResponse.success && presenceResponse.presence) {
        // Convert array of presence objects to object with userId as keys
        const presenceArray = Array.isArray(presenceResponse.presence) ? presenceResponse.presence : [];
        const presenceMap = presenceArray.reduce((acc: Record<string, any>, presence: any) => {
          acc[presence.userId] = presence;
          return acc;
        }, {});
        setUserPresence(presenceMap);
      }
      if (presenceResponse.onlineUsers) {
        setOnlineUsers(presenceResponse.onlineUsers);
      }
    } catch (error: any) {
      console.error("Failed to connect to messaging service:", error);
      setConnectionStatus("error");
      setError(error.message || "Failed to connect to messaging service");
    } finally {
      setIsLoading(false);
    }
  }, [activeChannelId, setConnectionStatus, setConnected, setError, setIsLoading, setUserPresence, setOnlineUsers]);

  // Disconnect
  const disconnect = useCallback(() => {
    messagingService.disconnect();
    setConnectionStatus("disconnected");
    setConnected(false);
  }, [setConnectionStatus, setConnected]);

  // Send message - Simplified one-step sending with optimistic UI
  const sendMessage = useCallback(
    async (content: string, recipientId?: string): Promise<boolean> => {
      if (!activeChannelId || !content.trim() || !currentUser) return false;

      try {
        setIsSending(true);
        setError(null);

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create optimistic message for immediate UI update
        const optimisticMessage: Message = {
          id: tempId,
          conversationId: activeChannelId,
          content: content.trim(),
          userId: currentUser.userId,
          userEmail: currentUser.email,
          userName: currentUser.name,
          createdAt: new Date().toISOString(),
          tempId,
          metadata: { type: "text" },
        };

        // Add optimistic message to UI immediately
        setMessages((prev) => ({
          ...prev,
          [activeChannelId]: [...(prev[activeChannelId] || []), optimisticMessage],
        }));

        // Prepare message data for WebSocket
        const messageData: SendMessageData = {
          conversationId: activeChannelId,
          content: content.trim(),
          recipientId,
          tempId,
          metadata: { type: "text" },
        };

        // Send message through WebSocket (one-step, no waiting)
        messagingService.sendMessage(messageData);

        // Clear draft for this channel
        setDraft((prev) => ({ ...prev, [activeChannelId]: "" }));

        setIsSending(false);
        return true;
      } catch (error: any) {
        console.error("Failed to send message:", error);
        setError(error.message || "Failed to send message");
        setIsSending(false);
        return false;
      }
    },
    [activeChannelId, currentUser, setIsSending, setError, setDraft, setMessages]
  );

  // Load message history for a channel
  const loadMessageHistory = useCallback(
    async (channelId: string) => {
      try {
        setIsLoadingHistory(true);
        setError(null);

        const historyResponse = await messagingService.fetchChannelMessages(channelId, { limit: 50, offset: 0 });

        if (historyResponse.messages) {
          setMessages((prev) => ({
            ...prev,
            [channelId]: historyResponse.messages,
          }));
        }

        console.log(`Loaded ${historyResponse.messages.length} historical messages for channel ${channelId}`);
      } catch (error: any) {
        console.error("Failed to load message history:", error);
        setError(error.message || "Failed to load message history");
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [setIsLoadingHistory, setError, setMessages]
  );

  // Join channel
  const joinChannel = useCallback(
    async (channelId: string) => {
      try {
        setError(null);
        await messagingService.joinChannel({ conversationId: channelId });
        setActiveChannelId(channelId);

        // Clear unread count for this channel
        setUnreadCounts((prev) => ({ ...prev, [channelId]: 0 }));

        // Load message history for this channel if we don't have messages yet
        const currentMessages = messages[channelId] || [];
        if (currentMessages.length === 0) {
          await loadMessageHistory(channelId);
        }
      } catch (error: any) {
        console.error("Failed to join channel:", error);
        setError(error.message || "Failed to join channel");
      }
    },
    [setError, setActiveChannelId, setUnreadCounts, messages, loadMessageHistory]
  );

  // Leave channel
  const leaveChannel = useCallback(
    async (channelId: string) => {
      try {
        setError(null);
        await messagingService.leaveChannel({ conversationId: channelId });
      } catch (error: any) {
        console.error("Failed to leave channel:", error);
        setError(error.message || "Failed to leave channel");
      }
    },
    [setError]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!activeChannelId || isTyping) return;

    setIsTyping(true);
    messagingService.startTyping({ conversationId: activeChannelId });

    // Stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [activeChannelId, isTyping, setIsTyping]);

  const stopTyping = useCallback(() => {
    if (!activeChannelId || !isTyping) return;

    setIsTyping(false);
    messagingService.stopTyping({ conversationId: activeChannelId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [activeChannelId, isTyping, setIsTyping]);

  // Update draft and handle typing
  const updateDraft = useCallback(
    (channelId: string, content: string) => {
      setDraft((prev) => ({ ...prev, [channelId]: content }));

      if (content.trim() && channelId === activeChannelId) {
        startTyping();
      } else if (!content.trim()) {
        stopTyping();
      }
    },
    [activeChannelId, setDraft, startTyping, stopTyping]
  );

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messagingService.markAsRead({ messageId });
    } catch (error: any) {
      console.error("Failed to mark message as read:", error);
    }
  }, []);

  // Update user status
  const updateStatus = useCallback(
    async (status: "online" | "away" | "busy" | "offline") => {
      try {
        setError(null);
        await messagingService.updateStatus({ status });
      } catch (error: any) {
        console.error("Failed to update status:", error);
        setError(error.message || "Failed to update status");
      }
    },
    [setError]
  );

  // Event handlers
  useEffect(() => {
    if (!connected) return;

    // Message handlers
    const handleNewMessage = (message: Message) => {
      // Don't add if it's a duplicate of an optimistic message we already have
      setMessages((prev) => {
        const channelMessages = prev[message.conversationId] || [];
        // Check if this is our own message that was already added optimistically
        const existingOptimisticMessage = channelMessages.find(
          (msg) => msg.tempId && msg.content === message.content && msg.userId === message.userId
        );

        if (existingOptimisticMessage) {
          // Replace the optimistic message with the confirmed one
          return {
            ...prev,
            [message.conversationId]: channelMessages.map((msg) =>
              msg.tempId === existingOptimisticMessage.tempId ? { ...message, tempId: undefined } : msg
            ),
          };
        }

        // Otherwise, add the new message
        return {
          ...prev,
          [message.conversationId]: [...channelMessages, message],
        };
      });

      // Update unread count if not in active channel
      if (message.conversationId !== activeChannelId && message.userId !== currentUser?.userId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.conversationId]: (prev[message.conversationId] || 0) + 1,
        }));
      }
    };

    const handleMessageConfirmed = (data: MessageConfirmedData) => {
      // Replace temp message with confirmed message
      setMessages((prev) => {
        const channelMessages = prev[data.conversationId] || [];
        return {
          ...prev,
          [data.conversationId]: channelMessages.map((msg) =>
            msg.tempId === data.tempId
              ? { ...msg, id: data.messageId, tempId: undefined, createdAt: data.timestamp || msg.createdAt }
              : msg
          ),
        };
      });

      console.log("Message confirmed:", data);
    };

    const handleDirectMessage = (message: Message) => {
      // Handle direct messages similar to channel messages
      handleNewMessage(message);
    };

    // Presence handlers
    const handleUserOnline = (data: any) => {
      console.log("Received userOnline event:", data);
      setOnlineUsers(data.onlineUsers || []);
      if (data.userId) {
        setUserPresence((prev) => ({
          ...prev,
          [data.userId]: {
            userId: data.userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: "online",
            timestamp: data.timestamp,
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
            timestamp: data.timestamp,
          },
        }));
      }
    };

    // Typing handlers
    const handleUserTyping = (data: TypingIndicator) => {
      setTypingUsers((prev) => {
        const newTypingUsers = { ...prev };
        const channelTypers = newTypingUsers[data.conversationId] || [];

        if (data.isTyping) {
          if (!channelTypers.includes(data.userId)) {
            newTypingUsers[data.conversationId] = [...channelTypers, data.userId];
          }
        } else {
          newTypingUsers[data.conversationId] = channelTypers.filter((id) => id !== data.userId);
        }

        return newTypingUsers;
      });
    };

    // Status change handler
    const handleStatusChanged = (data: any) => {
      if (data.userId) {
        setUserPresence((prev) => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            status: data.status,
            timestamp: data.timestamp,
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
    messagingService.onNewMessage(handleNewMessage);
    messagingService.onMessageConfirmed(handleMessageConfirmed);
    messagingService.onDirectMessage(handleDirectMessage);
    messagingService.onUserOnline(handleUserOnline);
    messagingService.onUserOffline(handleUserOffline);
    messagingService.onUserTyping(handleUserTyping);
    messagingService.onStatusChanged(handleStatusChanged);
    messagingService.onConnect(handleConnect);
    messagingService.onDisconnect(handleDisconnect);
    messagingService.onError(handleError);

    // Cleanup
    return () => {
      messagingService.removeAllListeners();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [
    connected,
    activeChannelId,
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
    console.log("Messaging Hook - User Profile:", userProfile);
    console.log("Messaging Hook - Connection Status:", connectionStatus);
    console.log("Messaging Hook - Connected:", connected);

    const userId = userProfile?.id || userProfile?.userId;
    if (userProfile && userId && !connected && connectionStatus === "disconnected") {
      console.log("Messaging Hook - Attempting to connect...");
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
        role: 'member' as const,
      });
    }
  }, [userProfile, currentUser, setCurrentUser]);

  return {
    // Connection state
    connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    error: useRecoilValue(messagingErrorState),

    // Data
    currentUser,
    channels,
    activeChannelId,
    messages: messages[activeChannelId || ""] || [],
    allMessages: messages,
    unreadCounts,
    onlineUsers,
    userPresence,
    typingUsers: typingUsers[activeChannelId || ""] || [],
    allTypingUsers: typingUsers,
    isTyping,
    draft: draft[activeChannelId || ""] || "",
    allDrafts: draft,
    isSending,

    // Actions
    connect,
    disconnect,
    sendMessage,
    joinChannel,
    leaveChannel,
    loadMessageHistory,
    startTyping,
    stopTyping,
    updateDraft,
    markAsRead,
    updateStatus,
    setActiveChannelId,
    setError,
  };
};
