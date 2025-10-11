import { atom, selector } from 'recoil';

/**
 * Notification Types
 */
export type NotificationType = 'MESSAGE' | 'TICKET';

/**
 * Channel Types for Messages
 */
export type NotificationChannel = 'DM' | 'EMAIL' | 'WHATSAPP';

/**
 * Priority Levels for Tickets
 */
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * FrontDesk Notification Interface
 */
export interface IFrontdeskNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  metadata: {
    // For MESSAGE type
    channel?: NotificationChannel;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    conversationId?: string;

    // For TICKET type
    ticketNumber?: string;
    ticketId?: string;
    priority?: NotificationPriority;
    status?: string;
  };
}

/**
 * Atom: All FrontDesk notifications
 */
export const frontdeskNotificationsAtom = atom<IFrontdeskNotification[]>({
  key: 'frontdesk.notifications.all',
  default: [
    // Dummy Message Notifications
    {
      id: 'msg-1',
      type: 'MESSAGE',
      title: 'New message from John Smith',
      message: 'Hi, I need help with my recent order...',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      metadata: {
        channel: 'EMAIL',
        senderId: 'user-1',
        senderName: 'John Smith',
        senderAvatar: undefined,
        conversationId: 'conv-1',
      },
    },
    {
      id: 'msg-2',
      type: 'MESSAGE',
      title: 'New message from Sarah Johnson',
      message: 'Can you provide an update on ticket #2453?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      isRead: false,
      metadata: {
        channel: 'DM',
        senderId: 'user-2',
        senderName: 'Sarah Johnson',
        senderAvatar: undefined,
        conversationId: 'conv-2',
      },
    },
    {
      id: 'msg-3',
      type: 'MESSAGE',
      title: 'New message from Mike Wilson',
      message: 'Thank you for the quick response!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      metadata: {
        channel: 'WHATSAPP',
        senderId: 'user-3',
        senderName: 'Mike Wilson',
        senderAvatar: undefined,
        conversationId: 'conv-3',
      },
    },
    {
      id: 'msg-4',
      type: 'MESSAGE',
      title: 'New message from Emily Davis',
      message: 'I have a question about the pricing...',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      isRead: false,
      metadata: {
        channel: 'EMAIL',
        senderId: 'user-4',
        senderName: 'Emily Davis',
        senderAvatar: undefined,
        conversationId: 'conv-4',
      },
    },
    {
      id: 'msg-5',
      type: 'MESSAGE',
      title: 'New message from David Brown',
      message: 'When can I expect delivery?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isRead: false,
      metadata: {
        channel: 'DM',
        senderId: 'user-5',
        senderName: 'David Brown',
        senderAvatar: undefined,
        conversationId: 'conv-5',
      },
    },
    {
      id: 'msg-6',
      type: 'MESSAGE',
      title: 'New message from Lisa Anderson',
      message: 'I received the wrong item in my order',
      timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
      isRead: false,
      metadata: {
        channel: 'WHATSAPP',
        senderId: 'user-6',
        senderName: 'Lisa Anderson',
        senderAvatar: undefined,
        conversationId: 'conv-6',
      },
    },
    {
      id: 'msg-7',
      type: 'MESSAGE',
      title: 'New message from Robert Taylor',
      message: 'Can I change my order details?',
      timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
      isRead: false,
      metadata: {
        channel: 'EMAIL',
        senderId: 'user-7',
        senderName: 'Robert Taylor',
        senderAvatar: undefined,
        conversationId: 'conv-7',
      },
    },
    {
      id: 'msg-8',
      type: 'MESSAGE',
      title: 'New message from Jennifer Martinez',
      message: 'The product quality is excellent!',
      timestamp: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
      isRead: false,
      metadata: {
        channel: 'DM',
        senderId: 'user-8',
        senderName: 'Jennifer Martinez',
        senderAvatar: undefined,
        conversationId: 'conv-8',
      },
    },
    {
      id: 'msg-9',
      type: 'MESSAGE',
      title: 'New message from William Garcia',
      message: 'How do I track my shipment?',
      timestamp: new Date(Date.now() - 240 * 60 * 1000), // 4 hours ago
      isRead: false,
      metadata: {
        channel: 'WHATSAPP',
        senderId: 'user-9',
        senderName: 'William Garcia',
        senderAvatar: undefined,
        conversationId: 'conv-9',
      },
    },
    {
      id: 'msg-10',
      type: 'MESSAGE',
      title: 'New message from Mary Rodriguez',
      message: 'I need to return an item',
      timestamp: new Date(Date.now() - 300 * 60 * 1000), // 5 hours ago
      isRead: false,
      metadata: {
        channel: 'EMAIL',
        senderId: 'user-10',
        senderName: 'Mary Rodriguez',
        senderAvatar: undefined,
        conversationId: 'conv-10',
      },
    },

    // Dummy Ticket Notifications
    {
      id: 'ticket-1',
      type: 'TICKET',
      title: 'New ticket assigned to you',
      message: 'Payment processing issue - Customer cannot complete checkout',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      isRead: false,
      metadata: {
        ticketNumber: 'TICKET-1234',
        ticketId: 'tick-1',
        priority: 'URGENT',
        status: 'New',
      },
    },
    {
      id: 'ticket-2',
      type: 'TICKET',
      title: 'Ticket status updated',
      message: 'Product quality concern - Customer received damaged goods',
      timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      isRead: false,
      metadata: {
        ticketNumber: 'TICKET-1233',
        ticketId: 'tick-2',
        priority: 'HIGH',
        status: 'In Progress',
      },
    },
    {
      id: 'ticket-3',
      type: 'TICKET',
      title: 'New comment on ticket',
      message: 'Shipping delay inquiry - Customer asking about ETA',
      timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
      isRead: false,
      metadata: {
        ticketNumber: 'TICKET-1232',
        ticketId: 'tick-3',
        priority: 'MEDIUM',
        status: 'Active',
      },
    },
    {
      id: 'ticket-4',
      type: 'TICKET',
      title: 'Ticket escalated',
      message: 'Feature request - Custom printing options',
      timestamp: new Date(Date.now() - 75 * 60 * 1000), // 1.25 hours ago
      isRead: false,
      metadata: {
        ticketNumber: 'TICKET-1231',
        ticketId: 'tick-4',
        priority: 'LOW',
        status: 'New',
      },
    },
    {
      id: 'ticket-5',
      type: 'TICKET',
      title: 'Ticket assigned to you',
      message: 'Account access issue - Customer locked out',
      timestamp: new Date(Date.now() - 150 * 60 * 1000), // 2.5 hours ago
      isRead: false,
      metadata: {
        ticketNumber: 'TICKET-1230',
        ticketId: 'tick-5',
        priority: 'HIGH',
        status: 'New',
      },
    },
  ],
});

/**
 * Selector: Unread notifications count by type
 */
export const notificationCountsSelector = selector<{
  total: number;
  messages: number;
  tickets: number;
}>({
  key: 'frontdesk.notifications.counts',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    const unreadNotifications = notifications.filter(n => !n.isRead);

    return {
      total: unreadNotifications.length,
      messages: unreadNotifications.filter(n => n.type === 'MESSAGE').length,
      tickets: unreadNotifications.filter(n => n.type === 'TICKET').length,
    };
  },
});

/**
 * Selector: Message notifications only
 */
export const messageNotificationsSelector = selector<IFrontdeskNotification[]>({
  key: 'frontdesk.notifications.messages',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    return notifications
      .filter(n => n.type === 'MESSAGE' && !n.isRead)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },
});

/**
 * Selector: Ticket notifications only
 */
export const ticketNotificationsSelector = selector<IFrontdeskNotification[]>({
  key: 'frontdesk.notifications.tickets',
  get: ({ get }) => {
    const notifications = get(frontdeskNotificationsAtom);
    return notifications
      .filter(n => n.type === 'TICKET' && !n.isRead)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },
});
