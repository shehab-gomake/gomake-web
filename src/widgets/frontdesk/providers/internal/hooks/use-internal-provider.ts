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

  const handleStartDirectMessage = useCallback(
    (userId: string) => {
      // Create a direct message channel ID
      const currentUserId = currentUser?.id;
      if (!currentUserId || currentUserId === userId) return;

      // Create a consistent channel ID for direct messages between two users
      const channelId = `dm-${[currentUserId, userId].sort().join("-")}`;

      // Select the channel (this will trigger joinChannel if needed)
      handleChannelSelect(channelId);
    },
    [currentUser?.id, handleChannelSelect]
  );

  const handleCreateChannel = useCallback(
    async (name: string, description?: string) => {
      try {
        // For now, just create a simple channel ID
        // In a real implementation, this would call the backend
        const channelId = `channel-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

        // Select the new channel
        handleChannelSelect(channelId);

        console.log(`Created channel: ${name} with ID: ${channelId}`);
      } catch (error) {
        console.error("Failed to create channel:", error);
        setError("Failed to create channel");
      }
    },
    [handleChannelSelect, setError]
  );

  const handleArchiveConversation = useCallback(
    async (channelId: string) => {
      try {
        // For now, just log the action
        // In a real implementation, this would call the backend
        console.log(`Archived conversation: ${channelId}`);
      } catch (error) {
        console.error("Failed to archive conversation:", error);
        setError("Failed to archive conversation");
      }
    },
    [setError]
  );

  const handleDeleteConversation = useCallback(
    async (channelId: string) => {
      try {
        // For now, just log the action
        // In a real implementation, this would call the backend
        console.log(`Deleted conversation: ${channelId}`);
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        setError("Failed to delete conversation");
      }
    },
    [setError]
  );

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
    handleCreateChannel,
    handleArchiveConversation,
    handleDeleteConversation,
    connect,
    setError,
  };
};
