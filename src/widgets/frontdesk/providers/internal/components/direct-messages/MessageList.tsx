import React from 'react';
import { BaseMessageList, BaseMessage } from '@/widgets/frontdesk/components/shared/BaseMessageList';
import { DMMessage, DMPresenceData } from '../../types/direct-messages.types';
import { MessageListProps } from '../../types/direct-messages.types';

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  userPresence,
  isLoadingHistory = false,
  onLoadMore,
  lastReadMessageId,
  onScrollToUnread,
}) => {
  // Convert DMMessage to BaseMessage format
  const baseMessages: BaseMessage[] = messages.map((message) => ({
    id: message.id || message.tempId || message.createdAt,
    content: message.content,
    timestamp: message.createdAt,
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
