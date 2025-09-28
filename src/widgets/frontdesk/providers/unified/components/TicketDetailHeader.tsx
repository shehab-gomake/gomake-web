import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  ButtonGroup,
  Avatar,
  Stack,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Assignment as AssignIcon,
  Edit as EditIcon,
  Note as NoteIcon,
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { UnifiedConversation, TicketStatus, TicketPriority } from '../types/unified.types';

interface TicketDetailHeaderProps {
  conversation: UnifiedConversation;
  onReply?: () => void;
  onAssign?: (assigneeId: string) => void;
  onStatusChange?: (status: TicketStatus) => void;
  onPriorityChange?: (priority: TicketPriority) => void;
  onAddNote?: () => void;
  availableAgents?: Array<{ id: string; name: string; email: string; avatar?: string }>;
  ticketHistory?: Array<any>;
  loading?: {
    assigning?: boolean;
    updatingStatus?: boolean;
    updatingPriority?: boolean;
  };
}

export const TicketDetailHeader: React.FC<TicketDetailHeaderProps> = ({
  conversation,
  onReply,
  onAssign,
  onStatusChange,
  onPriorityChange,
  onAddNote,
  availableAgents = [],
  ticketHistory = [],
  loading = {}
}) => {
  const theme = useTheme();
  const [historyExpanded, setHistoryExpanded] = useState(false);

  // Don't render if not a ticket
  if (!conversation.isTicket) {
    return null;
  }

  // Get status color
  const getStatusColor = (status?: TicketStatus) => {
    switch (status) {
      case 'OPEN': return theme.palette.error.main;
      case 'PENDING': return theme.palette.warning.main;
      case 'IN_PROGRESS': return theme.palette.info.main;
      case 'RESOLVED': return theme.palette.success.main;
      case 'CLOSED': return theme.palette.grey[500];
      case 'REOPENED': return theme.palette.error.main;
      default: return theme.palette.grey[400];
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.info.main;
      default: return theme.palette.grey[400];
    }
  };

  // Get SLA status color and text
  const getSLAInfo = (sla?: any) => {
    if (!sla) return { color: theme.palette.grey[400], text: 'No SLA' };

    switch (sla.status) {
      case 'breached':
        return { color: theme.palette.error.main, text: 'SLA Breached' };
      case 'at-risk':
        const timeLeft = sla.firstResponseDue ?
          Math.max(0, Math.floor((new Date(sla.firstResponseDue).getTime() - Date.now()) / (1000 * 60 * 60)))
          : 0;
        return { color: theme.palette.warning.main, text: `Due in ${timeLeft}h` };
      case 'normal':
        return { color: theme.palette.success.main, text: 'On Track' };
      default:
        return { color: theme.palette.grey[400], text: 'Unknown' };
    }
  };

  const slaInfo = getSLAInfo(conversation.sla);

  return (
    <Card
      sx={{
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1]
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        {/* Title Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              #{conversation.ticketNumber} – {conversation.name}
            </Typography>

            {/* Status and Priority */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={conversation.ticketStatus || 'OPEN'}
                  onChange={(e) => onStatusChange?.(e.target.value as TicketStatus)}
                  disabled={loading.updatingStatus}
                  sx={{
                    '& .MuiSelect-select': {
                      backgroundColor: getStatusColor(conversation.ticketStatus),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      py: 0.5
                    }
                  }}
                >
                  <MenuItem value="OPEN">OPEN</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                  <MenuItem value="RESOLVED">RESOLVED</MenuItem>
                  <MenuItem value="CLOSED">CLOSED</MenuItem>
                  <MenuItem value="REOPENED">REOPENED</MenuItem>
                </Select>
              </FormControl>

              <Chip
                icon={<FlagIcon sx={{ fontSize: '16px !important' }} />}
                label={conversation.priority || 'low'}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(conversation.priority),
                  color: 'white',
                  textTransform: 'uppercase',
                  fontWeight: 600
                }}
              />
            </Stack>
          </Box>

          {/* Action Buttons */}
          <ButtonGroup size="small" variant="outlined">
            <Button
              startIcon={<ReplyIcon />}
              onClick={onReply}
              disabled={conversation.ticketStatus === 'CLOSED'}
            >
              Reply
            </Button>
            <Button
              startIcon={<AssignIcon />}
              disabled={loading.assigning}
            >
              Assign
            </Button>
            <Button
              startIcon={<NoteIcon />}
              onClick={onAddNote}
            >
              Note
            </Button>
          </ButtonGroup>
        </Box>

        {/* Meta Information Row */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {/* Assignee */}
          {conversation.assigneeName ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {conversation.assigneeName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {conversation.assigneeName}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Unassigned
            </Typography>
          )}

          {/* Category */}
          {conversation.categoryName && (
            <Chip
              label={conversation.categoryName}
              size="small"
              variant="outlined"
            />
          )}

          {/* Tags */}
          {conversation.ticketTags?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}

          {/* SLA Indicator */}
          <Chip
            icon={<ScheduleIcon sx={{ fontSize: '14px !important' }} />}
            label={slaInfo.text}
            size="small"
            sx={{
              backgroundColor: slaInfo.color,
              color: 'white',
              ml: 'auto'
            }}
          />
        </Stack>

        {/* Ticket History Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            size="small"
            startIcon={<HistoryIcon />}
            endIcon={<ExpandMoreIcon sx={{
              transform: historyExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }} />}
            onClick={() => setHistoryExpanded(!historyExpanded)}
            sx={{ color: 'text.secondary' }}
          >
            Ticket History ({ticketHistory.length})
          </Button>
        </Box>

        {/* Collapsible History */}
        <Collapse in={historyExpanded}>
          <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
            <List dense>
              {ticketHistory.map((event, index) => (
                <React.Fragment key={event.id || index}>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Avatar sx={{ width: 20, height: 20, fontSize: '0.6rem' }}>
                        {event.userName?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>{event.userName}</strong> {event.action}
                          {event.oldValue && event.newValue && (
                            <span> from <em>{event.oldValue}</em> to <em>{event.newValue}</em></span>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.createdAt).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < ticketHistory.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
              {ticketHistory.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary">
                        No history available
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TicketDetailHeader;