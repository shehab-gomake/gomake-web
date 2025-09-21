import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailMessage } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { safeFormatDate } from "../../utils/date-utils";
import { EmailActionButton } from "../ui/email-action-button";

interface MessageItemProps {
  message: EmailMessage;
  isLast?: boolean;
  showInlineReply: boolean;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isLast = false,
  showInlineReply,
  onReply,
  onReplyAll,
  onForward,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const isOwn = false; // TODO: Check if message is from current user

  const formatMessageDate = (dateString: string) => safeFormatDate(dateString);

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
        backgroundColor: isOwn ? alpha(primaryColor(50), 0.3) : "transparent",
      }}
    >
      <Stack spacing={1}>
        {/* Message Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: isOwn ? primaryColor(700) : neutralColor(800),
              }}
            >
              {typeof message.from === "string" ? message.from : message.from.name || message.from.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(500),
              }}
            >
              {formatMessageDate(message.createdAt)}
            </Typography>
          </Stack>

          {!showInlineReply && (
            <Stack direction="row" spacing={0.5}>
              <EmailActionButton icon={<div>↩</div>} tooltip="Reply" onClick={onReply} />
              <EmailActionButton icon={<div>↩↩</div>} tooltip="Reply All" onClick={onReplyAll} />
              <EmailActionButton icon={<div>↪</div>} tooltip="Forward" onClick={onForward} />
            </Stack>
          )}
        </Stack>

        {/* Message Content */}
        <Box
          sx={{
            "& p": {
              margin: 0,
              marginBottom: 1,
              "&:last-child": {
                marginBottom: 0,
              },
            },
            "& a": {
              color: primaryColor(600),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
          dangerouslySetInnerHTML={{
            __html: message.html || safeDecodeHtml(message.text || message.snippet || ""),
          }}
        />
      </Stack>
    </Box>
  );
};
