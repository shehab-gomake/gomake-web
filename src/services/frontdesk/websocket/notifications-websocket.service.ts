/**
 * Notifications WebSocket Service
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/guides/NOTIFICATION_SYSTEM_FRONTEND_GUIDE.md
 *
 * Manages real-time notification updates via Socket.IO
 * Namespace: /messaging
 * Events: notification:new, notification:read, notification:unreadCount
 */

import { io, Socket } from 'socket.io-client';
import config from '@/config';
import { getUserToken } from '@/services/storage-data';
import { BackendNotification } from '@/services/frontdesk/utils/notification-type-mapper';

/**
 * Notification event data structures
 */
export interface NotificationNewEvent {
  notification: BackendNotification;
}

export interface NotificationReadEvent {
  id: string;
  readAt: Date;
}

export interface NotificationUnreadCountEvent {
  count: number;
  type?: string;
}

/**
 * Event handler types
 */
export type NotificationNewHandler = (notification: BackendNotification) => void;
export type NotificationReadHandler = (data: NotificationReadEvent) => void;
export type NotificationUnreadCountHandler = (data: NotificationUnreadCountEvent) => void;
export type ConnectionEventHandler = (connected: boolean) => void;
export type ErrorEventHandler = (error: string) => void;

/**
 * NotificationsWebSocketService
 * Handles real-time notification updates via WebSocket
 */
export class NotificationsWebSocketService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnecting: boolean = false;

  // Event handlers
  private onNewNotificationHandler: NotificationNewHandler | null = null;
  private onNotificationReadHandler: NotificationReadHandler | null = null;
  private onUnreadCountChangeHandler: NotificationUnreadCountHandler | null = null;
  private onConnectionChangeHandler: ConnectionEventHandler | null = null;
  private onErrorHandler: ErrorEventHandler | null = null;

  constructor() {
    this.serverUrl = config.messaging_server || config.api_server;
  }

  /**
   * Connect to the WebSocket server
   * Connects to /messaging namespace
   */
  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      console.log('[NotificationsWebSocket] Already connected or connecting');
      return;
    }

    const token = getUserToken();
    if (!token) {
      console.error('[NotificationsWebSocket] No auth token available');
      this.onErrorHandler?.('No authentication token available');
      return;
    }

    this.isConnecting = true;

    try {
      console.log('[NotificationsWebSocket] Connecting to:', `${this.serverUrl}/messaging`);

      this.socket = io(`${this.serverUrl}/messaging`, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.setupEventListeners();
      this.isConnecting = false;
    } catch (error) {
      console.error('[NotificationsWebSocket] Connection error:', error);
      this.isConnecting = false;
      this.onErrorHandler?.(error instanceof Error ? error.message : 'Connection failed');
    }
  }

  /**
   * Setup Socket.IO event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[NotificationsWebSocket] ✅ Connected');
      this.onConnectionChangeHandler?.(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[NotificationsWebSocket] ❌ Disconnected:', reason);
      this.onConnectionChangeHandler?.(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[NotificationsWebSocket] Connection error:', error);
      this.onErrorHandler?.(error.message);
    });

    // Notification events

    /**
     * Event: notification:new
     * Emitted when a new notification is created
     */
    this.socket.on('notification:new', (notification: BackendNotification) => {
      console.log('[NotificationsWebSocket] 📬 New notification:', notification);
      this.onNewNotificationHandler?.(notification);
    });

    /**
     * Event: notification:read
     * Emitted when a notification is marked as read
     */
    this.socket.on('notification:read', (data: NotificationReadEvent) => {
      console.log('[NotificationsWebSocket] ✅ Notification read:', data);
      this.onNotificationReadHandler?.(data);
    });

    /**
     * Event: notification:unreadCount
     * Emitted when the unread count changes
     */
    this.socket.on('notification:unreadCount', (data: NotificationUnreadCountEvent) => {
      console.log('[NotificationsWebSocket] 🔢 Unread count:', data);
      this.onUnreadCountChangeHandler?.(data);
    });

    // Error events
    this.socket.on('error', (error: any) => {
      console.error('[NotificationsWebSocket] Error:', error);
      this.onErrorHandler?.(error.message || 'Socket error');
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('[NotificationsWebSocket] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Register handler for new notification events
   * @param handler - Callback function to handle new notifications
   */
  onNewNotification(handler: NotificationNewHandler): void {
    this.onNewNotificationHandler = handler;
  }

  /**
   * Register handler for notification read events
   * @param handler - Callback function to handle read notifications
   */
  onNotificationRead(handler: NotificationReadHandler): void {
    this.onNotificationReadHandler = handler;
  }

  /**
   * Register handler for unread count change events
   * @param handler - Callback function to handle count changes
   */
  onUnreadCountChange(handler: NotificationUnreadCountHandler): void {
    this.onUnreadCountChangeHandler = handler;
  }

  /**
   * Register handler for connection state changes
   * @param handler - Callback function to handle connection changes
   */
  onConnectionChange(handler: ConnectionEventHandler): void {
    this.onConnectionChangeHandler = handler;
  }

  /**
   * Register handler for errors
   * @param handler - Callback function to handle errors
   */
  onError(handler: ErrorEventHandler): void {
    this.onErrorHandler = handler;
  }

  /**
   * Clear all event handlers
   */
  clearHandlers(): void {
    this.onNewNotificationHandler = null;
    this.onNotificationReadHandler = null;
    this.onUnreadCountChangeHandler = null;
    this.onConnectionChangeHandler = null;
    this.onErrorHandler = null;
  }
}

/**
 * Singleton instance of NotificationsWebSocketService
 * Import and use this instance throughout the application
 *
 * @example
 * import { notificationsWebSocketService } from '@/services/frontdesk';
 *
 * // Connect
 * notificationsWebSocketService.connect();
 *
 * // Listen to events
 * notificationsWebSocketService.onNewNotification((notification) => {
 *   console.log('New notification:', notification);
 * });
 *
 * // Disconnect when done
 * notificationsWebSocketService.disconnect();
 */
export const notificationsWebSocketService = new NotificationsWebSocketService();
