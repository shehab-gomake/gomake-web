import React from "react";
import { BaseMessageList, BaseMessage } from "@/widgets/frontdesk/components/shared/BaseMessageList";
import { Message } from "../types/internal.types";

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers: string[];
  userPresence: Record<string, any>;
  isLoadingHistory?: boolean;
  lastReadMessageId?: string;
  onScrollToUnread?: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  userPresence,
  isLoadingHistory = false,
  lastReadMessageId,
  onScrollToUnread,
}) => {
  // Convert internal messages to base message format
  const baseMessages: BaseMessage[] = messages.map((message) => ({
    id: message.messageId || message.tempId || message.timestamp,
    content: message.content,
    timestamp: message.timestamp,
    userId: message.userId,
    userName: message.userName,
    userEmail: message.userEmail,
    isOwn: message.userId === currentUserId,
  }));

  return (
    <BaseMessageList
      messages={baseMessages}
      currentUserId={currentUserId}
      typingUsers={typingUsers}
      userPresence={userPresence}
      isLoadingHistory={isLoadingHistory}
      emptyMessage="No messages yet"
      themLabel="Team Member"
      lastReadMessageId={lastReadMessageId}
      onScrollToUnread={onScrollToUnread}
    />
  );
};
