/**
 * Ticket History Card Component
 *
 * Rich card-based UI for displaying individual conversation/ticket history
 * Shows status, priority, message preview, assignee, channel, and metadata
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens, radiusTokens } from '@/widgets/frontdesk/design-system/tokens';
import { Chip } from '@/widgets/frontdesk/design-system/primitives/Chip';
import { Avatar } from '@/widgets/frontdesk/design-system/primitives/Avatar';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import {
  AccessTime as TimeIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  WhatsApp as WhatsAppIcon,
  Flag as PriorityIcon,
} from '@mui/icons-material';

interface TicketHistoryCardProps {
  conversation: ChatwootConversation;
  onClick: (conversation: ChatwootConversation) => void;
}

/**
 * Get status color and label
 */
const getStatusInfo = (status?: string) => {
  const statusMap: Record<string, { label: string; color: 'primary' | 'success' | 'warning' | 'neutral' }> = {
    open: { label: 'Open', color: 'primary' },
    pending: { label: 'Pending', color: 'warning' },
    resolved: { label: 'Resolved', color: 'success' },
    snoozed: { label: 'Snoozed', color: 'neutral' },
  };
  return statusMap[status || 'open'] || { label: status || 'Open', color: 'neutral' };
};

/**
 * Get priority color and label
 */
const getPriorityInfo = (priority?: string | null) => {
  if (!priority) return null;

  const priorityMap: Record<string, { label: string; color: string }> = {
    urgent: { label: 'Urgent', color: colorTokens.semantic.priority.urgent },
    high: { label: 'High', color: colorTokens.semantic.priority.high },
    medium: { label: 'Medium', color: colorTokens.semantic.priority.medium },
    low: { label: 'Low', color: colorTokens.semantic.priority.low },
  };

  return priorityMap[priority.toLowerCase()] || { label: priority, color: colorTokens.neutral[600] };
};

/**
 * Get channel icon based on channel type
 */
const getChannelIcon = (channel?: string) => {
  const channelLower = channel?.toLowerCase() || '';

  if (channelLower.includes('email')) return <EmailIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes('whatsapp')) return <WhatsAppIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes('sms')) return <SmsIcon sx={{ fontSize: 12 }} />;
  if (channelLower.includes('phone')) return <PhoneIcon sx={{ fontSize: 12 }} />;

  return <ChatIcon sx={{ fontSize: 12 }} />;
};

/**
 * Format channel name for display
 */
const formatChannelName = (channel?: string) => {
  if (!channel) return 'Chat';

  // Convert from snake_case or handle special cases
  const formatted = channel
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
};

/**
 * Get relative time string
 */
const getRelativeTime = (timestamp?: number) => {
  if (!timestamp) return 'Unknown';

  const now = Date.now();
  const diff = now - timestamp * 1000; // Convert to milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;

  // For older dates, show formatted date
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Extract and clean message preview
 */
const getMessagePreview = (conversation: ChatwootConversation): string => {
  // Try to get last non-activity message
  let content = conversation.last_non_activity_message?.content;

  // Fallback to last message in messages array
  if (!content && conversation.messages && conversation.messages.length > 0) {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    content = lastMessage.content;
  }

  if (!content) return 'No messages';

  // Strip HTML tags
  const stripped = content.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  const cleaned = decoded.replace(/\s+/g, ' ').trim();

  // Truncate to ~80 characters
  if (cleaned.length > 80) {
    return cleaned.substring(0, 77) + '...';
  }

  return cleaned || 'No messages';
};

/**
 * Ticket History Card Component
 */
export const TicketHistoryCard: React.FC<TicketHistoryCardProps> = ({ conversation, onClick }) => {
  const statusInfo = getStatusInfo(conversation.status);
  const priorityInfo = getPriorityInfo(conversation.priority);
  const messagePreview = getMessagePreview(conversation);
  const relativeTime = getRelativeTime(conversation.last_activity_at || conversation.created_at);
  const channelName = formatChannelName(conversation.meta?.channel);
  const channelIcon = getChannelIcon(conversation.meta?.channel);
  const assigneeName = conversation.meta?.assignee?.name || 'Unassigned';
  const assigneeThumbnail = conversation.meta?.assignee?.thumbnail;

  // Get labels (show first 2, indicate if more)
  const labels = conversation.labels || [];
  const displayLabels = labels.slice(0, 2);
  const remainingLabels = labels.length - displayLabels.length;

  return (
    <Box
      onClick={() => onClick(conversation)}
      sx={{
        p: 1.5,
        mb: 1.5,
        backgroundColor: colorTokens.neutral[50],
        border: `1px solid ${colorTokens.semantic.border.default}`,
        borderRadius: radiusTokens.md,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: colorTokens.neutral[100],
          borderColor: colorTokens.primary[300],
          boxShadow: `0 2px 8px ${colorTokens.neutral[200]}`,
        },
      }}
    >
      {/* Header: Status and Priority */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Chip
          label={statusInfo.label}
          color={statusInfo.color}
          variant="soft"
          size="small"
        />

        {priorityInfo && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: priorityInfo.color,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <PriorityIcon sx={{ fontSize: 12 }} />
            {priorityInfo.label}
          </Box>
        )}
      </Box>

      {/* Ticket ID */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: 12,
          color: colorTokens.semantic.text.primary,
          mb: 0.5,
        }}
      >
        Ticket #{conversation.id}
      </Typography>

      {/* Message Preview */}
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          color: colorTokens.semantic.text.secondary,
          mb: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.4,
        }}
      >
        {messagePreview}
      </Typography>

      {/* Metadata Row: Assignee, Channel, Time */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: labels.length > 0 ? 1 : 0,
          flexWrap: 'wrap',
        }}
      >
        {/* Assignee */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Avatar
            size="xs"
            name={assigneeName}
            src={assigneeThumbnail}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: 10,
              color: colorTokens.semantic.text.tertiary,
            }}
          >
            {assigneeName}
          </Typography>
        </Box>

        {/* Channel */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: colorTokens.semantic.text.tertiary,
          }}
        >
          {channelIcon}
          <Typography
            variant="caption"
            sx={{ fontSize: 10 }}
          >
            {channelName}
          </Typography>
        </Box>

        {/* Time */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: colorTokens.semantic.text.tertiary,
          }}
        >
          <TimeIcon sx={{ fontSize: 12 }} />
          <Typography
            variant="caption"
            sx={{ fontSize: 10 }}
          >
            {relativeTime}
          </Typography>
        </Box>
      </Box>

      {/* Labels */}
      {labels.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
          }}
        >
          {displayLabels.map((label) => (
            <Chip
              key={label}
              label={label}
              variant="soft"
              color="neutral"
              size="small"
              sx={{ fontSize: 9, height: 18 }}
            />
          ))}
          {remainingLabels > 0 && (
            <Typography
              variant="caption"
              sx={{
                fontSize: 9,
                color: colorTokens.semantic.text.tertiary,
                fontWeight: 600,
              }}
            >
              +{remainingLabels} more
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
