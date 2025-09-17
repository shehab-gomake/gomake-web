import { useEffect, useCallback, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { messagingService } from '@/services/websocket/messaging-service';
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
  messagingIsSendingState
} from '@/store/messaging';
import {
  Message,
  Channel,
  User,
  PresenceData,
  TypingIndicator,
  SendMessageData
} from '@/widgets/frontdesk/providers/internal/types';
import { useUserProfile } from '@/hooks/use-user-profile';

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

  const { profileState: userProfile } = useUserProfile();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize connection
  const connect = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      setIsLoading(true);
      setError(null);

      const authToken = userProfile?.token;
      await messagingService.connect(authToken);

      setConnectionStatus('connected');
      setConnected(true);

      // Auto-join general channel
      if (activeChannelId) {
        await messagingService.joinChannel({ channelId: activeChannelId });
      }

      // Get initial presence data
      const presenceResponse = await messagingService.getPresence();
      if (presenceResponse.success && presenceResponse.presence) {
        setUserPresence(presenceResponse.presence);
      }
      if (presenceResponse.onlineUsers) {
        setOnlineUsers(presenceResponse.onlineUsers);
      }

    } catch (error: any) {
      console.error('Failed to connect to messaging service:', error);
      setConnectionStatus('error');
      setError(error.message || 'Failed to connect to messaging service');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.token, activeChannelId, setConnectionStatus, setConnected, setError, setIsLoading, setUserPresence, setOnlineUsers]);

  // Disconnect
  const disconnect = useCallback(() => {
    messagingService.disconnect();
    setConnectionStatus('disconnected');
    setConnected(false);
  }, [setConnectionStatus, setConnected]);

  // Send message
  const sendMessage = useCallback(async (content: string, recipientId?: string): Promise<boolean> => {
    if (!activeChannelId || !content.trim()) return false;

    try {
      setIsSending(true);
      setError(null);

      const messageData: SendMessageData = {
        channelId: activeChannelId,
        content: content.trim(),
        recipientId,
        messageId: Date.now().toString(),
        metadata: { type: 'text' }
      };

      const response = await messagingService.sendMessage(messageData);

      if (response.success) {
        // Clear draft for this channel
        setDraft(prev => ({ ...prev, [activeChannelId]: '' }));
        return true;
      } else {
        setError(response.error || 'Failed to send message');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      setError(error.message || 'Failed to send message');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [activeChannelId, setIsSending, setError, setDraft]);

  // Join channel
  const joinChannel = useCallback(async (channelId: string) => {
    try {
      setError(null);
      await messagingService.joinChannel({ channelId });
      setActiveChannelId(channelId);

      // Clear unread count for this channel
      setUnreadCounts(prev => ({ ...prev, [channelId]: 0 }));
    } catch (error: any) {
      console.error('Failed to join channel:', error);
      setError(error.message || 'Failed to join channel');
    }
  }, [setError, setActiveChannelId, setUnreadCounts]);

  // Leave channel
  const leaveChannel = useCallback(async (channelId: string) => {
    try {
      setError(null);
      await messagingService.leaveChannel({ channelId });
    } catch (error: any) {
      console.error('Failed to leave channel:', error);
      setError(error.message || 'Failed to leave channel');
    }
  }, [setError]);

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!activeChannelId || isTyping) return;

    setIsTyping(true);
    messagingService.startTyping({ channelId: activeChannelId });

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
    messagingService.stopTyping({ channelId: activeChannelId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [activeChannelId, isTyping, setIsTyping]);

  // Update draft and handle typing
  const updateDraft = useCallback((channelId: string, content: string) => {
    setDraft(prev => ({ ...prev, [channelId]: content }));

    if (content.trim() && channelId === activeChannelId) {
      startTyping();
    } else if (!content.trim()) {
      stopTyping();
    }
  }, [activeChannelId, setDraft, startTyping, stopTyping]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messagingService.markAsRead({ messageId });
    } catch (error: any) {
      console.error('Failed to mark message as read:', error);
    }
  }, []);

  // Update user status
  const updateStatus = useCallback(async (status: 'online' | 'away' | 'busy' | 'offline') => {
    try {
      setError(null);
      await messagingService.updateStatus({ status });
    } catch (error: any) {
      console.error('Failed to update status:', error);
      setError(error.message || 'Failed to update status');
    }
  }, [setError]);

  // Event handlers
  useEffect(() => {
    if (!connected) return;

    // Message handlers
    const handleNewMessage = (message: Message) => {
      setMessages(prev => ({
        ...prev,
        [message.channelId]: [...(prev[message.channelId] || []), message]
      }));

      // Update unread count if not in active channel
      if (message.channelId !== activeChannelId && message.userId !== currentUser?.id) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.channelId]: (prev[message.channelId] || 0) + 1
        }));
      }
    };

    const handleDirectMessage = (message: Message) => {
      // Handle direct messages similar to channel messages
      handleNewMessage(message);
    };

    // Presence handlers
    const handleUserOnline = (data: any) => {
      setOnlineUsers(data.onlineUsers || []);
      if (data.userId) {
        setUserPresence(prev => ({
          ...prev,
          [data.userId]: {
            userId: data.userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: 'online',
            timestamp: data.timestamp
          }
        }));
      }
    };

    const handleUserOffline = (data: any) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
      if (data.userId) {
        setUserPresence(prev => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            status: 'offline',
            lastSeen: data.lastSeen,
            timestamp: data.timestamp
          }
        }));
      }
    };

    // Typing handlers
    const handleUserTyping = (data: TypingIndicator) => {
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        const channelTypers = newTypingUsers[data.channelId] || [];

        if (data.isTyping) {
          if (!channelTypers.includes(data.userId)) {
            newTypingUsers[data.channelId] = [...channelTypers, data.userId];
          }
        } else {
          newTypingUsers[data.channelId] = channelTypers.filter(id => id !== data.userId);
        }

        return newTypingUsers;
      });
    };

    // Status change handler
    const handleStatusChanged = (data: any) => {
      if (data.userId) {
        setUserPresence(prev => ({
          ...prev,
          [data.userId]: {
            ...prev[data.userId],
            status: data.status,
            timestamp: data.timestamp
          }
        }));
      }
    };

    // Connection handlers
    const handleConnect = () => {
      setConnectionStatus('connected');
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      setConnected(false);
    };

    const handleError = (error: string) => {
      setConnectionStatus('error');
      setError(error);
    };

    // Register event listeners
    messagingService.onNewMessage(handleNewMessage);
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
  }, [connected, activeChannelId, currentUser?.id, setMessages, setUnreadCounts, setOnlineUsers, setUserPresence, setTypingUsers, setConnectionStatus, setConnected, setError]);

  // Auto-connect on mount
  useEffect(() => {
    console.log('Messaging Hook - User Profile:', userProfile);
    console.log('Messaging Hook - Connection Status:', connectionStatus);
    console.log('Messaging Hook - Connected:', connected);

    const userId = userProfile?.id || userProfile?.userId;
    if (userProfile && userId && !connected && connectionStatus === 'disconnected') {
      console.log('Messaging Hook - Attempting to connect...');
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
        id: userId,
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userProfile.email || 'User',
        status: 'online'
      });
    }
  }, [userProfile, currentUser, setCurrentUser]);

  return {
    // Connection state
    connected,
    connectionStatus,
    isLoading,
    error: useRecoilValue(messagingErrorState),

    // Data
    currentUser,
    channels,
    activeChannelId,
    messages: messages[activeChannelId || ''] || [],
    allMessages: messages,
    unreadCounts,
    onlineUsers,
    userPresence,
    typingUsers: typingUsers[activeChannelId || ''] || [],
    allTypingUsers: typingUsers,
    isTyping,
    draft: draft[activeChannelId || ''] || '',
    allDrafts: draft,
    isSending,

    // Actions
    connect,
    disconnect,
    sendMessage,
    joinChannel,
    leaveChannel,
    startTyping,
    stopTyping,
    updateDraft,
    markAsRead,
    updateStatus,
    setActiveChannelId,
    setError
  };
};