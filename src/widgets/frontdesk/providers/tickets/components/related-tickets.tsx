import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens, Chip, PriorityBadge, ChannelBadge } from '@/widgets/frontdesk/design-system';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { RelatedTicket, TicketStatus, ChannelType } from '../types/api.types';
import { apiStatusToUi, apiPriorityToUi } from '../types/transformers';

export interface RelatedTicketsProps {
  /** Related tickets from the same customer */
  relatedTickets: RelatedTicket[];

  /** Callback when a ticket is clicked */
  onTicketClick?: (ticketId: string) => void;

  /** Maximum number of tickets to display */
  maxDisplay?: number;
}

const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
};

const getStatusColor = (status: TicketStatus): 'primary' | 'warning' | 'success' | 'error' | 'neutral' => {
  const uiStatus = apiStatusToUi(status);

  if (uiStatus === 'To Do') return 'primary';
  if (uiStatus === 'In Progress') return 'warning';
  if (uiStatus === 'Done') return 'success';
  if (uiStatus === 'Blocked') return 'error';
  return 'neutral';
};

/**
 * RelatedTickets Component
 *
 * Displays previous tickets from the same customer (matched by email or phone).
 * Provides context for agents to see customer history and identify recurring issues.
 */
export const RelatedTickets: React.FC<RelatedTicketsProps> = ({
  relatedTickets,
  onTicketClick,
  maxDisplay = 5,
}) => {
  if (!relatedTickets || relatedTickets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 13, mb: 1 }}>
          No previous tickets from this customer
        </Typography>
        <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary, fontSize: 11 }}>
          This is their first interaction
        </Typography>
      </Box>
    );
  }

  // Group tickets by channel for multi-channel customer insights
  const ticketsByChannel = relatedTickets.reduce((acc, ticket) => {
    const channel = ticket.originProviderChannel?.type || 'UNKNOWN';
    if (!acc[channel]) acc[channel] = [];
    acc[channel].push(ticket);
    return acc;
  }, {} as Record<string, RelatedTicket[]>);

  const channels = Object.keys(ticketsByChannel);
  const isMultiChannel = channels.length > 1;

  const displayTickets = relatedTickets.slice(0, maxDisplay);
  const hasMore = relatedTickets.length > maxDisplay;

  return (
    <Box>
      {/* Multi-channel customer indicator */}
      {isMultiChannel && (
        <Box sx={{ mb: 2, px: 1.5, py: 1, backgroundColor: colorTokens.primary[50], borderRadius: '6px', border: `1px solid ${colorTokens.primary[200]}` }}>
          <Typography variant="caption" sx={{ color: colorTokens.primary[700], fontSize: 12, fontWeight: 600 }}>
            Multi-channel customer · {channels.length} channels
          </Typography>
          <Typography variant="caption" sx={{ color: colorTokens.primary[600], fontSize: 11, display: 'block', mt: 0.5 }}>
            This customer has contacted support via multiple channels
          </Typography>
        </Box>
      )}

      {displayTickets.map((ticket) => {
        const uiStatus = apiStatusToUi(ticket.status);
        const uiPriority = apiPriorityToUi(ticket.priority);
        const statusColor = getStatusColor(ticket.status);

        return (
          <Box
            key={ticket.id}
            onClick={() => onTicketClick?.(ticket.id)}
            sx={{
              mb: 1.5,
              p: 1.5,
              backgroundColor: colorTokens.neutral[50],
              borderRadius: '8px',
              border: `1px solid ${colorTokens.semantic.border.default}`,
              cursor: onTicketClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              '&:hover': onTicketClick
                ? {
                    backgroundColor: colorTokens.neutral[100],
                    borderColor: colorTokens.primary[300],
                    transform: 'translateY(-1px)',
                    boxShadow: `0 2px 8px ${colorTokens.neutral[200]}`,
                  }
                : {},
            }}
          >
            {/* Header: Ticket Number + Channel + Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: colorTokens.primary[700],
                  }}
                >
                  #{ticket.ticketNumber}
                </Typography>
                {/* Channel Badge */}
                {ticket.originProviderChannel && (
                  <ChannelBadge
                    channel={ticket.originProviderChannel.type.toLowerCase() as any}
                    mode="icon"
                    size="xs"
                  />
                )}
              </Box>
              <Chip
                label={uiStatus}
                color={statusColor}
                variant="soft"
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Customer Info */}
            {(ticket.customerEmail || ticket.customerPhone) && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: 12,
                  color: colorTokens.semantic.text.secondary,
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {ticket.customerEmail || ticket.customerPhone}
              </Typography>
            )}

            {/* Metadata Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {/* Priority Badge */}
              <PriorityBadge
                priority={uiPriority as any}
                mode="icon"
                size="sm"
                showBackground={false}
              />

              {/* Created Time */}
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.tertiary,
                  fontSize: 11,
                }}
              >
                {formatRelativeTime(ticket.createdAt)}
              </Typography>
            </Box>
          </Box>
        );
      })}

      {/* Show More Button */}
      {hasMore && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="caption" sx={{ color: colorTokens.semantic.text.tertiary, fontSize: 11 }}>
            +{relatedTickets.length - maxDisplay} more tickets
          </Typography>
        </Box>
      )}
    </Box>
  );
};
