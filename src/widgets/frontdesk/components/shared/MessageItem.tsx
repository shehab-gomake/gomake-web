import React from "react";
import { Box, Stack, Typography, Avatar, Chip } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { UnifiedMessage } from "@/widgets/frontdesk/utils/message-transformer";
import { getAvatarColor, getInitials } from "@/widgets/frontdesk/utils/message-transformer";
import { formatMessageDate } from "@/widgets/frontdesk/utils";
import { ChannelBadge } from "@/widgets/frontdesk/design-system";
import { EmailAttachmentList } from "@/widgets/frontdesk/providers/email/components/message-viewer/email-attachment-list";
import { smartFormatContent } from "@/widgets/frontdesk/utils/text-formatter";

interface MessageItemProps {
  message: UnifiedMessage;
  variant?: "email" | "ticket";
  accountId?: string; // Required for email attachments
  isLast?: boolean;
}

/**
 * Shared message display component used across FrontDesk providers.
 *
 * Features:
 * - Clean, minimal design based on email MessageItem
 * - Avatar with initials and color
 * - Timestamp formatting
 * - HTML content support
 * - Attachments display
 * - Ticket variant: Shows channel badges, direction, status
 * - Email variant: Simple, focused on content
 *
 * Used by:
 * - Email provider (clean display)
 * - Tickets provider (with channel context)
 * - Future providers (DMs, WhatsApp, etc.)
 */
export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  variant = "email",
  accountId,
  isLast = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const isOwn = message.direction === "outbound";
  const avatarColor = getAvatarColor(message.author.email || message.author.name);
  const initials = getInitials(message.author.name);

  // Smart format content - handles both HTML and plain text
  // SECURITY: All HTML is sanitized by smartFormatContent using DOMPurify
  // to prevent XSS attacks. See: src/widgets/frontdesk/utils/html-sanitizer.ts
  const content = smartFormatContent(message.content, message.html);

  // Only highlight outbound messages for email variant
  // For tickets, don't highlight to avoid confusion between:
  // - INBOUND email you received (ticket created from it)
  // - OUTBOUND reply you sent
  const shouldHighlight = variant === "email" && isOwn;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: isLast ? "none" : `1px solid ${neutralColor(200)}`,
        backgroundColor: shouldHighlight ? alpha(primaryColor(50), 0.3) : "transparent",
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
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: shouldHighlight ? primaryColor(700) : neutralColor(800),
                  }}
                >
                  {message.author.name}
                </Typography>

                {/* Ticket variant: Show channel and direction badges */}
                {variant === "ticket" && message.channel && (
                  <ChannelBadge
                    channel={message.channel}
                    mode="icon"
                    size="sm"
                  />
                )}

                {/* Ticket variant: Show status if not delivered */}
                {variant === "ticket" && message.status && message.status !== "delivered" && (
                  <Chip
                    label={message.status}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      backgroundColor:
                        message.status === "failed"
                          ? alpha("#EF4444", 0.1)
                          : message.status === "pending"
                          ? alpha("#F59E0B", 0.1)
                          : alpha("#10B981", 0.1),
                      color:
                        message.status === "failed"
                          ? "#EF4444"
                          : message.status === "pending"
                          ? "#F59E0B"
                          : "#10B981",
                    }}
                  />
                )}
              </Stack>

              {message.author.email && (
                <Typography variant="body2" sx={{ color: neutralColor(500) }}>
                  {message.author.email}
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
            {formatMessageDate(message.timestamp)}
          </Typography>
        </Stack>

        {/* Message Content */}
        {/* SECURITY NOTE: HTML content is pre-sanitized by smartFormatContent() using DOMPurify.
            All JavaScript, dangerous attributes, and unsafe tags are stripped before rendering.
            See: src/widgets/frontdesk/utils/html-sanitizer.ts for security configuration. */}
        <Box
          sx={{
            pl: "56px", // Align with avatar

            // Paragraphs & text
            "& p": {
              margin: 0,
              marginBottom: 1,
              lineHeight: 1.6,
              "&:last-child": {
                marginBottom: 0,
              },
            },

            // Headings
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              margin: 0,
              marginTop: 2,
              marginBottom: 1,
              fontWeight: 600,
              lineHeight: 1.3,
              "&:first-of-type": {
                marginTop: 0,
              },
            },
            "& h1": { fontSize: "1.5rem" },
            "& h2": { fontSize: "1.3rem" },
            "& h3": { fontSize: "1.1rem" },

            // Lists - CRITICAL for email bullets
            "& ul, & ol": {
              margin: 0,
              marginBottom: 1,
              paddingLeft: 3,
              lineHeight: 1.6,
            },
            "& li": {
              marginBottom: 0.5,
              lineHeight: 1.6,
            },

            // Images - CRITICAL for email banners/graphics
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 1,
              marginTop: 1,
              marginBottom: 1,
              display: "block",
            },

            // Links
            "& a": {
              color: primaryColor(600),
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },

            // Tables
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 1,
              marginBottom: 1,
            },
            "& td, & th": {
              padding: 1,
              borderBottom: `1px solid ${neutralColor(200)}`,
            },

            // Text formatting
            "& strong, & b": {
              fontWeight: 600,
            },
            "& em, & i": {
              fontStyle: "italic",
            },

            // Blockquotes
            "& blockquote": {
              borderLeft: `3px solid ${primaryColor(300)}`,
              marginLeft: 0,
              paddingLeft: 2,
              color: neutralColor(600),
              fontStyle: "italic",
            },

            // Email-specific: styled divs with backgrounds
            "& div[style*='background']": {
              borderRadius: 1,
              overflow: "hidden",
            },
          }}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ pl: "56px" }}>
            {variant === "email" && accountId ? (
              <EmailAttachmentList
                attachments={message.attachments}
                accountId={accountId}
                messageId={message.id}
              />
            ) : (
              // Generic attachment list for non-email providers
              <Stack spacing={1}>
                {message.attachments.map((attachment) => (
                  <Box
                    key={attachment.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: neutralColor(50),
                      border: `1px solid ${neutralColor(200)}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      📎 {attachment.filename}
                    </Typography>
                    <Typography variant="caption" sx={{ color: neutralColor(500) }}>
                      ({Math.round(attachment.size / 1024)} KB)
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};
