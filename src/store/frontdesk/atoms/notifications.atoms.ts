import { atom, selector } from 'recoil';
import {
  BackendNotification,
  BackendNotificationType,
  BackendNotificationPriority,
  mapNotificationToTab,
  isNotificationUnread,
} from '@/services/frontdesk/utils/notification-type-mapper';

/**
 * Export backend types for use in components
 */
export { BackendNotificationType, BackendNotificationPriority };
export type { BackendNotification };

/**
 * Atom: All FrontDesk notifications from backend
 * Initially empty - will be populated by API call on mount
 */
export const frontdeskNotificationsAtom = atom<BackendNotification[]>({
  key: 'frontdesk.notifications.all',
  default: [],
});

/**
 * Atom: Loading state for notifications
 */
export const notificationsLoadingAtom = atom<boolean>({
  key: 'frontdesk.notifications.loading',
  default: false,
});

/**
 * Atom: Error state for notifications
 */
export const notificationsErrorAtom = atom<string | null>({
  key: 'frontdesk.notifications.error',
  default: null,
});

/**
 * Selector: Unread notifications count by tab type
 * Returns total count and breakdown by Messages/Tickets
 */
export const notificationCountsSelector = selector<{
  total: number;
  messages: number;
  tickets: number;
}>({
  key: 'frontdesk.notifications.counts',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    const unreadNotifications = notifications.filter(isNotificationUnread);

    const messages = unreadNotifications.filter(
      (n) => mapNotificationToTab(n.type) === 'MESSAGE'
    ).length;

    const tickets = unreadNotifications.filter(
      (n) => mapNotificationToTab(n.type) === 'TICKET'
    ).length;

    return {
      total: unreadNotifications.length,
      messages,
      tickets,
    };
  },
});

/**
 * Selector: Message notifications only (DM_RECEIVED, DM_MENTION, etc.)
 * Returns ALL message notifications (both read and unread)
 * Sorted by creation date (newest first)
 */
export const messageNotificationsSelector = selector<BackendNotification[]>({
  key: 'frontdesk.notifications.messages',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    return notifications
      .filter((n) => {
        // Filter by Messages tab only (show both read and unread)
        return mapNotificationToTab(n.type) === 'MESSAGE';
      })
      .sort((a, b) => {
        // Sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },
});

/**
 * Selector: Ticket notifications only (TICKET_ASSIGNED, TICKET_SLA_BREACH, etc.)
 * Returns ALL ticket notifications (both read and unread)
 * Sorted by creation date (newest first)
 */
export const ticketNotificationsSelector = selector<BackendNotification[]>({
  key: 'frontdesk.notifications.tickets',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    return notifications
      .filter((n) => {
        // Filter by Tickets tab only (show both read and unread)
        return mapNotificationToTab(n.type) === 'TICKET';
      })
      .sort((a, b) => {
        // Sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },
});

/**
 * Selector: All unread notifications (for debugging/admin views)
 */
export const unreadNotificationsSelector = selector<BackendNotification[]>({
  key: 'frontdesk.notifications.unread',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    return notifications.filter(isNotificationUnread);
  },
});

/**
 * Selector: Get notification by ID
 */
export const getNotificationByIdSelector = (id: string) =>
  selector<BackendNotification | null>({
    key: `frontdesk.notifications.byId.${id}`,
    get: ({ get }) => {
      const notifications = get(frontdeskNotificationsAtom);
      return notifications.find((n) => n.id === id) || null;
    },
  });
