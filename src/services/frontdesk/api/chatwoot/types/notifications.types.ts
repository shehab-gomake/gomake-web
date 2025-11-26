/**
 * Chatwoot Notifications Types
 *
 * Type definitions for notification-related API requests and responses
 * Based on NOTIFICATIONS_FRONTEND_API_GUIDE.md
 */

/**
 * Notification Sort Order
 */
export enum NotificationSortOrder {
  DESC = "desc",
  ASC = "asc",
}

/**
 * Notification Types
 * All possible notification types in Chatwoot
 */
export enum NotificationType {
  CONVERSATION_CREATION = "conversation_creation",
  CONVERSATION_ASSIGNMENT = "conversation_assignment",
  ASSIGNED_CONVERSATION_NEW_MESSAGE = "assigned_conversation_new_message",
  CONVERSATION_MENTION = "conversation_mention",
  PARTICIPATING_CONVERSATION_NEW_MESSAGE = "participating_conversation_new_message",
  SLA_MISSED_FIRST_RESPONSE = "sla_missed_first_response",
  SLA_MISSED_NEXT_RESPONSE = "sla_missed_next_response",
  SLA_MISSED_RESOLUTION = "sla_missed_resolution",
}

/**
 * Notification List Query Parameters
 * Query parameters for GET /api/v1/accounts/{accountId}/notifications
 */
export interface NotificationListParams {
  /** Page number for pagination (starts at 1) */
  page?: number;

  /** Sort order (desc or asc, default: desc) */
  sort_order?: NotificationSortOrder | string;

  /** Include additional notification types: 'read', 'snoozed' */
  includes?: ("read" | "snoozed")[];
}

/**
 * Chatwoot Notification (NotificationDTO)
 * Represents a notification in Chatwoot
 * Based on NotificationDTO from NOTIFICATIONS_FRONTEND_API_GUIDE.md
 */
export interface ChatwootNotification {
  id: number;
  notification_type: NotificationType | string;
  push_message_title?: string;
  push_message_body?: string;
  primary_actor_type: string; // Always "Conversation"
  primary_actor_id: number; // Conversation ID
  primary_actor?: {
    id: number;
    conversation_id?: number;
    display_id?: string;
    inbox_id?: number;
    status?: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    type?: string;
    meta?: {
      assignee?: {
        id: number;
        name: string;
        thumbnail?: string;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  secondary_actor?: {
    id: number;
    content?: string;
    message_type?: number;
    sender?: {
      id: number;
      name: string;
      thumbnail?: string;
    };
    name?: string;
    email?: string;
    avatar_url?: string;
    type?: string;
    [key: string]: any;
  };
  read_at: string | null;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  user_id?: number;
  created_at: number; // Unix timestamp
  last_activity_at?: number; // Unix timestamp
  snoozed_until: string | null;
  meta?: Record<string, any>;
  account_id?: number;
  updated_at?: string;
}

/**
 * Notification List Response
 * Response structure for GET /api/v1/accounts/{accountId}/notifications
 */
export interface NotificationListResponse {
  data: {
    meta: {
      unread_count: number;
      count: number;
      current_page: number;
    };
    payload: ChatwootNotification[];
  };
}

/**
 * Unread Count Response
 * Response for GET /api/v1/accounts/{accountId}/notifications/unread_count
 */
export interface UnreadCountResponse {
  unread_count: number;
}

/**
 * Mark Conversation as Read Request
 * Request body for POST /api/v1/accounts/{accountId}/notifications/read_all
 */
export interface MarkConversationAsReadRequest {
  primary_actor_type: "Conversation";
  primary_actor_id: number;
}

/**
 * Snooze Notification Request
 * Request body for POST /api/v1/accounts/{accountId}/notifications/{id}/snooze
 */
export interface SnoozeNotificationRequest {
  snoozed_until: string | null;
}

/**
 * Destroy All Request
 * Request body for POST /api/v1/accounts/{accountId}/notifications/destroy_all
 */
export interface DestroyAllRequest {
  type: "all" | "read";
}

/**
 * WebSocket Event Payloads
 */

/**
 * Notification Created Event
 * Sent when a new notification is created
 */
export interface NotificationCreatedEvent {
  notification: ChatwootNotification;
  unread_count: number;
  count: number;
  account_id: number;
  performer?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * Notification Updated Event
 * Sent when a notification is updated (read, snoozed, etc.)
 */
export interface NotificationUpdatedEvent {
  notification: ChatwootNotification;
  unread_count: number;
  count: number;
  account_id: number;
}

/**
 * Notification Deleted Event
 * Sent when a notification is deleted
 */
export interface NotificationDeletedEvent {
  notification: {
    id: number;
  };
  unread_count: number;
  count: number;
  account_id: number;
}

