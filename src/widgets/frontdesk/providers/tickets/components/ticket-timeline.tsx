import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { PriorityBadge } from '@/widgets/frontdesk/design-system';
import { format, parseISO } from 'date-fns';
import { TicketHistoryEntry } from '../types/api.types';

export interface TicketTimelineProps {
  history: TicketHistoryEntry[];
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    return format(date, 'MMM d, h:mm a');
  } catch {
    return timestamp;
  }
};

const getActionIcon = (action: string): string => {
  const icons: Record<string, string> = {
    created: '🎫',
    assigned: '👤',
    status_changed: '🔄',
    priority_changed: '⚡',
    reopened: '🔓',
    merged: '🔗',
    message_received: '💬',
    closed: '✅',
    category_changed: '📁',
  };
  return icons[action] || '📝';
};

const getActionColor = (action: string): string => {
  const colors: Record<string, string> = {
    created: colorTokens.primary[500],
    assigned: colorTokens.primary[600],
    status_changed: colorTokens.warning[600],
    priority_changed: colorTokens.error[600],
    reopened: colorTokens.warning[500],
    merged: colorTokens.neutral[600],
    closed: colorTokens.success[600],
    category_changed: colorTokens.primary[500],
  };
  return colors[action] || colorTokens.neutral[500];
};

const formatHistoryMessage = (entry: TicketHistoryEntry): React.ReactNode => {
  const { action, oldValue, newValue, comment, user } = entry;
  const userName = user?.name || 'System';

  switch (action) {
    case 'created':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            created this ticket
            {newValue?.source && ` from ${newValue.source}`}
          </Typography>
        </>
      );

    case 'assigned':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            {oldValue ? `reassigned from ${oldValue.name} to agent` : 'assigned ticket to agent'}
          </Typography>
        </>
      );

    case 'status_changed':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            changed status from
          </Typography>
          {' '}
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {String(oldValue?.status) || 'unknown'}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            to
          </Typography>
          {' '}
          <Typography component="span" sx={{ fontWeight: 600, color: getActionColor('status_changed') }}>
            {String(newValue?.status) || 'unknown'}
          </Typography>
        </>
      );

    case 'priority_changed':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            changed priority to
          </Typography>
          {newValue?.priority && (
            <PriorityBadge
              priority={newValue.priority as any}
              mode="both"
              size="sm"
              showBackground={true}
            />
          )}
        </Box>
      );

    case 'reopened':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            reopened this ticket
          </Typography>
          {comment && comment !== `Status changed to REOPENED` && (
            <>
              {' - '}
              <Typography component="span" sx={{ fontStyle: 'italic', color: colorTokens.semantic.text.tertiary }}>
                {comment}
              </Typography>
            </>
          )}
        </>
      );

    case 'merged':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            {comment || 'merged this ticket'}
          </Typography>
        </>
      );

    case 'closed':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            closed this ticket
          </Typography>
        </>
      );

    case 'category_changed':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {userName}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            changed category
            {oldValue?.category && ` from ${String(oldValue.category)}`}
            {newValue?.category && ` to ${String(newValue.category)}`}
          </Typography>
        </>
      );

    case 'message_received':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            Customer
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            sent a message via {String(newValue?.channel) || 'email'}
          </Typography>
        </>
      );

    default:
      return (
        <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
          {comment || 'System event'}
        </Typography>
      );
  }
};

/**
 * TicketTimeline Component
 *
 * Displays the complete activity history for a ticket, including:
 * - Ticket creation
 * - Status changes
 * - Assignment changes
 * - Priority updates
 * - Reopening events
 * - Merging events
 */
export const TicketTimeline: React.FC<TicketTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 13 }}>
          No activity yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      {history.map((entry, index) => {
        const icon = getActionIcon(entry.action);
        const color = getActionColor(entry.action);
        const isLast = index === history.length - 1;

        return (
          <Box key={entry.id} sx={{ position: 'relative', pl: 4, pb: isLast ? 0 : 3 }}>
            {/* Timeline Line */}
            {!isLast && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 13,
                  top: 32,
                  bottom: 0,
                  width: 2,
                  backgroundColor: colorTokens.neutral[200],
                }}
              />
            )}

            {/* Timeline Dot/Icon */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 4,
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'white',
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              {icon}
            </Box>

            {/* Event Content */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                {formatHistoryMessage(entry)}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.tertiary,
                  fontSize: 11,
                  display: 'block',
                }}
              >
                {formatTimestamp(entry.createdAt)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
