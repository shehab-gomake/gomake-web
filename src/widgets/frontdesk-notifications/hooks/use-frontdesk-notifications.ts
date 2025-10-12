import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import {
  frontdeskNotificationsAtom,
  notificationCountsSelector,
  messageNotificationsSelector,
  ticketNotificationsSelector,
  notificationsLoadingAtom,
  notificationsErrorAtom,
  BackendNotification,
} from '@/store/frontdesk/atoms/notifications.atoms';
import {
  notificationsService,
  notificationsWebSocketService,
} from '@/services/frontdesk';

/**
 * Hook for managing FrontDesk notifications
 * Provides state, actions, real-time updates, and navigation handlers
 */
export const useFrontdeskNotifications = () => {
  const router = useRouter();

  // State
  const [notifications, setNotifications] = useRecoilState(frontdeskNotificationsAtom);
  const [loading, setLoading] = useRecoilState(notificationsLoadingAtom);
  const [error, setError] = useRecoilState(notificationsErrorAtom);

  // Selectors
  const counts = useRecoilValue(notificationCountsSelector);
  const messageNotifications = useRecoilValue(messageNotificationsSelector);
  const ticketNotifications = useRecoilValue(ticketNotificationsSelector);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedNotifications = await notificationsService.getNotifications({
        unreadOnly: true,
        limit: 50,
      });

      setNotifications(fetchedNotifications);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      console.error('[useFrontdeskNotifications] Fetch error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setNotifications, setLoading, setError]);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, readAt: new Date() } : n
          )
        );

        // API call
        await notificationsService.markAsRead(notificationId);
      } catch (err) {
        console.error('[useFrontdeskNotifications] Mark as read error:', err);

        // Revert optimistic update on error
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, readAt: null } : n
          )
        );

        throw err;
      }
    },
    [setNotifications]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      const now = new Date();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: now }))
      );

      // API call
      await notificationsService.markAllAsRead();
    } catch (err) {
      console.error('[useFrontdeskNotifications] Mark all as read error:', err);

      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: null }))
      );

      throw err;
    }
  }, [setNotifications]);

  /**
   * Handle notification click - mark as read and navigate
   */
  const handleNotificationClick = useCallback(
    async (notification: BackendNotification) => {
      try {
        // Mark as read if unread
        if (!notification.readAt) {
          await markAsRead(notification.id);
        }

        // Navigate based on entity type
        if (notification.entityType === 'ticket' && notification.entityId) {
          // Navigate to specific ticket
          router.push(`/frontdesk/inbox?view=my-tickets&ticket=${notification.entityId}`);
        } else if (notification.entityType === 'conversation' && notification.entityId) {
          // Navigate to specific conversation
          router.push(`/frontdesk/inbox?view=internal&conversation=${notification.entityId}`);
        } else if (notification.entityType === 'message' && notification.entityId) {
          // Navigate to message's conversation
          router.push(`/frontdesk/inbox?view=internal&message=${notification.entityId}`);
        } else {
          // Default: navigate to frontdesk inbox
          router.push('/frontdesk/inbox');
        }
      } catch (err) {
        console.error('[useFrontdeskNotifications] Click handler error:', err);
      }
    },
    [markAsRead, router]
  );

  /**
   * Navigate to FrontDesk main view
   */
  const navigateToFrontdesk = useCallback(() => {
    router.push('/frontdesk/inbox');
  }, [router]);

  /**
   * Retry fetching notifications (for error recovery)
   */
  const retryFetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Setup WebSocket connection and event handlers
   */
  useEffect(() => {
    // Connect to WebSocket
    notificationsWebSocketService.connect();

    // Handle new notification
    notificationsWebSocketService.onNewNotification((notification) => {
      console.log('[useFrontdeskNotifications] New notification received:', notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    // Handle notification read
    notificationsWebSocketService.onNotificationRead(({ id, readAt }) => {
      console.log('[useFrontdeskNotifications] Notification marked as read:', id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date(readAt) } : n))
      );
    });

    // Handle unread count change
    notificationsWebSocketService.onUnreadCountChange(({ count }) => {
      console.log('[useFrontdeskNotifications] Unread count changed:', count);
      // Count is automatically calculated by selector, so we don't need to do anything
    });

    // Handle connection state
    notificationsWebSocketService.onConnectionChange((connected) => {
      console.log('[useFrontdeskNotifications] WebSocket connection:', connected ? 'Connected' : 'Disconnected');
    });

    // Handle errors
    notificationsWebSocketService.onError((error) => {
      console.error('[useFrontdeskNotifications] WebSocket error:', error);
      setError(`WebSocket error: ${error}`);
    });

    // Cleanup on unmount
    return () => {
      notificationsWebSocketService.clearHandlers();
      notificationsWebSocketService.disconnect();
    };
  }, [setNotifications, setError]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    // State
    notifications,
    messageNotifications,
    ticketNotifications,
    counts,
    loading,
    error,

    // Actions
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    navigateToFrontdesk,
    retryFetch,
    fetchNotifications,

    // Computed
    hasNotifications: counts.total > 0,
    hasMessages: counts.messages > 0,
    hasTickets: counts.tickets > 0,
  };
};
