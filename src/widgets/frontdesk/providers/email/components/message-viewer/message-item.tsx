import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailMessage } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { safeFormatDate } from "../../utils/date-utils";

interface MessageItemProps {
  message: EmailMessage;
  isLast?: boolean;
  showInlineReply: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isLast = false, showInlineReply }) => {
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
