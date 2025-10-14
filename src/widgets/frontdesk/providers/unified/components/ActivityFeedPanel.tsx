import React, { useMemo } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ConversationListItem, EmptyState } from '@/widgets/frontdesk/design-system';
import { UnifiedConversation } from '../types/unified.types';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import InboxIcon from '@mui/icons-material/Inbox';

export interface ActivityFeedPanelProps {
  conversations: UnifiedConversation[];
  selectedId?: string;
  onSelect: (conversation: UnifiedConversation) => void;
  isLoading?: boolean;
}

interface GroupedConversations {
  today: UnifiedConversation[];
  yesterday: UnifiedConversation[];
  thisWeek: UnifiedConversation[];
  older: UnifiedConversation[];
}

const groupConversationsByDate = (
  conversations: UnifiedConversation[]
): GroupedConversations => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  conversations.forEach((conversation) => {
    const timestamp = new Date(conversation.lastMessageAt);

    if (timestamp >= today) {
      grouped.today.push(conversation);
    } else if (timestamp >= yesterday) {
      grouped.yesterday.push(conversation);
    } else if (timestamp >= thisWeekStart) {
      grouped.thisWeek.push(conversation);
    } else {
      grouped.older.push(conversation);
    }
  });

  return grouped;
};

const TimeGroupHeader: React.FC<{ label: string; count: number }> = ({
  label,
  count,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.neutral[600],
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label} ({count})
      </Typography>
    </Box>
  );
};

export const ActivityFeedPanel: React.FC<ActivityFeedPanelProps> = ({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
}) => {
  const theme = useTheme();

  const groupedConversations = useMemo(
    () => groupConversationsByDate(conversations),
    [conversations]
  );

  // Show empty state if no conversations
  if (!isLoading && conversations.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3,
        }}
      >
        <EmptyState
          icon={<InboxIcon sx={{ fontSize: 48 }} />}
          title="No Activity"
          description="You're all caught up! No conversations or tickets need attention."
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Today */}
      {groupedConversations.today.length > 0 && (
        <>
          <TimeGroupHeader
            label="Today"
            count={groupedConversations.today.length}
          />
          {groupedConversations.today.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.name}
              participants={conversation.members || []}
              snippet={conversation.lastMessage || ''}
              timestamp={conversation.lastMessageAt || ''}
              isRead={!conversation.unreadCount || conversation.unreadCount === 0}
              isSelected={selectedId === conversation.id}
              unreadCount={conversation.unreadCount || 0}
              hasAttachments={false}
              onClick={() => onSelect(conversation)}
            />
          ))}
        </>
      )}

      {/* Yesterday */}
      {groupedConversations.yesterday.length > 0 && (
        <>
          <TimeGroupHeader
            label="Yesterday"
            count={groupedConversations.yesterday.length}
          />
          {groupedConversations.yesterday.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.name}
              participants={conversation.members || []}
              snippet={conversation.lastMessage || ''}
              timestamp={conversation.lastMessageAt || ''}
              isRead={!conversation.unreadCount || conversation.unreadCount === 0}
              isSelected={selectedId === conversation.id}
              unreadCount={conversation.unreadCount || 0}
              hasAttachments={false}
              onClick={() => onSelect(conversation)}
            />
          ))}
        </>
      )}

      {/* This Week */}
      {groupedConversations.thisWeek.length > 0 && (
        <>
          <TimeGroupHeader
            label="This Week"
            count={groupedConversations.thisWeek.length}
          />
          {groupedConversations.thisWeek.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.name}
              participants={conversation.members || []}
              snippet={conversation.lastMessage || ''}
              timestamp={conversation.lastMessageAt || ''}
              isRead={!conversation.unreadCount || conversation.unreadCount === 0}
              isSelected={selectedId === conversation.id}
              unreadCount={conversation.unreadCount || 0}
              hasAttachments={false}
              onClick={() => onSelect(conversation)}
            />
          ))}
        </>
      )}

      {/* Older */}
      {groupedConversations.older.length > 0 && (
        <>
          <TimeGroupHeader
            label="Older"
            count={groupedConversations.older.length}
          />
          {groupedConversations.older.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              id={conversation.id}
              title={conversation.name}
              participants={conversation.members || []}
              snippet={conversation.lastMessage || ''}
              timestamp={conversation.lastMessageAt || ''}
              isRead={!conversation.unreadCount || conversation.unreadCount === 0}
              isSelected={selectedId === conversation.id}
              unreadCount={conversation.unreadCount || 0}
              hasAttachments={false}
              onClick={() => onSelect(conversation)}
            />
          ))}
        </>
      )}
    </Box>
  );
};

export default ActivityFeedPanel;
