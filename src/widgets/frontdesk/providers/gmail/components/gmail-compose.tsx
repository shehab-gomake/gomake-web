import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
  Avatar,
  Button
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  InsertEmoticon as EmojiIcon
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface GmailComposeProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
  meInitial?: string;
}

export const GmailCompose: React.FC<GmailComposeProps> = ({
  value,
  onChange,
  onSend,
  placeholder = "Type your reply...",
  disabled = false,
  isSending = false,
  meInitial = "Y"
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  }, [onChange]);

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
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    }

    // Handle Escape key (clear input)
    if (event.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  }, [value, onSend, onChange, disabled, isSending, isComposing]);

  const handleSendClick = useCallback(async () => {
    const message = value.trim();
    if (message && !disabled && !isSending) {
      try {
        await onSend(message);
        onChange('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }, [value, onSend, onChange, disabled, isSending]);

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
        borderTop: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(25)
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-end">
        {/* User Avatar */}
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: primaryColor(600),
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {meInitial}
        </Avatar>

        {/* Main compose area */}
        <Stack sx={{ flex: 1 }} spacing={1}>
          {/* Formatting toolbar */}
          <Stack direction="row" spacing={0.5} sx={{ display: 'none' }}> {/* Hidden for now */}
            <Tooltip title="Bold">
              <IconButton size="small" disabled={disabled}>
                <BoldIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton size="small" disabled={disabled}>
                <ItalicIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Attach file">
              <IconButton size="small" disabled={disabled}>
                <AttachIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add emoji">
              <IconButton size="small" disabled={disabled}>
                <EmojiIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Message input */}
          <Stack direction="row" spacing={1} alignItems="flex-end">
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
                    borderColor: neutralColor(300),
                  },
                  '&:hover fieldset': {
                    borderColor: neutralColor(400),
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: primaryColor(500),
                    borderWidth: 2,
                  },
                  '& .MuiInputBase-input': {
                    padding: '10px 12px',
                    lineHeight: 1.4,
                    '&::placeholder': {
                      color: neutralColor(500),
                      opacity: 1,
                    },
                  },
                },
              }}
            />

            {/* Send button */}
            <Button
              variant="contained"
              size="small"
              endIcon={
                isSending ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )
              }
              onClick={handleSendClick}
              disabled={!canSend}
              sx={{
                backgroundColor: canSend ? primaryColor(600) : neutralColor(300),
                color: 'white',
                '&:hover': {
                  backgroundColor: canSend ? primaryColor(700) : neutralColor(300),
                },
                '&.Mui-disabled': {
                  backgroundColor: neutralColor(300),
                  color: neutralColor(500),
                },
                minWidth: 80,
                height: 36,
              }}
            >
              Send
            </Button>
          </Stack>

          {/* Keyboard shortcuts hint */}
          <Box sx={{ textAlign: 'left' }}>
            <Box
              component="span"
              sx={{
                fontSize: '0.6875rem',
                color: neutralColor(500),
                fontStyle: 'italic'
              }}
            >
              Press Enter to send, Shift+Enter for new line
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};