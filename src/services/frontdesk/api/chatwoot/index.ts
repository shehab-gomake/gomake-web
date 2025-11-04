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

// HTTP Client (for custom implementations)
export * from "./chatwoot-http-client";

// Core base classes
export * from "./core";

// Types - Export explicitly to avoid naming conflicts with other FrontDesk services
// Profile types
export {
  type ChatwootUser,
  type ChatwootUserAccount,
} from "./types/profile.types";

// Conversation types
export {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  type ConversationListParams,
  type ChatwootConversation,
  type ChatwootEmailContent,
  type ChatwootContentAttributes,
  type ChatwootMessage,
  type ConversationListResponse,
  type ConversationDetailResponse,
} from "./types/conversations.types";

// Message types
export {
  type Message,
  type MessageDetailed,
  type ConversationMessages,
  type ConversationMessageCreatePayload,
  type MessageType,
  type MessageStatus,
  type MessageContentType,
  type MessageSenderType,
  type MessageListResponse,
  type MessageDetailResponse,
} from "./types/messages.types";

// Inbox types
export {
  ChannelType,
  type ChatwootInbox,
  type InboxListResponse,
  type InboxDetailResponse,
  type InboxProvider,
  type ContactableInbox,
  type ContactableInboxesResponse,
} from "./types/inboxes.types";

// Notification types (rename UnreadCountResponse to avoid conflict)
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
  type MarkConversationAsReadRequest,
  type SnoozeNotificationRequest,
  type DestroyAllRequest,
} from "./types/notifications.types";

// Contact types
export {
  type ContactDetail,
  type ContactListItem,
  type ContactMeta,
  type ContactCreatePayload,
  type ContactUpdatePayload,
  type ContactFilterRequest,
  type ContactConversationsResponse,
  type ContactListResponse,
  type ContactDetailResponse,
  type ContactsListResponse,
} from "./types/contacts.types";

// Agent types
export {
  type Agent,
  type AgentBot,
  type AgentListResponse,
  type AgentDetailResponse,
  type InboxAgentsResponse,
  type AgentAvailabilityStatus,
  type AgentRole,
  type AgentUpdatePayload,
} from "./types/agents.types";

// Team types
export {
  type Team,
  type TeamListResponse,
  type TeamDetailResponse,
  type TeamMemberPayload,
} from "./types/teams.types";

// Label types
export {
  type ConversationLabels,
  type Label,
  type LabelListResponse,
  type LabelDetailResponse,
} from "./types/labels.types";

// Compose types
export {
  type ComposeFormState,
  type WhatsAppTemplateParams,
  type CreateConversationPayload,
  type ComposeValidationErrors,
  ChannelFieldRequirements,
} from "@/services/frontdesk/api/chatwoot/types/compose.types";

// Enum types (for convenience)
export * from "./types/enums.types";

