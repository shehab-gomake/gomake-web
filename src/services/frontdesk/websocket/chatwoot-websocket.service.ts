/**
 * Chatwoot WebSocket Service
 *
 * Manages real-time WebSocket connections to Chatwoot using ActionCable.
 * Handles event subscriptions, connection state, and multi-account support.
 *
 * Note: This service connects directly to Chatwoot server, not Messaging Hub.
 */

import { createConsumer, Consumer, Subscription } from "@rails/actioncable";
import configModule from "@/config";
import { getUserToken } from "@/services/storage-data";

/**
 * Chatwoot WebSocket Event Types
 * Based on NOTIFICATIONS_FRONTEND_API_GUIDE.md and Chatwoot ActionCable events
 */
export enum ChatwootWebSocketEvent {
  MESSAGE_CREATED = "message.created",
  MESSAGE_UPDATED = "message.updated",
  CONVERSATION_CREATED = "conversation.created",
  CONVERSATION_UPDATED = "conversation.updated",
  CONVERSATION_STATUS_CHANGED = "conversation.status_changed",
  ASSIGNEE_CHANGED = "assignee_changed",
  CONVERSATION_TYPING_ON = "conversation.typing_on",
  CONVERSATION_TYPING_OFF = "conversation.typing_off",
  // Notification events (from NOTIFICATIONS_FRONTEND_API_GUIDE.md)
  NOTIFICATION_CREATED = "notification.created",
  NOTIFICATION_UPDATED = "notification.updated",
  NOTIFICATION_DELETED = "notification.deleted",
  // Presence
  PRESENCE_UPDATE = "presence.update",
}

/**
 * Connection State
 */
export enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

/**
 * WebSocket Event Data Structure
 */
export interface ChatwootWebSocketEventData {
  event: string;
  data: any;
  timestamp: number;
}

/**
 * Event Handler Types
 */
export type ChatwootEventHandler = (data: ChatwootWebSocketEventData) => void;
export type ConnectionStateHandler = (state: ConnectionState) => void;
export type ErrorHandler = (error: string) => void;

/**
 * Subscription Configuration
 */
export interface SubscriptionConfig {
  accountId: number;
  userId: number;
  pubsubToken: string;
}

/**
 * Connection Statistics
 */
export interface ConnectionStats {
  eventsReceived: number;
  connectedAt: number | null;
  disconnectedAt: number | null;
  reconnectionAttempts: number;
  lastEventAt: number | null;
}

/**
 * Chatwoot WebSocket Service using ActionCable
 */
export class ChatwootWebSocketService {
  private consumer: Consumer | null = null;
  private subscription: Subscription | null = null;
  private websocketUrl: string;
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private currentConfig: SubscriptionConfig | null = null;

  // Event handlers
  private eventHandlers: Map<string, Set<ChatwootEventHandler>> = new Map();
  private stateHandlers: Set<ConnectionStateHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();

  // Statistics
  private stats: ConnectionStats = {
    eventsReceived: 0,
    connectedAt: null,
    disconnectedAt: null,
    reconnectionAttempts: 0,
    lastEventAt: null,
  };

  // Debug mode
  private debugEnabled: boolean = false;

  constructor() {
    // Construct WebSocket URL from Chatwoot server config
    // NOTE: WebSocket goes through proxy (messaging-hub-v2)
    // The proxy requires GoMake Bearer token for authentication
    const baseUrl = configModule.chatwoot_server || "http://localhost:8080";
    const token = getUserToken();
    this.websocketUrl = this.constructWebSocketUrl(baseUrl, token);

    // Enable debug mode if needed
    this.debugEnabled = this.isDebugEnabled();

    if (this.debugEnabled) {
      console.log("[ChatwootWS] Service initialized", {
        websocketUrl: this.websocketUrl.replace(/token=[^&]*/, "token=***"), // Hide token in logs
        baseUrl,
        hasToken: !!token,
        note: "WebSocket goes through proxy - Bearer token included for authentication",
      });
    }
  }

  /**
   * Check if debug mode is enabled
   */
  private isDebugEnabled(): boolean {
    try {
      const w: any = typeof window !== "undefined" ? window : {};
      // Always enable debug in development to see connection issues
      return (
        process.env.NEXT_PUBLIC_CHATWOOT_DEBUG === "true" ||
        w.CHATWOOT_DEBUG === true ||
        process.env.NODE_ENV === "development" ||
        true // Force enable for debugging
      );
    } catch {
      return true; // Enable by default for debugging
    }
  }

  /**
   * Construct WebSocket URL from base HTTP URL
   * Includes GoMake Bearer token as query parameter for authentication
   */
  private constructWebSocketUrl(baseUrl: string, token?: string): string {
    let wsUrl = baseUrl;

    // Replace HTTP with WS
    if (wsUrl.startsWith("https://")) {
      wsUrl = wsUrl.replace("https://", "wss://");
    } else if (wsUrl.startsWith("http://")) {
      wsUrl = wsUrl.replace("http://", "ws://");
    }

    // Ensure it ends with /cable
    if (!wsUrl.endsWith("/cable")) {
      wsUrl = wsUrl.replace(/\/$/, "") + "/cable";
    }

    // Add Bearer token as query parameter for messaging-hub-v2 authentication
    if (token) {
      const separator = wsUrl.includes("?") ? "&" : "?";
      wsUrl = `${wsUrl}${separator}token=${encodeURIComponent(token)}`;
    }

    return wsUrl;
  }

