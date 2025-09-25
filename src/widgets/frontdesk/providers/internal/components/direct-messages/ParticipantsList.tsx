import React from 'react';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ConversationMember, DMPresenceData } from '../../types/direct-messages.types';

interface ParticipantsListProps {
  members: ConversationMember[];
  currentUserId?: string;
  userPresence: Record<string, DMPresenceData>;
  conversationType: 'DM' | 'GROUP_DM';
  onAddMember?: () => void;
  onRemoveMember?: (userId: string) => void;
  maxVisible?: number;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  members,
  currentUserId,
  userPresence,
  conversationType,
  onAddMember,
  onRemoveMember,
  maxVisible = 3,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMemberStatus = (member: ConversationMember) => {
    const presence = userPresence[member.userId];
    return presence?.status || 'offline';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'away':
        return '#FF9800';
      case 'busy':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getMemberAvatar = (member: ConversationMember) => {
    return (
      <Avatar 
        sx={{ 
          width: 32, 
          height: 32,
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {member.firstName?.[0]}{member.lastName?.[0]}
      </Avatar>
    );
  };

  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = members.length - maxVisible;

  const renderMemberChip = (member: ConversationMember, showStatus = true) => {
    const status = getMemberStatus(member);
    const isCurrentUser = member.userId === currentUserId;
    
    return (
      <Chip
        key={member.userId}
        avatar={
          <Box sx={{ position: 'relative' }}>
            {getMemberAvatar(member)}
            {showStatus && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(status),
                  border: '2px solid white',
                }}
              />
            )}
          </Box>
        }
        label={
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {isCurrentUser ? 'You' : member.name}
          </Typography>
        }
        size="small"
        variant="outlined"
        sx={{
          height: 32,
          '& .MuiChip-avatar': {
            width: 32,
            height: 32,
            marginLeft: 0,
          },
          '& .MuiChip-label': {
            paddingLeft: 1,
            paddingRight: 1,
          },
        }}
      />
    );
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        {/* Conversation type icon */}
        <Tooltip title={conversationType === 'DM' ? 'Direct Message' : 'Group Chat'}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {conversationType === 'DM' ? (
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                <GroupIcon sx={{ fontSize: 16 }} />
              </Avatar>
            ) : (
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                <GroupIcon sx={{ fontSize: 16 }} />
              </Avatar>
            )}
          </Box>
        </Tooltip>

        {/* Member chips */}
        {visibleMembers.map(member => renderMemberChip(member))}
        
        {/* Remaining count */}
        {remainingCount > 0 && (
          <Chip
            label={`+${remainingCount}`}
            size="small"
            variant="outlined"
            onClick={handleClick}
            sx={{
              height: 32,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        )}

        {/* More button for group chats */}
        {conversationType === 'GROUP_DM' && (
          <IconButton
            size="small"
            onClick={handleClick}
            sx={{
              width: 32,
              height: 32,
              ml: 0.5,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {/* Participants popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Participants ({members.length})
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <List dense>
            {members.map((member, index) => {
              const status = getMemberStatus(member);
              const isCurrentUser = member.userId === currentUserId;
              
              return (
                <React.Fragment key={member.userId}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Box sx={{ position: 'relative' }}>
                        {getMemberAvatar(member)}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(status),
                            border: '2px solid white',
                          }}
                        />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {isCurrentUser ? 'You' : member.name}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            {member.email}
                          </Typography>
                          <Chip
                            label={status}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.65rem',
                              textTransform: 'capitalize',
                              backgroundColor: getStatusColor(status),
                              color: 'white',
                            }}
                          />
                        </Stack>
                      }
                    />
                    {conversationType === 'GROUP_DM' && !isCurrentUser && onRemoveMember && (
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => onRemoveMember(member.userId)}
                          sx={{ opacity: 0.7 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < members.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>

          {conversationType === 'GROUP_DM' && onAddMember && (
            <>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ textAlign: 'center', pt: 1 }}>
                <IconButton
                  onClick={() => {
                    onAddMember();
                    handleClose();
                  }}
                  sx={{
                    backgroundColor: 'primary.50',
                    '&:hover': {
                      backgroundColor: 'primary.100',
                    },
                  }}
                >
                  <PersonAddIcon />
                </IconButton>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Add participant
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};