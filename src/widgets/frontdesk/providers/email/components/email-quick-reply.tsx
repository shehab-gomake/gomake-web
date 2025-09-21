import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Stack,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface EmailQuickReplyProps {
  onSend: (text: string) => Promise<boolean>;
  onClose?: () => void;
  placeholder?: string;
  isSending?: boolean;
}

export const EmailQuickReply: React.FC<EmailQuickReplyProps> = ({
  onSend,
  onClose,
  placeholder = "Type your reply...",
  isSending = false
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [replyText, setReplyText] = useState('');

  const handleSend = async () => {
    const text = replyText.trim();
    if (!text || isSending) return;

    const success = await onSend(text);
    if (success) {
      setReplyText('');
      onClose?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper sx={{ p: 2, borderTop: `1px solid ${neutralColor(200)}` }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ color: neutralColor(700) }}>
            Quick Reply
          </Typography>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Stack>

        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder={placeholder}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="small"
          disabled={isSending}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: primaryColor(300),
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor(500),
              },
            },
          }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onClose && (
            <Button size="small" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!replyText.trim() || isSending}
            sx={{
              backgroundColor: primaryColor(500),
              '&:hover': {
                backgroundColor: primaryColor(600),
              },
            }}
          >
            {isSending ? 'Sending...' : 'Send'}
          </Button>
        </Stack>

        <Typography variant="caption" sx={{ color: neutralColor(500) }}>
          Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send
        </Typography>
      </Stack>
    </Paper>
  );
};