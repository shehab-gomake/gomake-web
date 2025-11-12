/**
 * ReplyComposerBottomToolbar Component
 * Bottom toolbar with emoji, attach, voice, schedule, AI assist, and send button
 */

import React from "react";
import { Box, Stack, IconButton, Tooltip, Button, Typography } from "@mui/material";
import {
  InsertEmoticon as EmojiIcon,
  AttachFile as AttachIcon,
  Mic as MicIcon,
  CalendarToday as CalendarIcon,
  AutoAwesome as AIAssistIcon,
  Send as SendIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import type { UseChannelFeaturesReturn } from "../../hooks/use-channel-features";

interface ReplyComposerBottomToolbarProps {
  channelFeatures: UseChannelFeaturesReturn;
  messageContent: string;
  canSend: boolean;
  isSending: boolean;
  onSend: () => void;
  onAttachClick: () => void;
  attachmentCount: number;
  borderColor: string;
  lightGrayText: string;
  neutralColor: (shade: number) => string;
  primaryColor: (shade: number) => string;
}

export const ReplyComposerBottomToolbar: React.FC<ReplyComposerBottomToolbarProps> = ({
  channelFeatures,
  messageContent,
  canSend,
  isSending,
  onSend,
  onAttachClick,
  attachmentCount,
  borderColor,
  lightGrayText,
  neutralColor,
  primaryColor,
}) => {
  const iconButtonStyle = {
    color: lightGrayText,
    p: 0.75,
    "&:hover": {
      backgroundColor: neutralColor(100),
      color: primaryColor(600),
    },
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        borderTop: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
      }}
    >
      {/* Left Side Icons */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        {/* AI Assist Button */}
        <Tooltip title="AI Assist">
          <IconButton
            size="small"
            sx={{
              background: "linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)",
              color: "white",
              p: 0.75,
              "&:hover": {
                background: "linear-gradient(135deg, #7E22CE 0%, #6B21A8 100%)",
              },
            }}
          >
            <AIAssistIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* File upload - only if supported */}
        {channelFeatures.supportsFileUpload && (
          <Tooltip
            title={
              attachmentCount > 0
                ? `${attachmentCount} file${attachmentCount > 1 ? 's' : ''} attached`
                : channelFeatures.supportsMultipleFileUpload
                ? 'Attach files'
                : 'Attach file'
            }
          >
            <IconButton
              size="small"
              onClick={onAttachClick}
              sx={{
                ...iconButtonStyle,
                ...(attachmentCount > 0 && {
                  color: primaryColor(600),
                  backgroundColor: `${primaryColor(600)}15`,
                }),
              }}
            >
              <AttachIcon sx={{ fontSize: 18 }} />
              {attachmentCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: primaryColor(600),
                    color: 'white',
                    borderRadius: '50%',
                    width: 14,
                    height: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                  }}
                >
                  {attachmentCount}
                </Box>
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* WhatsApp Templates Button - only for WhatsApp Cloud */}
        {channelFeatures.shouldShowWhatsAppTemplates && (
          <Tooltip title="WhatsApp Templates">
            <IconButton size="small" sx={iconButtonStyle}>
              <CalendarIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Content Templates Button - only for Twilio WhatsApp */}
        {channelFeatures.shouldShowContentTemplates && (
          <Tooltip title="Content Templates">
            <IconButton size="small" sx={iconButtonStyle}>
              <CalendarIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Editor Toggle - only for API inbox */}
        {channelFeatures.shouldShowEditorToggle && (
          <Tooltip title="Toggle Rich Editor">
            <IconButton size="small" sx={iconButtonStyle}>
              <CodeIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Right Side: Send Button and Character Count */}
      <Stack direction="row" spacing={1} alignItems="center">
        {messageContent.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              color:
                messageContent.length > channelFeatures.maxMessageLength
                  ? "error.main"
                  : messageContent.length > channelFeatures.maxMessageLength * 0.9
                  ? "warning.main"
                  : lightGrayText,
              fontSize: "0.75rem",
            }}
          >
            {messageContent.length} / {channelFeatures.maxMessageLength}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={onSend}
          disabled={!canSend || isSending}
          startIcon={<SendIcon sx={{ fontSize: 16 }} />}
          sx={{
            backgroundColor: primaryColor(600),
            color: "white",
            textTransform: "none",
            fontSize: "0.8125rem",
            px: 1.5,
            py: 0.5,
            minHeight: 32,
            "&:hover": {
              backgroundColor: primaryColor(700),
            },
            "&:disabled": {
              backgroundColor: neutralColor(200),
              color: neutralColor(500),
            },
          }}
        >
          Send (⌘ + ←)
        </Button>
      </Stack>
    </Box>
  );
};
