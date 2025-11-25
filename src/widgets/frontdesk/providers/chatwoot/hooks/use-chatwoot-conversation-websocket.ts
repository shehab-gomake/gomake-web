/**
 * useChatwootConversationWebSocket Hook
 *
 * Manages real-time WebSocket connection for Chatwoot conversation updates.
 * Automatically updates conversation list when events are received.
 *
 * Features:
 * - Real-time conversation list updates
 * - New conversation notifications
 * - Message received updates (moves conversation to top)
 * - Status change handling
 * - Assignee change handling
 * - Typing indicators
 * - Connection state tracking
 * - Automatic cleanup on unmount
 *
 * @example
 * ```typescript
 * const { connected, error, typing } = useChatwootConversationWebSocket({
 *   accountId: selectedAccountId,
 *   enabled: true,
 *   onNewConversation: (conversation) => {
 *     showToast(`New conversation from ${conversation.meta?.sender?.name}`);
 *   },
 * });
 * ```
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  chatwootConversationsAtom,
  chatwootSelectedConversationAtom,
  chatwootProfileAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import {
  chatwootConversationsWebSocketHelper,
  chatwootWebSocketService,
} from "@/services/frontdesk";
import { ConnectionState } from "@/services/frontdesk/websocket/chatwoot-websocket.service";
import type {
  ConversationCreatedEvent,
  ConversationUpdatedEvent,
  ConversationStatusChangedEvent,
  MessageCreatedEvent,
  AssigneeChangedEvent,
  TypingEvent,
} from "@/services/frontdesk/websocket/chatwoot-conversations-websocket.helper";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootConversationWebSocket");

// ============================================================================
// Types
// ============================================================================

export interface UseChatwootConversationWebSocketOptions {
  /** Account ID to filter events for */
  accountId: number | null;

  /**
   * Enable/disable WebSocket updates
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when a new conversation is created
   * Use this to show notifications, play sounds, etc.
   */
  onNewConversation?: (conversation: ChatwootConversation) => void;

  /**
   * Callback when a new message is received
   */
  onNewMessage?: (conversationId: number, message: any) => void;

  /**
   * Current filter key for cache updates
   * If provided, will update the specific cache entry
   */
  filterKey?: string;
}

export interface TypingIndicator {
  conversationId: number;
  user: {
    id?: number;
    name?: string;
  };
  isTyping: boolean;
  isPrivate: boolean;
  timestamp: number;
}

export interface UseChatwootConversationWebSocketReturn {
  /** Whether WebSocket is connected */
  connected: boolean;

  /** Connection error if any */
  error: string | null;

  /** Current typing indicators by conversation ID */
  typing: Map<number, TypingIndicator>;

