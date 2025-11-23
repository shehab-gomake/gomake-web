/**
 * Chatwoot Notifications WebSocket Helper
 *
 * Provides specialized notification handling on top of the base Chatwoot WebSocket service.
 * Implements the notification event patterns from NOTIFICATIONS_FRONTEND_API_GUIDE.md
 *
 * This helper wraps the main chatwootWebSocketService to provide:
 * - Type-safe notification event handlers
 * - Automatic notification state updates
 * - Unread count tracking
 * - Event filtering and validation
 */

import {
  chatwootWebSocketService,
  ChatwootWebSocketEvent,
  type ChatwootWebSocketEventData,
  type SubscriptionConfig,
} from './chatwoot-websocket.service';
import {
  type NotificationCreatedEvent,
  type NotificationUpdatedEvent,
  type NotificationDeletedEvent,
  type ChatwootNotification,
} from '../api/chatwoot/types/notifications.types';
import { createLogger } from '../utils/logger';

const logger = createLogger('ChatwootNotificationsWebSocketHelper');

/**
 * Notification Event Handler Types
 */
export type NotificationCreatedHandler = (event: NotificationCreatedEvent) => void;
export type NotificationUpdatedHandler = (event: NotificationUpdatedEvent) => void;
export type NotificationDeletedHandler = (event: NotificationDeletedEvent) => void;
export type UnreadCountChangeHandler = (count: number) => void;

/**
 * Chatwoot Notifications WebSocket Helper
 *
 * This helper manages notification-specific WebSocket event handling
 * using the underlying chatwootWebSocketService.
 */
export class ChatwootNotificationsWebSocketHelper {
  private createdHandlers: Set<NotificationCreatedHandler> = new Set();
  private updatedHandlers: Set<NotificationUpdatedHandler> = new Set();
  private deletedHandlers: Set<NotificationDeletedHandler> = new Set();
  private unreadCountHandlers: Set<UnreadCountChangeHandler> = new Set();
  private isListening: boolean = false;

  /**
   * Start listening to notification events
   * This will register handlers with the main WebSocket service
   */
  public startListening(): void {
    if (this.isListening) {
      logger.warn('Already listening to notification events');
      return;
    }

    logger.info('Starting to listen to notification events');

    // Register handlers with the main WebSocket service
    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.NOTIFICATION_CREATED,
      this.handleNotificationCreated
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.NOTIFICATION_UPDATED,
      this.handleNotificationUpdated
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.NOTIFICATION_DELETED,
      this.handleNotificationDeleted
    );

