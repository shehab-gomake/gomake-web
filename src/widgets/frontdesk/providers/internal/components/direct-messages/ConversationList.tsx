import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Badge,
  CircularProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Group as GroupIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Conversation } from '../../types/direct-messages.types';
import { ConversationListProps } from '../../types/direct-messages.types';

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  currentUserId,
  onSelect,
  loading = false,
  hasMore = false,
  onLoadMore,
}) => {
  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    
    if (conversation.type === 'DM') {
      // For DM, show the other participant's name
      const otherMember = conversation.members?.find(member => member.userId !== currentUserId);
      return otherMember?.name || 'Direct Message';
    }
    
    return 'Group Chat';
  };

  const getConversationIcon = (conversation: Conversation) => {
    return conversation.type === 'DM' ? <ChatIcon /> : <GroupIcon />;
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'DM') {
      const otherMember = conversation.members?.find(member => member.userId !== currentUserId);
      if (otherMember) {
        return (
          <Avatar sx={{ width: 40, height: 40 }}>
            {otherMember.firstName?.[0]}{otherMember.lastName?.[0]}
          </Avatar>
        );
      }
    }
    
    // Group chat avatar
    return (
      <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
        <GroupIcon />
      </Avatar>
    );
  };

  if (loading && conversations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <List sx={{ height: '100%', overflow: 'auto' }}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            disablePadding
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ListItemButton
              selected={selectedId === conversation.id}
              onClick={() => onSelect(conversation)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.50',
                  '&:hover': {
                    backgroundColor: 'primary.100',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    conversation.unreadCount && conversation.unreadCount > 0 ? (
                      <Chip
                        label={conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        size="small"
                        color="primary"
                        sx={{
                          height: 18,
                          fontSize: '0.75rem',
                          minWidth: 18,
                        }}
                      />
                    ) : null
                  }
                >
                  {getConversationAvatar(conversation)}
                </Badge>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: conversation.unreadCount && conversation.unreadCount > 0 ? 600 : 400,
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {getConversationName(conversation)}
                    </Typography>
                    {conversation.type === 'GROUP_DM' && (
                      <Tooltip title="Group Chat">
                        <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    )}
                  </Stack>
                }
                secondary={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: conversation.unreadCount && conversation.unreadCount > 0 ? 500 : 400,
                      }}
                    >
                      {conversation.lastMessageAt ? formatLastMessageTime(conversation.lastMessageAt) : ''}
                    </Typography>
                  </Stack>
                }
              />
              
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {conversation.unreadCount && conversation.unreadCount > 0 && (
                  <Chip
                    label={conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                    size="small"
                    color="primary"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      minWidth: 20,
                    }}
                  />
                )}
                <IconButton size="small" sx={{ opacity: 0.7 }}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
        
        {hasMore && onLoadMore && (
          <ListItem>
            <ListItemButton onClick={onLoadMore} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">
                Load More
              </Typography>
            </ListItemButton>
          </ListItem>
        )}
        
        {conversations.length === 0 && !loading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No conversations yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Start a new conversation to begin messaging
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};