  /**
   * Update connection state and notify handlers
   */
  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;

      if (this.debugEnabled) {
        console.log("[ChatwootWS] State changed:", state);
      }

      // Update stats
      if (state === ConnectionState.CONNECTED) {
        this.stats.connectedAt = Date.now();
        this.stats.disconnectedAt = null;
      } else if (state === ConnectionState.DISCONNECTED) {
        this.stats.disconnectedAt = Date.now();
      }

      // Notify handlers
      this.stateHandlers.forEach((handler) => handler(state));
    }
  }

  /**
   * Emit error to error handlers
   */
  private emitError(error: string): void {
    if (this.debugEnabled) {
      console.error("[ChatwootWS] Error:", error);
    }

    this.errorHandlers.forEach((handler) => handler(error));
  }

  /**
   * Handle received event from ActionCable
   *
   * According to Chatwoot WebSocket docs:
   * https://www.chatwoot.com/hc/user-guide/articles/1677691027-how-to-setup-a-web_socket-connection
   *
   * Events arrive as: {"message": {"event": "event.name", "data": {...}}}
   * ActionCable unwraps the outer "message" wrapper and passes the inner object to received()
   * So payload should be: {"event": "event.name", "data": {...}}
   */
  private handleReceivedEvent = (payload: any): void => {
    // Handle both formats: direct payload or wrapped in message
    let eventName: string | undefined;
    let eventData: any;

    if (payload?.message) {
      // Wrapped format: {message: {event: "...", data: {...}}}
      eventName = payload.message.event;
      eventData = payload.message.data || payload.message;
    } else if (payload?.event) {
      // Direct format: {event: "...", data: {...}}
      eventName = payload.event;
      eventData = payload.data || payload;
    } else {
      if (this.debugEnabled) {
        console.warn("[ChatwootWS] Received invalid payload (no event field):", payload);
      }
      return;
    }

    if (!eventName) {
      if (this.debugEnabled) {
        console.warn("[ChatwootWS] Received payload without event name:", payload);
      }
      return;
    }

    // Update stats
    this.stats.eventsReceived++;
    this.stats.lastEventAt = Date.now();

    const eventDataWrapper: ChatwootWebSocketEventData = {
      event: eventName,
      data: eventData,
      timestamp: Date.now(),
    };

    if (this.debugEnabled) {
      console.log("[ChatwootWS] Event received:", {
        event: eventDataWrapper.event,
        data: eventDataWrapper.data,
      });
    }

    // Emit to specific event handlers
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => handler(eventDataWrapper));
    }

    // Emit to wildcard handlers (listen to all events)
    const wildcardHandlers = this.eventHandlers.get("*");
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(eventDataWrapper));
    }
  };

  /**
   * Connect to Chatwoot WebSocket with account/user configuration
   */
  public async connect(config: SubscriptionConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.consumer && this.connectionState === ConnectionState.CONNECTED) {
          if (this.debugEnabled) {
            console.log("[ChatwootWS] Already connected");
          }
          resolve();
          return;
        }

        this.setConnectionState(ConnectionState.CONNECTING);
        this.currentConfig = config;

        // Get fresh token (in case it changed)
        const token = getUserToken();
        if (!token) {
          const error = "No GoMake Bearer token available for WebSocket authentication";
          console.error("[ChatwootWS] ❌", error);
          this.setConnectionState(ConnectionState.ERROR);
          this.emitError(error);
          reject(new Error(error));
          return;
        }

        // Reconstruct URL with fresh token (use imported configModule, not parameter)
        const baseUrl = configModule.chatwoot_server || "http://localhost:8080";
        const wsUrl = this.constructWebSocketUrl(baseUrl, token);

        // Create ActionCable consumer
        console.log("[ChatwootWS] Creating ActionCable consumer...", {
          url: wsUrl.replace(/token=[^&]*/, "token=***"), // Hide token in logs
          accountId: config.accountId,
          userId: config.userId,
          pubsubToken: config.pubsubToken ? "present" : "missing",
          hasGoMakeToken: !!token,
        });

        this.consumer = createConsumer(wsUrl);

        console.log("[ChatwootWS] Consumer created, subscribing to RoomChannel...", {
          url: this.websocketUrl,
          accountId: config.accountId,
          userId: config.userId,
        });

        // Subscribe to RoomChannel
        this.subscription = this.consumer.subscriptions.create(
          {
            channel: "RoomChannel",
            pubsub_token: config.pubsubToken,
            account_id: config.accountId,
            user_id: config.userId,
          },
          {
            connected: () => {
              console.log("[ChatwootWS] ✅ Connected successfully to WebSocket");
              this.setConnectionState(ConnectionState.CONNECTED);
              this.stats.reconnectionAttempts = 0;
              resolve();
            },

            disconnected: () => {
              if (this.debugEnabled) {
                console.log("[ChatwootWS] Disconnected");
              }
              this.setConnectionState(ConnectionState.DISCONNECTED);
            },

            rejected: () => {
              const error = "Connection rejected (invalid credentials or permissions)";
              this.setConnectionState(ConnectionState.ERROR);
              this.emitError(error);
              reject(new Error(error));
            },

            error: (error: any) => {
              const errorMessage = error?.message || "WebSocket connection error";
              console.error("[ChatwootWS] ❌ WebSocket connection error:", error);
              console.error("[ChatwootWS] Error details:", {
                message: errorMessage,
                error: error,
                url: this.websocketUrl,
                accountId: config.accountId,
                userId: config.userId,
              });

              this.setConnectionState(ConnectionState.ERROR);
              this.emitError(errorMessage);

              // Log helpful error message for 404 (proxy not configured)
              if (errorMessage.includes("404") || errorMessage.includes("Unexpected response code")) {
                console.warn("[ChatwootWS] WebSocket endpoint not found (404). This usually means:");
                console.warn("  1. The proxy (messaging-hub-v2) does not support WebSocket /cable endpoint yet");
                console.warn("  2. Or the Chatwoot server URL is incorrect");
                console.warn("  3. Real-time notifications will not work until WebSocket is configured");
                console.warn("  Solution: Implement WebSocket gateway in messaging-hub-v2 or connect directly to Chatwoot");
              }

              reject(new Error(errorMessage));
            },

            received: this.handleReceivedEvent,
          }
        );

        // Add timeout for connection
        setTimeout(() => {
          if (this.connectionState === ConnectionState.CONNECTING) {
            console.error("[ChatwootWS] ⏱️ Connection timeout after 10 seconds");
            console.error("[ChatwootWS] Connection details:", {
              url: this.websocketUrl,
              accountId: config.accountId,
              userId: config.userId,
              state: this.connectionState,
            });
            this.setConnectionState(ConnectionState.ERROR);
            this.emitError("Connection timeout");
            reject(new Error("Connection timeout"));
          }
        }, 10000); // 10 second timeout
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        this.setConnectionState(ConnectionState.ERROR);
        this.emitError(errorMessage);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Chatwoot WebSocket
   */
  public disconnect(): void {
    if (this.debugEnabled) {
      console.log("[ChatwootWS] Disconnecting...");
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.consumer) {
      this.consumer.disconnect();
      this.consumer = null;
    }

    this.setConnectionState(ConnectionState.DISCONNECTED);
    this.currentConfig = null;
  }

  /**
   * Reconnect with current configuration
   */
  public async reconnect(): Promise<void> {
    if (!this.currentConfig) {
      throw new Error("No previous configuration to reconnect with");
    }

    this.stats.reconnectionAttempts++;
    this.disconnect();

    // Wait a bit before reconnecting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.connect(this.currentConfig);
  }

  /**
   * Register event handler for specific event type
   */
  public on(event: ChatwootWebSocketEvent | string, handler: ChatwootEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Unregister event handler
   */
  public off(event: ChatwootWebSocketEvent | string, handler: ChatwootEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Register connection state change handler
   */
  public onStateChange(handler: ConnectionStateHandler): void {
    this.stateHandlers.add(handler);
  }

  /**
   * Unregister connection state change handler
   */
  public offStateChange(handler: ConnectionStateHandler): void {
    this.stateHandlers.delete(handler);
  }

  /**
   * Register error handler
   */
  public onError(handler: ErrorHandler): void {
    this.errorHandlers.add(handler);
  }

  /**
   * Unregister error handler
   */
  public offError(handler: ErrorHandler): void {
    this.errorHandlers.delete(handler);
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if currently connected
   */
  public isConnected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  /**
   * Get current subscription configuration
   */
  public getCurrentConfig(): SubscriptionConfig | null {
    return this.currentConfig;
  }

  /**
   * Get connection statistics
   */
  public getStats(): ConnectionStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  public resetStats(): void {
    this.stats = {
      eventsReceived: 0,
      connectedAt: this.stats.connectedAt,
      disconnectedAt: this.stats.disconnectedAt,
      reconnectionAttempts: 0,
      lastEventAt: null,
    };
  }

  /**
   * Get uptime in milliseconds (null if not connected)
   */
  public getUptime(): number | null {
    if (!this.stats.connectedAt) {
      return null;
    }

    if (this.connectionState === ConnectionState.CONNECTED) {
      return Date.now() - this.stats.connectedAt;
    }

    if (this.stats.disconnectedAt) {
      return this.stats.disconnectedAt - this.stats.connectedAt;
    }

    return null;
  }

  /**
   * Enable/disable debug mode
   */
  public setDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
    if (typeof window !== "undefined") {
      (window as any).CHATWOOT_DEBUG = enabled;
    }
  }
}

// Export singleton instance
export const chatwootWebSocketService = new ChatwootWebSocketService();
