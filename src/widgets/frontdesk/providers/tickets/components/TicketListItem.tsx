import React from 'react';
import { Box, Checkbox, Typography, Chip, Avatar, AvatarGroup, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Ticket } from '../types/ticket.types';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

interface TicketListItemProps {
  ticket: Ticket;
  selected?: boolean;
  checked?: boolean;
  onSelect: (ticketId: string) => void;
  onCheck?: (ticketId: string, checked: boolean) => void;
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'Urgent':
    case 'High':
      return <SentimentVeryDissatisfiedIcon fontSize="small" sx={{ color: '#DC2626' }} />;
    case 'Medium':
      return <SentimentNeutralIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
    case 'Low':
      return <SentimentSatisfiedAltIcon fontSize="small" sx={{ color: '#10B981' }} />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'To Do':
      return { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' };
    case 'In Progress':
      return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
    case 'Done':
      return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
    case 'Blocked':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
    default:
      return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
  }
};

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM d');
  }
};

export const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  selected = false,
  checked = false,
  onSelect,
  onCheck
}) => {
  const theme = useTheme();
  const statusColors = getStatusColor(ticket.status);

  return (
    <Box
      onClick={() => onSelect(ticket.id)}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: selected ? '#F9FAFB' : 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: '#F9FAFB'
        }
      }}
    >
      {/* Checkbox */}
      <Checkbox
        size="small"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onCheck?.(ticket.id, e.target.checked);
        }}
        sx={{ p: 0, mt: 0.5 }}
      />

      {/* Ticket Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.secondary,
              fontSize: '0.75rem'
            }}
          >
            {ticket.ticketNumber}
          </Typography>
          <Chip
            label={ticket.status}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.688rem',
              fontWeight: 500,
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              border: `1px solid ${statusColors.border}`,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: theme.palette.text.primary,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {ticket.title}
        </Typography>

        {/* Footer Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Priority Icon */}
            {getPriorityIcon(ticket.priority)}

            {/* Participants */}
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 20, height: 20, fontSize: '0.688rem' } }}>
              {ticket.participants.map((participant) => (
                <Avatar
                  key={participant.userId}
                  alt={participant.name}
                  src={participant.avatarUrl}
                  sx={{ width: 20, height: 20 }}
                >
                  {participant.name.charAt(0)}
                </Avatar>
              ))}
            </AvatarGroup>

            {/* Date */}
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontSize: '0.688rem' }}>
              {formatDate(ticket.updatedAt)}
            </Typography>
          </Box>

          {/* Unread indicator */}
          {ticket.isUnread && (
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: theme.palette.error.main
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};