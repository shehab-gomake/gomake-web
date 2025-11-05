import React from "react";
import { Box, Stack, Typography, Avatar, Paper, Chip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";
import { ActivityBubble } from "@/widgets/frontdesk/components/shared/ActivityBubble";

/**
 * Chatwoot message types
 * Reference: Chatwoot backend enum
 */
const MESSAGE_TYPES = {
  INCOMING: 0,    // Message from contact
  OUTGOING: 1,    // Message from agent
  ACTIVITY: 2,    // System activity message (status changes, assignments, etc.)
  TEMPLATE: 3,    // Template message
} as const;

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

  // Early return for ACTIVITY messages - render as centered activity bubble
  if (message.message_type === MESSAGE_TYPES.ACTIVITY) {
    const activityContent = message.content || "";
    const timestamp = message.created_at
      ? new Date(message.created_at * 1000).toISOString()
      : undefined;

    return (
      <ActivityBubble
        content={activityContent}
        timestamp={timestamp}
        isHtml={isHtmlContent(activityContent)}
      />
    );
  }

  // Determine if message is outgoing (from agent) or incoming (from contact)
  // message_type: 0 = incoming, 1 = outgoing (or check sender_type)
  const isMe = message.message_type === 1 || message.sender_type === "User";

  // Check if message is private (use _private property)
  const isPrivate = message._private === true;

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
  // Chatwoot stores email HTML in a specific structure:
  // content_attributes.email.htmlContent.full (HTML version)
  // content_attributes.email.textContent.full (plain text version)
  const emailHtml = message.content_attributes?.email?.htmlContent?.full;
  const emailText = message.content_attributes?.email?.textContent?.full;

  // Priority: 1. email HTML, 2. email plain text, 3. regular content field
  const htmlContent = emailHtml;
  const rawContent = htmlContent || emailText || message.content || "";

  // Determine if content is HTML based on content_type or content detection
  // Check for full HTML documents (like 404 pages) - these should be displayed as code blocks
  const isFullHtmlDocument = rawContent.trim().startsWith("<!DOCTYPE html") ||
                            rawContent.trim().startsWith("<!doctype html") ||
                            (rawContent.includes("<html") && rawContent.includes("<head>"));

  // If we have HTML in content_attributes.email, always treat it as HTML
  const isHtml = !isFullHtmlDocument && (
    !!htmlContent ||  // Explicit HTML content from email attributes
    message.content_type === "text/html" ||
    isHtmlContent(rawContent)
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

  // Check if this is an email message (has email metadata)
  const isEmailMessage = !!message.content_attributes?.email;

  // Message bubble styles matching WhatsApp
  const getMessageBubbleStyles = (isOutgoing: boolean) => ({
    bgcolor: isPrivate
      ? neutralColor(100)
      : isOutgoing
      ? primaryColor(100)
      : neutralColor(50),
    color: isOutgoing ? primaryColor(900) : neutralColor(800),
    border: `1px solid ${
      isPrivate
        ? neutralColor(300)
        : isOutgoing
        ? primaryColor(200)
        : neutralColor(200)
    }`,
    borderRadius: isOutgoing ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative" as const,
    boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short,
    }),
    opacity: isPrivate ? 0.85 : 1,
    fontStyle: isPrivate ? "italic" : "normal",
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
    // Email-specific styling
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: 1,
      marginBottom: 0.5,
      lineHeight: 1.3,
      "&:first-of-type": { marginTop: 0 },
    },
    // Preserve email font sizes but ensure readability
    "& font": {
      fontSize: "inherit !important",
    },
    // Center tag support (common in email HTML)
    "& center": {
      textAlign: "center",
    },
    // Better spacing for nested divs (common in email templates)
    "& div": {
      margin: 0,
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
        maxWidth={isEmailMessage ? "85%" : "70%"}
        alignItems={isMe ? "flex-end" : "flex-start"}
        spacing={0.5}
      >
        {shouldShowAvatar && (
          <Chip
            label={isPrivate ? `🔒 ${isMe ? "You" : senderName} (Private)` : isMe ? "You" : senderName}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              borderColor: isPrivate
                ? neutralColor(400)
                : isMe
                ? primaryColor(300)
                : neutralColor(300),
              color: isPrivate
                ? neutralColor(600)
                : isMe
                ? primaryColor(700)
                : neutralColor(700),
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

