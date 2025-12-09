/**
 * Chatwoot Notifications Enhanced Component
 *
 * Professional, real-time notifications section for the dashboard.
 * Features:
 * - Real-time WebSocket updates
 * - Time-based grouping (Today, Yesterday, This Week, Older)
 * - Rich notification actions (mark as read, delete, snooze)
 * - Visual indicators for notification types
 * - Connection status indicator
 * - Optimistic UI updates
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  Typography,
  List,
  ListItem,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Badge,
} from '@mui/material';
import {
  NotificationsNone as NotificationsIcon,
  CheckCircle as ReadIcon,
  RadioButtonUnchecked as UnreadIcon,
  Delete as DeleteIcon,
  Snooze as SnoozeIcon,
  MoreVert as MoreIcon,
  Circle as DotIcon,
  WifiOff as OfflineIcon,
  Wifi as OnlineIcon,
  Comment as MentionIcon,
  Assignment as AssignmentIcon,
  AddComment as MessageIcon,
  PersonAdd as AssignmentAddIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import { useChatwootNotifications } from '../../hooks/use-chatwoot-notifications';
import { useChatwootProvider } from '../../hooks/use-chatwoot-provider';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { EmptyState } from '@/widgets/frontdesk/design-system';
import type { ChatwootNotification } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { NotificationType } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { DASHBOARD_LIMITS } from '../../constants/dashboard.constants';
import { generateNotificationAvatar } from '../../utils/avatar.utils';

type FilterType = 'unread' | 'mentions' | 'assignments' | 'all';

interface NotificationGroup {
  label: string;
  notifications: ChatwootNotification[];
}

export const ChatwootNotificationsEnhanced: React.FC = () => {
  const { t } = useTranslation();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    wsConnected,
    markAsRead,
    markAsUnread,
    deleteNotification,
    snoozeNotification,
    markConversationAsRead,
    markAllAsRead,
    refresh,
  } = useChatwootNotifications();
  const { router: chatwootRouter, selectedAccountId: currentAccountId } = useChatwootProvider();
  const [activeFilter, setActiveFilter] = useState<FilterType>('unread');
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ el: HTMLElement; notification: ChatwootNotification } | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['today']));
  const notificationRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Track new notifications for animation
  const [newNotificationIds, setNewNotificationIds] = useState<Set<number>>(new Set());
  const previousNotificationsRef = useRef<Set<number>>(new Set());
  const hasFetchedRef = useRef(false);

  // Ensure notifications are fetched when component mounts or account changes
  useEffect(() => {
    if (currentAccountId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      console.log('[ChatwootNotificationsEnhanced] Account ID available, fetching notifications...', currentAccountId);
      // Small delay to ensure hook is ready
      const timeoutId = setTimeout(() => {
        refresh();
      }, 200);
      return () => clearTimeout(timeoutId);
    } else if (!currentAccountId) {
      console.log('[ChatwootNotificationsEnhanced] No account ID available yet');
      hasFetchedRef.current = false;
    }
  }, [currentAccountId, refresh]);

  // Debug logging
  useEffect(() => {
    console.log('[ChatwootNotificationsEnhanced] State:', {
      notificationsCount: notifications.length,
      loading,
      error,
      unreadCount,
      wsConnected,
      currentAccountId,
    });
  }, [notifications.length, loading, error, unreadCount, wsConnected, currentAccountId]);

  // Detect new notifications for animation
  useEffect(() => {
    const currentIds = new Set(notifications.map(n => n.id));
    const previousIds = previousNotificationsRef.current;
    
    // Find new notifications
    const newIds = new Set<number>();
    currentIds.forEach(id => {
      if (!previousIds.has(id)) {
        newIds.add(id);
      }
    });

    if (newIds.size > 0) {
      setNewNotificationIds(newIds);
      // Clear animation after 3 seconds
      setTimeout(() => {
        setNewNotificationIds(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 3000);
    }

    previousNotificationsRef.current = currentIds;
  }, [notifications]);

  // Filter notifications based on active filter
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    switch (activeFilter) {
      case 'unread':
        filtered = notifications.filter((n) => !n.read_at);
        break;
      case 'mentions':
        filtered = notifications.filter(
          (n) => n.notification_type === NotificationType.CONVERSATION_MENTION || 
                 n.notification_type === 'conversation.mention'
        );
        break;
      case 'assignments':
        filtered = notifications.filter(
          (n) => n.notification_type === NotificationType.CONVERSATION_ASSIGNMENT ||
                 n.notification_type === 'conversation.assigned'
        );
        break;
      case 'all':
      default:
        filtered = notifications;
        break;
    }

    return filtered.slice(0, DASHBOARD_LIMITS.MAX_NOTIFICATIONS_DASHBOARD);
  }, [notifications, activeFilter]);

  // Group notifications by time
  const groupedNotifications = useMemo((): NotificationGroup[] => {
    const groups: NotificationGroup[] = [
      { label: t("frontdesk.dashboard.today"), notifications: [] },
      { label: t("frontdesk.dashboard.yesterday"), notifications: [] },
      { label: t("frontdesk.dashboard.thisWeek"), notifications: [] },
      { label: t("frontdesk.dashboard.older"), notifications: [] },
    ];

    filteredNotifications.forEach((notification) => {
      const createdAt = notification.created_at
        ? new Date(notification.created_at * 1000)
        : new Date();

      if (isToday(createdAt)) {
        groups[0].notifications.push(notification);
      } else if (isYesterday(createdAt)) {
        groups[1].notifications.push(notification);
      } else if (isThisWeek(createdAt)) {
        groups[2].notifications.push(notification);
      } else {
        groups[3].notifications.push(notification);
      }
    });

    // Remove empty groups
    return groups.filter(group => group.notifications.length > 0);
  }, [filteredNotifications, t]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      unread: notifications.filter((n) => !n.read_at).length,
      mentions: notifications.filter(
        (n) => n.notification_type === NotificationType.CONVERSATION_MENTION ||
               n.notification_type === 'conversation.mention'
      ).length,
      assignments: notifications.filter(
        (n) => n.notification_type === NotificationType.CONVERSATION_ASSIGNMENT ||
               n.notification_type === 'conversation.assigned'
      ).length,
      all: notifications.length,
    };
  }, [notifications]);

  // Get notification type icon and color
  const getNotificationTypeInfo = (notificationType: string) => {
    const typeMap: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      [NotificationType.CONVERSATION_MENTION]: {
        icon: <MentionIcon sx={{ fontSize: 14 }} />,
        color: colorTokens.primary[600],
        label: t("frontdesk.dashboard.notificationTypes.mention"),
      },
      [NotificationType.CONVERSATION_ASSIGNMENT]: {
        icon: <AssignmentIcon sx={{ fontSize: 14 }} />,
        color: '#3B82F6',
        label: t("frontdesk.dashboard.notificationTypes.assignment"),
      },
      [NotificationType.ASSIGNED_CONVERSATION_NEW_MESSAGE]: {
        icon: <MessageIcon sx={{ fontSize: 14 }} />,
        color: colorTokens.primary[500],
        label: t("frontdesk.dashboard.notificationTypes.newMessage"),
      },
      [NotificationType.PARTICIPATING_CONVERSATION_NEW_MESSAGE]: {
        icon: <MessageIcon sx={{ fontSize: 14 }} />,
        color: colorTokens.primary[500],
        label: t("frontdesk.dashboard.notificationTypes.newMessage"),
      },
      [NotificationType.CONVERSATION_CREATION]: {
        icon: <AssignmentAddIcon sx={{ fontSize: 14 }} />,
        color: '#10B981',
        label: t("frontdesk.dashboard.notificationTypes.newConversation"),
      },
    };

    return typeMap[notificationType] || {
      icon: <MessageIcon sx={{ fontSize: 14 }} />,
      color: colorTokens.neutral[500],
      label: t("frontdesk.dashboard.notificationTypes.notification"),
    };
  };

  // Get sender info for avatar (using unified avatar utility)
  const getSenderAvatarData = (notification: ChatwootNotification) => {
    return generateNotificationAvatar(notification);
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number | string | undefined) => {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000)
      : parseISO(timestamp.toString());
    
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'MMM d, h:mm a');
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
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  // Handle notification click
  const handleNotificationClick = useCallback(
    async (notification: ChatwootNotification) => {
      const primaryActor = notification.primary_actor as any;
      const conversationId = primaryActor?.id;
      const inboxId = primaryActor?.inbox_id;

      if (conversationId) {
        // Mark all notifications for this conversation as read
        try {
          await markConversationAsRead(conversationId);
        } catch (err) {
          console.error('Failed to mark conversation notifications as read:', err);
        }

        // Navigate to conversation
        chatwootRouter.navigateToConversation(
          conversationId.toString(),
          inboxId?.toString()
        );
      }
    },
    [markConversationAsRead, chatwootRouter]
  );

  // Handle context menu open
  const handleContextMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>, notification: ChatwootNotification) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenuAnchor({ el: event.currentTarget, notification });
    },
    []
  );

  // Handle context menu close
  const handleContextMenuClose = useCallback(() => {
    setContextMenuAnchor(null);
  }, []);

  // Handle mark as read
  const handleMarkAsRead = useCallback(
    async (notification: ChatwootNotification) => {
      if (!notification.id) return;
      try {
        await markAsRead(notification.id);
        handleContextMenuClose();
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    },
    [markAsRead, handleContextMenuClose]
  );

  // Handle mark as unread
  const handleMarkAsUnread = useCallback(
    async (notification: ChatwootNotification) => {
      if (!notification.id) return;
      try {
        await markAsUnread(notification.id);
        handleContextMenuClose();
      } catch (err) {
        console.error('Failed to mark notification as unread:', err);
      }
    },
    [markAsUnread, handleContextMenuClose]
  );

  // Handle delete
  const handleDelete = useCallback(
    async (notification: ChatwootNotification) => {
      if (!notification.id) return;
      try {
        await deleteNotification(notification.id);
        handleContextMenuClose();
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    },
    [deleteNotification, handleContextMenuClose]
  );

  // Handle snooze
  const handleSnooze = useCallback(
    async (notification: ChatwootNotification, hours: number) => {
      if (!notification.id) return;
      const snoozedUntil = new Date();
      snoozedUntil.setHours(snoozedUntil.getHours() + hours);
      try {
        await snoozeNotification(notification.id, snoozedUntil.toISOString());
        handleContextMenuClose();
      } catch (err) {
        console.error('Failed to snooze notification:', err);
      }
    },
    [snoozeNotification, handleContextMenuClose]
  );

  // Toggle group expansion
  const toggleGroup = useCallback((label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label.toLowerCase())) {
        next.delete(label.toLowerCase());
      } else {
        next.add(label.toLowerCase());
      }
      return next;
    });
  }, []);

  const currentNotification = contextMenuAnchor?.notification;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      {/* Header with Connection Status */}
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
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: colorTokens.neutral[900],
            }}
          >
            {t("frontdesk.dashboard.notifications")}
          </Typography>
          <Tooltip title={wsConnected ? t("frontdesk.dashboard.realTimeUpdatesActive") : t("frontdesk.dashboard.realTimeUpdatesDisconnected")}>
            {wsConnected ? (
              <OnlineIcon sx={{ fontSize: 14, color: '#10B981' }} />
            ) : (
              <OfflineIcon sx={{ fontSize: 14, color: colorTokens.neutral[400] }} />
            )}
          </Tooltip>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.688rem',
                fontWeight: 600,
                backgroundColor: colorTokens.primary[600],
                color: 'white',
              }}
            />
          )}
        </Stack>
        {unreadCount > 0 && (
          <Tooltip title={t("frontdesk.dashboard.markAllAsRead")}>
            <IconButton
              size="small"
              onClick={markAllAsRead}
              sx={{
                padding: '4px',
                '&:hover': {
                  backgroundColor: colorTokens.primary[50],
                },
              }}
            >
              <ReadIcon sx={{ fontSize: 16, color: colorTokens.primary[600] }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Filter Chips */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          backgroundColor: 'white',
        }}
      >
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
          <Chip
            label={`${t("frontdesk.dashboard.unread")} ${filterCounts.unread > 0 ? `(${filterCounts.unread})` : ''}`}
            variant={activeFilter === 'unread' ? 'filled' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('unread')}
            sx={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              height: 24,
              '&:hover': {
                backgroundColor: activeFilter === 'unread' ? undefined : colorTokens.primary[50],
              },
            }}
          />
          <Chip
            label={`${t("frontdesk.dashboard.mentions")} ${filterCounts.mentions > 0 ? `(${filterCounts.mentions})` : ''}`}
            variant={activeFilter === 'mentions' ? 'filled' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('mentions')}
            sx={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              height: 24,
              '&:hover': {
                backgroundColor: activeFilter === 'mentions' ? undefined : colorTokens.primary[50],
              },
            }}
          />
          <Chip
            label={`${t("frontdesk.dashboard.assignments")} ${filterCounts.assignments > 0 ? `(${filterCounts.assignments})` : ''}`}
            variant={activeFilter === 'assignments' ? 'filled' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('assignments')}
            sx={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              height: 24,
              '&:hover': {
                backgroundColor: activeFilter === 'assignments' ? undefined : colorTokens.primary[50],
              },
            }}
          />
          <Chip
            label={t("frontdesk.dashboard.all")}
            variant={activeFilter === 'all' ? 'filled' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => setActiveFilter('all')}
            sx={{
              cursor: 'pointer',
              fontSize: '0.75rem',
              height: 24,
              '&:hover': {
                backgroundColor: activeFilter === 'all' ? undefined : colorTokens.primary[50],
              },
            }}
          />
        </Stack>
      </Box>

      {/* Notification List */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'white' }}>
        {!currentAccountId ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: colorTokens.neutral[500], fontSize: '0.813rem' }}>
              {t("frontdesk.dashboard.waitingForAccountSelection")}
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'error.main', fontSize: '0.813rem' }}>
              {error}
            </Typography>
          </Box>
        ) : loading && notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
            <Typography
              variant="body2"
              sx={{ color: colorTokens.neutral[500], fontSize: '0.813rem', mt: 1 }}
            >
              {t("frontdesk.dashboard.loadingNotifications")}
            </Typography>
          </Box>
        ) : groupedNotifications.length === 0 ? (
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
              icon={<NotificationsIcon sx={{ fontSize: 48, color: colorTokens.neutral[300] }} />}
              title={t("frontdesk.dashboard.noNotifications")}
              description={
                activeFilter === 'unread'
                  ? t("frontdesk.dashboard.allCaughtUpNoUnreadNotifications")
                  : t("frontdesk.dashboard.noNotificationsFound", { filter: activeFilter })
              }
            />
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {groupedNotifications.map((group, groupIndex) => {
              const groupKey = group.label.toLowerCase();
              const isExpanded = expandedGroups.has(groupKey);

              return (
                <React.Fragment key={groupKey}>
                  {/* Group Header */}
                  <ListItem
                    onClick={() => toggleGroup(groupKey)}
                    sx={{
                      px: 2,
                      py: 0.75,
                      cursor: 'pointer',
                      backgroundColor: colorTokens.neutral[50],
                      '&:hover': {
                        backgroundColor: colorTokens.neutral[100],
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        color: colorTokens.neutral[700],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {group.label} ({group.notifications.length})
                    </Typography>
                  </ListItem>

                  {/* Group Notifications */}
                  {isExpanded &&
                    group.notifications.map((notification, index) => {
                      const isUnread = !notification.read_at;
                      const isNew = newNotificationIds.has(notification.id);
                      const avatarData = getSenderAvatarData(notification);
                      const typeInfo = getNotificationTypeInfo(notification.notification_type);
                      const messagePreview = getMessagePreview(notification);
                      const timestamp = notification.created_at
                        ? notification.created_at * 1000
                        : Date.now();

                      return (
                        <React.Fragment key={notification.id}>
                          <ListItem
                            onClick={() => handleNotificationClick(notification)}
                            onContextMenu={(e) => handleContextMenuOpen(e, notification)}
                            ref={(el) => {
                              if (el) {
                                notificationRefs.current.set(notification.id, el);
                              }
                            }}
                            sx={{
                              px: 2,
                              py: 1.25,
                              cursor: 'pointer',
                              backgroundColor: isUnread ? colorTokens.primary[50] : 'white',
                              borderLeft: isUnread ? `3px solid ${colorTokens.primary[600]}` : '3px solid transparent',
                              animation: isNew ? 'pulse 0.5s ease-in-out' : 'none',
                              '@keyframes pulse': {
                                '0%': { backgroundColor: colorTokens.primary[100] },
                                '100%': { backgroundColor: isUnread ? colorTokens.primary[50] : 'white' },
                              },
                              '&:hover': {
                                backgroundColor: isUnread ? colorTokens.primary[100] : colorTokens.neutral[50],
                              },
                            }}
                          >
                            <Stack direction="row" spacing={1.5} sx={{ width: '100%', alignItems: 'flex-start' }}>
                              {/* Avatar */}
                              <Avatar
                                src={avatarData.src}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: avatarData.backgroundColor,
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  flexShrink: 0,
                                }}
                                alt={avatarData.displayName}
                                title={avatarData.displayName}
                              >
                                {avatarData.initials}
                              </Avatar>

                              {/* Content */}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                {/* Header Row */}
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  spacing={1}
                                  sx={{ mb: 0.5 }}
                                >
                                  <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                                    {/* Type Icon */}
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: typeInfo.color,
                                      }}
                                    >
                                      {typeInfo.icon}
                                    </Box>
                                    {/* Sender Name */}
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
                                      {avatarData.displayName}
                                    </Typography>
                                    {/* Unread Indicator */}
                                    {isUnread && (
                                      <DotIcon
                                        sx={{
                                          fontSize: 8,
                                          color: colorTokens.primary[600],
                                          flexShrink: 0,
                                        }}
                                      />
                                    )}
                                  </Stack>
                                  {/* Timestamp */}
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
                                    fontWeight: isUnread ? 500 : 400,
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
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.688rem',
                                    color: typeInfo.color,
                                    fontWeight: 500,
                                    mt: 0.25,
                                  }}
                                >
                                  {typeInfo.label}
                                </Typography>
                              </Box>

                              {/* Actions Menu */}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContextMenuOpen(e, notification);
                                }}
                                sx={{
                                  padding: '4px',
                                  opacity: 0.6,
                                  '&:hover': {
                                    opacity: 1,
                                    backgroundColor: colorTokens.neutral[100],
                                  },
                                }}
                              >
                                <MoreIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>
                          </ListItem>
                          {index < group.notifications.length - 1 && (
                            <Divider sx={{ ml: 7, borderColor: colorTokens.neutral[100] }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  {groupIndex < groupedNotifications.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={contextMenuAnchor?.el}
        open={Boolean(contextMenuAnchor)}
        onClose={handleContextMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {currentNotification && (
          <>
            {!currentNotification.read_at ? (
              <MenuItem onClick={() => handleMarkAsRead(currentNotification)}>
                <ListItemIcon>
                  <ReadIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText>{t("frontdesk.dashboard.markAsRead")}</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => handleMarkAsUnread(currentNotification)}>
                <ListItemIcon>
                  <UnreadIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText>{t("frontdesk.dashboard.markAsUnread")}</ListItemText>
              </MenuItem>
            )}
            <MenuItem onClick={() => handleSnooze(currentNotification, 1)}>
              <ListItemIcon>
                <SnoozeIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.dashboard.snoozeFor1Hour")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleSnooze(currentNotification, 24)}>
              <ListItemIcon>
                <SnoozeIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.dashboard.snoozeFor24Hours")}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleDelete(currentNotification)}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>{t("frontdesk.dashboard.delete")}</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default ChatwootNotificationsEnhanced;

