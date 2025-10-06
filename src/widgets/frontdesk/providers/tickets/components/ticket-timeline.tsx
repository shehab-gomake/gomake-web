import React from 'react';
import { Box, Typography, Avatar, Paper, Chip as MuiChip } from '@mui/material';
import { colorTokens } from '@/widgets/frontdesk/design-system';
import { PriorityBadge } from '@/widgets/frontdesk/design-system';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { TicketHistoryEntry } from '../types/api.types';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SyncIcon from '@mui/icons-material/Sync';
import BoltIcon from '@mui/icons-material/Bolt';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import MergeIcon from '@mui/icons-material/Merge';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';

export interface TicketTimelineProps {
  history: TicketHistoryEntry[];
}

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  } catch {
    return timestamp;
  }
};

const formatDateHeader = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy');
  } catch {
    return timestamp;
  }
};

const getActionIcon = (action: string): React.ReactNode => {
  const iconProps = { sx: { fontSize: 18 } };
  const icons: Record<string, React.ReactNode> = {
    created: <ConfirmationNumberIcon {...iconProps} />,
    assigned: <PersonAddIcon {...iconProps} />,
    status_changed: <SyncIcon {...iconProps} />,
    priority_changed: <BoltIcon {...iconProps} />,
    reopened: <LockOpenIcon {...iconProps} />,
    merged: <MergeIcon {...iconProps} />,
    message_received: <ChatBubbleOutlineIcon {...iconProps} />,
    closed: <CheckCircleIcon {...iconProps} />,
    category_changed: <FolderIcon {...iconProps} />,
  };
  return icons[action] || <HistoryIcon {...iconProps} />;
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
 * TicketTimeline Component - Modern UI
 *
 * Displays the complete activity history for a ticket with a modern card-based design:
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: colorTokens.neutral[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <HistoryIcon sx={{ fontSize: 40, color: colorTokens.neutral[400] }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: colorTokens.semantic.text.primary, mb: 0.5 }}>
          No Activity Yet
        </Typography>
        <Typography variant="body2" sx={{ color: colorTokens.semantic.text.secondary, fontSize: 14 }}>
          Activity history will appear here as changes are made to this ticket
        </Typography>
      </Box>
    );
  }

  // Group events by date
  const groupedHistory: Record<string, TicketHistoryEntry[]> = {};
  history.forEach((entry) => {
    const dateKey = formatDateHeader(entry.createdAt);
    if (!groupedHistory[dateKey]) {
      groupedHistory[dateKey] = [];
    }
    groupedHistory[dateKey].push(entry);
  });

  return (
    <Box sx={{ py: 0 }}>
      {Object.entries(groupedHistory).map(([dateHeader, entries], groupIndex) => (
        <Box key={dateHeader} sx={{ mb: groupIndex < Object.keys(groupedHistory).length - 1 ? 4 : 0 }}>
          {/* Date Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1,
              py: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 12,
                color: colorTokens.semantic.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {dateHeader}
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 1,
                backgroundColor: colorTokens.neutral[200],
              }}
            />
          </Box>

          {/* Timeline Events */}
          <Box sx={{ position: 'relative', pl: 5 }}>
            {/* Vertical Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: 19,
                top: 20,
                bottom: 20,
                width: 2,
                background: `linear-gradient(to bottom, ${colorTokens.neutral[200]} 0%, ${colorTokens.neutral[100]} 100%)`,
              }}
            />

            {entries.map((entry, index) => {
              const icon = getActionIcon(entry.action);
              const color = getActionColor(entry.action);
              const isLast = index === entries.length - 1;

              return (
                <Box
                  key={entry.id}
                  sx={{
                    position: 'relative',
                    mb: isLast ? 0 : 2.5,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {/* Timeline Icon */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -38,
                      top: 12,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      border: `3px solid ${color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: color,
                      boxShadow: `0 0 0 4px ${colorTokens.neutral[50]}`,
                      zIndex: 2,
                    }}
                  >
                    {icon}
                  </Box>

                  {/* Event Card */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      backgroundColor: colorTokens.neutral[50],
                      border: `1px solid ${colorTokens.neutral[200]}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'white',
                        borderColor: color,
                        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08)`,
                        transform: 'translateX(2px)',
                      },
                    }}
                  >
                    {/* User Avatar & Name */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 14,
                          fontWeight: 600,
                          backgroundColor: color,
                          color: 'white',
                        }}
                      >
                        {(entry.user?.name || 'S').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          {formatHistoryMessage(entry)}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: colorTokens.semantic.text.tertiary,
                            fontSize: 12,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {formatTimestamp(entry.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Optional Comment */}
                    {entry.comment && entry.action !== 'reopened' && (
                      <Box
                        sx={{
                          mt: 1.5,
                          pt: 1.5,
                          borderTop: `1px solid ${colorTokens.neutral[200]}`,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: 13,
                            fontStyle: 'italic',
                            color: colorTokens.semantic.text.secondary,
                            lineHeight: 1.6,
                          }}
                        >
                          "{entry.comment}"
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
