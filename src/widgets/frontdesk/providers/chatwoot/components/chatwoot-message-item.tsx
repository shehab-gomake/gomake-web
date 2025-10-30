import React from "react";
import { Box, Stack, Typography, Avatar } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { ChatwootMessage } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";

interface ChatwootMessageItemProps {
  message: ChatwootMessage;
  isLast?: boolean;
}

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = ({ message, isLast = false }) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  
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

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
        backgroundColor: isOutgoing ? alpha(primaryColor(50), 0.3) : "transparent",
      }}
    >
      <Stack spacing={2}>
        {/* Message Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar 
              sx={{ width: 40, height: 40, backgroundColor: avatarColor, color: "white" }}
              src={sender.avatar_url}
            >
              {!sender.avatar_url && initials}
            </Avatar>
            <Stack>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: isOutgoing ? primaryColor(700) : neutralColor(800),
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
            {timestamp}
          </Typography>
        </Stack>

        {/* Message Content */}
        {isFullHtmlDocument ? (
          // Display full HTML documents as code blocks
          <Box
            sx={{
              pl: "56px",
              mt: 1,
            }}
          >
            <Box
              component="pre"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                backgroundColor: neutralColor(100),
                border: `1px solid ${neutralColor(300)}`,
                borderRadius: "4px",
                padding: "1rem",
                overflow: "auto",
                maxWidth: "100%",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: neutralColor(700),
                maxHeight: "400px",
              }}
            >
              {processedContent}
            </Box>
          </Box>
        ) : (
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
              "& pre, & code": {
                fontFamily: "monospace",
                fontSize: "0.875rem",
                backgroundColor: neutralColor(100),
                padding: "0.5rem",
                borderRadius: "4px",
                overflow: "auto",
                maxWidth: "100%",
              },
              "& pre": {
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              },
            }}
            dangerouslySetInnerHTML={
              isHtml && processedContent
                ? { __html: processedContent }
                : undefined
            }
          >
            {!isHtml && processedContent && (
              <Typography variant="body2" sx={{ color: neutralColor(700), whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {processedContent}
              </Typography>
            )}
          </Box>
        )}

        {/* Message Status (for outgoing messages) */}
        {isOutgoing && message.status && (
          <Box sx={{ pl: "56px", display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: neutralColor(500), fontSize: 11 }}>
              {message.status === "sent" && "✓"}
              {message.status === "delivered" && "✓✓"}
              {message.status === "read" && "✓✓"}
              {message.status === "failed" && "✗"}
            </Typography>
            <Typography variant="caption" sx={{ color: neutralColor(500), fontSize: 11 }}>
              {message.status}
            </Typography>
          </Box>
        )}

        {/* Attachments (if content_attributes has attachments) */}
        {message.content_attributes?.attachments && 
         Array.isArray(message.content_attributes.attachments) &&
         message.content_attributes.attachments.length > 0 && (
          <Box sx={{ pl: "56px" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500), fontSize: 12 }}>
              {message.content_attributes.attachments.length} attachment(s)
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