    this.isListening = true;
  }

  /**
   * Stop listening to notification events
   */
  public stopListening(): void {
    if (!this.isListening) {
      return;
    }

    logger.info('Stopping notification event listeners');

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.NOTIFICATION_CREATED,
      this.handleNotificationCreated
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.NOTIFICATION_UPDATED,
      this.handleNotificationUpdated
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.NOTIFICATION_DELETED,
      this.handleNotificationDeleted
    );

    this.isListening = false;
  }

  /**
   * Handle notification.created event
   */
  private handleNotificationCreated = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = eventData.data as NotificationCreatedEvent;

      if (!this.validateNotificationCreatedEvent(event)) {
        logger.warn('Invalid notification.created event:', eventData);
        return;
      }

      logger.debug('Notification created:', {
        id: event.notification?.id,
        type: event.notification?.notification_type,
        unread_count: event.unread_count,
      });

      // Emit to all registered handlers
      this.createdHandlers.forEach(handler => handler(event));

      // Emit unread count change
      if (typeof event.unread_count === 'number') {
        this.unreadCountHandlers.forEach(handler => handler(event.unread_count));
      }
    } catch (error) {
      logger.error('Error handling notification.created event:', error);
    }
  };

  /**
   * Handle notification.updated event
   */
  private handleNotificationUpdated = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = eventData.data as NotificationUpdatedEvent;

      if (!this.validateNotificationUpdatedEvent(event)) {
        logger.warn('Invalid notification.updated event:', eventData);
        return;
      }

      logger.debug('Notification updated:', {
        id: event.notification?.id,
        read_at: event.notification?.read_at,
        unread_count: event.unread_count,
      });

      // Emit to all registered handlers
      this.updatedHandlers.forEach(handler => handler(event));

      // Emit unread count change
      if (typeof event.unread_count === 'number') {
        this.unreadCountHandlers.forEach(handler => handler(event.unread_count));
      }
    } catch (error) {
      logger.error('Error handling notification.updated event:', error);
    }
  };

  /**
   * Handle notification.deleted event
   */
  private handleNotificationDeleted = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = eventData.data as NotificationDeletedEvent;

      if (!this.validateNotificationDeletedEvent(event)) {
        logger.warn('Invalid notification.deleted event:', eventData);
        return;
      }

      logger.debug('Notification deleted:', {
        id: event.notification?.id,
        unread_count: event.unread_count,
      });

      // Emit to all registered handlers
      this.deletedHandlers.forEach(handler => handler(event));

      // Emit unread count change
      if (typeof event.unread_count === 'number') {
        this.unreadCountHandlers.forEach(handler => handler(event.unread_count));
      }
    } catch (error) {
      logger.error('Error handling notification.deleted event:', error);
    }
  };

  /**
   * Validate notification.created event structure
   */
  private validateNotificationCreatedEvent(event: any): event is NotificationCreatedEvent {
    return (
      event &&
      typeof event === 'object' &&
      event.notification &&
      typeof event.notification === 'object' &&
      typeof event.notification.id === 'number'
    );
  }

  /**
   * Validate notification.updated event structure
   */
  private validateNotificationUpdatedEvent(event: any): event is NotificationUpdatedEvent {
    return (
      event &&
      typeof event === 'object' &&
      event.notification &&
      typeof event.notification === 'object' &&
      typeof event.notification.id === 'number'
    );
  }

  /**
   * Validate notification.deleted event structure
   */
  private validateNotificationDeletedEvent(event: any): event is NotificationDeletedEvent {
    return (
      event &&
      typeof event === 'object' &&
      event.notification &&
      typeof event.notification === 'object' &&
      typeof event.notification.id === 'number'
    );
  }

  /**
   * Register handler for notification.created events
   */
  public onNotificationCreated(handler: NotificationCreatedHandler): void {
    this.createdHandlers.add(handler);
  }

  /**
   * Unregister handler for notification.created events
   */
  public offNotificationCreated(handler: NotificationCreatedHandler): void {
    this.createdHandlers.delete(handler);
  }

  /**
   * Register handler for notification.updated events
   */
  public onNotificationUpdated(handler: NotificationUpdatedHandler): void {
    this.updatedHandlers.add(handler);
  }

  /**
   * Unregister handler for notification.updated events
   */
  public offNotificationUpdated(handler: NotificationUpdatedHandler): void {
    this.updatedHandlers.delete(handler);
  }

  /**
   * Register handler for notification.deleted events
   */
  public onNotificationDeleted(handler: NotificationDeletedHandler): void {
    this.deletedHandlers.add(handler);
  }

  /**
   * Unregister handler for notification.deleted events
   */
  public offNotificationDeleted(handler: NotificationDeletedHandler): void {
    this.deletedHandlers.delete(handler);
  }

  /**
   * Register handler for unread count changes
   */
  public onUnreadCountChange(handler: UnreadCountChangeHandler): void {
    this.unreadCountHandlers.add(handler);
  }

  /**
   * Unregister handler for unread count changes
   */
  public offUnreadCountChange(handler: UnreadCountChangeHandler): void {
    this.unreadCountHandlers.delete(handler);
  }

  /**
   * Connect to WebSocket with configuration
   * This is a convenience method that wraps the main service
   */
  public async connect(config: SubscriptionConfig): Promise<void> {
    return chatwootWebSocketService.connect(config);
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    this.stopListening();
    // Note: We don't disconnect the main service as other parts may be using it
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return chatwootWebSocketService.isConnected();
  }

  /**
   * Get connection state
   */
  public getConnectionState() {
    return chatwootWebSocketService.getConnectionState();
  }

  /**
   * Clean up all handlers
   */
  public cleanup(): void {
    this.stopListening();
    this.createdHandlers.clear();
    this.updatedHandlers.clear();
    this.deletedHandlers.clear();
    this.unreadCountHandlers.clear();
  }
}

// Export singleton instance
export const chatwootNotificationsWebSocketHelper = new ChatwootNotificationsWebSocketHelper();
