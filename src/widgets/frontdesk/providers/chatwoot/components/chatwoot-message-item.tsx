/**
 * Chatwoot Message Item Component
 *
 * Renders individual messages in a conversation thread.
 * Supports text, HTML, attachments, and activity messages.
 */

import React, { useMemo } from "react";
import { Box, Stack, Typography, Avatar, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";
import { ActivityBubble } from "@/widgets/frontdesk/components/shared/ActivityBubble";
import { MessageAttachments } from "./attachments";
import { generateMessageSenderAvatar } from "../utils/avatar.utils";
import { useSafeColors } from "@/widgets/frontdesk/utils/theme.utils";

// ============================================================================
// Constants
// ============================================================================

/**
 * Chatwoot message types
 * @see https://www.chatwoot.com/docs/product/channels/api/messages
 */
const MESSAGE_TYPES = {
  INCOMING: 0,
  OUTGOING: 1,
  ACTIVITY: 2,
  TEMPLATE: 3,
} as const;

// ============================================================================
// Types
// ============================================================================

interface ChatwootMessageItemProps {
  /** Message data */
  message: ChatwootMessage;
  /** Is this the last message in the thread */
  isLast?: boolean;
  /** Is this the first message in the thread */
  isFirst?: boolean;
  /** Whether to show avatar */
  showAvatar?: boolean;
  /** Previous message for grouping logic */
  previousMessage?: ChatwootMessage | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract body content from full HTML documents
 * Email HTML often comes as complete documents with <html>, <head>, <body>
 */
const extractBodyContent = (html: string): string => {
  if (!html.includes("<body")) return html;

  try {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch?.[1] || html;
  } catch {
    return html;
  }
};

/**
 * Check if content is a full HTML document (not an email)
 */
const isFullHtmlDocument = (content: string, hasEmailHtml: boolean): boolean => {
  if (hasEmailHtml) return false;

  const trimmed = content.trim();
  return (
    trimmed.startsWith("<!DOCTYPE html") ||
    trimmed.startsWith("<!doctype html") ||
    (trimmed.includes("<html") && trimmed.includes("<head>"))
  );
};

/**
 * Process message content for display
 */
const processMessageContent = (message: ChatwootMessage): { content: string; isHtml: boolean } => {
  const emailHtml = message.content_attributes?.email?.html_content?.full;
  const emailText = message.content_attributes?.email?.text_content?.full;

  // Priority: email HTML > email text > regular content
  let rawContent = emailHtml || emailText || message.content || "";

  // Extract body from full HTML documents
  if (emailHtml) {
    rawContent = extractBodyContent(rawContent);
  }

  // Determine if full HTML document (not email)
  const isFullDoc = isFullHtmlDocument(rawContent, !!emailHtml);

  // Determine if should render as HTML
  const shouldRenderHtml =
    !isFullDoc &&
    (!!emailHtml ||
      message.content_type === "text/html" ||
      message.content_type === "incoming_email" ||
      isHtmlContent(rawContent));

  // Process content
  const processedContent = isFullDoc ? rawContent : shouldRenderHtml && rawContent ? sanitizeHtml(rawContent) : rawContent;

  return { content: processedContent, isHtml: shouldRenderHtml };
};

// ============================================================================
// Component
// ============================================================================

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = React.memo(
  ({ message, isLast = false, isFirst = false, showAvatar = true, previousMessage = null }) => {
    const theme = useTheme();
    const { safeNeutralColor } = useSafeColors();

    // Early return for ACTIVITY messages
    if (message.message_type === MESSAGE_TYPES.ACTIVITY) {
      return (
        <ActivityBubble
          content={message.content || ""}
          timestamp={message.created_at ? new Date(message.created_at * 1000).toISOString() : undefined}
          isHtml={isHtmlContent(message.content || "")}
        />
      );
    }

    // Message direction
    const isMe = message.message_type === 1 || message.sender_type === "User";

    // Privacy indicator
    const isPrivate = message._private === true || message.private === true;

    // Sender info
    const sender = message.sender || {
      name: isMe ? "You" : "Contact",
      email: "",
      avatar_url: undefined,
    };
    const senderName = sender.name || (isMe ? "You" : "Unknown");

    // Generate avatar data using unified utility
    const avatarData = useMemo(() => generateMessageSenderAvatar(sender), [sender]);
    const avatarInitial = avatarData.initials[0] || "?";

    // Timestamp
    const timestamp = message.created_at ? formatMessageDate(new Date(message.created_at * 1000).toISOString()) : "";

    // Process content
    const { content: processedContent, isHtml } = useMemo(() => processMessageContent(message), [message]);

    // Attachments
    const attachments = message.attachments || [];
    const hasContent = !!processedContent;

    // Avatar visibility
    const shouldShowAvatar =
      isFirst ||
      showAvatar ||
      (previousMessage &&
        (previousMessage.sender?.id !== message.sender?.id ||
          previousMessage.message_type !== message.message_type ||
          previousMessage.sender_type !== message.sender_type));

    // Email message check
    const isEmailMessage = !!message.content_attributes?.email;

    // Styles - Professional colors: light blue for outgoing (like iMessage), white for incoming
    const messageBubbleStyles = useMemo(
      () => ({
        bgcolor: isPrivate
          ? "rgba(251, 191, 36, 0.1)"
          : isMe
          ? "#DCF8C6" // WhatsApp-style light green, or use "#E3F2FD" for light blue
          : theme.palette.mode === "dark"
          ? safeNeutralColor(800)
          : "#FFFFFF",
        color: isMe
          ? safeNeutralColor(900)
          : theme.palette.mode === "dark"
          ? safeNeutralColor(100)
          : safeNeutralColor(900),
        border: isPrivate
          ? `1px solid ${alpha("#F59E0B", 0.25)}`
          : isMe
          ? "none"
          : `1px solid ${alpha(safeNeutralColor(300), 0.4)}`,
        borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        px: 2,
        py: 1.5,
        position: "relative" as const,
        boxShadow: isPrivate
          ? `0 1px 3px ${alpha("#F59E0B", 0.15)}`
          : `0 1px 2px ${alpha(theme.palette.common.black, 0.08)}`,
        // HTML content styling
        "& p": {
          margin: 0,
          marginBottom: "0.625em",
          fontSize: "0.9375rem",
          lineHeight: 1.6,
          "&:last-child": { marginBottom: 0 },
        },
        "& a": {
          color: "#1976D2",
          textDecoration: "none",
          fontWeight: 500,
          "&:hover": {
            textDecoration: "underline",
          },
        },
        "& ul, & ol": {
          paddingLeft: "24px",
          marginTop: "0.5em",
          marginBottom: "0.5em",
          "& li": {
            marginBottom: "0.375em",
            lineHeight: 1.6,
          },
        },
        "& blockquote": {
          borderLeft: `3px solid ${safeNeutralColor(400)}`,
          paddingLeft: "16px",
          marginLeft: 0,
          marginTop: "0.75em",
          marginBottom: "0.75em",
          fontStyle: "italic",
          opacity: 0.85,
          backgroundColor: alpha(safeNeutralColor(100), 0.5),
          paddingTop: "0.5em",
          paddingBottom: "0.5em",
          borderRadius: "4px",
        },
        "& img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "8px",
          marginTop: "10px",
          marginBottom: "10px",
          display: "block",
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
        },
        "& table": {
          borderCollapse: "collapse",
          width: "100%",
          border: `1px solid ${alpha(safeNeutralColor(300), 0.3)}`,
          marginTop: "0.5em",
          marginBottom: "0.5em",
          borderRadius: "6px",
          overflow: "hidden",
        },
        "& th, & td": {
          border: `1px solid ${alpha(safeNeutralColor(300), 0.2)}`,
          padding: "8px 12px",
          textAlign: "left" as const,
        },
        "& th": {
          backgroundColor: alpha(safeNeutralColor(100), 0.5),
          fontWeight: 600,
        },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          marginTop: "0.75em",
          marginBottom: "0.5em",
          lineHeight: 1.3,
          fontWeight: 600,
          "&:first-child": { marginTop: 0 },
        },
        "& code": {
          backgroundColor: alpha(safeNeutralColor(200), 0.4),
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "0.875em",
          fontFamily: "monospace",
        },
        "& pre": {
          backgroundColor: alpha(safeNeutralColor(100), 0.5),
          padding: "12px",
          borderRadius: "6px",
          overflow: "auto",
          marginTop: "0.5em",
          marginBottom: "0.5em",
          "& code": {
            backgroundColor: "transparent",
            padding: 0,
          },
        },
        lineHeight: 1.6,
        fontSize: "0.9375rem",
      }),
      [isPrivate, isMe, safeNeutralColor, theme]
    );

    const avatarStyles = useMemo(
      () => ({
        width: 32,
        height: 32,
        bgcolor: avatarData.backgroundColor,
        color: "white",
        fontSize: "0.75rem",
        fontWeight: 600,
        border: `2px solid ${safeNeutralColor(100)}`,
      }),
      [avatarData.backgroundColor, safeNeutralColor]
    );

    return (
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent={isMe ? "flex-end" : "flex-start"}
        alignItems="flex-end"
        sx={{
          mb: shouldShowAvatar ? 2 : 1,
          px: 0.5,
        }}
      >
        {/* Avatar (left for incoming) */}
        {!isMe && (
          <Avatar sx={avatarStyles} src={avatarData.src} alt={avatarData.displayName} title={avatarData.displayName}>
            {shouldShowAvatar && !avatarData.src && avatarInitial}
          </Avatar>
        )}

        <Stack maxWidth={isEmailMessage ? "85%" : "70%"} alignItems={isMe ? "flex-end" : "flex-start"} spacing={0.5}>
          {/* Sender Name Chip - only for incoming messages */}
          {!isMe && shouldShowAvatar && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: isPrivate ? "#F59E0B" : safeNeutralColor(600),
                px: 0.5,
              }}
            >
              {isPrivate ? `🔒 ${senderName} (Private)` : senderName}
            </Typography>
          )}

          {/* Message Bubble */}
          <Paper elevation={0} sx={messageBubbleStyles}>
            {/* Text Content */}
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
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                  fontSize: "0.9375rem",
                }}
              >
                {processedContent}
              </Typography>
            ) : attachments.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                  fontStyle: "italic",
                  opacity: 0.6,
                  fontSize: "0.875rem",
                }}
              >
                (Empty message)
              </Typography>
            ) : null}

            {/* Attachments */}
            <MessageAttachments attachments={attachments} isOutgoing={isMe} hasContent={hasContent} />

            {/* Private Message Indicator */}
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
                  color: "rgba(251, 191, 36, 0.8)",
                }}
              >
                <LockIcon sx={{ fontSize: 14 }} />
              </Box>
            )}
          </Paper>

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              color: safeNeutralColor(500),
              fontSize: "0.6875rem",
              px: 0.5,
              fontWeight: 400,
            }}
          >
            {timestamp}
          </Typography>
        </Stack>
      </Stack>
    );
  }
);

ChatwootMessageItem.displayName = "ChatwootMessageItem";

export default ChatwootMessageItem;
