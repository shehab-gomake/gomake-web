import React from "react";
import { Box, Avatar, Typography, Stack, Chip } from "@mui/material";
import { colorTokens } from "../../tokens";
import { CommunicationChannel, MessageDirection } from "../../primitives/Badge/ChannelBadge";
import { MessageStatusIndicator, MessageStatus } from "../../primitives/Badge/MessageStatusIndicator";
import { AttachmentCard } from "../AttachmentCard";
import { format, parseISO } from "date-fns";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";
import ComputerIcon from "@mui/icons-material/Computer";

export interface MessageCardProps {
  /** Message ID */
  id: string;

  /** Communication channel */
  channel: CommunicationChannel;

  /** Message direction */
  direction: MessageDirection;

  /** Delivery/read status */
  status?: MessageStatus;

  /** Message author */
  author: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };

  /** Message recipient (for outbound messages) */
  recipient?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };

  /** Message content */
  content: string;

  /** Content type - if provided, overrides auto-detection */
  contentType?: "text" | "html" | "markdown";

  /** Timestamp */
  timestamp: string;

  /** Attachments */
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    mimeType?: string;
    url?: string;
    previewUrl?: string;
    uploadedAt?: string;
  }>;

  /** Is this a private/internal note */
  isPrivate?: boolean;

  /** Has the message been edited */
  isEdited?: boolean;

  /** Callback for reply action */
  onReply?: () => void;

  /** Callback for more actions */
  onMoreActions?: () => void;
}

/**
 * Detects if content is HTML
 */
const isHtmlContent = (content: string): boolean => {
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
};

/**
 * Get channel display info
 */
