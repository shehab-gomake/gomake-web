import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Chip,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { UnifiedConversation } from '../types/unified.types';
import { groupConversationsByDate } from '../utils/conversation-aggregator';

interface UnifiedConversationListProps {
  conversations: UnifiedConversation[];
  selectedId?: string;
  onSelect: (conversation: UnifiedConversation) => void;
  groupByDate?: boolean;
}

const ConversationIndicator: React.FC<{ provider: string }> = ({ provider }) => {
  const getIndicator = () => {
    switch (provider) {
      case 'email':
        return '📧';
      case 'whatsapp':
        return '💬';
      case 'internal':
        return '🏢';
      default:
        return '📨';
    }
  };
  
  return (
    <span style={{ fontSize: '16px', marginRight: '4px' }}>
      {getIndicator()}
    </span>
  );
};

const ConversationItem: React.FC<{
  conversation: UnifiedConversation;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ conversation, isSelected, onSelect }) => {
  const theme = useTheme();
  
  // Format time
  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else if (hours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  return (
    <ListItem 
      disablePadding
      sx={{
        borderLeft: isSelected ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
        backgroundColor: isSelected ? theme.palette.action.selected : 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.action.hover
        }
      }}
    >
      <ListItemButton onClick={onSelect} sx={{ py: 1.5 }}>
        <ListItemAvatar>
          <Badge 
            badgeContent={conversation.unreadCount} 
            color="error"
            overlap="circular"
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {conversation.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ConversationIndicator provider={conversation.provider} />
              <Typography variant="body1" fontWeight={conversation.unreadCount ? 600 : 400}>
                {conversation.name}
              </Typography>
              {conversation.accountName && (
                <Chip 
                  label={conversation.accountName} 
                  size="small" 
                  variant="outlined"
                  sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          }
          secondary={
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {conversation.lastMessage || 'No messages yet'}
            </Typography>
          }
        />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          minWidth: 60
        }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(conversation.lastMessageAt)}
          </Typography>
          {conversation.priority && conversation.priority !== 'low' && (
            <Chip 
              label={conversation.priority}
              size="small"
              color={conversation.priority === 'high' ? 'error' : 'warning'}
              sx={{ mt: 0.5, height: 16, fontSize: '0.65rem' }}
            />
          )}
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export const UnifiedConversationList: React.FC<UnifiedConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  groupByDate = true
}) => {
  const theme = useTheme();
  
  if (!conversations || conversations.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 200,
          color: theme.palette.text.secondary
        }}
      >
        <Typography variant="body2">No conversations found</Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          Messages from all channels will appear here
        </Typography>
      </Box>
    );
  }
  
  // Group conversations by date if enabled
  if (groupByDate) {
    const grouped = groupConversationsByDate(conversations);
    const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older', 'Other'];
    
    return (
      <List sx={{ p: 0 }}>
        {groupOrder.map(groupName => {
          const groupConversations = grouped.get(groupName);
          if (!groupConversations || groupConversations.length === 0) return null;
          
          return (
            <Box key={groupName}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 2,
                  py: 1,
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.7rem'
                }}
              >
                {groupName} ({groupConversations.length})
              </Typography>
              {groupConversations.map(conversation => (
                <React.Fragment key={conversation.id}>
                  <ConversationItem
                    conversation={conversation}
                    isSelected={selectedId === conversation.id}
                    onSelect={() => onSelect(conversation)}
                  />
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </Box>
          );
        })}
      </List>
    );
  }
  
  // Flat list without grouping
  return (
    <List sx={{ p: 0 }}>
      {conversations.map(conversation => (
        <React.Fragment key={conversation.id}>
          <ConversationItem
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onSelect={() => onSelect(conversation)}
          />
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default UnifiedConversationList;