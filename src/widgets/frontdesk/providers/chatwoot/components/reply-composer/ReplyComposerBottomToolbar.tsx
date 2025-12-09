/**
 * ReplyComposerBottomToolbar Component
 *
 * Premium bottom toolbar with modernized icons, consistent stroke weights,
 * improved spacing, and a polished send button.
 */

import React from "react";
import {
  Box,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import type { UseChannelFeaturesReturn } from "../../hooks/use-channel-features";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";

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
}

export const ReplyComposerBottomToolbar: React.FC<
  ReplyComposerBottomToolbarProps
> = ({
  channelFeatures,
  messageContent,
  canSend,
  isSending,
  onSend,
  onAttachClick,
  attachmentCount,
  lightGrayText,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  // Consistent icon button styling with modern appearance
  const iconButtonStyle = {
    color: colorTokens.neutral[500],
    p: 1,
    borderRadius: `${radiusTokens.md}px`,
    transition: "all 0.15s ease",
    "&:hover": {
      backgroundColor: colorTokens.neutral[200],
      color: colorTokens.neutral[700],
    },
    "& .MuiSvgIcon-root": {
      fontSize: 20,
      strokeWidth: 1.5,
    },
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        direction: dir,
      }}
    >
      {/* Left Side Icons with improved spacing */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: 1,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {/* File upload - only if supported */}
        {channelFeatures.supportsFileUpload && (
          <Tooltip
            title={
              attachmentCount > 0
                ? t("frontdesk.compose.filesAttached", {
                    count: attachmentCount,
                  })
                : channelFeatures.supportsMultipleFileUpload
                ? t("frontdesk.compose.attachFiles")
                : t("frontdesk.compose.attachFile")
            }
            arrow
          >
            <IconButton
              size="small"
              onClick={onAttachClick}
              sx={{
                ...iconButtonStyle,
                position: "relative",
                ...(attachmentCount > 0 && {
                  color: colorTokens.primary[600],
                  backgroundColor: colorTokens.primary[50],
                  "&:hover": {
                    backgroundColor: colorTokens.primary[100],
                    color: colorTokens.primary[700],
                  },
                }),
              }}
            >
              <AttachFileOutlinedIcon />
              {attachmentCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    top: 4,
                    [isRTL ? "left" : "right"]: 4,
                    backgroundColor: colorTokens.primary[600],
                    color: "white",
                    borderRadius: `${radiusTokens.full}px`,
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    boxShadow: shadowTokens.sm,
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
          <Tooltip title="WhatsApp Templates" arrow>
            <IconButton size="small" sx={iconButtonStyle}>
              <DescriptionOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Content Templates Button - only for Twilio WhatsApp */}
        {channelFeatures.shouldShowContentTemplates && (
          <Tooltip title="Content Templates" arrow>
            <IconButton size="small" sx={iconButtonStyle}>
              <DescriptionOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Editor Toggle - only for API inbox */}
        {channelFeatures.shouldShowEditorToggle && (
          <Tooltip title="Toggle Rich Editor" arrow>
            <IconButton size="small" sx={iconButtonStyle}>
              <CodeOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {/* Right Side: Character Count and Send Button */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: 1.5,
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        {/* Character Count - subtle styling */}
        {messageContent.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              color:
                messageContent.length > channelFeatures.maxMessageLength
                  ? colorTokens.error[600]
                  : messageContent.length >
                    channelFeatures.maxMessageLength * 0.9
                  ? colorTokens.warning[600]
                  : colorTokens.neutral[400],
              fontSize: "0.75rem",
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {messageContent.length.toLocaleString()} /{" "}
            {channelFeatures.maxMessageLength.toLocaleString()}
          </Typography>
        )}

        {/* Send Button - Premium styling */}
        <Button
          variant="contained"
          onClick={onSend}
          disabled={!canSend || isSending}
          {...(isRTL
            ? {
                startIcon: <SendRoundedIcon sx={{ fontSize: 16, ml: 1 }} />,
              }
            : {
                endIcon: <SendRoundedIcon sx={{ fontSize: 16, ml: -0.5 }} />,
              })}
          sx={{
            backgroundColor: colorTokens.primary[600],
            color: "white",
            textTransform: "none",
            fontSize: "0.8125rem",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            minHeight: 36,
            borderRadius: `${radiusTokens.full}px`,
            boxShadow: shadowTokens.sm,
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: colorTokens.primary[700],
              boxShadow: shadowTokens.md,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&:disabled": {
              backgroundColor: colorTokens.neutral[200],
              color: colorTokens.neutral[400],
              boxShadow: "none",
            },
          }}
        >
          {t("frontdesk.compose.send")}
        </Button>
      </Stack>
    </Box>
  );
};
