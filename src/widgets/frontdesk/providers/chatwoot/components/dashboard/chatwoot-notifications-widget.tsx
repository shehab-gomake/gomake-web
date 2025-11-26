/**
 * Chatwoot Notifications Widget
 *
 * Compact notifications widget for dashboard display.
 * Shows recent notifications with real-time updates.
 */

import React, { useMemo, useState } from 'react';
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
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as DotIcon,
  Wifi as OnlineIcon,
  WifiOff as OfflineIcon,
  ArrowForward as ArrowForwardIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { useChatwootNotifications } from '../../hooks/use-chatwoot-notifications';
import { useChatwootProvider } from '../../hooks/use-chatwoot-provider';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { EmptyState } from '@/widgets/frontdesk/design-system';
import type { ChatwootNotification } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { NotificationType } from '@/services/frontdesk/api/chatwoot/types/notifications.types';
import { formatTimeAgo } from '../../utils/date-utils';
import { getNotificationSender, getMessagePreview } from '../../utils/notification-formatters';

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
    notificationMeta,
    wsConnected,
    filters,
    updateFilters,
    markConversationAsRead,
    markAllAsRead,
    deleteAll,
    deleteAllRead,
    refresh,
  } = useChatwootNotifications();
  const { router: chatwootRouter, selectedAccountId } = useChatwootProvider();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Check if showing all notifications (including read)
  const showingAllNotifications = filters.includes?.includes('read') || false;

  // Get recent notifications based on filter
  const recentNotifications = useMemo(() => {
    if (showingAllNotifications) {
      // Show all notifications (read + unread)
      return notifications.slice(0, maxItems);
    } else {
      // Show only unread notifications
      const unread = notifications.filter((n) => !n.read_at);
      return unread.slice(0, maxItems);
    }
  }, [notifications, maxItems, showingAllNotifications]);

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

  // Get sender info using shared formatter
  const getSenderInfo = (notification: ChatwootNotification) => {
    const sender = getNotificationSender(notification, primaryColor(500));
    const primaryActor = notification.primary_actor as any;
    return {
      name: sender.name,
      initials: sender.initials,
      color: sender.color,
      avatar: sender.thumbnail || primaryActor?.avatar_url || null,
    };
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMarkAllAsRead = async () => {
    handleMenuClose();
    try {
      await markAllAsRead();
      await refresh();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDeleteAll = async () => {
    handleMenuClose();
    try {
      await deleteAll();
      await refresh();
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  };

  const handleDeleteAllRead = async () => {
    handleMenuClose();
    try {
      await deleteAllRead();
      await refresh();
    } catch (err) {
      console.error('Failed to delete all read notifications:', err);
    }
  };

  const handleFilterToggle = (_event: React.MouseEvent<HTMLElement>, value: 'unread' | 'all' | null) => {
    if (value === null) return;
    
    if (value === 'all') {
      // Show all notifications (including read)
      updateFilters({
        includes: ['read'],
        page: 1,
      });
    } else {
      // Show only unread notifications
      updateFilters({
        includes: undefined,
        page: 1,
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {showHeader && (
        <Box
          sx={{
            px: 3,
            py: 2,
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
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: colorTokens.neutral[900],
              }}
            >
              Notifications
            </Typography>
            {(() => {
              // Use count and unread_count from API response
              const displayCount = showingAllNotifications 
                ? notificationMeta.count 
                : notificationMeta.unread_count;
              
              // Only show counter if there are notifications
              if (displayCount > 0) {
                return (
                  <Chip
                    label={displayCount}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.688rem',
                      fontWeight: 600,
                      backgroundColor: showingAllNotifications 
                        ? colorTokens.neutral[500] 
                        : primaryColor(600),
                      color: 'white',
                    }}
                  />
                );
              }
              return null;
            })()}
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
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Filter Toggle */}
            <ToggleButtonGroup
              value={showingAllNotifications ? 'all' : 'unread'}
              exclusive
              onChange={handleFilterToggle}
              size="small"
              sx={{
                height: 28,
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  border: `1px solid ${colorTokens.neutral[300]}`,
                  color: colorTokens.neutral[700],
                  '&.Mui-selected': {
                    backgroundColor: primaryColor(600),
                    color: 'white',
                    borderColor: primaryColor(600),
                    '&:hover': {
                      backgroundColor: primaryColor(700),
                    },
                  },
                  '&:hover': {
                    backgroundColor: colorTokens.neutral[50],
                  },
                },
              }}
            >
              <ToggleButton value="unread" aria-label="unread only">
                Unread
              </ToggleButton>
              <ToggleButton value="all" aria-label="all notifications">
                All
              </ToggleButton>
            </ToggleButtonGroup>
            
            {recentNotifications.length > 0 && (
              <>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: colorTokens.neutral[100],
                    },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 18, color: colorTokens.neutral[700] }} />
                </IconButton>
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
              </>
            )}
          </Stack>
        </Box>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            borderRadius: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <MenuItem
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          sx={{
            fontSize: '0.875rem',
            py: 1.5,
            '&:hover': {
              backgroundColor: colorTokens.neutral[50],
            },
          }}
        >
          Mark all as read
        </MenuItem>
        <MenuItem
          onClick={handleDeleteAllRead}
          disabled={notifications.filter((n) => n.read_at).length === 0}
          sx={{
            fontSize: '0.875rem',
            py: 1.5,
            '&:hover': {
              backgroundColor: colorTokens.neutral[50],
            },
          }}
        >
          Delete all read
        </MenuItem>
        <MenuItem
          onClick={handleDeleteAll}
          disabled={notifications.length === 0}
          sx={{
            fontSize: '0.875rem',
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: colorTokens.error[50],
            },
          }}
        >
          Delete all
        </MenuItem>
      </Menu>

      {/* Notifications List */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
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
              title={showingAllNotifications ? "No notifications" : "No unread notifications"}
              description={showingAllNotifications ? "No notifications to display." : "All caught up! No new notifications."}
            />
          </Box>
        ) : (
          <List sx={{ py: 0.5 }}>
            {recentNotifications.map((notification) => {
              const sender = getSenderInfo(notification);
              const typeInfo = getNotificationTypeInfo(notification.notification_type);
              const messagePreview = getMessagePreview(notification, 60);
              // created_at is Unix timestamp in seconds, formatTimeAgo handles it correctly
              const timestamp = notification.created_at;

              return (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    // Different background colors for read vs unread
                    backgroundColor: notification.read_at 
                      ? colorTokens.neutral[50] // Read: light gray background
                      : primaryColor(50), // Unread: colored background
                    '&:hover': {
                      backgroundColor: notification.read_at
                        ? colorTokens.neutral[100]
                        : primaryColor(100),
                    },
                    borderBottom: `1px solid ${colorTokens.neutral[100]}`,
                    // Add left border indicator for unread notifications
                    borderLeft: notification.read_at 
                      ? 'none' 
                      : `3px solid ${primaryColor(600)}`,
                    pl: notification.read_at ? 2 : 1.5, // Adjust padding when border is present
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
                            fontWeight: notification.read_at ? 400 : 600, // Bold for unread
                            color: notification.read_at 
                              ? colorTokens.neutral[600] // Lighter color for read
                              : colorTokens.neutral[900], // Darker color for unread
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
                          fontWeight: notification.read_at ? 400 : 500, // Slightly bolder for unread
                          color: notification.read_at 
                            ? colorTokens.neutral[500] // Lighter color for read
                            : colorTokens.neutral[700], // Darker color for unread
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
            View all notifications ({showingAllNotifications ? notificationMeta.count : notificationMeta.unread_count} {showingAllNotifications ? 'total' : 'unread'})
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatwootNotificationsWidget;

