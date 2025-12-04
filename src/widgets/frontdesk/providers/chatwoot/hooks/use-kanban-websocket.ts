import { useEffect, useCallback, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatwootKanbanConversationsAtom,
  chatwootProfileAtom,
  chatwootSelectedAccountAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { chatwootConversationsWebSocketHelper, chatwootWebSocketService } from "@/services/frontdesk";
import { ConnectionState } from "@/services/frontdesk/websocket/chatwoot-websocket.service";
import type {
  ConversationCreatedEvent,
  ConversationUpdatedEvent,
  ConversationStatusChangedEvent,
  MessageCreatedEvent,
  AssigneeChangedEvent,
} from "@/services/frontdesk/websocket/chatwoot-conversations-websocket.helper";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useKanbanWebSocket");

export function useKanbanWebSocket(enabled: boolean = true) {
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const [, setConversations] = useRecoilState(chatwootKanbanConversationsAtom);
  
  const [connected, setConnected] = useState(false);
  const isMountedRef = useRef(true);
  const registeredHandlersRef = useRef(false);

  // Helper to update conversations state safely
  const updateConversations = useCallback((updateFn: (prev: ChatwootConversation[]) => ChatwootConversation[]) => {
    setConversations(updateFn);
  }, [setConversations]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleConversationCreated = useCallback((event: ConversationCreatedEvent) => {
    const conversation = event.conversation;
    if (!conversation?.id) return;

    logger.info("Kanban: New conversation received", { id: conversation.id });

    updateConversations((prev) => {
      const exists = prev.some((c) => c.id === conversation.id);
      if (exists) {
        return prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c));
      }
      return [conversation, ...prev];
    });
  }, [updateConversations]);

  const handleConversationUpdated = useCallback((event: ConversationUpdatedEvent) => {
    const conversation = event.conversation;
    if (!conversation?.id) return;

    updateConversations((prev) => 
      prev.map((c) => (c.id === conversation.id ? { ...c, ...conversation } : c))
    );
  }, [updateConversations]);

  const handleStatusChanged = useCallback((event: ConversationStatusChangedEvent) => {
    const conversation = event.conversation;
    if (!conversation?.id) return;

    logger.info("Kanban: Status changed", { 
      id: conversation.id, 
      status: event.current_status 
    });

    updateConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id 
          ? { ...c, ...conversation, status: event.current_status || conversation.status } 
          : c
      )
    );
  }, [updateConversations]);

  const handleMessageCreated = useCallback((event: MessageCreatedEvent) => {
    const conversation = event.conversation;
    const message = event.message;
    const conversationId = conversation?.id || message?.conversation_id;

    if (!conversationId) return;

    updateConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === conversationId);
      if (existingIndex === -1) {
        if (conversation) return [conversation, ...prev];
        return prev;
      }

      // Update and move to top (optional for Kanban, but good for freshness)
      const existing = prev[existingIndex];
      const updated: ChatwootConversation = {
        ...existing,
        ...conversation,
        last_non_activity_message: message || existing.last_non_activity_message,
        updated_at: message?.created_at || Date.now() / 1000,
      };

      // For Kanban, we might not want to reorder strictly by time if users are manually ordering,
      // but Chatwoot default is time-based. 
      // Let's just update the data in place to avoid jumping cards if possible, 
      // unless we want to bubble up.
      // Updating in place:
      return prev.map(c => c.id === conversationId ? updated : c);
    });
  }, [updateConversations]);

  const handleAssigneeChanged = useCallback((event: AssigneeChangedEvent) => {
    const conversation = event.conversation;
    if (!conversation?.id) return;

    logger.info("Kanban: Assignee changed", { 
      id: conversation.id, 
      assignee: event.assignee?.name 
    });

    updateConversations((prev) => 
      prev.map((c) => 
        c.id === conversation.id 
          ? { 
              ...c, 
              ...conversation, 
              meta: { ...c.meta, assignee: event.assignee || null } 
            } 
          : c
      )
    );
  }, [updateConversations]);

  // ============================================================================
  // Connection & Registration
  // ============================================================================

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const registerHandlers = useCallback(() => {
    if (registeredHandlersRef.current) return;

    chatwootConversationsWebSocketHelper.onConversationCreated(handleConversationCreated);
    chatwootConversationsWebSocketHelper.onConversationUpdated(handleConversationUpdated);
    chatwootConversationsWebSocketHelper.onStatusChanged(handleStatusChanged);
    chatwootConversationsWebSocketHelper.onMessageCreated(handleMessageCreated);
    chatwootConversationsWebSocketHelper.onAssigneeChanged(handleAssigneeChanged);
    
    registeredHandlersRef.current = true;
  }, [
    handleConversationCreated, 
    handleConversationUpdated, 
    handleStatusChanged, 
    handleMessageCreated, 
    handleAssigneeChanged
  ]);

  const unregisterHandlers = useCallback(() => {
    if (!registeredHandlersRef.current) return;

    chatwootConversationsWebSocketHelper.offConversationCreated(handleConversationCreated);
    chatwootConversationsWebSocketHelper.offConversationUpdated(handleConversationUpdated);
    chatwootConversationsWebSocketHelper.offStatusChanged(handleStatusChanged);
    chatwootConversationsWebSocketHelper.offMessageCreated(handleMessageCreated);
    chatwootConversationsWebSocketHelper.offAssigneeChanged(handleAssigneeChanged);

    registeredHandlersRef.current = false;
  }, [
    handleConversationCreated, 
    handleConversationUpdated, 
    handleStatusChanged, 
    handleMessageCreated, 
    handleAssigneeChanged
  ]);

  // Connect when account/profile changes
  useEffect(() => {
    if (!enabled || !accountId || !profile?.pubsub_token) {
        if (!enabled && connected) {
            // Disconnect logic if disabled
            unregisterHandlers();
            setConnected(false);
        }
        return;
    }

    const connect = async () => {
      try {
        chatwootConversationsWebSocketHelper.setAccountId(accountId);
        registerHandlers();
        chatwootConversationsWebSocketHelper.startListening();

        if (!chatwootWebSocketService.isConnected()) {
          await chatwootWebSocketService.connect({
            accountId,
            userId: profile.id,
            pubsubToken: profile.pubsub_token,
          });
        }
        
        if (isMountedRef.current) setConnected(true);
      } catch (err) {
        logger.error("Kanban WS connection failed", err);
        if (isMountedRef.current) setConnected(false);
      }
    };

    connect();

    return () => {
      unregisterHandlers();
      // We don't disconnect the service here because it might be shared
    };
  }, [accountId, profile, registerHandlers, unregisterHandlers, enabled, connected]);

  return { connected };
}