const getChannelInfo = (
  channel: CommunicationChannel
): {
  icon: any;
  label: string;
  color: string;
  customIcon?: React.ReactNode;
} => {
  const configs: Record<string, { icon: any; label: string; color: string; customIcon?: React.ReactNode }> = {
    email: { icon: EmailIcon, label: "Email", color: colorTokens.semantic.channels.email.main },
    whatsapp: {
      icon: null,
      label: "WhatsApp",
      color: "#25D366",
      customIcon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    sms: { icon: SmsIcon, label: "SMS", color: colorTokens.semantic.channels.sms.main },
    phone: { icon: PhoneIcon, label: "Phone", color: colorTokens.semantic.channels.phone.main },
    private_note: { icon: LockIcon, label: "Private Note", color: "#F59E0B" },
    internal: { icon: ChatIcon, label: "Internal", color: colorTokens.primary[600] },
    web_chat: { icon: ComputerIcon, label: "Web Chat", color: colorTokens.primary[500] },
  };
  return configs[channel] || configs.internal;
};

/**
 * MessageCard Component - Refactored
 *
 * Clean, modern message display for multi-channel communication.
 * Improved visual hierarchy, better spacing, clearer channel identification.
 */
export const MessageCard: React.FC<MessageCardProps> = ({
  id,
  channel,
  direction,
  status,
  author,
  content,
  contentType,
  timestamp,
  attachments,
  isPrivate = false,
  isEdited = false,
}) => {
  const isOutbound = direction === "outbound";
  const isPrivateNote = channel === "private_note";
  const isHtml = contentType === "html" || (contentType === undefined && isHtmlContent(content));
  const hasContent = content && content.trim().length > 0;
  const channelInfo = getChannelInfo(channel);
  const isAIResponse = author.name.toLowerCase().includes("ai") || author.name.toLowerCase().includes("bot");

  // Channel Icon Component
  const ChannelIcon = channelInfo.icon;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexDirection: isOutbound ? "row-reverse" : "row",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      <Avatar
        src={author.avatarUrl}
        sx={{
          width: 40,
          height: 40,
          fontSize: 15,
          flexShrink: 0,
          bgcolor: isOutbound ? colorTokens.primary[600] : isPrivateNote ? "#F59E0B" : colorTokens.neutral[500],
          fontWeight: 600,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {author.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Message Container */}
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: isOutbound ? "70%" : "80%" }}>
        {/* Header: Author + Channel + Time */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1,
            flexWrap: "wrap",
          }}
        >
          {/* Author Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: colorTokens.semantic.text.primary,
            }}
          >
            {author.name}
          </Typography>

          {/* AI Badge */}
          {isAIResponse && (
            <Chip
              icon={
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4 }}>
                  <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" fill="#8B5CF6" />
                </svg>
              }
              label="AI"
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "#F3E8FF",
                color: "#8B5CF6",
                border: "1px solid #E9D5FF",
                "& .MuiChip-icon": {
                  marginLeft: "4px",
                  marginRight: "-4px",
                },
              }}
            />
          )}

          {/* Channel Badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.25,
              backgroundColor: isPrivateNote ? "#FEF3C7" : `${channelInfo.color}15`,
              borderRadius: "4px",
              border: `1px solid ${isPrivateNote ? "#FCD34D" : `${channelInfo.color}40`}`,
            }}
          >
            {channelInfo.customIcon || (ChannelIcon && <ChannelIcon sx={{ fontSize: 12, color: channelInfo.color }} />)}
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: channelInfo.color,
                lineHeight: 1,
              }}
            >
              {channelInfo.label}
            </Typography>
          </Box>

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              color: colorTokens.semantic.text.tertiary,
              marginLeft: "auto",
              fontWeight: 400,
            }}
          >
            {format(parseISO(timestamp), "MMM d, h:mm a")}
          </Typography>
        </Box>

        {/* Message Body */}
        <Box
          sx={{
            position: "relative",
            p: 2,
            backgroundColor: isPrivateNote ? "#FFFBEB" : isOutbound ? colorTokens.primary[50] : "#FFFFFF",
            border: `1px solid ${isPrivateNote ? "#FCD34D" : isOutbound ? colorTokens.primary[200] : colorTokens.neutral[200]}`,
            borderRadius: "8px",
            boxShadow: isPrivateNote ? "0 1px 3px rgba(251, 191, 36, 0.1)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
            // Private note left accent
            ...(isPrivateNote && {
              borderLeft: `3px solid #F59E0B`,
            }),
          }}
        >
          {/* Message Content */}
          {hasContent ? (
            <Box
              sx={{
                "& p": {
                  margin: 0,
                  marginBottom: "0.75em",
                  "&:last-child": {
                    marginBottom: 0,
                  },
                },
                "& a": {
                  color: colorTokens.primary[600],
                  textDecoration: "underline",
                  fontWeight: 500,
                  "&:hover": {
                    color: colorTokens.primary[700],
                  },
                },
                "& ul, & ol": {
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                  paddingLeft: "1.5em",
                },
                "& li": {
                  marginBottom: "0.25em",
                },
                fontSize: 14,
                color: colorTokens.semantic.text.primary,
                lineHeight: 1.6,
                whiteSpace: isHtml ? "normal" : "pre-wrap",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={isHtml ? { __html: content } : undefined}
            >
              {/* {!isHtml && content} */}
            </Box>
          ) : (
            <Typography
              variant="body2"
              sx={{
                fontSize: 13,
                color: colorTokens.semantic.text.tertiary,
                fontStyle: "italic",
              }}
            >
              (No message content)
            </Typography>
          )}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${
                  isPrivateNote ? "#FCD34D" : isOutbound ? colorTokens.primary[100] : colorTokens.neutral[200]
                }`,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 1.5,
              }}
            >
              {attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  name={attachment.name}
                  size={attachment.size}
                  mimeType={attachment.mimeType}
                  previewUrl={attachment.previewUrl}
                  url={attachment.url}
                  uploadedAt={attachment.uploadedAt}
                  onPreview={() => attachment.url && window.open(attachment.url, "_blank")}
                  onDownload={() => attachment.url && window.open(attachment.url, "_blank")}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer: Status & Edited Indicator */}
        {(status || isEdited) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 0.75,
              px: 0.5,
            }}
          >
            {status && <MessageStatusIndicator status={status} size="xs" showLabel={true} />}

            {isEdited && (
              <>
                {status && (
                  <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary, fontSize: 11 }}>
                    •
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.tertiary,
                    fontSize: 11,
                    fontStyle: "italic",
                  }}
                >
                  (edited)
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};
