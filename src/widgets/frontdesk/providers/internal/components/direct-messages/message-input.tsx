import React from 'react';
import { BaseMessageInput } from '@/widgets/frontdesk/components/shared/BaseMessageInput';
import { MessageInputProps } from '../../types/direct-messages.types';

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = 'Type a message...',
  disabled = false,
  isSending = false,
}) => {
  const handleSend = async (message: string) => {
    await onSend(message);
  };

  return (
    <BaseMessageInput
      value={value}
      onChange={onChange}
      onSend={handleSend}
      onTypingStart={onTypingStart}
      onTypingStop={onTypingStop}
      placeholder={placeholder}
      disabled={disabled}
      isSending={isSending}
      showAttachments={true}
      showEmojis={true}
    />
  );
};