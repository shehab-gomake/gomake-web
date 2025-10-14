import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  Close as CloseIcon,
  Search as SearchIcon,
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
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm('');
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

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        <AvatarGroup
          max={maxVisible}
          total={members.length}
          onClick={handleClickOpen}
          sx={{
            cursor: 'pointer',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              fontWeight: 500,
              border: '2px solid white',
            },
          }}
          renderSurplus={(surplus) => (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.875rem',
                fontWeight: 500,
                backgroundColor: 'grey.300',
                color: 'text.primary',
                border: '2px solid white',
              }}
            >
              +{surplus}
            </Avatar>
          )}
        >
          {members.map(member => (
            <Tooltip key={member.userId} title={member.userId === currentUserId ? 'You' : member.name}>
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
                    backgroundColor: getStatusColor(getMemberStatus(member)),
                    border: '2px solid white',
                  }}
                />
              </Box>
            </Tooltip>
          ))}
        </AvatarGroup>

        {conversationType === 'GROUP_DM' && onAddMember && (
          <Tooltip title="Add participant">
            <IconButton
              size="small"
              onClick={onAddMember}
              sx={{
                width: 32,
                height: 32,
                ml: 0.5,
                border: '1px dashed grey',
              }}
            >
              <PersonAddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Participants ({members.length})
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <List dense sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
            {filteredMembers.map((member, index) => {
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
                        <Typography variant="caption" color="text.secondary">
                          {member.email}
                        </Typography>
                      }
                    />
                    {conversationType === 'GROUP_DM' && !isCurrentUser && onRemoveMember && (
                      <ListItemSecondaryAction>
                        <Tooltip title="Remove from group">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => onRemoveMember(member.userId)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < filteredMembers.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </DialogContent>
        {conversationType === 'GROUP_DM' && onAddMember && (
          <DialogActions sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => {
                onAddMember();
                handleClose();
              }}
            >
              Add Participant
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};