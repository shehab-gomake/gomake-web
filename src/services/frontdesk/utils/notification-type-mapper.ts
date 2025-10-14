/**
 * Notification Type Mapper
 *
 * Maps backend notification types from Messaging Hub API to frontend tab types.
 * Backend has explicit notification types for tickets and direct messages.
 * Frontend organizes these into two tabs: Messages and Tickets.
 */

/**
 * Backend Notification Types (from Messaging Hub API)
 * These are auto-created when events occur (ticket assigned, DM received, etc.)
 */
export enum BackendNotificationType {
  // Ticket notifications
  TICKET_ASSIGNED = 'TICKET_ASSIGNED',
  TICKET_REASSIGNED = 'TICKET_REASSIGNED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_MESSAGE_RECEIVED = 'TICKET_MESSAGE_RECEIVED',
  TICKET_REOPENED = 'TICKET_REOPENED',
  TICKET_SLA_BREACH = 'TICKET_SLA_BREACH',
  TICKET_SLA_WARNING = 'TICKET_SLA_WARNING',

  // Direct message notifications
  DM_RECEIVED = 'DM_RECEIVED',
  DM_MENTION = 'DM_MENTION',

  // Email notifications
  EMAIL_RECEIVED = 'EMAIL_RECEIVED',

  // System notifications
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

/**
 * Backend Notification Priority Levels
 */
export enum BackendNotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Frontend tab types for FrontDesk notification dropdown
 */
export type FrontendTabType = 'MESSAGE' | 'TICKET';

/**
 * Backend notification structure (from Messaging Hub API)
 */
export interface BackendNotification {
  id: string;
  userId: string;
  printHouseId: string;
  type: BackendNotificationType;
  priority: BackendNotificationPriority;
  entityType?: string | null; // "ticket", "conversation", "message"
  entityId?: string | null;
  title: string;
  body?: string | null;
  metadata: any;
  readAt?: Date | null;
  dismissedAt?: Date | null;
  createdAt: Date;
}

/**
 * Map backend notification type to frontend tab type
 *
 * @param type - Backend notification type
 * @returns Frontend tab type ('MESSAGE' or 'TICKET')
 *
 * @example
 * mapNotificationToTab('TICKET_ASSIGNED') // returns 'TICKET'
 * mapNotificationToTab('DM_RECEIVED') // returns 'MESSAGE'
 */
export function mapNotificationToTab(
  type: BackendNotificationType
): FrontendTabType {
  // All ticket-related notification types
  const ticketTypes: BackendNotificationType[] = [
    BackendNotificationType.TICKET_ASSIGNED,
    BackendNotificationType.TICKET_REASSIGNED,
    BackendNotificationType.TICKET_UPDATED,
    BackendNotificationType.TICKET_MESSAGE_RECEIVED,
    BackendNotificationType.TICKET_REOPENED,
    BackendNotificationType.TICKET_SLA_BREACH,
    BackendNotificationType.TICKET_SLA_WARNING,
  ];

  // Check if notification is ticket-related
  if (ticketTypes.includes(type)) {
    return 'TICKET';
  }

  // All other types (DM_RECEIVED, DM_MENTION, EMAIL_RECEIVED, SYSTEM_ALERT) go to Messages tab
  return 'MESSAGE';
}

/**
 * Get icon for notification type
 * Used for displaying type indicator in notification items
 *
 * @param type - Backend notification type
 * @returns Icon emoji or symbol
 */
export function getNotificationIcon(type: BackendNotificationType): string {
  const iconMap: Record<BackendNotificationType, string> = {
    [BackendNotificationType.TICKET_ASSIGNED]: '🎫',
    [BackendNotificationType.TICKET_REASSIGNED]: '🔄',
    [BackendNotificationType.TICKET_UPDATED]: '✏️',
    [BackendNotificationType.TICKET_MESSAGE_RECEIVED]: '💬',
    [BackendNotificationType.TICKET_REOPENED]: '🔓',
    [BackendNotificationType.TICKET_SLA_BREACH]: '⚠️',
    [BackendNotificationType.TICKET_SLA_WARNING]: '⏰',
    [BackendNotificationType.DM_RECEIVED]: '✉️',
    [BackendNotificationType.DM_MENTION]: '👤',
    [BackendNotificationType.EMAIL_RECEIVED]: '📧',
    [BackendNotificationType.SYSTEM_ALERT]: '🔔',
  };

  return iconMap[type] || '📬';
}

/**
 * Get priority color for styling
 *
 * @param priority - Backend notification priority
 * @returns Color hex code
 */
export function getPriorityColor(priority: BackendNotificationPriority): string {
  const colorMap: Record<BackendNotificationPriority, string> = {
    [BackendNotificationPriority.URGENT]: '#EF4444', // Red
    [BackendNotificationPriority.HIGH]: '#F59E0B',   // Orange
    [BackendNotificationPriority.NORMAL]: '#3B82F6', // Blue
    [BackendNotificationPriority.LOW]: '#9CA3AF',    // Gray
  };

  return colorMap[priority] || colorMap[BackendNotificationPriority.NORMAL];
}

/**
 * Extract channel information from notification metadata
 * For DM notifications, determines the communication channel
 *
 * @param notification - Backend notification object
 * @returns Channel type ('DM', 'EMAIL', 'WHATSAPP', or null)
 */
export function extractChannel(notification: BackendNotification): 'DM' | 'EMAIL' | 'WHATSAPP' | null {
  if (!notification.metadata) return null;

  // Check metadata for channel information
  if (notification.metadata.channel) {
    const channel = notification.metadata.channel.toUpperCase();
    if (['DM', 'EMAIL', 'WHATSAPP'].includes(channel)) {
      return channel as 'DM' | 'EMAIL' | 'WHATSAPP';
    }
  }

  // Infer from notification type
  if (
    notification.type === BackendNotificationType.DM_RECEIVED ||
    notification.type === BackendNotificationType.DM_MENTION
  ) {
    return 'DM';
  }

  return null;
}

/**
 * Extract ticket priority from notification metadata
 *
 * @param notification - Backend notification object
 * @returns Ticket priority or null
 */
export function extractTicketPriority(
  notification: BackendNotification
): 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | null {
  if (!notification.metadata) return null;

  const priority = notification.metadata.priority || notification.metadata.ticketPriority;
  if (priority && typeof priority === 'string') {
    const upperPriority = priority.toUpperCase();
    if (['URGENT', 'HIGH', 'MEDIUM', 'LOW'].includes(upperPriority)) {
      return upperPriority as 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
    }
  }

  return null;
}

/**
 * Extract ticket number from notification metadata
 *
 * @param notification - Backend notification object
 * @returns Ticket number string or null
 */
export function extractTicketNumber(notification: BackendNotification): string | null {
  if (!notification.metadata) return null;
  return notification.metadata.ticketNumber || null;
}

/**
 * Check if notification is unread
 *
 * @param notification - Backend notification object
 * @returns true if notification is unread
 */
export function isNotificationUnread(notification: BackendNotification): boolean {
  return !notification.readAt && !notification.dismissedAt;
}
