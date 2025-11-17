/**
 * Chatwoot Notifications Widget
 *
 * Compact notifications widget for dashboard display.
 * Shows recent notifications with real-time updates.
 */

import React, { useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as DotIcon,
  Wifi as OnlineIcon,
  WifiOff as OfflineIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { useChatwootNotifications } from '../../hooks/use-chatwoot-notifications';
import { useChatwootProvider } from '../../hooks/use-chatwoot-provider';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { EmptyState } from '@/widgets/frontdesk/design-system';
import type { ChatwootNotification } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { NotificationType } from '@/services/frontdesk/api/chatwoot/types/notifications.types';

interface ChatwootNotificationsWidgetProps {
  maxItems?: number;
  showHeader?: boolean;
  onViewAll?: () => void;
}

export const ChatwootNotificationsWidget: React.FC<ChatwootNotificationsWidgetProps> = ({
  maxItems = 5,
  showHeader = true,
  onViewAll,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    wsConnected,
    markConversationAsRead,
  } = useChatwootNotifications();
  const { router: chatwootRouter, selectedAccountId } = useChatwootProvider();

  // Get recent unread notifications
  const recentNotifications = useMemo(() => {
    const unread = notifications.filter((n) => !n.read_at);
    return unread.slice(0, maxItems);
  }, [notifications, maxItems]);

  // Get notification type info
  const getNotificationTypeInfo = (notificationType: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      [NotificationType.CONVERSATION_MENTION]: {
        color: primaryColor(600),
        label: 'Mention',
      },
      [NotificationType.CONVERSATION_ASSIGNMENT]: {
        color: '#3B82F6',
        label: 'Assignment',
      },
      [NotificationType.ASSIGNED_CONVERSATION_NEW_MESSAGE]: {
        color: primaryColor(500),
        label: 'Message',
      },
      [NotificationType.PARTICIPATING_CONVERSATION_NEW_MESSAGE]: {
        color: primaryColor(500),
        label: 'Message',
      },
      [NotificationType.CONVERSATION_CREATION]: {
        color: '#10B981',
        label: 'New',
      },
    };

    return typeMap[notificationType] || {
      color: neutralColor(500),
      label: 'Notification',
    };
  };

  // Get sender info
  const getSenderInfo = (notification: ChatwootNotification) => {
    const primaryActor = notification.primary_actor;
    if (!primaryActor) {
      return { name: 'System', initials: 'S', color: neutralColor(400), avatar: null };
    }

    const name = primaryActor.name || primaryActor.email || 'Unknown';
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = [primaryColor(500), '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const colorIndex = name.charCodeAt(0) % colors.length;

    return {
      name,
      initials,
      color: colors[colorIndex],
      avatar: primaryActor.avatar_url || primaryActor.meta?.sender?.thumbnail || null,
    };
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number | string | undefined) => {
    if (!timestamp) return '';
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000)
      : parseISO(timestamp.toString());
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Get message preview
  const getMessagePreview = (notification: ChatwootNotification): string => {
    const pushMessageBody =
      notification.push_message_body ||
      notification.meta?.pushMessageBody ||
      (notification.primary_actor as any)?.meta?.pushMessageBody ||
      notification.meta?.message?.content ||
      '';

    if (!pushMessageBody) {
      return notification.push_message_title || 'New notification';
    }

    const plainText = pushMessageBody.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText;
  };

  // Handle notification click
  const handleNotificationClick = async (notification: ChatwootNotification) => {
    const primaryActor = notification.primary_actor as any;
    const conversationId = primaryActor?.id;
    const inboxId = primaryActor?.inbox_id;

    if (conversationId) {
      try {
        await markConversationAsRead(conversationId);
      } catch (err) {
        console.error('Failed to mark conversation notifications as read:', err);
      }

      chatwootRouter.navigateToConversation(
        conversationId.toString(),
        inboxId?.toString()
      );
    }
  };

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Navigate to My Inbox view
      chatwootRouter.navigateToMyInbox();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 1,
        border: `1px solid ${colorTokens.neutral[200]}`,
        overflow: 'hidden',
        maxHeight: '400px',
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${colorTokens.neutral[200]}`,
            backgroundColor: colorTokens.neutral[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <NotificationsIcon sx={{ fontSize: 18, color: colorTokens.neutral[700] }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: colorTokens.neutral[900],
              }}
            >
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.688rem',
                  fontWeight: 600,
                  backgroundColor: primaryColor(600),
                  color: 'white',
                }}
              />
            )}
            <Tooltip 
              title={
                wsConnected 
                  ? 'Real-time updates active' 
                  : 'Real-time updates unavailable - WebSocket proxy not configured. Notifications will update on refresh.'
              }
            >
              {wsConnected ? (
                <OnlineIcon sx={{ fontSize: 14, color: '#10B981' }} />
              ) : (
                <OfflineIcon sx={{ fontSize: 14, color: colorTokens.neutral[400] }} />
              )}
            </Tooltip>
          </Stack>
          {recentNotifications.length > 0 && (
            <IconButton
              size="small"
              onClick={handleViewAllClick}
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: primaryColor(50),
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 16, color: primaryColor(600) }} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Notifications List */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0, maxHeight: '300px' }}>
        {error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'error.main', fontSize: '0.813rem' }}>
              {error}
            </Typography>
          </Box>
        ) : loading && recentNotifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: colorTokens.neutral[500], fontSize: '0.813rem' }}
            >
              Loading notifications...
            </Typography>
          </Box>
        ) : recentNotifications.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <EmptyState
              icon={<NotificationsIcon sx={{ fontSize: 32, color: colorTokens.neutral[300] }} />}
              title="No unread notifications"
              description="All caught up! No new notifications."
            />
          </Box>
        ) : (
          <List sx={{ py: 0.5 }}>
            {recentNotifications.map((notification) => {
              const sender = getSenderInfo(notification);
              const typeInfo = getNotificationTypeInfo(notification.notification_type);
              const messagePreview = getMessagePreview(notification);
              const timestamp = notification.created_at
                ? typeof notification.created_at === 'number'
                  ? notification.created_at * 1000
                  : parseISO(notification.created_at.toString()).getTime()
                : Date.now();

              return (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    backgroundColor: primaryColor(50),
                    '&:hover': {
                      backgroundColor: primaryColor(100),
                    },
                    borderBottom: `1px solid ${colorTokens.neutral[100]}`,
                  }}
                >
                  <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <Avatar
                      src={sender.avatar || undefined}
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: sender.color,
                        color: 'white',
                        fontSize: '0.688rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {sender.initials}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Header Row */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 0.25 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.813rem',
                            fontWeight: 600,
                            color: colorTokens.neutral[900],
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {sender.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.688rem',
                            color: colorTokens.neutral[500],
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTimeAgo(timestamp)}
                        </Typography>
                      </Stack>

                      {/* Message Preview */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.813rem',
                          fontWeight: 400,
                          color: colorTokens.neutral[700],
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        title={messagePreview}
                      >
                        {messagePreview}
                      </Typography>

                      {/* Type Label */}
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                        <DotIcon sx={{ fontSize: 8, color: typeInfo.color }} />
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.688rem',
                            color: typeInfo.color,
                            fontWeight: 500,
                          }}
                        >
                          {typeInfo.label}
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

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: `1px solid ${colorTokens.neutral[200]}`,
            backgroundColor: colorTokens.neutral[50],
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            onClick={handleViewAllClick}
            sx={{
              fontSize: '0.75rem',
              color: primaryColor(600),
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            View all notifications ({unreadCount} unread)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatwootNotificationsWidget;

