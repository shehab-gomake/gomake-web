import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  Box,
  Divider,
  Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BaseConversation } from '@/widgets/frontdesk/providers/base/provider.interface';

export interface ConversationListProps {
  conversations: BaseConversation[];
  selectedId?: string;
  onSelect: (conversation: BaseConversation) => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
  showChannelIndicator?: boolean;
  renderChannelIndicator?: (conversation: BaseConversation) => React.ReactNode;
  groupByDate?: boolean;
  compact?: boolean;
}

const ConversationListItem: React.FC<{
  conversation: BaseConversation;
  isSelected: boolean;
  onSelect: () => void;
  showChannelIndicator?: boolean;
  renderChannelIndicator?: (conversation: BaseConversation) => React.ReactNode;
  compact?: boolean;
}> = ({ 
  conversation, 
  isSelected, 
  onSelect, 
  showChannelIndicator,
  renderChannelIndicator,
  compact = false
}) => {
  const theme = useTheme();

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.substring(0, 2);
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
      <ListItemButton 
        onClick={onSelect} 
        sx={{ py: compact ? 1 : 1.5 }}
      >
        <ListItemAvatar>
          <Badge
            badgeContent={conversation.unreadCount}
            color="error"
            overlap="circular"
            max={99}
          >
            <Avatar sx={{ width: compact ? 36 : 40, height: compact ? 36 : 40 }}>
              {getInitials(conversation.name)}
            </Avatar>
          </Badge>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {showChannelIndicator && renderChannelIndicator && renderChannelIndicator(conversation)}
              <Typography 
                variant={compact ? "body2" : "body1"} 
                fontWeight={conversation.unreadCount ? 600 : 400}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {conversation.name}
              </Typography>
            </Box>
          }
          secondary={
            !compact && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block'
                }}
              >
                {conversation.lastMessage || 'No messages yet'}
              </Typography>
            )
          }
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            minWidth: 60
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatTime(conversation.lastMessageAt)}
          </Typography>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

const LoadingSkeleton: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <ListItem key={i} sx={{ py: compact ? 1 : 1.5 }}>
        <ListItemAvatar>
          <Skeleton variant="circular" width={compact ? 36 : 40} height={compact ? 36 : 40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={!compact && <Skeleton variant="text" width="80%" />}
        />
      </ListItem>
    ))}
  </>
);

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = 'No conversations',
  showChannelIndicator = false,
  renderChannelIndicator,
  groupByDate = false,
  compact = false
}) => {
  const theme = useTheme();

  if (loading && conversations.length === 0) {
    return (
      <List sx={{ p: 0 }}>
        <LoadingSkeleton compact={compact} />
      </List>
    );
  }

  if (!loading && conversations.length === 0) {
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
        <Typography variant="body2">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {conversations.map((conversation, index) => (
        <React.Fragment key={conversation.id}>
          <ConversationListItem
            conversation={conversation}
            isSelected={selectedId === conversation.id}
            onSelect={() => onSelect(conversation)}
            showChannelIndicator={showChannelIndicator}
            renderChannelIndicator={renderChannelIndicator}
            compact={compact}
          />
          {index < conversations.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
      
      {loading && <LoadingSkeleton compact={compact} />}
      
      {hasMore && !loading && onLoadMore && (
        <ListItem>
          <ListItemButton onClick={onLoadMore} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">
              Load more
            </Typography>
          </ListItemButton>
        </ListItem>
      )}
    </List>
  );
};

export default ConversationList;