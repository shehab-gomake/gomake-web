/**
 * FrontDesk WebSocket Services
 * Centralized export for all real-time communication services
 */

export { messagingService, MessagingService } from './messaging-socket.service';
export { ticketSocketService } from './ticket-socket.service';
export { directMessagesWebSocketService, DirectMessagesWebSocketService } from './direct-messages-websocket.service';
export { notificationsWebSocketService, NotificationsWebSocketService } from './notifications-websocket.service';
export { emailWebSocketService } from './email-websocket.service';
export type { EmailSocketEvent } from './email-websocket.service';
export { chatwootWebSocketService, ChatwootWebSocketService } from './chatwoot-websocket.service';
export type {
  ChatwootWebSocketEvent,
  ConnectionState,
  ChatwootWebSocketEventData,
  ChatwootEventHandler,
  ConnectionStateHandler,
  ErrorHandler,
  SubscriptionConfig,
  ConnectionStats,
} from './chatwoot-websocket.service';

// Chatwoot Notifications WebSocket Helper
export {
  chatwootNotificationsWebSocketHelper,
  ChatwootNotificationsWebSocketHelper,
} from './chatwoot-notifications-websocket.helper';
export type {
  NotificationCreatedHandler,
  NotificationUpdatedHandler,
  NotificationDeletedHandler,
  UnreadCountChangeHandler,
} from './chatwoot-notifications-websocket.helper';

// Chatwoot Conversations WebSocket Helper
export {
  chatwootConversationsWebSocketHelper,
  ChatwootConversationsWebSocketHelper,
} from './chatwoot-conversations-websocket.helper';
export type {
  ConversationCreatedEvent,
  ConversationUpdatedEvent,
  ConversationStatusChangedEvent,
  MessageCreatedEvent,
  AssigneeChangedEvent,
  TypingEvent,
  ConversationCreatedHandler,
  ConversationUpdatedHandler,
  ConversationStatusChangedHandler,
  MessageCreatedHandler,
  AssigneeChangedHandler,
  TypingHandler,
} from './chatwoot-conversations-websocket.helper';

// Re-export types for convenience (rename Message to avoid conflicts with API types)
export type {
  Message as WebSocketMessage,
  PresenceData,
  SendMessageData,
  JoinChannelData,
  TypingData,
  MarkAsReadData,
  UpdateStatusData,
  GetPresenceData,
  SocketResponse,
  TypingIndicator,
  MessageConfirmedData,
  MessageEventHandler,
  PresenceEventHandler,
  TypingEventHandler,
  ConnectionEventHandler,
  ErrorEventHandler,
  MessageConfirmedHandler,
} from './messaging-socket.service';
