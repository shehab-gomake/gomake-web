/**
 * Chatwoot WebSocket Atom Effect
 *
 * Manages WebSocket connection lifecycle based on Recoil atom state.
 * Automatically connects when accountId is set and disconnects when cleared.
 *
 * Usage:
 * Add this effect to an atom that should trigger WebSocket connection/disconnection.
 *
 * @example
 * ```typescript
 * export const chatwootWebSocketConnectionAtom = atom<boolean>({
 *   key: 'frontdesk.chatwoot.wsConnection',
 *   default: false,
 *   effects: [chatwootWebSocketEffect({ accountId: 123 })],
 * });
 * ```
 */

import { AtomEffect } from "recoil";
import { chatwootWebSocketService } from "@/services/frontdesk";
import { ChatwootWebSocketState, ChatwootWebSocketStats } from "@/store/frontdesk/atoms/chatwoot.atoms";

// ============================================================================
// TYPES
// ============================================================================

export interface WebSocketEffectConfig {
  /** Account ID to connect to */
  accountId: number | null;
  /** Pub/sub token for authentication */
  pubsubToken?: string;
  /** Auto-reconnect on disconnect */
  autoReconnect?: boolean;
  /** Max reconnection attempts */
  maxReconnectAttempts?: number;
  /** Enable debug logging */
  debug?: boolean;
}

export interface WebSocketEffectState {
  connected: boolean;
  state: ChatwootWebSocketState;
  stats: ChatwootWebSocketStats;
  error: string | null;
}

// ============================================================================
// EFFECT FACTORY
// ============================================================================

/**
 * Creates a Recoil atom effect for WebSocket connection management
 *
 * @param getConfig - Function to get current configuration (called on each effect run)
 * @returns Recoil AtomEffect
 */
export const createChatwootWebSocketEffect = <T>(getConfig: () => WebSocketEffectConfig): AtomEffect<T> => {
  return ({ setSelf, onSet, trigger }) => {
    const config = getConfig();
    let isCleaningUp = false;

    const log = (message: string, ...args: unknown[]) => {
      if (config.debug) {
        console.log(`[WebSocketEffect] ${message}`, ...args);
      }
    };

    // Initialize connection on first load
    if (trigger === "get" && config.accountId && config.pubsubToken) {
      log("Initializing WebSocket connection", { accountId: config.accountId });
      connectWebSocket(config, log);
    }

    // Listen for value changes
    onSet((newValue, oldValue, isReset) => {
      if (isReset || isCleaningUp) return;

      log("Value changed", { newValue, oldValue });

      // If the atom value changes to trigger connection
      if (newValue && config.accountId && config.pubsubToken) {
        connectWebSocket(config, log);
      } else {
        disconnectWebSocket(log);
      }
    });

    // Cleanup on unmount
    return () => {
      isCleaningUp = true;
      log("Cleaning up WebSocket effect");
      disconnectWebSocket(log);
    };
  };
};

// ============================================================================
// CONNECTION HELPERS
// ============================================================================

function connectWebSocket(config: WebSocketEffectConfig, log: (message: string, ...args: unknown[]) => void) {
  if (!config.accountId || !config.pubsubToken) {
    log("Cannot connect: missing accountId or pubsubToken");
    return;
  }

  try {
    log("Connecting to WebSocket", { accountId: config.accountId });
    chatwootWebSocketService.connect(config.accountId, config.pubsubToken);
  } catch (error) {
    log("Failed to connect", error);
  }
}

function disconnectWebSocket(log: (message: string, ...args: unknown[]) => void) {
  try {
    log("Disconnecting WebSocket");
    chatwootWebSocketService.disconnect();
  } catch (error) {
    log("Failed to disconnect", error);
  }
}

// ============================================================================
// UTILITY EFFECTS
// ============================================================================

/**
 * Effect that syncs WebSocket state to a Recoil atom
 * Useful for components that need to react to connection state changes
 *
 * Note: Uses named function references (not arrow functions) to ensure
 * the same reference is used for both on() and off() calls, preventing
 * memory leaks from orphaned event listeners.
 */
export const syncWebSocketStateEffect: AtomEffect<ChatwootWebSocketState> = ({ setSelf }) => {
  // Named handlers to ensure same reference for on/off
  const handleConnected = () => {
    setSelf(mapConnectionState("connected"));
  };

  const handleDisconnected = () => {
    setSelf(mapConnectionState("disconnected"));
  };

  const handleError = () => {
    setSelf(mapConnectionState("error"));
  };

  // Set up event listeners with named handlers
  chatwootWebSocketService.on("connected", handleConnected);
  chatwootWebSocketService.on("disconnected", handleDisconnected);
  chatwootWebSocketService.on("error", handleError);

  return () => {
    // Cleanup: remove listeners using same references
    chatwootWebSocketService.off("connected", handleConnected);
    chatwootWebSocketService.off("disconnected", handleDisconnected);
    chatwootWebSocketService.off("error", handleError);
  };
};

/**
 * Effect that tracks WebSocket statistics
 */
export const syncWebSocketStatsEffect: AtomEffect<ChatwootWebSocketStats> = ({ setSelf }) => {
  let eventsReceived = 0;
  let connectionTime: number | null = null;
  let reconnectionAttempts = 0;
  let lastEventAt: number | null = null;

  const updateStats = () => {
    setSelf({
      eventsReceived,
      uptime: connectionTime ? Date.now() - connectionTime : null,
      reconnectionAttempts,
      lastEventAt,
    });
  };

  const handleConnected = () => {
    connectionTime = Date.now();
    updateStats();
  };

  const handleDisconnected = () => {
    connectionTime = null;
    updateStats();
  };

  const handleEvent = () => {
    eventsReceived++;
    lastEventAt = Date.now();
    updateStats();
  };

  const handleReconnecting = () => {
    reconnectionAttempts++;
    updateStats();
  };

  chatwootWebSocketService.on("connected", handleConnected);
  chatwootWebSocketService.on("disconnected", handleDisconnected);
  chatwootWebSocketService.on("message", handleEvent);
  chatwootWebSocketService.on("reconnecting", handleReconnecting);

  return () => {
    chatwootWebSocketService.off("connected", handleConnected);
    chatwootWebSocketService.off("disconnected", handleDisconnected);
    chatwootWebSocketService.off("message", handleEvent);
    chatwootWebSocketService.off("reconnecting", handleReconnecting);
  };
};

// ============================================================================
// HELPERS
// ============================================================================

function mapConnectionState(state: string): ChatwootWebSocketState {
  switch (state) {
    case "connected":
      return ChatwootWebSocketState.CONNECTED;
    case "connecting":
      return ChatwootWebSocketState.CONNECTING;
    case "disconnected":
      return ChatwootWebSocketState.DISCONNECTED;
    case "error":
      return ChatwootWebSocketState.ERROR;
    default:
      return ChatwootWebSocketState.DISCONNECTED;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default createChatwootWebSocketEffect;
