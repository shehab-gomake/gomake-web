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
  Grid,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  Divider,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  PeopleOutline as PeopleOutlineIcon,
  GroupAdd as GroupAddIcon,
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

  const getUserAvatar = (user: ConversationMember, size = 40) => {
    return (
      <Avatar sx={{ width: size, height: size, fontSize: size > 32 ? '1rem' : '0.8rem' }}>
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
        sx: { height: '70vh', maxHeight: '600px', borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <GroupAddIcon color="primary" />
            <Typography variant="h6">Create a conversation</Typography>
          </Stack>
          <IconButton onClick={handleCancel} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Grid container sx={{ flex: 1, overflow: 'hidden' }}>
          {/* Left side: User list and search */}
          <Grid item xs={7} sx={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={onlineOnly}
                      onChange={(event) => onToggleOnlineOnly?.(event.target.checked)}
                      disabled={!onToggleOnlineOnly}
                    />
                  }
                  label="Online"
                  sx={{ whiteSpace: 'nowrap' }}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: '3px' } }}>
              {loading ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1 }}>Loading users...</Typography>
                </Box>
              ) : filteredUsers.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', mt: 4 }}>
                  <PeopleOutlineIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {searchQuery
                      ? 'No users found'
                      : 'No users available'}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {filteredUsers.map(user => {
                    const isSelected = selectedUsers.some(selected => selected.userId === user.userId);
                    return (
                      <ListItem key={user.userId} disablePadding>
                        <ListItemButton
                          onClick={() => handleUserToggle(user)}
                          selected={isSelected}
                          sx={{
                            py: 0.5,
                            px: 2,
                            '&.Mui-selected': {
                              backgroundColor: 'action.selected',
                            },
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            {getUserAvatar(user, 32)}
                          </ListItemAvatar>
                          <ListItemText
                            primaryTypographyProps={{ fontSize: '0.9rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8rem' }}
                            primary={user.name}
                            secondary={user.email}
                          />
                          {isSelected && <CheckCircleIcon color="primary" />}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Grid>

          {/* Right side: Selected users */}
          <Grid item xs={5} sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                Selected ({selectedUsers.length})
              </Typography>
              <Button
                size="small"
                onClick={() => setSelectedUsers([])}
                disabled={selectedUsers.length === 0}
              >
                Clear
              </Button>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: '3px' } }}>
              {selectedUsers.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <GroupAddIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Select users from the list to start a conversation.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {selectedUsers.map(user => (
                    <ListItem
                      key={user.userId}
                      disablePadding
                      sx={{ mb: 1 }}
                    >
                      <ListItemButton sx={{ py: 0.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          {getUserAvatar(user, 32)}
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.name}
                          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                        />
                        <IconButton
                          edge="end"
                          aria-label={`Remove ${user.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserToggle(user);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedUsers.length === 0}
          startIcon={<PersonAddIcon />}
          sx={{ ml: 'auto' }}
        >
          {`Start Conversation (${selectedUsers.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
