import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { MessageInputProps } from '../../types/direct-messages.types';

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  isSending = false,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !disabled && !isSending) {
      onSend(value.trim());
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // Auto-focus on mount
  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-end">
        {/* Attachment button */}
        <Tooltip title="Attach file">
          <IconButton
            size="small"
            disabled={disabled}
            sx={{ alignSelf: 'flex-end' }}
          >
            <AttachFileIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Image button */}
        <Tooltip title="Send image">
          <IconButton
            size="small"
            disabled={disabled}
            sx={{ alignSelf: 'flex-end' }}
          >
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Message input */}
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          maxRows={4}
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'grey.50',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
              '&.Mui-focused': {
                backgroundColor: 'background.paper',
              },
            },
          }}
        />

        {/* Emoji button */}
        <Tooltip title="Add emoji">
          <IconButton
            size="small"
            disabled={disabled}
            sx={{ alignSelf: 'flex-end' }}
          >
            <EmojiIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Send button */}
        <Tooltip title="Send message">
          <IconButton
            onClick={handleSend}
            disabled={disabled || !value.trim() || isSending}
            sx={{
              alignSelf: 'flex-end',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            {isSending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Character count or typing indicator */}
      {value.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {value.length} characters
          </Typography>
          
          {isComposing && (
            <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
              Typing...
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};