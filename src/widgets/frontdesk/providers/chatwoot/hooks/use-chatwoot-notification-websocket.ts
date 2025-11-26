/**
 * useChatwootNotificationWebSocket Hook
 *
 * Manages real-time WebSocket connection for Chatwoot notifications.
 * Automatically connects, listens for events, and updates notification state.
 *
 * Features:
 * - Automatic connection management
 * - Real-time notification events (created, updated, deleted)
 * - Unread count synchronization
 * - Connection state tracking
 * - Automatic cleanup on unmount
 *
 * Based on NOTIFICATIONS_FRONTEND_API_GUIDE.md WebSocket specification.
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatwootNotificationsAtom,
  chatwootNotificationUnreadCountAtom,
  chatwootNotificationMetaAtom,
  chatwootNotificationConnectionAtom,
  chatwootSelectedAccountAtom,
  chatwootProfileAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import {
  chatwootNotificationsWebSocketHelper,
  chatwootWebSocketService,
} from "@/services/frontdesk";
import { ConnectionState } from "@/services/frontdesk/websocket/chatwoot-websocket.service";
import type {
  NotificationCreatedEvent,
  NotificationUpdatedEvent,
  NotificationDeletedEvent,
} from "@/services/frontdesk/api/chatwoot/types/notifications.types";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootNotificationWebSocket");

/**
 * Hook options
 */
export interface UseChatwootNotificationWebSocketOptions {
  /**
   * Enable/disable WebSocket connection
   * @default true
   */
  enabled?: boolean;

  /**
   * Auto-connect on mount
   * @default true
   */
  autoConnect?: boolean;
}

/**
 * Hook return value
 */
export interface UseChatwootNotificationWebSocketReturn {
  /** Whether WebSocket is connected */
  connected: boolean;
  /** Connection error if any */
  error: string | null;
  /** Manually connect to WebSocket */
  connect: () => Promise<void>;
  /** Manually disconnect from WebSocket */
  disconnect: () => void;
}

/**
 * Hook for managing Chatwoot notification WebSocket connection
 *
 * @example
 * ```typescript
 * const { connected, error } = useChatwootNotificationWebSocket({
 *   enabled: true,
 *   autoConnect: true
 * });
 * ```
 */
