/**
 * Chatwoot Message Item Component
 *
 * Renders individual messages in a conversation thread.
 * Supports text, HTML, attachments, and activity messages.
 */

import React, { useMemo } from "react";
import { Box, Stack, Typography, Avatar, Paper, Chip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";
import { ActivityBubble } from "@/widgets/frontdesk/components/shared/ActivityBubble";
import { MessageAttachments } from "./attachments";

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
const processMessageContent = (
  message: ChatwootMessage
): { content: string; isHtml: boolean } => {
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
  const processedContent = isFullDoc
    ? rawContent
    : shouldRenderHtml && rawContent
    ? sanitizeHtml(rawContent)
    : rawContent;

  return { content: processedContent, isHtml: shouldRenderHtml };
};

// ============================================================================
// Component
// ============================================================================

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = React.memo(
  ({ message, isLast = false, isFirst = false, showAvatar = true, previousMessage = null }) => {
    const { primaryColor, neutralColor } = useGomakeTheme();
    const theme = useTheme();

    // Early return for ACTIVITY messages
    if (message.message_type === MESSAGE_TYPES.ACTIVITY) {
      return (
        <ActivityBubble
          content={message.content || ""}
          timestamp={
            message.created_at
              ? new Date(message.created_at * 1000).toISOString()
              : undefined
          }
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
    const senderEmail = sender.email || "";
    const avatarColor = getAvatarColor(senderEmail || senderName);
    const initials = getEmailInitials(senderEmail || senderName);
    const avatarInitial =
      senderName?.[0]?.toUpperCase() || initials?.[0]?.toUpperCase() || "?";

    // Timestamp
    const timestamp = message.created_at
      ? formatMessageDate(new Date(message.created_at * 1000).toISOString())
      : "";

    // Process content
    const { content: processedContent, isHtml } = useMemo(
      () => processMessageContent(message),
      [message]
    );

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

    // Styles
    const messageBubbleStyles = useMemo(
      () => ({
        bgcolor: isPrivate
          ? "rgba(251, 191, 36, 0.12)"
          : isMe
          ? primaryColor(100)
          : neutralColor(50),
        color: isMe ? primaryColor(900) : neutralColor(800),
        border: isPrivate ? "1px solid rgba(251, 191, 36, 0.3)" : "none",
        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        px: 2,
        py: 1.5,
        position: "relative" as const,
        boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: theme.transitions.create(
          ["box-shadow", "transform", "background-color", "border-color"],
          { duration: theme.transitions.duration.short }
        ),
        "&:hover": {
          boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.12)}`,
        },
        // HTML content styling
        "& p": { margin: 0, marginBottom: "0.5em", "&:last-child": { marginBottom: 0 } },
        "& a": {
          color: isMe ? primaryColor(700) : primaryColor(600),
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        },
        "& ul, & ol": { paddingLeft: "20px", marginTop: "0.25em", marginBottom: "0.25em" },
        "& li": { marginBottom: "0.25em" },
        "& blockquote": {
          borderLeft: `3px solid ${isMe ? primaryColor(300) : neutralColor(300)}`,
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
        "& table": { borderCollapse: "collapse", width: "100%", border: "none", margin: 0 },
        "& th, & td": { border: "none", padding: "4px", textAlign: "left" as const },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          marginTop: "0.5em",
          marginBottom: "0.25em",
          lineHeight: 1.3,
          fontWeight: 600,
          "&:first-child": { marginTop: 0 },
        },
        lineHeight: 1.5,
      }),
      [isPrivate, isMe, primaryColor, neutralColor, theme]
    );

    const avatarStyles = useMemo(
      () => ({
        width: 32,
        height: 32,
        bgcolor: isMe ? primaryColor(500) : avatarColor,
        color: "white",
        fontSize: "0.75rem",
        fontWeight: 600,
      }),
      [isMe, primaryColor, avatarColor]
    );

    return (
      <Stack
        direction="row"
        spacing={1}
        justifyContent={isMe ? "flex-end" : "flex-start"}
        alignItems="flex-end"
        sx={{ mb: 0.5 }}
      >
        {/* Avatar (left for incoming) */}
        {!isMe && (
          <Avatar sx={avatarStyles} src={sender.avatar_url}>
            {shouldShowAvatar && !sender.avatar_url && avatarInitial}
          </Avatar>
        )}

        <Stack
          maxWidth={isEmailMessage ? "85%" : "70%"}
          alignItems={isMe ? "flex-end" : "flex-start"}
          spacing={0.5}
        >
          {/* Sender Name Chip */}
          {shouldShowAvatar && (
            <Chip
              label={
                isPrivate
                  ? `🔒 ${isMe ? "You" : senderName} (Private)`
                  : isMe
                  ? "You"
                  : senderName
              }
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
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5, wordBreak: "break-word" }}
              >
                {processedContent}
              </Typography>
            ) : attachments.length === 0 ? (
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
            ) : null}

            {/* Attachments */}
            <MessageAttachments
              attachments={attachments}
              isOutgoing={isMe}
              hasContent={hasContent}
            />

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
            sx={{ color: neutralColor(500), fontSize: "0.7rem", px: 0.5 }}
          >
            {timestamp}
          </Typography>
        </Stack>

        {/* Avatar (right for outgoing) */}
        {isMe && (
          <Avatar sx={avatarStyles}>{shouldShowAvatar ? "Y" : ""}</Avatar>
        )}
      </Stack>
    );
  }
);

ChatwootMessageItem.displayName = "ChatwootMessageItem";

export default ChatwootMessageItem;
