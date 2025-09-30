import { useCallback, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { directMessagesWebSocketService } from "@/services/websocket/direct-messages-websocket.service";
import {
  dmConnectionState,
  dmConnectedState,
  dmErrorState,
  dmIsLoadingState,
} from "@/store/direct-messages";

export interface UseConnectionManagerResult {
  // State
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  connected: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;

  // Internal refs (for other hooks)
  joinedConversationsRef: React.MutableRefObject<Set<string>>;
}

/**
 * Manages WebSocket connection lifecycle for Direct Messages
 *
 * Responsibilities:
 * - Connect/disconnect from WebSocket service
 * - Track connection status
 * - Manage joined conversation rooms cache
 * - Handle connection errors
 *
 * Used by: use-conversations, use-messages, use-presence
 */
export function useConnectionManager(
  onConnect?: () => Promise<void>
): UseConnectionManagerResult {
  const debug = process.env.NEXT_PUBLIC_DM_DEBUG === 'true';

  // State
  const [connectionStatus, setConnectionStatus] = useRecoilState(dmConnectionState);
  const [connected, setConnected] = useRecoilState(dmConnectedState);
  const [isLoading, setIsLoading] = useRecoilState(dmIsLoadingState);
  const setError = useSetRecoilState(dmErrorState);

  // Refs
  const joinedConversationsRef = useRef<Set<string>>(new Set());

  /**
   * Connect to WebSocket service
   */
  const connect = useCallback(async () => {
    try {
      setConnectionStatus("connecting");
      setIsLoading(true);
      setError(null);

      await directMessagesWebSocketService.connect();
      setConnectionStatus("connected");
      setConnected(true);

      // Clear joined cache on fresh connection so we can rejoin rooms
      joinedConversationsRef.current.clear();

      if (debug) console.log('[DM Connection] Connected successfully');

      // Call onConnect callback if provided (for loading initial data)
      if (onConnect) {
        await onConnect();
      }
    } catch (error: any) {
      console.error("[DM Connection] Failed to connect:", error);
      setConnectionStatus("error");
      setError(error.message || "Failed to connect to DM service");
    } finally {
      setIsLoading(false);
    }
  }, [setConnectionStatus, setConnected, setError, setIsLoading, onConnect, debug]);

  /**
   * Disconnect from WebSocket service
   */
  const disconnect = useCallback(() => {
    directMessagesWebSocketService.disconnect();
    setConnectionStatus("disconnected");
    setConnected(false);
    joinedConversationsRef.current.clear();

    if (debug) console.log('[DM Connection] Disconnected');
  }, [setConnectionStatus, setConnected, debug]);

  return {
    // State
    connectionStatus,
    connected,
    isLoading,
    error: null, // Error is managed in Recoil but not exposed here to avoid confusion

    // Actions
    connect,
    disconnect,

    // Internal refs
    joinedConversationsRef,
  };
}