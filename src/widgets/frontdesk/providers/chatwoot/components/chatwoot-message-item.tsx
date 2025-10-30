import React, { useState } from "react";
import { Box, Stack, Typography, Avatar, Paper, Collapse, IconButton } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
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

  // State for expand/collapse functionality
  const [isExpanded, setIsExpanded] = useState(false);

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
  const emailCc = message.content_attributes?.email?.cc ||
                  message.content_attributes?.cc || "";
  const emailBcc = message.content_attributes?.email?.bcc ||
                   message.content_attributes?.bcc || "";

  // Check if content is long enough to warrant expand/collapse
  const isLongContent = processedContent.length > 300;

  // Gmail-style email card layout (for ALL messages)
  return (
    <Box
      sx={{
        p: 2.5,
        m: 2,
        backgroundColor: "white",
        borderRadius: 2,
        border: `1px solid ${neutralColor(200)}`,
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.08)}, 0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: neutralColor(25),
          boxShadow: `0 4px 6px ${alpha(theme.palette.common.black, 0.1)}, 0 2px 4px ${alpha(theme.palette.common.black, 0.08)}`,
        },
      }}
    >
      <Stack spacing={2}>
        {/* Header Row: Avatar + Sender Info (left) | Timestamp (right) */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          {/* Left: Avatar + Sender Info */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: avatarColor,
                color: "white",
                fontSize: "0.875rem",
              }}
              src={sender.avatar_url}
            >
              {!sender.avatar_url && initials}
            </Avatar>
            <Stack>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: neutralColor(900),
                  fontSize: "0.9375rem",
                }}
              >
                {senderName}
              </Typography>
              {senderEmail && (
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(500),
                    fontSize: "0.8125rem",
                  }}
                >
                  {senderEmail}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Right: Timestamp + Expand/Collapse Button */}
          <Stack direction="row" alignItems="center" spacing={1}>
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
            {(emailTo || emailSubject || emailCc || emailBcc || isLongContent) && (
              <IconButton
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{
                  color: neutralColor(500),
                  "&:hover": { backgroundColor: neutralColor(100) },
                }}
              >
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Expandable Email Metadata */}
        <Collapse in={isExpanded}>
          <Box
            sx={{
              pl: "56px", // Align with content under avatar
              pt: 1,
              pb: 1,
              borderTop: `1px solid ${neutralColor(200)}`,
              borderBottom: `1px solid ${neutralColor(200)}`,
            }}
          >
            <Stack spacing={0.5}>
              {emailTo && (
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(700),
                    fontSize: "0.8125rem",
                  }}
                >
                  <strong>To:</strong> {emailTo}
                </Typography>
              )}
              {emailCc && (
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(700),
                    fontSize: "0.8125rem",
                  }}
                >
                  <strong>Cc:</strong> {emailCc}
                </Typography>
              )}
              {emailBcc && (
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(700),
                    fontSize: "0.8125rem",
                  }}
                >
                  <strong>Bcc:</strong> {emailBcc}
                </Typography>
              )}
              {emailSubject && (
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(900),
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    mt: 0.5,
                  }}
                >
                  <strong>Subject:</strong> {emailSubject}
                </Typography>
              )}
            </Stack>
          </Box>
        </Collapse>

        {/* Content Area - Left-aligned under avatar */}
        <Box
          sx={{
            pl: "56px", // Align with sender name (avatar width + spacing)
            ...(!isExpanded && isLongContent && {
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }),
            "& p": {
              margin: 0,
              marginBottom: 1,
              color: neutralColor(800),
              "&:last-child": { marginBottom: 0 },
            },
            "& a": {
              color: primaryColor(600),
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
              borderLeft: `3px solid ${neutralColor(300)}`,
              paddingLeft: 2,
              marginLeft: 0,
              color: neutralColor(600),
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
              textAlign: "left",
            },
            "& th": {
              backgroundColor: neutralColor(50),
              fontWeight: 600,
            },
          }}
          dangerouslySetInnerHTML={isHtml && processedContent ? { __html: processedContent } : undefined}
        >
          {!isHtml && processedContent && (
            <Typography
              variant="body2"
              sx={{
                color: neutralColor(800),
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.6,
                fontSize: "0.875rem",
              }}
            >
              {processedContent}
            </Typography>
          )}
        </Box>

        {/* Show More/Less Button (for long content when collapsed) */}
        {isLongContent && !isExpanded && (
          <Box sx={{ pl: "56px" }}>
            <Typography
              variant="caption"
              sx={{
                color: primaryColor(600),
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setIsExpanded(true)}
            >
              Show more
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

