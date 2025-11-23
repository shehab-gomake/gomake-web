/**
 * Chatwoot Enum Types
 *
 * Re-exports all enums for convenience.
 */

// Conversation enums (from custom types)
export { ConversationStatus, ConversationAssigneeType, ConversationSortBy } from './conversations.types';

// Inbox/Channel enums (from custom types)
export { ChannelType } from './inboxes.types';
export type { InboxProvider } from './inboxes.types';

// Notification enums (from custom types)
export { NotificationSortOrder } from './notifications.types';

// Agent enums (from agents.types)
export type { AgentAvailabilityStatus, AgentRole } from './agents.types';

// Message enums (from messages.types)
export type {
  MessageType,
  MessageStatus,
  MessageContentType,
  MessageSenderType,
} from './messages.types';
