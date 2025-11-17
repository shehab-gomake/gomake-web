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
  lastHeartbeatAt: number | null;
}

/**
 * Retry Configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

/**
 * Connection Health Status
 */
export enum ConnectionHealth {
  HEALTHY = "healthy",
  DEGRADED = "degraded",
  UNHEALTHY = "unhealthy",
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
    lastHeartbeatAt: null,
  };

  // Retry configuration
  private retryConfig: RetryConfig = {
    maxRetries: 5,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  };

  // Heartbeat interval
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly heartbeatIntervalMs = 30000; // 30 seconds
  private readonly heartbeatTimeoutMs = 60000; // 60 seconds

  // Auto-reconnect flag
  private autoReconnect: boolean = true;
  private isManualDisconnect: boolean = false;

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
      // Only enable debug in development or when explicitly requested
      return (
        process.env.NEXT_PUBLIC_CHATWOOT_DEBUG === "true" ||
        w.CHATWOOT_DEBUG === true ||
        process.env.NODE_ENV === "development"
      );
    } catch {
      return false; // Disable by default in production
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
              this.isManualDisconnect = false;
              // Start heartbeat monitoring
              this.startHeartbeat();
              resolve();
            },

            disconnected: () => {
              if (this.debugEnabled) {
                console.log("[ChatwootWS] Disconnected");
              }
              this.stopHeartbeat();
              this.setConnectionState(ConnectionState.DISCONNECTED);

              // Auto-reconnect if not manually disconnected
              if (this.autoReconnect && !this.isManualDisconnect) {
                if (this.debugEnabled) {
                  console.log("[ChatwootWS] Auto-reconnecting...");
                }
                this.reconnect().catch((err) => {
                  if (this.debugEnabled) {
                    console.error("[ChatwootWS] Auto-reconnect failed:", err);
                  }
                });
              }
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
   * Start heartbeat monitoring
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.stats.lastHeartbeatAt = Date.now();

      // Check if connection is healthy
      const health = this.getConnectionHealth();
      if (health === ConnectionHealth.UNHEALTHY && this.autoReconnect && !this.isManualDisconnect) {
        if (this.debugEnabled) {
          console.warn("[ChatwootWS] Connection unhealthy, attempting reconnect...");
        }
        this.reconnect().catch((err) => {
          if (this.debugEnabled) {
            console.error("[ChatwootWS] Heartbeat reconnect failed:", err);
          }
        });
      }
    }, this.heartbeatIntervalMs);
  }

  /**
   * Stop heartbeat monitoring
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Get connection health status
   */
  public getConnectionHealth(): ConnectionHealth {
    if (this.connectionState !== ConnectionState.CONNECTED) {
      return ConnectionHealth.UNHEALTHY;
    }

    const now = Date.now();
    const lastEventOrHeartbeat = Math.max(
      this.stats.lastEventAt || 0,
      this.stats.lastHeartbeatAt || 0,
      this.stats.connectedAt || 0
    );

    const timeSinceLastActivity = now - lastEventOrHeartbeat;

    if (timeSinceLastActivity > this.heartbeatTimeoutMs) {
      return ConnectionHealth.UNHEALTHY;
    } else if (timeSinceLastActivity > this.heartbeatIntervalMs) {
      return ConnectionHealth.DEGRADED;
    }

    return ConnectionHealth.HEALTHY;
  }

  /**
   * Disconnect from Chatwoot WebSocket
   */
  public disconnect(): void {
    this.isManualDisconnect = true;

    if (this.debugEnabled) {
      console.log("[ChatwootWS] Disconnecting...");
    }

    this.stopHeartbeat();

    if (this.subscription) {
      try {
        this.subscription.unsubscribe();
      } catch (err) {
        if (this.debugEnabled) {
          console.warn("[ChatwootWS] Error unsubscribing:", err);
        }
      }
      this.subscription = null;
    }

    if (this.consumer) {
      try {
        this.consumer.disconnect();
      } catch (err) {
        if (this.debugEnabled) {
          console.warn("[ChatwootWS] Error disconnecting consumer:", err);
        }
      }
      this.consumer = null;
    }

    this.setConnectionState(ConnectionState.DISCONNECTED);
    this.currentConfig = null;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.initialDelayMs * Math.pow(this.retryConfig.backoffMultiplier, attempt),
      this.retryConfig.maxDelayMs
    );
    // Add jitter (±20%) to prevent thundering herd
    const jitter = delay * 0.2 * (Math.random() * 2 - 1);
    return Math.floor(delay + jitter);
  }

  /**
   * Reconnect with current configuration using exponential backoff
   */
  public async reconnect(): Promise<void> {
    if (!this.currentConfig) {
      throw new Error("No previous configuration to reconnect with");
    }

    this.isManualDisconnect = false;

    // Don't exceed max retries
    if (this.stats.reconnectionAttempts >= this.retryConfig.maxRetries) {
      const error = `Max reconnection attempts (${this.retryConfig.maxRetries}) exceeded`;
      this.emitError(error);
      throw new Error(error);
    }

    const delay = this.calculateBackoffDelay(this.stats.reconnectionAttempts);

    if (this.debugEnabled) {
      console.log(
        `[ChatwootWS] Reconnecting in ${delay}ms (attempt ${this.stats.reconnectionAttempts + 1}/${this.retryConfig.maxRetries})`
      );
    }

    this.stats.reconnectionAttempts++;

    // Disconnect cleanly before reconnecting
    this.isManualDisconnect = true;
    this.disconnect();
    this.isManualDisconnect = false;

    // Wait before reconnecting (exponential backoff)
    await new Promise((resolve) => setTimeout(resolve, delay));

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
      lastHeartbeatAt: null,
    };
  }

  /**
   * Configure retry behavior
   */
  public setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = {
      ...this.retryConfig,
      ...config,
    };
  }

  /**
   * Get current retry configuration
   */
  public getRetryConfig(): RetryConfig {
    return { ...this.retryConfig };
  }

  /**
   * Enable/disable auto-reconnect
   */
  public setAutoReconnect(enabled: boolean): void {
    this.autoReconnect = enabled;
  }

  /**
   * Check if auto-reconnect is enabled
   */
  public isAutoReconnectEnabled(): boolean {
    return this.autoReconnect;
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
