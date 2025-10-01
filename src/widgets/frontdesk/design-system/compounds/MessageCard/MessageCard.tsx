import React from 'react';
import { Box, Avatar, Typography, IconButton, Stack } from '@mui/material';
import { colorTokens, radiusTokens, semanticShadows } from '../../tokens';
import { ChannelBadge, CommunicationChannel, MessageDirection } from '../../primitives/Badge/ChannelBadge';
import { MessageStatusIndicator, MessageStatus } from '../../primitives/Badge/MessageStatusIndicator';
import { AttachmentCard } from '../AttachmentCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import { format, parseISO } from 'date-fns';

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

const formatTimestamp = (timestamp: string): string => {
  const date = parseISO(timestamp);
  return format(date, 'MMM d, yyyy h:mm a');
};

const getChannelColors = (channel: CommunicationChannel) => {
  return colorTokens.semantic.channels[channel];
};

/**
 * MessageCard Component
 *
 * Unified message display for multi-channel ticket communication.
 * Supports email, WhatsApp, SMS, phone, private notes, and internal messages.
 * Visual design adapts based on channel type and message direction.
 */
export const MessageCard: React.FC<MessageCardProps> = ({
  id,
  channel,
  direction,
  status,
  author,
  recipient,
  content,
  timestamp,
  attachments,
  isPrivate = false,
  isEdited = false,
  onReply,
  onMoreActions,
}) => {
  const channelColors = getChannelColors(channel);
  const isOutbound = direction === 'outbound';
  const isPrivateNote = channel === 'private_note';

  // Determine if this is an AI/automated response
  const isAIResponse = author.name.toLowerCase().includes('ai') || author.name.toLowerCase().includes('bot');

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 2.5,
        flexDirection: isOutbound ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <Avatar
        src={author.avatarUrl}
        sx={{
          width: 32,
          height: 32,
          fontSize: 13,
          flexShrink: 0,
          bgcolor: isOutbound ? colorTokens.primary[600] : colorTokens.neutral[400],
        }}
      >
        {author.name.charAt(0).toUpperCase()}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: isOutbound ? '75%' : '85%' }}>
        {/* AI Response Badge */}
        {isAIResponse && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                backgroundColor: colorTokens.primary[50],
                borderRadius: '4px',
                border: `1px solid ${colorTokens.primary[200]}`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
                  fill={colorTokens.primary[600]}
                />
              </svg>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colorTokens.primary[700],
                }}
              >
                Reply by {author.name}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Message Body */}
        <Box
          sx={{
            p: 2,
            backgroundColor: isPrivateNote
              ? channelColors.bg
              : isOutbound
              ? colorTokens.primary[50]
              : colorTokens.semantic.background.primary,
            border: `1px solid ${
              isPrivateNote
                ? channelColors.border
                : isOutbound
                ? colorTokens.primary[200]
                : colorTokens.neutral[200]
            }`,
            borderRadius: '12px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            ...(isPrivateNote && {
              borderLeftWidth: '4px',
              borderLeftColor: channelColors.main,
            }),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              color: colorTokens.semantic.text.primary,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
            }}
          >
            {content}
          </Typography>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  name={attachment.name}
                  size={attachment.size}
                  mimeType={attachment.mimeType}
                  previewUrl={attachment.previewUrl}
                  url={attachment.url}
                  uploadedAt={attachment.uploadedAt}
                  onPreview={() => attachment.url && window.open(attachment.url, '_blank')}
                  onDownload={() => attachment.url && window.open(attachment.url, '_blank')}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer - Timestamp and Channel */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 0.5,
            px: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 11,
            }}
          >
            {format(parseISO(timestamp), 'hh:mm a')}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            • Via{' '}
            {channel === 'whatsapp' && '💬 Whatsapp'}
            {channel === 'email' && '📧 Email'}
            {channel === 'sms' && '📱 SMS'}
            {channel === 'phone' && '📞 Phone'}
            {channel === 'private_note' && '🔒 Private Note'}
            {channel === 'internal' && '💬 Internal'}
            {channel === 'web_chat' && '💻 Web Chat'}
          </Typography>

          {status && (
            <MessageStatusIndicator status={status} size="xs" showLabel={false} />
          )}
        </Box>
      </Box>
    </Box>
  );
};