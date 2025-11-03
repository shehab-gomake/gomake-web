/**
 * Chatwoot Notifications Compact Component
 *
 * Simplified notification list for dashboard embedding.
 * Shows top 10 notifications with simple chip-based filtering.
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip as MuiChip,
  Button,
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { useChatwootNotifications } from '../../hooks/use-chatwoot-notifications';
import { useChatwootProvider } from '../../hooks/use-chatwoot-provider';
import { Chip } from '@/widgets/frontdesk/design-system';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { EmptyState } from '@/widgets/frontdesk/design-system';
import InboxIcon from '@mui/icons-material/Inbox';
import type { ChatwootNotification } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { DASHBOARD_LIMITS } from '../../constants/dashboard.constants';

type FilterType = 'unread' | 'mentions' | 'assignments' | 'all';

export const ChatwootNotificationsCompact: React.FC = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    wsConnected,
    markConversationAsRead,
  } = useChatwootNotifications();
  const { router: chatwootRouter } = useChatwootProvider();
  const [activeFilter, setActiveFilter] = useState<FilterType>('unread');

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    switch (activeFilter) {
      case 'unread':
        filtered = notifications.filter((n) => !n.read_at);
        break;
      case 'mentions':
        filtered = notifications.filter(
          (n) => n.notification_type === 'conversation.mention'
        );
        break;
      case 'assignments':
        filtered = notifications.filter(
          (n) => n.notification_type === 'conversation.assigned'
        );
        break;
      case 'all':
      default:
        filtered = notifications;
        break;
    }

    // Limit to configured dashboard maximum
    return filtered.slice(0, DASHBOARD_LIMITS.MAX_NOTIFICATIONS_DASHBOARD);
  }, [notifications, activeFilter]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      unread: notifications.filter((n) => !n.read_at).length,
      mentions: notifications.filter((n) => n.notification_type === 'conversation.mention').length,
      assignments: notifications.filter((n) => n.notification_type === 'conversation.assigned').length,
      all: notifications.length,
    };
  }, [notifications]);

  // Helper functions
  const getNotificationSender = (notification: ChatwootNotification) => {
    const primaryActor = notification.primary_actor;
    if (!primaryActor) return { name: 'System', initials: 'S', color: neutralColor(400) };

    const name = primaryActor.name || primaryActor.email || 'Unknown';
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [primaryColor(500), '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return { name, initials, color: colors[colorIndex] };
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getMessagePreview = (notification: ChatwootNotification) => {
    const pushMessageBody =
      notification.meta?.pushMessageBody ||
      (notification.primary_actor as any)?.meta?.pushMessageBody ||
      notification.meta?.message?.content ||
      '';

    if (!pushMessageBody) {
      return notification.notification_type || 'Notification';
    }

    const plainText = pushMessageBody.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 80 ? plainText.substring(0, 80) + '...' : plainText;
  };

  const getNotificationTypeLabel = (notificationType?: string) => {
    const typeMap: Record<string, string> = {
      'conversation.mention': 'Mention',
      'conversation.assigned': 'Assignment',
      'conversation.created': 'New Conversation',
      'conversation.updated': 'Updated',
      'message.created': 'New Message',
    };
    return typeMap[notificationType || ''] || 'New message';
  };

  const handleNotificationClick = async (notification: ChatwootNotification) => {
    const primaryActor = notification.primary_actor as any;
    const conversationId = primaryActor?.id;
    const inboxId = primaryActor?.inbox_id;

    if (conversationId) {
      // Mark all notifications for this conversation as read
      try {
        await markConversationAsRead(conversationId);
      } catch (err) {
        // Error is logged by the hook, continue with navigation
        console.error('Failed to mark conversation notifications as read:', err);
      }

      // Navigate to conversation
      chatwootRouter.navigateToConversation(
        conversationId.toString(),
        inboxId?.toString()
      );
    }
  };

  const handleViewAllClick = () => {
    chatwootRouter.navigateToMyInbox();
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Filter Chips */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: colorTokens.neutral[50],
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
          <Chip
            label={`Unread ${filterCounts.unread > 0 ? `(${filterCounts.unread})` : ''}`}
            variant={activeFilter === 'unread' ? 'filled' : 'soft'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('unread')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`Mentions ${filterCounts.mentions > 0 ? `(${filterCounts.mentions})` : ''}`}
            variant={activeFilter === 'mentions' ? 'filled' : 'soft'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('mentions')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`Assignments ${filterCounts.assignments > 0 ? `(${filterCounts.assignments})` : ''}`}
            variant={activeFilter === 'assignments' ? 'filled' : 'soft'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('assignments')}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="All"
            variant={activeFilter === 'all' ? 'filled' : 'soft'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('all')}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      </Box>

      {/* Notification List */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'white' }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: 'error.main', fontSize: '0.813rem' }}>
              {error}
            </Typography>
          </Box>
        ) : loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: colorTokens.neutral[500], fontSize: '0.813rem' }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : filteredNotifications.length === 0 ? (
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
              icon={<InboxIcon sx={{ fontSize: 40 }} />}
              title="No notifications"
              description={
                activeFilter === 'unread'
                  ? "All caught up! No unread notifications."
                  : `No ${activeFilter} notifications found.`
              }
            />
          </Box>
        ) : (
          <List sx={{ py: 0.5 }}>
            {filteredNotifications.map((notification) => {
              const sender = getNotificationSender(notification);
              const isUnread = !notification.read_at;
              const primaryActor = notification.primary_actor as any;
              const messagePreview = getMessagePreview(notification);
              const typeLabel = getNotificationTypeLabel(notification.notification_type);
              const lastActivityAt =
                primaryActor?.last_activity_at ||
                notification.updated_at ||
                notification.created_at;

              return (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    backgroundColor: isUnread ? primaryColor(50) : 'white',
                    '&:hover': {
                      backgroundColor: isUnread ? primaryColor(100) : colorTokens.neutral[50],
                    },
                    borderBottom: `1px solid ${colorTokens.neutral[100]}`,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ width: '100%', alignItems: 'flex-start' }}
                  >
                    {/* Avatar (16px - more compact) */}
                    <Avatar
                      src={(primaryActor?.meta?.sender?.thumbnail || primaryActor?.avatar_url) as string | undefined}
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: sender.color,
                        color: 'white',
                        fontSize: '0.563rem',
                        fontWeight: 600,
                        flexShrink: 0,
                        mt: 0.25,
                      }}
                    >
                      {sender.initials}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Message Preview */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 12,
                          fontWeight: isUnread ? 600 : 400,
                          color: colorTokens.neutral[900],
                          lineHeight: 1.4,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={messagePreview}
                      >
                        {messagePreview}
                      </Typography>

                      {/* Metadata Row */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        {/* Left: Type Icon + Label */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ flex: 1, minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: 1,
                              backgroundColor: isUnread
                                ? primaryColor(600)
                                : colorTokens.neutral[400],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <AddCommentIcon sx={{ fontSize: 8, color: 'white' }} />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: isUnread
                                ? primaryColor(600)
                                : colorTokens.neutral[500],
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {typeLabel}
                          </Typography>
                        </Stack>

                        {/* Right: Timestamp */}
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 11,
                            color: colorTokens.neutral[500],
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTimeAgo(lastActivityAt)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* View All Button */}
      {filteredNotifications.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderTop: `1px solid ${colorTokens.neutral[200]}`,
            backgroundColor: 'white',
          }}
        >
          <Button
            fullWidth
            variant="text"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            onClick={handleViewAllClick}
            sx={{
              fontSize: '0.813rem',
              textTransform: 'none',
              color: primaryColor(600),
              '&:hover': {
                backgroundColor: primaryColor(50),
              },
            }}
          >
            View All in My Inbox
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatwootNotificationsCompact;
