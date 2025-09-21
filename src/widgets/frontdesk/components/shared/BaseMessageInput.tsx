import React, { useState, useRef, useCallback } from "react";
import { Box, TextField, IconButton, Stack, Tooltip, CircularProgress } from "@mui/material";
import { Send as SendIcon, AttachFile as AttachIcon, EmojiEmotions as EmojiIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface BaseMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isSending?: boolean;
  showAttachments?: boolean;
  showEmojis?: boolean;
}

export const BaseMessageInput: React.FC<BaseMessageInputProps> = ({
  value,
  onChange,
  onSend,
  onTypingStart,
  onTypingStop,
  placeholder = "Type a message...",
  disabled = false,
  isSending = false,
  showAttachments = true,
  showEmojis = true,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTypingTimeRef = useRef<number>(0);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [onChange, onTypingStart, onTypingStop, disabled]
  );

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent) => {
      // Handle Enter key (send message)
      if (event.key === "Enter" && !event.shiftKey && !isComposing) {
        event.preventDefault();

        const message = value.trim();
        if (message && !disabled && !isSending) {
          try {
            await onSend(message);
            // Clear input after successful send
            onChange("");
            if (onTypingStop) {
              onTypingStop();
            }
          } catch (error) {
            console.error("Failed to send message:", error);
          }
        }
      }

      // Handle Escape key (clear input)
      if (event.key === "Escape") {
        onChange("");
        if (onTypingStop) {
          onTypingStop();
        }
        inputRef.current?.blur();
      }
    },
    [value, onSend, onChange, onTypingStop, disabled, isSending, isComposing]
  );

  const handleSendClick = useCallback(async () => {
    const message = value.trim();
    if (message && !disabled && !isSending) {
      try {
        await onSend(message);
        onChange("");
        if (onTypingStop) {
          onTypingStop();
        }
      } catch (error) {
        console.error("Failed to send message:", error);
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
        borderTop: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(25),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-end">
        {/* Attachment button */}
        {showAttachments && (
          <Tooltip title="Attach file">
            <IconButton
              size="small"
              disabled={disabled}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  color: primaryColor(600),
                  backgroundColor: primaryColor(50),
                },
              }}
            >
              <AttachIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

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
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              "& fieldset": {
                borderColor: neutralColor(300),
              },
              "&:hover fieldset": {
                borderColor: neutralColor(400),
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
                borderWidth: 2,
              },
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                lineHeight: 1.4,
                "&::placeholder": {
                  color: neutralColor(500),
                  opacity: 1,
                },
              },
            },
          }}
        />

        {/* Emoji button */}
        {showEmojis && (
          <Tooltip title="Add emoji">
            <IconButton
              size="small"
              disabled={disabled}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  color: primaryColor(600),
                  backgroundColor: primaryColor(50),
                },
              }}
            >
              <EmojiIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Send button */}
        <Tooltip title="Send message (Enter)">
          <span>
            <IconButton
              onClick={handleSendClick}
              disabled={!canSend}
              sx={{
                backgroundColor: canSend ? primaryColor(500) : neutralColor(300),
                color: canSend ? "white" : neutralColor(500),
                "&:hover": {
                  backgroundColor: canSend ? primaryColor(600) : neutralColor(300),
                },
                "&.Mui-disabled": {
                  backgroundColor: neutralColor(300),
                  color: neutralColor(500),
                },
                width: 36,
                height: 36,
              }}
            >
              {isSending ? <CircularProgress size={16} color="inherit" /> : <SendIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Keyboard shortcuts hint */}
      <Box sx={{ mt: 1, textAlign: "center" }}>
        <Box
          component="span"
          sx={{
            fontSize: "0.6875rem",
            color: neutralColor(500),
            fontStyle: "italic",
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </Box>
      </Box>
    </Box>
  );
};
