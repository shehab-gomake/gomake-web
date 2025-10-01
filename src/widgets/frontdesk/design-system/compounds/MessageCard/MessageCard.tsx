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
        mb: 2,
        flexDirection: isOutbound ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <Avatar
        src={author.avatarUrl}
        sx={{
          width: 36,
          height: 36,
          fontSize: 14,
          flexShrink: 0,
          bgcolor: isOutbound ? colorTokens.primary[600] : colorTokens.neutral[500],
          fontWeight: 600,
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
              : '#FFFFFF',
            border: `1px solid ${
              isPrivateNote
                ? channelColors.border
                : isOutbound
                ? colorTokens.primary[200]
                : colorTokens.neutral[300]
            }`,
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
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
            gap: 1,
            mt: 0.75,
            px: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 11,
              fontWeight: 400,
            }}
          >
            {format(parseISO(timestamp), 'hh:mm a')}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 11,
            }}
          >
            •
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontWeight: 400,
            }}
          >
            Via{' '}
            {channel === 'whatsapp' && (
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Whatsapp
              </Box>
            )}
            {channel === 'email' && '📧 Email'}
            {channel === 'sms' && '📱 SMS'}
            {channel === 'phone' && '📞 Phone'}
            {channel === 'private_note' && '🔒 Private Note'}
            {channel === 'internal' && '💬 Internal'}
            {channel === 'web_chat' && '💻 Web Chat'}
          </Typography>

          {status && (
            <>
              <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary, fontSize: 11 }}>
                •
              </Typography>
              <MessageStatusIndicator status={status} size="xs" showLabel={false} />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};