  /** Manually refresh conversation list */
  refreshConversations: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/** How long to keep typing indicator visible after last event (ms) */
const TYPING_TIMEOUT_MS = 5000;

// ============================================================================
// Hook Implementation
// ============================================================================

export const useChatwootConversationWebSocket = (
  options: UseChatwootConversationWebSocketOptions
): UseChatwootConversationWebSocketReturn => {
  const { accountId, enabled = true, onNewConversation, onNewMessage, filterKey } = options;

  // ============================================================================
  // State
  // ============================================================================

  const profile = useRecoilValue(chatwootProfileAtom);
  const [, setConversations] = useRecoilState(chatwootConversationsAtom);
  const setSelectedConversation = useSetRecoilState(chatwootSelectedConversationAtom);

  // Local state
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState<Map<number, TypingIndicator>>(new Map());

  // Refs for cleanup and state tracking
  const handlersRegisteredRef = useRef(false);
  const typingTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const stateHandlerRef = useRef<((state: ConnectionState) => void) | null>(null);
  const isMountedRef = useRef(true);

  // Stable refs for callbacks to prevent stale closure issues
  const onNewConversationRef = useRef(onNewConversation);
  const onNewMessageRef = useRef(onNewMessage);

  // Keep refs in sync with latest props
  useEffect(() => {
    onNewConversationRef.current = onNewConversation;
  }, [onNewConversation]);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  // ============================================================================
  // Cache Update Helper
  // ============================================================================

  /**
   * Update all conversation caches with a mutation function
   * This ensures consistency across different filter views
   */
  const updateAllCaches = useCallback(
    (updateFn: (conversations: ChatwootConversation[]) => ChatwootConversation[]) => {
      // Update main conversations atom
      setConversations(updateFn);

      // Note: Cache family updates would need to be done through the hook that owns them
      // The conversation list hook should handle its own cache updates
      // This is a limitation of Recoil - we can't easily update atomFamily from outside
    },
    [setConversations]
  );

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle new conversation created
   */
  const handleConversationCreated = useCallback(
    (event: ConversationCreatedEvent) => {
      const conversation = event.conversation;
      if (!conversation?.id) return;

      logger.info("New conversation received via WebSocket:", {
        id: conversation.id,
        inbox_id: conversation.inbox_id,
        status: conversation.status,
        sender: conversation.meta?.sender?.name,
      });

      // Add to conversations list (at the top)
      updateAllCaches((prev) => {
        // Check for duplicates
        const exists = prev.some((c) => c.id === conversation.id);
        if (exists) {
          logger.debug("Conversation already exists, updating instead");
          return prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c));
        }

        // Add to top of list
        return [conversation, ...prev];
      });

      // Callback for notifications (use ref to avoid stale closure)
      onNewConversationRef.current?.(conversation);
    },
    [updateAllCaches]
  );

  /**
   * Handle conversation updated
   */
  const handleConversationUpdated = useCallback(
    (event: ConversationUpdatedEvent) => {
      const conversation = event.conversation;
      if (!conversation?.id) return;

      logger.debug("Conversation updated via WebSocket:", {
        id: conversation.id,
        status: conversation.status,
      });

      updateAllCaches((prev) =>
        prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c))
      );

      // Update selected conversation if it's the one being updated
      setSelectedConversation((prev) =>
        prev?.id === conversation.id ? { ...prev, ...conversation } : prev
      );
    },
    [updateAllCaches, setSelectedConversation]
  );

  /**
   * Handle conversation status changed
   */
  const handleStatusChanged = useCallback(
    (event: ConversationStatusChangedEvent) => {
      const conversation = event.conversation;
      if (!conversation?.id) return;

      logger.info("Conversation status changed via WebSocket:", {
        id: conversation.id,
        from: event.previous_status,
        to: event.current_status,
      });

      updateAllCaches((prev) =>
        prev.map((c) =>
          c.id === conversation.id
            ? { ...c, ...conversation, status: event.current_status || conversation.status }
            : c
        )
      );

      // Update selected conversation
      setSelectedConversation((prev) =>
        prev?.id === conversation.id
          ? { ...prev, ...conversation, status: event.current_status || conversation.status }
          : prev
      );
    },
    [updateAllCaches, setSelectedConversation]
  );

  /**
   * Handle new message created
   * Moves the conversation to the top of the list
   */
  const handleMessageCreated = useCallback(
    (event: MessageCreatedEvent) => {
      const conversation = event.conversation;
      const message = event.message;
      const conversationId = conversation?.id || message?.conversation_id;

      if (!conversationId) return;

      logger.debug("New message received via WebSocket:", {
        conversationId,
        messageId: message?.id,
        content: message?.content?.substring(0, 30),
      });

      // Update conversation and move to top
      updateAllCaches((prev) => {
        const existingIndex = prev.findIndex((c) => c.id === conversationId);

        if (existingIndex === -1) {
          // Conversation not in list - might need to fetch it
          // For now, just add the partial data if we have it
          if (conversation) {
            return [conversation, ...prev];
          }
          return prev;
        }

        // Update existing conversation and move to top
        const existing = prev[existingIndex];
        const updated: ChatwootConversation = {
          ...existing,
          ...conversation,
          last_non_activity_message: message || existing.last_non_activity_message,
          last_activity_at: message?.created_at || Date.now() / 1000,
          updated_at: message?.created_at || Date.now() / 1000,
        };

        // Remove from current position and add to top
        const withoutCurrent = prev.filter((_, i) => i !== existingIndex);
        return [updated, ...withoutCurrent];
      });

      // Clear typing indicator for this conversation
      setTyping((prev) => {
        const next = new Map(prev);
        next.delete(conversationId);
        return next;
      });

      // Callback (use ref to avoid stale closure)
      if (message) {
        onNewMessageRef.current?.(conversationId, message);
      }
    },
    [updateAllCaches]
  );

  /**
   * Handle assignee changed
   */
  const handleAssigneeChanged = useCallback(
    (event: AssigneeChangedEvent) => {
      const conversation = event.conversation;
      if (!conversation?.id) return;

      logger.info("Assignee changed via WebSocket:", {
        conversationId: conversation.id,
        newAssignee: event.assignee?.name || "Unassigned",
      });

      const updatedMeta = {
        ...conversation.meta,
        assignee: event.assignee || null,
      };

      updateAllCaches((prev) =>
        prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation, meta: updatedMeta } : c))
      );

      // Update selected conversation
      setSelectedConversation((prev) =>
        prev?.id === conversation.id ? { ...prev, meta: updatedMeta } : prev
      );
    },
    [updateAllCaches, setSelectedConversation]
  );

  /**
   * Handle typing indicator
   */
  const handleTyping = useCallback((event: TypingEvent) => {
    const conversationId = event.conversation?.id;
    if (!conversationId) return;

    const isTyping = event.event === "conversation.typing_on";

    setTyping((prev) => {
      const next = new Map(prev);

      if (isTyping) {
        next.set(conversationId, {
          conversationId,
          user: event.user || {},
          isTyping: true,
          isPrivate: event.is_private || false,
          timestamp: Date.now(),
        });
      } else {
        next.delete(conversationId);
      }

      return next;
    });

    // Clear existing timeout
    const existingTimeout = typingTimeoutsRef.current.get(conversationId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout to clear typing indicator
    if (isTyping) {
      const timeout = setTimeout(() => {
        setTyping((prev) => {
          const next = new Map(prev);
          next.delete(conversationId);
          return next;
        });
        typingTimeoutsRef.current.delete(conversationId);
      }, TYPING_TIMEOUT_MS);

      typingTimeoutsRef.current.set(conversationId, timeout);
    }
  }, []);

  // ============================================================================
  // Registration
  // ============================================================================

  // Store handler refs to ensure we can properly unregister the same handlers we registered
  const registeredHandlersRef = useRef<{
    conversationCreated: typeof handleConversationCreated | null;
    conversationUpdated: typeof handleConversationUpdated | null;
    statusChanged: typeof handleStatusChanged | null;
    messageCreated: typeof handleMessageCreated | null;
    assigneeChanged: typeof handleAssigneeChanged | null;
    typing: typeof handleTyping | null;
  }>({
    conversationCreated: null,
    conversationUpdated: null,
    statusChanged: null,
    messageCreated: null,
    assigneeChanged: null,
    typing: null,
  });

  /**
   * Register all event handlers
   * IMPORTANT: First unregisters any existing handlers to prevent duplicates
   */
  const registerHandlers = useCallback(() => {
    // First, unregister any existing handlers to prevent duplicates
    const existingHandlers = registeredHandlersRef.current;
    if (existingHandlers.conversationCreated) {
      chatwootConversationsWebSocketHelper.offConversationCreated(existingHandlers.conversationCreated);
    }
    if (existingHandlers.conversationUpdated) {
      chatwootConversationsWebSocketHelper.offConversationUpdated(existingHandlers.conversationUpdated);
    }
    if (existingHandlers.statusChanged) {
      chatwootConversationsWebSocketHelper.offStatusChanged(existingHandlers.statusChanged);
    }
    if (existingHandlers.messageCreated) {
      chatwootConversationsWebSocketHelper.offMessageCreated(existingHandlers.messageCreated);
    }
    if (existingHandlers.assigneeChanged) {
      chatwootConversationsWebSocketHelper.offAssigneeChanged(existingHandlers.assigneeChanged);
    }
    if (existingHandlers.typing) {
      chatwootConversationsWebSocketHelper.offTyping(existingHandlers.typing);
    }

    // Now register new handlers
    registeredHandlersRef.current = {
      conversationCreated: handleConversationCreated,
      conversationUpdated: handleConversationUpdated,
      statusChanged: handleStatusChanged,
      messageCreated: handleMessageCreated,
      assigneeChanged: handleAssigneeChanged,
      typing: handleTyping,
    };

    chatwootConversationsWebSocketHelper.onConversationCreated(handleConversationCreated);
    chatwootConversationsWebSocketHelper.onConversationUpdated(handleConversationUpdated);
    chatwootConversationsWebSocketHelper.onStatusChanged(handleStatusChanged);
    chatwootConversationsWebSocketHelper.onMessageCreated(handleMessageCreated);
    chatwootConversationsWebSocketHelper.onAssigneeChanged(handleAssigneeChanged);
    chatwootConversationsWebSocketHelper.onTyping(handleTyping);

    chatwootConversationsWebSocketHelper.startListening();
    handlersRegisteredRef.current = true;
  }, [
    handleConversationCreated,
    handleConversationUpdated,
    handleStatusChanged,
    handleMessageCreated,
    handleAssigneeChanged,
    handleTyping,
  ]);

  /**
   * Unregister all event handlers
   */
  const unregisterHandlers = useCallback(() => {
    // Unregister the exact handlers we registered (from refs)
    const handlers = registeredHandlersRef.current;
    if (handlers.conversationCreated) {
      chatwootConversationsWebSocketHelper.offConversationCreated(handlers.conversationCreated);
    }
    if (handlers.conversationUpdated) {
      chatwootConversationsWebSocketHelper.offConversationUpdated(handlers.conversationUpdated);
    }
    if (handlers.statusChanged) {
      chatwootConversationsWebSocketHelper.offStatusChanged(handlers.statusChanged);
    }
    if (handlers.messageCreated) {
      chatwootConversationsWebSocketHelper.offMessageCreated(handlers.messageCreated);
    }
    if (handlers.assigneeChanged) {
      chatwootConversationsWebSocketHelper.offAssigneeChanged(handlers.assigneeChanged);
    }
    if (handlers.typing) {
      chatwootConversationsWebSocketHelper.offTyping(handlers.typing);
    }

    // Clear stored handlers
    registeredHandlersRef.current = {
      conversationCreated: null,
      conversationUpdated: null,
      statusChanged: null,
      messageCreated: null,
      assigneeChanged: null,
      typing: null,
    };

    chatwootConversationsWebSocketHelper.stopListening();
    handlersRegisteredRef.current = false;
  }, []);

  // ============================================================================
  // Connection Management
  // ============================================================================

  /**
   * Connect to WebSocket and start listening
   */
  const connect = useCallback(async () => {
    // Safety check for mounted state
    if (!isMountedRef.current) {
      return;
    }

    if (!enabled || !accountId || !profile) {
      logger.warn("Cannot connect: missing requirements", {
        enabled,
        accountId,
        hasProfile: !!profile,
      });
      return;
    }

    if (!profile.pubsub_token) {
      logger.error("Cannot connect: missing pubsub_token in profile");
      if (isMountedRef.current) {
        setError("Missing pubsub_token for WebSocket connection");
      }
      return;
    }

    try {
      if (isMountedRef.current) {
        setError(null);
      }

      // Set account ID for filtering
      chatwootConversationsWebSocketHelper.setAccountId(accountId);

      // Register handlers before connecting
      registerHandlers();

      // Listen for connection state changes
      const handleStateChange = (state: ConnectionState) => {
        // Safety check for mounted state
        if (!isMountedRef.current) return;

        if (state === ConnectionState.CONNECTED) {
          setConnected(true);
          setError(null);
          logger.info("WebSocket connected for conversations");
        } else if (state === ConnectionState.DISCONNECTED || state === ConnectionState.ERROR) {
          setConnected(false);
          if (state === ConnectionState.ERROR) {
            setError("WebSocket connection error");
          }
        }
      };

      // Store handler in ref for cleanup
      stateHandlerRef.current = handleStateChange;
      chatwootWebSocketService.onStateChange(handleStateChange);

      // Connect if not already connected
      if (!chatwootWebSocketService.isConnected()) {
        await chatwootWebSocketService.connect({
          accountId,
          userId: profile.id,
          pubsubToken: profile.pubsub_token,
        });
      } else {
        // Already connected, just mark as connected
        if (isMountedRef.current) {
          setConnected(true);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to WebSocket";
      logger.error("WebSocket connection failed:", err);
      if (isMountedRef.current) {
        setError(errorMessage);
        setConnected(false);
      }
      unregisterHandlers();
    }
  }, [enabled, accountId, profile, registerHandlers, unregisterHandlers]);

  /**
   * Disconnect and cleanup
   */
  const disconnect = useCallback(() => {
    // Unregister state handler
    if (stateHandlerRef.current) {
      chatwootWebSocketService.offStateChange(stateHandlerRef.current);
      stateHandlerRef.current = null;
    }

    // Unregister event handlers
    unregisterHandlers();

    // Clear account ID
    chatwootConversationsWebSocketHelper.setAccountId(null);

    // Clear typing timeouts
    typingTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    typingTimeoutsRef.current.clear();

    // Only update state if mounted
    if (isMountedRef.current) {
      setConnected(false);
      setTyping(new Map());
    }
  }, [unregisterHandlers]);

  /**
   * Manual refresh trigger (for pull-to-refresh, etc.)
   */
  const refreshConversations = useCallback(() => {
    // This is a placeholder - the actual refresh should be triggered
    // by the component that owns the conversation fetching logic
    logger.info("Manual refresh requested");
    // Could emit a custom event here that the conversation list listens to
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  /**
   * Track mounted state
   */
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Connect on mount / disconnect on unmount
   */
  useEffect(() => {
    if (!enabled) {
      disconnect();
      return;
    }

    if (accountId && profile?.pubsub_token) {
      connect();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, accountId, profile?.id, profile?.pubsub_token]);

  /**
   * Reconnect when account changes
   */
  useEffect(() => {
    if (!enabled || !connected) return;

    // Account changed while connected - update filter
    chatwootConversationsWebSocketHelper.setAccountId(accountId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  // ============================================================================
  // Return
  // ============================================================================

  return {
    connected,
    error,
    typing,
    refreshConversations,
  };
};

export default useChatwootConversationWebSocket;

