import React from "react";
import { BaseMessageInput } from "@/widgets/frontdesk/components/shared/BaseMessageInput";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = "Type a message...",
  disabled = false,
  isSending = false,
}) => {
  return (
    <BaseMessageInput
      value={value}
      onChange={onChange}
      onSend={onSend}
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
