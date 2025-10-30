import React from "react";
import { Box, Stack, Typography, Avatar, Paper } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";

interface ChatwootMessageItemProps {
  message: ChatwootMessage;
  isLast?: boolean;
  isFirst?: boolean; // True if this is the first message in the conversation
}

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = ({ message, isLast = false, isFirst = false }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();
  
  // Determine if message is outgoing (from agent) or incoming (from contact)
  // message_type: 0 = incoming, 1 = outgoing (or check sender_type)
  const isOutgoing = message.message_type === 1 || message.sender_type === "User";
  
  const sender = message.sender || {
    name: isOutgoing ? "You" : "Contact",
    email: "",
    avatar_url: undefined,
  };

  const senderEmail = sender.email || "";
  const senderName = sender.name || (isOutgoing ? "You" : "Unknown");
  
  const avatarColor = getAvatarColor(senderEmail || senderName);
  const initials = getEmailInitials(senderEmail || senderName);

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

  // Extract email metadata from content_attributes or message structure
  const emailTo = message.content_attributes?.email?.to || 
                  message.content_attributes?.to || 
                  message.content_attributes?.to_emails?.[0] || "";
  const emailSubject = message.content_attributes?.email?.subject || 
                       message.content_attributes?.subject || "";

  // Bubble styles for messages - dark blue bubbles
  const bubbleStyles = {
    bgcolor: isOutgoing ? primaryColor(500) : primaryColor(600), // Lighter blue for outgoing, darker blue for incoming
    color: "#FFFFFF", // White text
    borderRadius: isOutgoing ? "18px 18px 4px 18px" : "18px 18px 18px 4px", // Rounded bubbles
    px: 2,
    py: 1.5,
    maxWidth: "70%",
    boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.3)}`,
  };

  // For the FIRST message ONLY, show in standard email format (non-bubble)
  // For ALL subsequent messages, show in bubble format regardless of content
  if (isFirst && emailSubject) {
    // Original email format - standard format (only for first message with subject)
    return (
      <Box
        sx={{
          p: 2.5,
          borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
          borderRadius: "8px",
          mb: 1,
          mx: 2,
          mt: 2,
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack flex={1} spacing={0.5}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: neutralColor(900),
                  fontSize: "0.875rem",
                }}
              >
                {senderName} {senderEmail && `<${senderEmail}>`}
              </Typography>
              {emailTo && (
                <Typography variant="body2" sx={{ color: neutralColor(700), fontSize: "0.8125rem" }}>
                  To: {emailTo}
                </Typography>
              )}
              {emailSubject && (
                <Typography variant="body2" sx={{ color: neutralColor(700), fontSize: "0.8125rem", fontWeight: 500 }}>
                  Subject: {emailSubject}
                </Typography>
              )}
            </Stack>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(600),
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              {timestamp}
            </Typography>
          </Stack>
          <Box
            sx={{
              "& p": { margin: 0, marginBottom: 1, "&:last-child": { marginBottom: 0 } },
              "& a": { color: primaryColor(600), textDecoration: "none", "&:hover": { textDecoration: "underline" } },
            }}
            dangerouslySetInnerHTML={isHtml && processedContent ? { __html: processedContent } : undefined}
          >
            {!isHtml && processedContent && (
              <Typography variant="body2" sx={{ color: neutralColor(900), whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {processedContent}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    );
  }

  // Bubble format for subsequent messages
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent={isOutgoing ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      sx={{
        mb: 1,
        px: 2,
      }}
    >
      {/* Avatar for incoming messages (left side) */}
      {!isOutgoing && (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            backgroundColor: avatarColor, 
            color: "white",
            fontSize: "0.75rem",
          }}
          src={sender.avatar_url}
        >
          {!sender.avatar_url && initials}
        </Avatar>
      )}

      {/* Message Bubble */}
      <Stack alignItems={isOutgoing ? "flex-end" : "flex-start"} spacing={0.5} sx={{ maxWidth: "70%" }}>
        <Paper elevation={0} sx={bubbleStyles}>
          {/* To header inside bubble */}
          {emailTo && (
            <Typography variant="caption" sx={{ color: "#FFFFFF", fontSize: "0.75rem", mb: 0.5, display: "block", opacity: 0.95 }}>
              To: {emailTo}
            </Typography>
          )}
          <Box
            sx={{
              color: "#FFFFFF",
              "& p": {
                margin: 0,
                marginBottom: 0.5,
                color: "#FFFFFF",
                "&:last-child": { marginBottom: 0 },
              },
              "& a": {
                color: "#FFFFFF",
                textDecoration: "underline",
              },
            }}
            dangerouslySetInnerHTML={isHtml && processedContent ? { __html: processedContent } : undefined}
          >
            {!isHtml && processedContent && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#FFFFFF", 
                  whiteSpace: "pre-wrap", 
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                }}
              >
                {processedContent}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Timestamp with checkmark */}
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ px: 0.5 }}>
          {isOutgoing && message.status === "sent" && (
            <Typography variant="caption" sx={{ color: neutralColor(600), fontSize: "0.7rem" }}>
              ✓
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: neutralColor(500), fontSize: "0.7rem" }}>
            {timestamp}
          </Typography>
        </Stack>
      </Stack>

      {/* Avatar for outgoing messages (right side) */}
      {isOutgoing && (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            backgroundColor: avatarColor, 
            color: "white",
            fontSize: "0.75rem",
          }}
          src={sender.avatar_url}
        >
          {!sender.avatar_url && initials}
        </Avatar>
      )}
    </Stack>
  );
};

