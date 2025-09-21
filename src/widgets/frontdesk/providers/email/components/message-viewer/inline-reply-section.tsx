import React from "react";
import { Box, Stack, Typography, TextField, Button, IconButton, CircularProgress } from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface InlineReplySectionProps {
  isReplyAll: boolean;
  replyText: string;
  isSending: boolean;
  onReplyTextChange: (text: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

export const InlineReplySection: React.FC<InlineReplySectionProps> = ({
  isReplyAll,
  replyText,
  isSending,
  onReplyTextChange,
  onSend,
  onCancel,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderTop: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(25),
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" sx={{ color: neutralColor(700), fontWeight: 600 }}>
            {isReplyAll ? "Reply All" : "Reply"}
          </Typography>
          <IconButton size="small" onClick={onCancel} sx={{ color: neutralColor(600) }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder={`Type your ${isReplyAll ? "reply to all" : "reply"}...`}
          value={replyText}
          onChange={(e) => onReplyTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={isSending}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              "&:hover fieldset": {
                borderColor: primaryColor(300),
              },
              "&.Mui-focused fieldset": {
                borderColor: primaryColor(500),
              },
            },
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: neutralColor(500) }}>
            Press Cmd+Enter or Ctrl+Enter to send
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={onCancel}
              disabled={isSending}
              sx={{
                borderColor: neutralColor(300),
                color: neutralColor(700),
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onSend}
              disabled={!replyText.trim() || isSending}
              startIcon={isSending ? <CircularProgress size={16} /> : <SendIcon />}
              sx={{
                backgroundColor: primaryColor(600),
                "&:hover": {
                  backgroundColor: primaryColor(700),
                },
                "&:disabled": {
                  backgroundColor: neutralColor(300),
                },
              }}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
