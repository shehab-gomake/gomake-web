import React from 'react';
import { BaseMessageInput } from '@/widgets/frontdesk/components/shared/BaseMessageInput';
import { MessageInputProps } from '../../types/direct-messages.types';

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  isSending = false,
}) => {
  const handleSend = async (message: string) => {
    onSend(message);
  };

  return (
    <BaseMessageInput
      value={value}
      onChange={onChange}
      onSend={handleSend}
      placeholder={placeholder}
      disabled={disabled}
      isSending={isSending}
      showAttachments={true}
      showEmojis={true}
    />
  );
};