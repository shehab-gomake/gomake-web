/**
 * FrontDesk WebSocket Services
 * Centralized export for all real-time communication services
 */

export { messagingService, MessagingService } from './messaging-socket.service';
export { ticketSocketService } from './ticket-socket.service';
export { directMessagesWebSocketService, DirectMessagesWebSocketService } from './direct-messages-websocket.service';
export { notificationsWebSocketService, NotificationsWebSocketService } from './notifications-websocket.service';

// Re-export types for convenience
export type {
  Message,
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
