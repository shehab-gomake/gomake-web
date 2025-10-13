import React from "react";
import { Box, Stack, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { BaseMessageInput } from "@/widgets/frontdesk/components/shared/BaseMessageInput";

interface InlineReplySectionProps {
  title?: string;
  replyText: string;
  isSending: boolean;
  onReplyTextChange: (text: string) => void;
  onSend: () => void;
  onCancel: () => void;
  showReplyAll?: boolean;
  isReplyAll?: boolean;
}

/**
 * Shared inline reply component used across FrontDesk providers.
 *
 * Features:
 * - Clean, minimal UI
 * - BaseMessageInput with attachments and emojis
 * - Keyboard shortcuts (Cmd+Enter to send)
 * - Loading states
 * - Optional Reply All mode (for email)
 *
 * Used by:
 * - Email provider (with Reply/Reply All)
 * - Tickets provider (simple reply)
 * - Future providers (DMs, WhatsApp, etc.)
 */
export const InlineReplySection: React.FC<InlineReplySectionProps> = ({
  title,
  replyText,
  isSending,
  onReplyTextChange,
  onSend,
  onCancel,
  showReplyAll = false,
  isReplyAll = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Default title based on reply mode
  const displayTitle = title || (showReplyAll ? (isReplyAll ? "Reply All" : "Reply") : "Reply");

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
            {displayTitle}
          </Typography>
          <IconButton size="small" onClick={onCancel} sx={{ color: neutralColor(600) }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <BaseMessageInput
          value={replyText}
          onChange={onReplyTextChange}
          onSend={async (message) => {
            onReplyTextChange(message);
            onSend();
          }}
          placeholder={`Type your ${displayTitle.toLowerCase()}...`}
          disabled={isSending}
          isSending={isSending}
          showAttachments={true}
          showEmojis={false}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: neutralColor(500) }}>
            Press Enter to send
          </Typography>
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
        </Stack>
      </Stack>
    </Box>
  );
};
