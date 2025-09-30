import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailMessage } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { EmailAttachmentList } from "./email-attachment-list";

interface MessageItemProps {
  message: EmailMessage;
  accountId?: string;
  isLast?: boolean;
  showInlineReply: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, accountId, isLast = false, showInlineReply }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const isOwn = false; // TODO: Check if message is from current user

  let senderName: string;
  let senderEmail: string | undefined;

  // message.from is always an EmailRecipient object based on the type definition
  senderName = message.from.name || message.from.email;
  senderEmail = message.from.email;

  const avatarColor = getAvatarColor(senderEmail || senderName);
  const initials = getEmailInitials(senderEmail || senderName);

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
        backgroundColor: isOwn ? alpha(primaryColor(50), 0.3) : "transparent",
      }}
    >
      <Stack spacing={2}>
        {/* Message Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ width: 40, height: 40, backgroundColor: avatarColor, color: "white" }}>
              {initials}
            </Avatar>
            <Stack>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: isOwn ? primaryColor(700) : neutralColor(800),
                }}
              >
                {senderName}
              </Typography>
              {senderEmail && (
                <Typography variant="body2" sx={{ color: neutralColor(500) }}>
                  {senderEmail}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: neutralColor(500),
              fontWeight: 500,
              pt: 0.5,
            }}
          >
            {formatMessageDate(message.date)}
          </Typography>
        </Stack>

        {/* Message Content */}
        <Box
          sx={{
            pl: "56px", // Align with avatar
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

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && accountId && (
          <Box sx={{ pl: "56px" }}>
            <EmailAttachmentList
              attachments={message.attachments}
              accountId={accountId}
              messageId={message.id}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};
