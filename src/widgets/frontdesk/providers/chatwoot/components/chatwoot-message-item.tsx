import React from "react";
import { Box, Stack, Typography, Avatar, Paper, Chip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";

interface ChatwootMessageItemProps {
  message: ChatwootMessage;
  isLast?: boolean;
  isFirst?: boolean;
  showAvatar?: boolean; // Whether to show avatar (true if sender changed from previous message)
  previousMessage?: ChatwootMessage | null; // Previous message for grouping logic
}

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = ({ 
  message, 
  isLast = false, 
  isFirst = false,
  showAvatar = true,
  previousMessage = null,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  // Determine if message is outgoing (from agent) or incoming (from contact)
  // message_type: 0 = incoming, 1 = outgoing (or check sender_type)
  const isMe = message.message_type === 1 || message.sender_type === "User";

  const sender = message.sender || {
    name: isMe ? "You" : "Contact",
    email: "",
    avatar_url: undefined,
  };

  const senderEmail = sender.email || "";
  const senderName = sender.name || (isMe ? "You" : "Unknown");

  const avatarColor = getAvatarColor(senderEmail || senderName);
  const initials = getEmailInitials(senderEmail || senderName);
  const avatarInitial = senderName?.[0]?.toUpperCase() || initials?.[0]?.toUpperCase() || "?";

  // Format timestamp - Chatwoot uses Unix timestamps (seconds)
  const timestamp = message.created_at
    ? formatMessageDate(new Date(message.created_at * 1000).toISOString())
    : "";

  // Extract and process content
  const rawContent = message.content || "";

  // Determine if content is HTML based on content_type or content detection
  // Check for full HTML documents (like 404 pages) - these should be displayed as code blocks
  const isFullHtmlDocument = rawContent.trim().startsWith("<!DOCTYPE html") ||
                            rawContent.trim().startsWith("<!doctype html") ||
                            (rawContent.includes("<html") && rawContent.includes("<head>"));

  const isHtml = !isFullHtmlDocument && (
    message.content_type === "text/html" ||
    isHtmlContent(rawContent) ||
    message.content_attributes?.html
  );

  // For full HTML documents, treat as code/plain text to display the source
  // For regular HTML fragments, sanitize and render
  // For plain text, use as-is
  const processedContent = isFullHtmlDocument
    ? rawContent // Display as code
    : isHtml && rawContent
    ? sanitizeHtml(rawContent) // Sanitize HTML fragments
    : rawContent; // Plain text

  // Determine if avatar should be shown (show if first message, or sender changed from previous)
  const shouldShowAvatar = isFirst || showAvatar || 
    (previousMessage && (
      previousMessage.sender?.id !== message.sender?.id ||
      previousMessage.message_type !== message.message_type ||
      previousMessage.sender_type !== message.sender_type
    ));

  // Message bubble styles matching WhatsApp
  const getMessageBubbleStyles = (isOutgoing: boolean) => ({
    bgcolor: isOutgoing ? primaryColor(100) : neutralColor(50),
    color: isOutgoing ? primaryColor(900) : neutralColor(800),
    border: `1px solid ${isOutgoing ? primaryColor(200) : neutralColor(200)}`,
    borderRadius: isOutgoing ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative" as const,
    boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short,
    }),
    "&:hover": {
      boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
      transform: "translateY(-1px)",
    },
    // HTML content styling
    "& p": {
      margin: 0,
      marginBottom: 1,
      "&:last-child": { marginBottom: 0 },
    },
    "& a": {
      color: isOutgoing ? primaryColor(700) : primaryColor(600),
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    "& ul, & ol": {
      paddingLeft: 2,
      marginTop: 0.5,
      marginBottom: 0.5,
    },
    "& li": {
      marginBottom: 0.25,
    },
    "& blockquote": {
      borderLeft: `3px solid ${isOutgoing ? primaryColor(300) : neutralColor(300)}`,
      paddingLeft: 2,
      marginLeft: 0,
      fontStyle: "italic",
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: 1,
      marginTop: 1,
      marginBottom: 1,
    },
    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      marginTop: 1,
      marginBottom: 1,
    },
    "& th, & td": {
      border: `1px solid ${neutralColor(300)}`,
      padding: 1,
      textAlign: "left" as const,
    },
    "& th": {
      backgroundColor: neutralColor(50),
      fontWeight: 600,
    },
  });

  const getAvatarStyles = (isOutgoing: boolean) => ({
    width: 32,
    height: 32,
    bgcolor: isOutgoing ? primaryColor(500) : avatarColor,
    color: "white",
    fontSize: "0.75rem",
    fontWeight: 600,
  });

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent={isMe ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      sx={{ mb: 0.5 }}
    >
      {!isMe && (
        <Avatar sx={getAvatarStyles(false)} src={sender.avatar_url}>
          {shouldShowAvatar ? (!sender.avatar_url && avatarInitial) : ""}
        </Avatar>
      )}

      <Stack
        maxWidth="70%"
        alignItems={isMe ? "flex-end" : "flex-start"}
        spacing={0.5}
      >
        {shouldShowAvatar && (
          <Chip
            label={isMe ? "You" : senderName}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              borderColor: isMe ? primaryColor(300) : neutralColor(300),
              color: isMe ? primaryColor(700) : neutralColor(700),
              bgcolor: "transparent",
            }}
          />
        )}

        <Paper
          elevation={0}
          sx={getMessageBubbleStyles(isMe)}
        >
          {isHtml && processedContent ? (
            <Box
              dangerouslySetInnerHTML={{ __html: processedContent }}
              sx={{
                "& > *:first-of-type": { marginTop: 0 },
                "& > *:last-of-type": { marginBottom: 0 },
              }}
            />
          ) : processedContent ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {processedContent}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                wordBreak: "break-word",
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              (Empty message)
            </Typography>
          )}
        </Paper>

        <Typography
          variant="caption"
          sx={{
            color: neutralColor(500),
            fontSize: "0.7rem",
            px: 0.5,
          }}
        >
          {timestamp}
        </Typography>
      </Stack>

      {isMe && (
        <Avatar sx={getAvatarStyles(true)}>
          {shouldShowAvatar ? "Y" : ""}
        </Avatar>
      )}
    </Stack>
  );
};

