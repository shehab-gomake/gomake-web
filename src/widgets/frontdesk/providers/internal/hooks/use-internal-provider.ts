import { useCallback } from "react";
import { useMessaging } from "@/hooks/use-messaging";
import { Message, Channel, User, PresenceData } from "../types/internal.types";

export const useInternalProvider = () => {
  const {
    connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    error,
    currentUser,
    activeChannelId,
    messages,
    onlineUsers,
    userPresence,
    typingUsers,
    draft,
    isSending,
    connect,
    sendMessage,
    joinChannel,
    updateDraft,
    setError,
  } = useMessaging();

  // Convert messaging data to internal provider format
  const channels: Channel[] = [];
  const conversations = messages.map((message, index) => ({
    id: message.messageId || `temp-${index}`,
    subject: `Message in #${message.channelId}`,
    from: message.userName || message.userEmail || "Unknown User",
    snippet: message.content.substring(0, 100),
    receivedAt: message.timestamp,
    isRead: true,
    unreadCount: 0,
    hasAttachments: false,
    isStarred: false,
    labels: [],
  }));

  const handleChannelSelect = useCallback(
    (channelId: string) => {
      joinChannel(channelId);
    },
    [joinChannel]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      if (activeChannelId) {
        updateDraft(activeChannelId, value);
      }
    },
    [activeChannelId, updateDraft]
  );

  const handleRetryConnection = useCallback(() => {
    setError(null);
    connect();
  }, [connect, setError]);

  const handleStartDirectMessage = useCallback((userId: string) => {
    // TODO: Create or find direct message channel with user
    console.log("Start DM with user:", userId);
  }, []);

  return {
    // Connection state
    isConnected: connected,
    connectionStatus,
    isLoading,
    isLoadingHistory,
    error,
    currentUser,

    // Channels and conversations
    channels,
    conversations,
    activeChannelId,
    messages,

    // Users and presence
    onlineUsers,
    userPresence,
    typingUsers,

    // Input state
    draft,
    isSending,

    // Actions
    handleChannelSelect,
    handleSendMessage,
    handleInputChange,
    handleRetryConnection,
    handleStartDirectMessage,
    connect,
    setError,
  };
};
