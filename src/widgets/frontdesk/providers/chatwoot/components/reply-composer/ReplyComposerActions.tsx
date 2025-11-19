/**
 * Reply Composer Actions Component
 *
 * Bottom action bar with formatting toolbar and send button.
 */

import React from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  Send as SendIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import { ReplyComposerToolbar } from "./ReplyComposerToolbar";

export interface ReplyComposerActionsProps {
  /** Whether send button is enabled */
  canSend: boolean;
  /** Whether currently sending */
  isSending: boolean;
  /** Callback when send is clicked */
  onSend: () => void;
  /** Callback when format command is triggered */
  onFormat: (command: string) => void;
  /** Callback when fullscreen is toggled */
  onFullscreen?: () => void;
  /** Border color */
  borderColor?: string;
  /** Primary button color */
  primaryColor?: string;
  /** Icon color */
  iconColor?: string;
}

export const ReplyComposerActions: React.FC<ReplyComposerActionsProps> = ({
  canSend,
  isSending,
  onSend,
  onFormat,
  onFullscreen,
  borderColor = "#E5E7EB",
  primaryColor = "#1F4788",
  iconColor = "#6B7280",
}) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderTop: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Formatting Toolbar */}
      <ReplyComposerToolbar
        onFormat={onFormat}
        disabled={isSending}
        iconColor={iconColor}
      />

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {onFullscreen && (
          <Tooltip title="Fullscreen" arrow>
            <IconButton
              size="small"
              onClick={onFullscreen}
              disabled={isSending}
              sx={{
                color: iconColor,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        )}
        <Button
          variant="contained"
          size="small"
          startIcon={<SendIcon />}
          onClick={onSend}
          disabled={!canSend || isSending}
          sx={{
            backgroundColor: primaryColor,
            color: "white",
            textTransform: "none",
            fontWeight: 500,
            px: 2,
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: 0.9,
            },
            "&:disabled": {
              backgroundColor: "#E5E7EB",
              color: "#9CA3AF",
            },
          }}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </Box>
    </Box>
  );
};
