/**
 * Chatwoot API Services
 * Centralized export for all Chatwoot API services and types
 * 
 * This is the main entry point for Chatwoot integration.
 * 
 * @example
 * ```typescript
 * // Import main service (recommended)
 * import { chatwootService } from '@/services/frontdesk/api/chatwoot';
 * 
 * // Or import specific services
 * import { ChatwootProfileService } from '@/services/frontdesk/api/chatwoot';
 * 
 * // Or import types
 * import { ChatwootUser } from '@/services/frontdesk/api/chatwoot';
 * ```
 */

// Main service (aggregator)
export * from "./chatwoot.service";

// Individual services (for advanced usage)
export * from "./services";

// Types
export * from "./types";

// HTTP Client (for custom implementations)
export * from "./chatwoot-http-client";

// Core base classes
export * from "./core";

// Re-export commonly used enums and types for convenience
export {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  type ConversationListParams,
  type ChatwootConversation,
  type ConversationListResponse,
  type ConversationDetailResponse,
} from "./types/conversations.types";

export {
  ChannelType,
  type ChatwootInbox,
  type InboxListResponse,
  type InboxDetailResponse,
  type InboxProvider,
} from "./types/inboxes.types";

export {
  NotificationType,
  NotificationSortOrder,
  type ChatwootNotification,
  type NotificationListParams,
  type NotificationListResponse,
  type UnreadCountResponse as ChatwootUnreadCountResponse,
  type NotificationCreatedEvent,
  type NotificationUpdatedEvent,
  type NotificationDeletedEvent,
} from "./types/notifications.types";

