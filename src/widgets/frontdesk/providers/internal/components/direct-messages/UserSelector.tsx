import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { ConversationMember, UserSelectorProps } from '../../types/direct-messages.types';

export const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  onSelect,
  onConfirm,
  onSearch,
  loading = false,
  onClose,
  open,
  onlineOnly = false,
  onToggleOnlineOnly,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<ConversationMember[]>([]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedUsers([]);
    }
  }, [open]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (user: ConversationMember) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(selected => selected.userId === user.userId);
      if (isSelected) {
        return prev.filter(selected => selected.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedUsers.length === 0) return;
    if (onConfirm) {
      onConfirm(selectedUsers);
    } else if (onSelect) {
      onSelect(selectedUsers[0]);
    }
    onClose();
  };

  const handleCancel = () => {
    setSelectedUsers([]);
    setSearchQuery('');
    onClose();
  };

  const getUserAvatar = (user: ConversationMember) => {
    return (
      <Avatar sx={{ width: 40, height: 40 }}>
        {user.firstName?.[0]}{user.lastName?.[0]}
      </Avatar>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { height: '70vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonAddIcon />
            <Typography variant="h6">Start New Conversation</Typography>
          </Stack>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              const q = e.target.value;
              setSearchQuery(q);
              if (onSearch) onSearch(q);
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={onlineOnly}
                onChange={(event) => onToggleOnlineOnly?.(event.target.checked)}
                disabled={!onToggleOnlineOnly}
              />
            }
            label="Online only"
            sx={{ m: 0 }}
          />
          {onlineOnly && (
            <Chip label="Online" size="small" color="success" sx={{ fontWeight: 500 }} />
          )}
        </Box>

        {selectedUsers.length > 0 && (
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Selected ({selectedUsers.length})
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {selectedUsers.map(user => (
                <Chip
                  key={user.userId}
                  label={user.name}
                  onDelete={() => handleUserToggle(user)}
                  size="small"
                  color="primary"
                />
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={20} />
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? 'No users found matching your search'
                  : onlineOnly
                    ? 'No team members are online right now'
                    : 'No users available'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.some(selected => selected.userId === user.userId);
                
                return (
                  <ListItem key={user.userId} disablePadding>
                    <ListItemButton
                      onClick={() => handleUserToggle(user)}
                      selected={isSelected}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.50',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        {getUserAvatar(user)}
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={user.email}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedUsers.length === 0}
          startIcon={<PersonAddIcon />}
        >
          Start Conversation
        </Button>
      </DialogActions>
    </Dialog>
  );
};
