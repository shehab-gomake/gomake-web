import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

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
  isSending = false
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTypingTimeRef = useRef<number>(0);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);

    // Handle typing indicators
    if (newValue.trim() && !disabled) {
      const now = Date.now();
      lastTypingTimeRef.current = now;

      // Start typing indicator
      if (onTypingStart) {
        onTypingStart();
      }

      // Stop typing after 3 seconds of no input
      setTimeout(() => {
        if (lastTypingTimeRef.current === now && onTypingStop) {
          onTypingStop();
        }
      }, 3000);
    } else if (!newValue.trim() && onTypingStop) {
      onTypingStop();
    }
  }, [onChange, onTypingStart, onTypingStop, disabled]);

  const handleKeyDown = useCallback(async (event: React.KeyboardEvent) => {
    // Handle Enter key (send message)
    if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
      event.preventDefault();

      const message = value.trim();
      if (message && !disabled && !isSending) {
        try {
          await onSend(message);
          // Clear input after successful send
          onChange('');
          if (onTypingStop) {
            onTypingStop();
          }
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    }

    // Handle Escape key (clear input)
    if (event.key === 'Escape') {
      onChange('');
      if (onTypingStop) {
        onTypingStop();
      }
      inputRef.current?.blur();
    }
  }, [value, onSend, onChange, onTypingStop, disabled, isSending, isComposing]);

  const handleSendClick = useCallback(async () => {
    const message = value.trim();
    if (message && !disabled && !isSending) {
      try {
        await onSend(message);
        onChange('');
        if (onTypingStop) {
          onTypingStop();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }, [value, onSend, onChange, onTypingStop, disabled, isSending]);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const canSend = value.trim().length > 0 && !disabled && !isSending;

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid #EAECF0',
        backgroundColor: '#FAFBFC'
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-end">
        {/* Attachment button */}
        <Tooltip title="Attach file">
          <IconButton
            size="small"
            disabled={disabled}
            sx={{
              color: '#6B7280',
              '&:hover': {
                color: '#374151',
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            <AttachIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Message input */}
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: '#D1D5DB',
              },
              '&:hover fieldset': {
                borderColor: '#9CA3AF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3B82F6',
                borderWidth: 2,
              },
              '& .MuiInputBase-input': {
                padding: '10px 12px',
                lineHeight: 1.4,
                '&::placeholder': {
                  color: '#9CA3AF',
                  opacity: 1,
                },
              },
            },
          }}
        />

        {/* Emoji button */}
        <Tooltip title="Add emoji">
          <IconButton
            size="small"
            disabled={disabled}
            sx={{
              color: '#6B7280',
              '&:hover': {
                color: '#374151',
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            <EmojiIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Send button */}
        <Tooltip title="Send message (Enter)">
          <span>
            <IconButton
              onClick={handleSendClick}
              disabled={!canSend}
              sx={{
                backgroundColor: canSend ? '#3B82F6' : '#E5E7EB',
                color: canSend ? 'white' : '#9CA3AF',
                '&:hover': {
                  backgroundColor: canSend ? '#2563EB' : '#E5E7EB',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
                width: 36,
                height: 36,
              }}
            >
              {isSending ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon fontSize="small" />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Keyboard shortcuts hint */}
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Box
          component="span"
          sx={{
            fontSize: '0.6875rem',
            color: '#9CA3AF',
            fontStyle: 'italic'
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </Box>
      </Box>
    </Box>
  );
};