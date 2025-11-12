import React from "react";
import { Box, Stack, Typography, Avatar, Paper, Chip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
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

  // Check if message is private (support both _private and private properties)
  // The API may return either property name depending on the endpoint
  const isPrivate = message._private === true || message.private === true;

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
  // content_attributes.email.html_content.full (HTML version)
  // content_attributes.email.text_content.full (plain text version)
  const emailHtml = message.content_attributes?.email?.html_content?.full;
  const emailText = message.content_attributes?.email?.text_content?.full;

  // Priority: 1. email HTML, 2. email plain text, 3. regular content field
  const htmlContent = emailHtml;

  // Extract body content from full HTML documents
  // Email HTML often comes as complete documents with <html>, <head>, <body>
  // We only want the body content to avoid layout conflicts
  let rawContent = htmlContent || emailText || message.content || "";

  if (htmlContent && htmlContent.includes('<body')) {
    try {
      // Extract content between <body> tags
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        rawContent = bodyMatch[1];
      }
    } catch (error) {
      console.warn('[ChatwootMessageItem] Failed to extract body content:', error);
    }
  }

  // Determine if content is HTML based on content_type or content detection
  // Check for full HTML documents (like 404 pages) - these should be displayed as code blocks
  // EXCEPTION: Email messages with full HTML should be rendered, not displayed as code
  const isFullHtmlDocument = !emailHtml && (
    rawContent.trim().startsWith("<!DOCTYPE html") ||
    rawContent.trim().startsWith("<!doctype html") ||
    (rawContent.includes("<html") && rawContent.includes("<head>"))
  );

  // If we have HTML in content_attributes.email, always treat it as HTML (even if full document)
  // For emails, render the full HTML document with sanitization
  const isHtml = !isFullHtmlDocument && (
    !!htmlContent ||  // Explicit HTML content from email attributes
    message.content_type === "text/html" ||
    message.content_type === "incoming_email" ||  // Always render email HTML
    isHtmlContent(rawContent)
  );

  // For full HTML documents (non-email), treat as code/plain text to display the source
  // For email HTML or regular HTML fragments, sanitize and render
  // For plain text, use as-is
  const processedContent = isFullHtmlDocument
    ? rawContent // Display as code (404 pages, etc.)
    : isHtml && rawContent
    ? sanitizeHtml(rawContent) // Sanitize HTML fragments and email HTML
    : rawContent; // Plain text

  // Debug: Log email content structure for incoming emails
  if (message.content_type === 'incoming_email' && process.env.NODE_ENV === 'development') {
    console.log('[ChatwootMessageItem] Email rendering:', {
      id: message.id,
      has_emailHtml: !!emailHtml,
      rawContent_length: rawContent.length,
      isHtml,
      isFullHtmlDocument,
      processedContent_length: processedContent.length,
      emailHtml_preview: emailHtml?.substring(0, 200),
      processedContent_preview: processedContent?.substring(0, 200),
    });
  }

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
  // For private messages, use a distinctive amber/yellow background tint
  const getMessageBubbleStyles = (isOutgoing: boolean) => ({
    bgcolor: isPrivate
      ? "rgba(251, 191, 36, 0.12)" // Amber/yellow tint for private messages (more visible than neutral)
      : isOutgoing
      ? primaryColor(100)
      : neutralColor(50),
    color: isOutgoing ? primaryColor(900) : neutralColor(800),
    border: isPrivate 
      ? `1px solid rgba(251, 191, 36, 0.3)` // Amber border for private messages
      : "none",
    borderRadius: isOutgoing ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative" as const,
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.08)}`,
    transition: theme.transitions.create(["box-shadow", "transform", "background-color", "border-color"], {
      duration: theme.transitions.duration.short,
    }),
    opacity: 1, // Remove opacity reduction - use background color instead
    fontStyle: "normal", // Remove italic - use background color and icon instead
    "&:hover": {
      boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.12)}`,
    },
    // HTML content styling - clean and natural
    "& p": {
      margin: 0,
      marginBottom: "0.5em",
      "&:last-child": { marginBottom: 0 },
    },
    "& a": {
      color: isOutgoing ? primaryColor(700) : primaryColor(600),
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    "& ul, & ol": {
      paddingLeft: "20px",
      marginTop: "0.25em",
      marginBottom: "0.25em",
    },
    "& li": {
      marginBottom: "0.25em",
    },
    "& blockquote": {
      borderLeft: `3px solid ${isOutgoing ? primaryColor(300) : neutralColor(300)}`,
      paddingLeft: "12px",
      marginLeft: 0,
      marginTop: "0.5em",
      marginBottom: "0.5em",
      fontStyle: "italic",
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
      marginTop: "8px",
      marginBottom: "8px",
      display: "block",
    },
    // Remove all table borders for email tables (layout tables)
    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      border: "none",
      margin: 0,
    },
    "& th, & td": {
      border: "none",
      padding: "4px",
      textAlign: "left" as const,
    },
    "& tbody, & tr": {
      border: "none",
    },
    "& th": {
      border: "none",
      backgroundColor: "transparent",
      fontWeight: "inherit",
    },
    // Email-specific styling - natural appearance
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: "0.5em",
      marginBottom: "0.25em",
      lineHeight: 1.3,
      fontWeight: 600,
      "&:first-child": { marginTop: 0 },
    },
    "& h1": { fontSize: "1.5em" },
    "& h2": { fontSize: "1.3em" },
    "& h3": { fontSize: "1.1em" },
    "& h4, & h5, & h6": { fontSize: "1em" },
    // Preserve email styling but remove visual clutter
    "& font": {
      fontSize: "inherit",
    },
    "& center": {
      textAlign: "center",
    },
    // Clean spacing for email layout divs
    "& div": {
      margin: 0,
    },
    // Remove borders from email layout elements
    "& div[style*='border']": {
      border: "none !important",
    },
    "& table[border]": {
      border: "none !important",
    },
    "& td[style*='border'], & th[style*='border']": {
      border: "none !important",
    },
    // Better line height for readability
    lineHeight: 1.5,
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
          
          {/* Private message indicator icon - positioned at bottom right */}
          {isPrivate && (
            <Box
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                color: "rgba(251, 191, 36, 0.8)", // Amber color matching the theme
              }}
            >
              <LockIcon sx={{ fontSize: 14 }} />
            </Box>
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