export const useChatwootNotificationWebSocket = (
  options: UseChatwootNotificationWebSocketOptions = {}
): UseChatwootNotificationWebSocketReturn => {
  const { enabled = true, autoConnect = true } = options;

  // State
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const [notifications, setNotifications] = useRecoilState(chatwootNotificationsAtom);
  const setUnreadCount = useSetRecoilState(chatwootNotificationUnreadCountAtom);
  const setNotificationMeta = useSetRecoilState(chatwootNotificationMetaAtom);
  const [connected, setConnected] = useRecoilState(chatwootNotificationConnectionAtom);

  // Local error state (not using Recoil to avoid interference with API errors)
  const [error, setError] = useState<string | null>(null);

  // Track if we're currently connected
  const isConnectedRef = useRef(false);
  const handlersRegisteredRef = useRef(false);

  /**
   * Handle notification.created event
   */
  const handleNotificationCreated = useCallback(
    (event: NotificationCreatedEvent) => {
      logger.info("Notification created via WebSocket", {
        id: event.notification?.id,
        type: event.notification?.notification_type,
      });

      // Add new notification to the beginning of the list
      if (event.notification) {
        setNotifications((prev) => {
          // Prevent duplicates
          const exists = prev.some((n) => n.id === event.notification.id);
          if (exists) {
            logger.debug("Notification already exists, skipping", event.notification.id);
            return prev;
          }
          return [event.notification, ...prev];
        });
      }

      // Update unread count from WebSocket event
      if (typeof event.unread_count === "number") {
        setUnreadCount(event.unread_count);
      }
    },
    [setNotifications, setUnreadCount]
  );

  /**
   * Handle notification.updated event
   */
  const handleNotificationUpdated = useCallback(
    (event: NotificationUpdatedEvent) => {
      logger.info("Notification updated via WebSocket", {
        id: event.notification?.id,
        read_at: event.notification?.read_at,
      });

      // Update existing notification
      if (event.notification) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === event.notification.id ? { ...n, ...event.notification } : n
          )
        );
      }

      // Update unread count and meta from WebSocket event
      if (typeof event.unread_count === "number" && typeof event.count === "number") {
        setUnreadCount(event.unread_count);
        setNotificationMeta({
          count: event.count,
          unread_count: event.unread_count,
        });
      } else if (typeof event.unread_count === "number") {
        setUnreadCount(event.unread_count);
      }
    },
    [setNotifications, setUnreadCount, setNotificationMeta]
  );

  /**
   * Handle notification.deleted event
   */
  const handleNotificationDeleted = useCallback(
    (event: NotificationDeletedEvent) => {
      logger.info("Notification deleted via WebSocket", {
        id: event.notification?.id,
      });

      // Remove notification from list
      if (event.notification?.id) {
        setNotifications((prev) => prev.filter((n) => n.id !== event.notification.id));
      }

      // Update unread count and meta from WebSocket event
      if (typeof event.unread_count === "number" && typeof event.count === "number") {
        setUnreadCount(event.unread_count);
        setNotificationMeta({
          count: event.count,
          unread_count: event.unread_count,
        });
      } else if (typeof event.unread_count === "number") {
        setUnreadCount(event.unread_count);
      }
    },
    [setNotifications, setUnreadCount, setNotificationMeta]
  );

  /**
   * Handle unread count change
   */
  const handleUnreadCountChange = useCallback(
    (count: number) => {
      logger.debug("Unread count changed via WebSocket", count);
      setUnreadCount(count);
    },
    [setUnreadCount]
  );

  /**
   * Register event handlers with the WebSocket helper
   */
  const registerHandlers = useCallback(() => {
    if (handlersRegisteredRef.current) {
      logger.debug("Handlers already registered, skipping");
      return;
    }

    logger.info("Registering WebSocket notification event handlers");

    chatwootNotificationsWebSocketHelper.onNotificationCreated(handleNotificationCreated);
    chatwootNotificationsWebSocketHelper.onNotificationUpdated(handleNotificationUpdated);
    chatwootNotificationsWebSocketHelper.onNotificationDeleted(handleNotificationDeleted);
    chatwootNotificationsWebSocketHelper.onUnreadCountChange(handleUnreadCountChange);

    // Start listening to events
    chatwootNotificationsWebSocketHelper.startListening();

    handlersRegisteredRef.current = true;
  }, [
    handleNotificationCreated,
    handleNotificationUpdated,
    handleNotificationDeleted,
    handleUnreadCountChange,
  ]);

  /**
   * Unregister event handlers
   */
  const unregisterHandlers = useCallback(() => {
    if (!handlersRegisteredRef.current) {
      return;
    }

    logger.info("Unregistering WebSocket notification event handlers");

    chatwootNotificationsWebSocketHelper.offNotificationCreated(handleNotificationCreated);
    chatwootNotificationsWebSocketHelper.offNotificationUpdated(handleNotificationUpdated);
    chatwootNotificationsWebSocketHelper.offNotificationDeleted(handleNotificationDeleted);
    chatwootNotificationsWebSocketHelper.offUnreadCountChange(handleUnreadCountChange);

    // Stop listening to events
    chatwootNotificationsWebSocketHelper.stopListening();

    handlersRegisteredRef.current = false;
  }, [
    handleNotificationCreated,
    handleNotificationUpdated,
    handleNotificationDeleted,
    handleUnreadCountChange,
  ]);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(async () => {
    if (!enabled) {
      logger.warn("WebSocket disabled, skipping connection");
      return;
    }

    if (!selectedAccountId || !profile) {
      logger.warn("No account or profile selected, skipping WebSocket connection");
      return;
    }

    if (isConnectedRef.current) {
      logger.debug("Already connected to WebSocket");
      return;
    }

    try {
      logger.info("Connecting to Chatwoot WebSocket for notifications", {
        accountId: selectedAccountId,
        userId: profile.id,
      });

      setError(null);

      // Check if profile has pubsub_token
      if (!profile.pubsub_token) {
        throw new Error("Profile missing pubsub_token for WebSocket connection");
      }

      // Register handlers before connecting
      registerHandlers();

      // Listen to connection state changes from the WebSocket service
      const handleStateChange = (state: ConnectionState) => {
        logger.debug("WebSocket state changed", { state });
        if (state === ConnectionState.CONNECTED) {
          isConnectedRef.current = true;
          setConnected(true);
          logger.info("Successfully connected to Chatwoot WebSocket for notifications");
        } else if (state === ConnectionState.DISCONNECTED || state === ConnectionState.ERROR) {
          isConnectedRef.current = false;
          setConnected(false);
          if (state === ConnectionState.ERROR) {
            logger.error("WebSocket connection error");
          }
        }
      };

      chatwootWebSocketService.onStateChange(handleStateChange);

      // Connect to WebSocket (this uses the main WebSocket service)
      await chatwootWebSocketService.connect({
        accountId: selectedAccountId,
        userId: profile.id,
        pubsubToken: profile.pubsub_token,
      });

      // Check initial state (connection might be synchronous)
      const currentState = chatwootWebSocketService.getConnectionState();
      if (currentState === ConnectionState.CONNECTED) {
        isConnectedRef.current = true;
        setConnected(true);
        logger.info("Successfully connected to Chatwoot WebSocket for notifications");
      }

      // Store handler for cleanup
      (connect as any).__stateHandler = handleStateChange;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to WebSocket";
      logger.error("Failed to connect to WebSocket", err);
      setError(errorMessage);
      setConnected(false);
      isConnectedRef.current = false;

      // Unregister handlers on error
      unregisterHandlers();
    }
  }, [enabled, selectedAccountId, profile, registerHandlers, unregisterHandlers, setConnected]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (!isConnectedRef.current) {
      logger.debug("Not connected, skipping disconnect");
      return;
    }

    logger.info("Disconnecting from Chatwoot WebSocket");

    // Unregister state change handler if it exists
    const stateHandler = (connect as any).__stateHandler;
    if (stateHandler) {
      chatwootWebSocketService.offStateChange(stateHandler);
      delete (connect as any).__stateHandler;
    }

    // Unregister handlers
    unregisterHandlers();

    // Note: We don't disconnect the main WebSocket service as other features may be using it
    // We only stop listening to notification events

    isConnectedRef.current = false;
    setConnected(false);
  }, [unregisterHandlers, setConnected]);

  /**
   * Auto-connect on mount if enabled
   */
  useEffect(() => {
    if (!enabled || !autoConnect) {
      logger.debug("WebSocket disabled or autoConnect=false, skipping");
      return;
    }

    // Log connection requirements for debugging
    logger.debug("WebSocket connection requirements check", {
      selectedAccountId,
      hasProfile: !!profile,
      hasPubsubToken: !!profile?.pubsub_token,
      profileId: profile?.id,
    });

    // Only connect if we have the required data
    if (selectedAccountId && profile?.pubsub_token) {
      logger.info("All requirements met, connecting to WebSocket");
      connect();
    } else {
      if (!selectedAccountId) {
        logger.warn("Cannot connect: No account ID selected");
      } else if (!profile) {
        logger.warn("Cannot connect: Profile not loaded yet");
      } else if (!profile.pubsub_token) {
        logger.warn("Cannot connect: Profile missing pubsub_token", {
          profileKeys: Object.keys(profile),
        });
      }
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, autoConnect, selectedAccountId, profile?.id, profile?.pubsub_token]);

  /**
   * Reconnect when account changes
   */
  useEffect(() => {
    if (!enabled || !isConnectedRef.current) {
      return;
    }

    // Disconnect and reconnect when account changes
    logger.info("Account changed, reconnecting WebSocket");
    disconnect();
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  return {
    connected,
    error,
    connect,
    disconnect,
  };
};
