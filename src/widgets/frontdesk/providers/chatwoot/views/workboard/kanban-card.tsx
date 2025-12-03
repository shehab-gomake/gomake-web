/**
 * Kanban Card Component for Chatwoot Conversations
 * 
 * Draggable conversation card for the Kanban board.
 * Displays contact info, last message preview, priority, and time.
 * Includes quick action buttons on hover.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useCallback, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { 
  Box, 
  Typography, 
  Avatar, 
  Tooltip, 
  Stack, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  MoreVert as MoreIcon,
  CheckCircle as ResolveIcon,
  PersonAdd as AssignIcon,
  PriorityHigh as PriorityIcon,
  Snooze as SnoozeIcon,
  OpenInNew as OpenIcon,
  Flag as FlagIcon,
  LowPriority as LowPriorityIcon,
  Warning as UrgentIcon,
  ArrowUpward as HighIcon,
  Remove as MediumIcon,
  ArrowDownward as LowIcon,
} from '@mui/icons-material';

// Design system - import from centralized location
import { 
  colorTokens, 
  shadowTokens, 
  radiusTokens, 
  semanticSpacing,
  layoutTokens,
  priorityColors,
} from '@/widgets/frontdesk/design-system';

// Types
import { 
  ChatwootConversation, 
  ConversationPriority,
} from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// ============================================
// Types
// ============================================

export interface KanbanConversationCardProps {
  conversation: ChatwootConversation;
  index: number;
  agents?: Agent[];
  onClick?: (conversation: ChatwootConversation) => void;
  onResolve?: (conversation: ChatwootConversation) => void;
  onSnooze?: (conversation: ChatwootConversation) => void;
  onAssign?: (conversation: ChatwootConversation, agentId: number | null) => void;
  onPriorityChange?: (conversation: ChatwootConversation, priority: ConversationPriority) => void;
}

// ============================================
// Helper Functions
// ============================================

const formatRelativeTime = (timestamp?: number): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000); // Chatwoot uses seconds
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getPriorityColorTokens = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case 'urgent':
      return priorityColors.urgent;
    case 'high':
      return priorityColors.high;
    case 'medium':
      return priorityColors.medium;
    case 'low':
      return priorityColors.low;
    default:
      return priorityColors.none;
  }
};

const getPriorityLabel = (priority?: string): string | null => {
  if (!priority || priority === 'none') return null;
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const getChannelIcon = (channel?: string): React.ReactNode => {
  switch (channel?.toLowerCase()) {
    case 'channel::email':
    case 'email':
      return <EmailIcon sx={{ fontSize: 12 }} />;
    case 'channel::api':
    case 'api':
    case 'channel::widget':
    case 'widget':
    default:
      return <ChatIcon sx={{ fontSize: 12 }} />;
  }
};

const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const PRIORITY_OPTIONS = [
  { value: ConversationPriority.URGENT, label: 'Urgent', icon: <UrgentIcon />, color: colorTokens.error[500] },
  { value: ConversationPriority.HIGH, label: 'High', icon: <HighIcon />, color: colorTokens.warning[600] },
  { value: ConversationPriority.MEDIUM, label: 'Medium', icon: <MediumIcon />, color: colorTokens.info[500] },
  { value: ConversationPriority.LOW, label: 'Low', icon: <LowIcon />, color: colorTokens.success[500] },
  { value: ConversationPriority.NONE, label: 'None', icon: <FlagIcon />, color: colorTokens.neutral[400] },
];

// ============================================
// Component
// ============================================

const KanbanConversationCardComponent: React.FC<KanbanConversationCardProps> = ({
  conversation,
  index,
  agents = [],
  onClick,
  onResolve,
  onSnooze,
  onAssign,
  onPriorityChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [priorityMenuAnchor, setPriorityMenuAnchor] = useState<null | HTMLElement>(null);
  const [assignMenuAnchor, setAssignMenuAnchor] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger if clicking on menu
    if ((e.target as HTMLElement).closest('.card-menu')) return;
    onClick?.(conversation);
  }, [onClick, conversation]);

  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const handleResolve = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onResolve?.(conversation);
  }, [conversation, onResolve, handleMenuClose]);

  const handleSnooze = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleMenuClose();
    onSnooze?.(conversation);
  }, [conversation, onSnooze, handleMenuClose]);

  const handlePriorityMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    handleMenuClose();
    setPriorityMenuAnchor(e.currentTarget);
  }, [handleMenuClose]);

  const handlePriorityMenuClose = useCallback(() => {
    setPriorityMenuAnchor(null);
  }, []);

  const handlePrioritySelect = useCallback((priority: ConversationPriority) => {
    handlePriorityMenuClose();
    onPriorityChange?.(conversation, priority);
  }, [conversation, onPriorityChange, handlePriorityMenuClose]);

  const handleAssignMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    handleMenuClose();
    setAssignMenuAnchor(e.currentTarget);
  }, [handleMenuClose]);

  const handleAssignMenuClose = useCallback(() => {
    setAssignMenuAnchor(null);
  }, []);

  const handleAssignSelect = useCallback((agentId: number | null) => {
    handleAssignMenuClose();
    onAssign?.(conversation, agentId);
  }, [conversation, onAssign, handleAssignMenuClose]);

  const contact = conversation.meta?.sender;
  const assignee = conversation.meta?.assignee;
  const channel = conversation.meta?.channel;
  const lastMessage = conversation.last_non_activity_message;
  const priority = conversation.priority;
  const priorityTokens = getPriorityColorTokens(priority);
  const priorityLabel = getPriorityLabel(priority);
  const hasUnread = (conversation.unread_count || 0) > 0;
  const isResolved = conversation.status === 'resolved';
  
  // Get contact display info
  const contactName = contact?.name || contact?.email || 'Unknown Contact';
  const contactInitial = contactName.charAt(0).toUpperCase();
  
  // Get last message preview
  const messagePreview = truncateText(lastMessage?.content, 60);

  return (
    <Draggable draggableId={conversation.id?.toString() || ''} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            backgroundColor: colorTokens.semantic.background.primary,
            borderRadius: `${radiusTokens.md}px`,
            padding: `${semanticSpacing.component.md}px`,
            marginBottom: `${semanticSpacing.component.sm}px`,
            boxShadow: snapshot.isDragging ? shadowTokens.lg : shadowTokens.sm,
            border: `1px solid ${snapshot.isDragging ? colorTokens.primary[300] : colorTokens.semantic.border.default}`,
            borderLeft: priorityLabel 
              ? `3px solid ${priorityTokens.main}` 
              : `1px solid ${colorTokens.semantic.border.default}`,
            cursor: 'pointer',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            position: 'relative',
            opacity: isResolved ? 0.7 : 1,
            '&:hover': {
              boxShadow: shadowTokens.md,
              borderColor: colorTokens.primary[200],
            },
          }}
        >
          {/* Unread indicator */}
          {hasUnread && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: colorTokens.primary[500],
              }}
            />
          )}

          {/* Quick Actions - Show on hover */}
          {isHovered && !snapshot.isDragging && (
            <Box
              className="card-menu"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                display: 'flex',
                gap: 0.5,
                backgroundColor: alpha(colorTokens.semantic.background.primary, 0.95),
                borderRadius: `${radiusTokens.sm}px`,
                padding: '2px',
                boxShadow: shadowTokens.sm,
              }}
            >
              {!isResolved && (
                <Tooltip title="Mark Resolved">
                  <IconButton
                    size="small"
                    onClick={handleResolve}
                    sx={{
                      padding: '4px',
                      color: colorTokens.success[500],
                      '&:hover': {
                        backgroundColor: colorTokens.success[50],
                      },
                    }}
                  >
                    <ResolveIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="More Actions">
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    padding: '4px',
                    color: colorTokens.neutral[500],
                    '&:hover': {
                      backgroundColor: colorTokens.neutral[100],
                    },
                  }}
                >
                  <MoreIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Header: Contact Avatar + Name + Channel */}
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Avatar
              src={contact?.avatar_url}
              sx={{
                width: layoutTokens.avatar.sm,
                height: layoutTokens.avatar.sm,
                fontSize: '0.75rem',
                backgroundColor: colorTokens.primary[100],
                color: colorTokens.primary[700],
              }}
            >
              {contactInitial}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: colorTokens.semantic.text.primary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {contactName}
                </Typography>
                <Tooltip title={channel || 'Chat'}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: colorTokens.neutral[400],
                    }}
                  >
                    {getChannelIcon(channel)}
                  </Box>
                </Tooltip>
              </Stack>
              {contact?.email && contact.name && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.semantic.text.secondary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    fontSize: '0.7rem',
                  }}
                >
                  {contact.email}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Message Preview */}
          {messagePreview && (
            <Typography
              variant="body2"
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {messagePreview}
            </Typography>
          )}

          {/* Labels */}
          {conversation.labels && conversation.labels.length > 0 && (
            <Stack direction="row" spacing={0.5} mb={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
              {conversation.labels.slice(0, 2).map((label, idx) => (
                <Chip
                  key={idx}
                  label={label}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    backgroundColor: colorTokens.neutral[100],
                    color: colorTokens.neutral[700],
                    '& .MuiChip-label': {
                      px: 0.75,
                    },
                  }}
                />
              ))}
              {conversation.labels.length > 2 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: colorTokens.neutral[400],
                    fontSize: '0.65rem',
                    alignSelf: 'center',
                  }}
                >
                  +{conversation.labels.length - 2}
                </Typography>
              )}
            </Stack>
          )}

          {/* Footer: Assignee + Priority + Time */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* Assignee */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {assignee ? (
                <Tooltip title={assignee.name || 'Assigned'}>
                  <Avatar
                    src={assignee.thumbnail}
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: '0.6rem',
                      backgroundColor: colorTokens.success[100],
                      color: colorTokens.success[700],
                    }}
                  >
                    {assignee.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ) : (
                <Tooltip title="Unassigned">
                  <PersonIcon 
                    sx={{ 
                      fontSize: 14, 
                      color: colorTokens.neutral[400],
                    }} 
                  />
                </Tooltip>
              )}
            </Stack>

            {/* Priority + Time */}
            <Stack direction="row" alignItems="center" spacing={1}>
              {priorityLabel && (
                <Chip
                  label={priorityLabel}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    backgroundColor: priorityTokens.bg,
                    color: priorityTokens.text,
                    '& .MuiChip-label': {
                      px: 0.5,
                    },
                  }}
                />
              )}
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <AccessTimeIcon 
                  sx={{ 
                    fontSize: 11, 
                    color: colorTokens.neutral[400],
                  }} 
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    color: colorTokens.neutral[400],
                  }}
                >
                  {formatRelativeTime(conversation.last_activity_at)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Actions Menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                minWidth: 180,
                boxShadow: shadowTokens.lg,
              },
            }}
          >
            <MenuItem onClick={() => onClick?.(conversation)}>
              <ListItemIcon>
                <OpenIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Open</ListItemText>
            </MenuItem>
            
            {!isResolved && (
              <MenuItem onClick={handleResolve}>
                <ListItemIcon>
                  <ResolveIcon fontSize="small" sx={{ color: colorTokens.success[500] }} />
                </ListItemIcon>
                <ListItemText>Mark Resolved</ListItemText>
              </MenuItem>
            )}
            
            <MenuItem onClick={handleSnooze}>
              <ListItemIcon>
                <SnoozeIcon fontSize="small" sx={{ color: colorTokens.warning[500] }} />
              </ListItemIcon>
              <ListItemText>Snooze</ListItemText>
            </MenuItem>
            
            <Divider />
            
            <MenuItem onClick={handleAssignMenuOpen}>
              <ListItemIcon>
                <AssignIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Assign to...</ListItemText>
            </MenuItem>
            
            <MenuItem onClick={handlePriorityMenuOpen}>
              <ListItemIcon>
                <PriorityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Set Priority...</ListItemText>
            </MenuItem>
          </Menu>

          {/* Priority Sub-Menu */}
          <Menu
            anchorEl={priorityMenuAnchor}
            open={Boolean(priorityMenuAnchor)}
            onClose={handlePriorityMenuClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            PaperProps={{
              sx: {
                minWidth: 150,
                boxShadow: shadowTokens.lg,
              },
            }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <MenuItem 
                key={option.value} 
                onClick={() => handlePrioritySelect(option.value)}
                selected={conversation.priority === option.value}
              >
                <ListItemIcon sx={{ color: option.color }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

          {/* Assign Sub-Menu */}
          <Menu
            anchorEl={assignMenuAnchor}
            open={Boolean(assignMenuAnchor)}
            onClose={handleAssignMenuClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            PaperProps={{
              sx: {
                minWidth: 180,
                maxHeight: 300,
                boxShadow: shadowTokens.lg,
              },
            }}
          >
            <MenuItem onClick={() => handleAssignSelect(null)}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: colorTokens.neutral[400] }} />
              </ListItemIcon>
              <ListItemText>Unassign</ListItemText>
            </MenuItem>
            <Divider />
            {agents.map((agent) => (
              <MenuItem 
                key={agent.id} 
                onClick={() => handleAssignSelect(agent.id)}
                selected={assignee?.id === agent.id}
              >
                <ListItemIcon>
                  <Avatar 
                    src={agent.thumbnail} 
                    sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
                  >
                    {agent.name?.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText>{agent.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Draggable>
  );
};

export const KanbanConversationCard = memo(KanbanConversationCardComponent);
