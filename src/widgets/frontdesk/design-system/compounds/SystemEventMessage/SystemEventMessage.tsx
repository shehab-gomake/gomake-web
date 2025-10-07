import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens } from '../../tokens';
import { PriorityBadge } from '../../primitives/Badge/PriorityBadge';
import { format, parseISO } from 'date-fns';

export type SystemEventType =
  | 'ticket.assigned'
  | 'ticket.priority.changed'
  | 'ticket.status.changed'
  | 'ticket.reopened'
  | 'ticket.merged'
  | 'ticket.created';

export interface SystemEventMessageProps {
  /** Event type */
  type: SystemEventType;

  /** Event timestamp */
  timestamp: string;

  /** Actor who performed the action */
  actor?: {
    name: string;
  };

  /** Event-specific data */
  data?: {
    // For priority changes
    oldPriority?: 'Urgent' | 'High' | 'Medium' | 'Low';
    newPriority?: 'Urgent' | 'High' | 'Medium' | 'Low';

    // For status changes
    oldStatus?: string;
    newStatus?: string;

    // For assignments
    assigneeName?: string;

    // Generic message
    message?: string;
  };
}

const formatTimestamp = (timestamp: string): string => {
  const date = parseISO(timestamp);
  return format(date, 'hh:mm a');
};

const getEventMessage = (event: SystemEventMessageProps): React.ReactNode => {
  const { type, actor, data } = event;

  switch (type) {
    case 'ticket.assigned':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {actor?.name}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            has connected to take over ticket
          </Typography>
        </>
      );

    case 'ticket.priority.changed':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {actor?.name}
          </Typography>
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            Ticket change priority to
          </Typography>
          {data?.newPriority && (
            <PriorityBadge
              priority={data.newPriority}
              mode="both"
              size="sm"
              showBackground={true}
            />
          )}
        </Box>
      );

    case 'ticket.status.changed':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {actor?.name}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            changed status from
          </Typography>
          {' '}
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {data?.oldStatus}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            to
          </Typography>
          {' '}
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {data?.newStatus}
          </Typography>
        </>
      );

    case 'ticket.created':
      return (
        <>
          <Typography component="span" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary }}>
            {actor?.name}
          </Typography>
          {' '}
          <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
            created this ticket
          </Typography>
        </>
      );

    default:
      return (
        <Typography component="span" sx={{ color: colorTokens.semantic.text.secondary }}>
          {data?.message || 'System event'}
        </Typography>
      );
  }
};

/**
 * SystemEventMessage Component
 *
 * Displays system events in the ticket timeline (assignments, priority changes, status updates)
 * with a clean, minimal design that doesn't compete with actual messages.
 */
export const SystemEventMessage: React.FC<SystemEventMessageProps> = (props) => {
  const { timestamp } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        my: 2,
        px: 2,
      }}
    >
      {/* Icon/Visual Separator */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: colorTokens.neutral[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V8M8 8V13M8 8H13M8 8H3"
              stroke={colorTokens.neutral[400]}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Box>
      </Box>

      {/* Event Message */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {getEventMessage(props)}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.semantic.text.tertiary,
            fontSize: 11,
            whiteSpace: 'nowrap',
          }}
        >
          {formatTimestamp(timestamp)}
        </Typography>
      </Box>
    </Box>
  );
};
