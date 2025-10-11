import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import {
  frontdeskNotificationsAtom,
  notificationCountsSelector,
  messageNotificationsSelector,
  ticketNotificationsSelector,
  IFrontdeskNotification,
} from '@/store/frontdesk/atoms/notifications.atoms';

/**
 * Hook for managing FrontDesk notifications
 * Provides state, actions, and navigation handlers
 */
export const useFrontdeskNotifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useRecoilState(frontdeskNotificationsAtom);
  const counts = useRecoilValue(notificationCountsSelector);
  const messageNotifications = useRecoilValue(messageNotificationsSelector);
  const ticketNotifications = useRecoilValue(ticketNotificationsSelector);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    },
    [setNotifications]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [setNotifications]);

  /**
   * Handle notification click - mark as read and navigate
   */
  const handleNotificationClick = useCallback(
    (notification: IFrontdeskNotification) => {
      // Mark as read
      markAsRead(notification.id);

      // Navigate based on notification type
      if (notification.type === 'MESSAGE') {
        // Navigate to specific conversation in FrontDesk
        const channel = notification.metadata.channel?.toLowerCase() || 'internal';
        const conversationId = notification.metadata.conversationId;

        if (conversationId) {
          router.push(`/frontdesk/inbox?channel=${channel}&conversation=${conversationId}`);
        } else {
          router.push(`/frontdesk/inbox?channel=${channel}`);
        }
      } else if (notification.type === 'TICKET') {
        // Navigate to specific ticket
        const ticketId = notification.metadata.ticketId;

        if (ticketId) {
          router.push(`/frontdesk/inbox?view=my-tickets&ticket=${ticketId}`);
        } else {
          router.push(`/frontdesk/inbox?view=my-tickets`);
        }
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
   * Clear all read notifications (cleanup)
   */
  const clearReadNotifications = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  }, [setNotifications]);

  return {
    // State
    notifications,
    messageNotifications,
    ticketNotifications,
    counts,

    // Actions
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
    navigateToFrontdesk,
    clearReadNotifications,

    // Computed
    hasNotifications: counts.total > 0,
    hasMessages: counts.messages > 0,
    hasTickets: counts.tickets > 0,
  };
};
