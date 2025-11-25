/**
 * Chatwoot Conversations WebSocket Helper
 *
 * Provides real-time conversation updates using the base Chatwoot WebSocket service.
 * Handles conversation created, updated, and message events for instant list updates.
 *
 * Events handled:
 * - conversation.created: New conversation added to list
 * - conversation.updated: Conversation properties changed
 * - conversation.status_changed: Status changed (open/resolved/pending)
 * - message.created: New message received (updates last_activity_at)
 * - assignee_changed: Assignee changed
 *
 * @see chatwoot-websocket.service.ts for base WebSocket implementation
 */

import {
  chatwootWebSocketService,
  ChatwootWebSocketEvent,
  type ChatwootWebSocketEventData,
} from "./chatwoot-websocket.service";
import type { ChatwootConversation, ChatwootMessage } from "../api/chatwoot/types/conversations.types";
import { createLogger } from "../utils/logger";

const logger = createLogger("ChatwootConversationsWebSocketHelper");

// ============================================================================
// Event Types
// ============================================================================

/**
 * Base WebSocket event structure from Chatwoot
 */
export interface ConversationWebSocketEvent {
  /** The conversation data */
  conversation?: ChatwootConversation;
  /** Account ID */
  account_id?: number;
}

/**
 * Conversation created event
 */
export interface ConversationCreatedEvent extends ConversationWebSocketEvent {
  event: "conversation.created";
}

/**
 * Conversation updated event
 */
export interface ConversationUpdatedEvent extends ConversationWebSocketEvent {
  event: "conversation.updated";
}

/**
 * Conversation status changed event
 */
export interface ConversationStatusChangedEvent extends ConversationWebSocketEvent {
  event: "conversation.status_changed";
  /** Previous status */
  previous_status?: string;
  /** New status */
  current_status?: string;
}

/**
 * Message created event (for updating conversation's last message)
 */
export interface MessageCreatedEvent {
  event: "message.created";
  /** The new message */
  message?: ChatwootMessage;
  /** The conversation this message belongs to */
  conversation?: ChatwootConversation;
  /** Account ID */
  account_id?: number;
}

/**
 * Assignee changed event
 */
export interface AssigneeChangedEvent extends ConversationWebSocketEvent {
  event: "assignee_changed";
  /** New assignee (null if unassigned) */
  assignee?: {
    id?: number;
    name?: string;
    email?: string;
  } | null;
}

/**
 * Typing indicator event
 */
export interface TypingEvent {
  event: "conversation.typing_on" | "conversation.typing_off";
  conversation?: { id?: number };
  user?: {
    id?: number;
    name?: string;
  };
  is_private?: boolean;
}

// ============================================================================
// Handler Types
// ============================================================================

export type ConversationCreatedHandler = (event: ConversationCreatedEvent) => void;
export type ConversationUpdatedHandler = (event: ConversationUpdatedEvent) => void;
export type ConversationStatusChangedHandler = (event: ConversationStatusChangedEvent) => void;
export type MessageCreatedHandler = (event: MessageCreatedEvent) => void;
export type AssigneeChangedHandler = (event: AssigneeChangedEvent) => void;
export type TypingHandler = (event: TypingEvent) => void;

// ============================================================================
// Constants
// ============================================================================

/** How long to keep event IDs in deduplication cache (ms) */
const EVENT_DEDUP_TTL_MS = 5000;

/** Max number of events to keep in deduplication cache */
const EVENT_DEDUP_MAX_SIZE = 100;

// ============================================================================
// Helper Class
// ============================================================================

/**
 * Chatwoot Conversations WebSocket Helper
 *
 * Provides type-safe event handling for conversation-related WebSocket events.
 * Uses the singleton chatwootWebSocketService for the underlying connection.
 * 
 * Includes built-in event deduplication to prevent duplicate processing.
 */
export class ChatwootConversationsWebSocketHelper {
  private conversationCreatedHandlers = new Set<ConversationCreatedHandler>();
  private conversationUpdatedHandlers = new Set<ConversationUpdatedHandler>();
  private statusChangedHandlers = new Set<ConversationStatusChangedHandler>();
  private messageCreatedHandlers = new Set<MessageCreatedHandler>();
  private assigneeChangedHandlers = new Set<AssigneeChangedHandler>();
  private typingHandlers = new Set<TypingHandler>();
  private isListening = false;

  // Track account ID to filter events
  private currentAccountId: number | null = null;

  // Event deduplication cache: eventKey -> timestamp
  private processedEvents = new Map<string, number>();
  private dedupCleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Set the account ID to filter events for
   * Only events matching this account will be processed
   */
  public setAccountId(accountId: number | null): void {
    this.currentAccountId = accountId;
    logger.debug("Account ID set:", { accountId });
  }

  /**
   * Generate a unique key for an event to use for deduplication
   */
  private generateEventKey(eventType: string, id: number | undefined, messageId?: number): string {
    return `${eventType}:${id || 'unknown'}:${messageId || ''}`;
  }

  /**
   * Check if an event has already been processed recently
   * Returns true if the event is a duplicate and should be skipped
   */
  private isDuplicateEvent(eventKey: string): boolean {
    const now = Date.now();
    const lastProcessed = this.processedEvents.get(eventKey);
    
    if (lastProcessed && (now - lastProcessed) < EVENT_DEDUP_TTL_MS) {
      // Silently skip duplicates (no log spam)
      return true;
    }
    
    // Mark as processed
    this.processedEvents.set(eventKey, now);
    
    // Clean up if cache is too large
    if (this.processedEvents.size > EVENT_DEDUP_MAX_SIZE) {
      this.cleanupProcessedEvents();
    }
    
    return false;
  }

  /**
   * Clean up old entries from the processed events cache
   */
  private cleanupProcessedEvents(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.processedEvents.forEach((timestamp, key) => {
      if (now - timestamp > EVENT_DEDUP_TTL_MS) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.processedEvents.delete(key));
    
    // Only log if something was actually removed (reduce noise)
    if (keysToDelete.length > 0) {
      logger.debug("Cleaned up processed events cache:", { removed: keysToDelete.length, remaining: this.processedEvents.size });
    }
  }

  /**
   * Start listening to conversation events
   */
  public startListening(): void {
    if (this.isListening) {
      logger.warn("Already listening to conversation events");
      return;
    }

    logger.info("Starting to listen to conversation events");

    // Start periodic cleanup of deduplication cache
    if (!this.dedupCleanupInterval) {
      this.dedupCleanupInterval = setInterval(() => {
        this.cleanupProcessedEvents();
      }, EVENT_DEDUP_TTL_MS);
    }

    // Register handlers with the main WebSocket service
    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.CONVERSATION_CREATED,
      this.handleConversationCreated
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.CONVERSATION_UPDATED,
      this.handleConversationUpdated
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.CONVERSATION_STATUS_CHANGED,
      this.handleStatusChanged
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.MESSAGE_CREATED,
      this.handleMessageCreated
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.ASSIGNEE_CHANGED,
      this.handleAssigneeChanged
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.CONVERSATION_TYPING_ON,
      this.handleTyping
    );

    chatwootWebSocketService.on(
      ChatwootWebSocketEvent.CONVERSATION_TYPING_OFF,
      this.handleTyping
    );

    this.isListening = true;
  }

  /**
   * Stop listening to conversation events
   */
  public stopListening(): void {
    if (!this.isListening) {
      return;
    }

    logger.info("Stopping conversation event listeners");

    // Stop deduplication cleanup interval
    if (this.dedupCleanupInterval) {
      clearInterval(this.dedupCleanupInterval);
      this.dedupCleanupInterval = null;
    }

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.CONVERSATION_CREATED,
      this.handleConversationCreated
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.CONVERSATION_UPDATED,
      this.handleConversationUpdated
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.CONVERSATION_STATUS_CHANGED,
      this.handleStatusChanged
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.MESSAGE_CREATED,
      this.handleMessageCreated
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.ASSIGNEE_CHANGED,
      this.handleAssigneeChanged
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.CONVERSATION_TYPING_ON,
      this.handleTyping
    );

    chatwootWebSocketService.off(
      ChatwootWebSocketEvent.CONVERSATION_TYPING_OFF,
      this.handleTyping
    );

    this.isListening = false;
  }

  // ============================================================================
  // Event Handlers
  // ============================================================================

  private handleConversationCreated = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = this.parseConversationEvent<ConversationCreatedEvent>(eventData, "conversation.created");
      if (!event) return;

      // Filter by account ID if set
      if (this.currentAccountId && event.account_id !== this.currentAccountId) {
        logger.debug("Ignoring conversation.created for different account:", {
          eventAccountId: event.account_id,
          currentAccountId: this.currentAccountId,
        });
        return;
      }

      // Deduplicate events
      const eventKey = this.generateEventKey("conversation.created", event.conversation?.id);
      if (this.isDuplicateEvent(eventKey)) {
        return;
      }

      logger.info("Conversation created:", {
        id: event.conversation?.id,
        inbox_id: event.conversation?.inbox_id,
        status: event.conversation?.status,
      });

      this.conversationCreatedHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling conversation.created:", error);
    }
  };

  private handleConversationUpdated = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = this.parseConversationEvent<ConversationUpdatedEvent>(eventData, "conversation.updated");
      if (!event) return;

      // Filter by account ID if set
      if (this.currentAccountId && event.account_id !== this.currentAccountId) {
        return;
      }

      // Deduplicate events (use timestamp from event if available for more granular dedup)
      const eventKey = this.generateEventKey("conversation.updated", event.conversation?.id);
      if (this.isDuplicateEvent(eventKey)) {
        return;
      }

      logger.debug("Conversation updated:", {
        id: event.conversation?.id,
        status: event.conversation?.status,
      });

      this.conversationUpdatedHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling conversation.updated:", error);
    }
  };

  private handleStatusChanged = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = this.parseConversationEvent<ConversationStatusChangedEvent>(
        eventData,
        "conversation.status_changed"
      );
      if (!event) return;

      // Filter by account ID if set
      if (this.currentAccountId && event.account_id !== this.currentAccountId) {
        return;
      }

      // Deduplicate events
      const eventKey = this.generateEventKey("conversation.status_changed", event.conversation?.id);
      if (this.isDuplicateEvent(eventKey)) {
        return;
      }

      logger.info("Conversation status changed:", {
        id: event.conversation?.id,
        from: event.previous_status,
        to: event.current_status,
      });

      this.statusChangedHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling conversation.status_changed:", error);
    }
  };

  private handleMessageCreated = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const data = eventData.data;
      if (!data) return;

      const event: MessageCreatedEvent = {
        event: "message.created",
        message: data.message || data,
        conversation: data.conversation,
        account_id: data.account_id || data.conversation?.account_id,
      };

      // Filter by account ID if set
      if (this.currentAccountId && event.account_id !== this.currentAccountId) {
        return;
      }

      // Validate we have conversation info
      if (!event.conversation?.id && !event.message?.conversation_id) {
        logger.warn("message.created missing conversation info:", eventData);
        return;
      }

      // Deduplicate events using message ID for more granular deduplication
      const conversationId = event.conversation?.id || event.message?.conversation_id;
      const eventKey = this.generateEventKey("message.created", conversationId, event.message?.id);
      if (this.isDuplicateEvent(eventKey)) {
        return;
      }

      logger.debug("Message created:", {
        messageId: event.message?.id,
        conversationId,
        content: event.message?.content?.substring(0, 50),
      });

      this.messageCreatedHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling message.created:", error);
    }
  };

  private handleAssigneeChanged = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const event = this.parseConversationEvent<AssigneeChangedEvent>(eventData, "assignee_changed");
      if (!event) return;

      // Filter by account ID if set
      if (this.currentAccountId && event.account_id !== this.currentAccountId) {
        return;
      }

      // Deduplicate events
      const eventKey = this.generateEventKey("assignee_changed", event.conversation?.id);
      if (this.isDuplicateEvent(eventKey)) {
        return;
      }

      logger.info("Assignee changed:", {
        conversationId: event.conversation?.id,
        newAssignee: event.assignee?.name || "Unassigned",
      });

      this.assigneeChangedHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling assignee_changed:", error);
    }
  };

  private handleTyping = (eventData: ChatwootWebSocketEventData): void => {
    try {
      const data = eventData.data;
      if (!data) return;

      const event: TypingEvent = {
        event: eventData.event as TypingEvent["event"],
        conversation: data.conversation,
        user: data.user,
        is_private: data.is_private,
      };

      this.typingHandlers.forEach((handler) => handler(event));
    } catch (error) {
      logger.error("Error handling typing event:", error);
    }
  };

  // ============================================================================
  // Helpers
  // ============================================================================

  /**
   * Parse and validate a conversation event
   */
  private parseConversationEvent<T extends ConversationWebSocketEvent>(
    eventData: ChatwootWebSocketEventData,
    expectedEvent: string
  ): T | null {
    const data = eventData.data;

    if (!data) {
      logger.warn(`${expectedEvent} event missing data:`, eventData);
      return null;
    }

    // The event might be wrapped differently depending on Chatwoot version
    const conversation = data.conversation || data;
    const accountId = data.account_id || conversation?.account_id;

    if (!conversation?.id) {
      logger.warn(`${expectedEvent} event missing conversation:`, eventData);
      return null;
    }

    return {
      event: expectedEvent,
      conversation,
      account_id: accountId,
      ...data,
    } as T;
  }

  // ============================================================================
  // Public API - Event Registration
  // ============================================================================

  public onConversationCreated(handler: ConversationCreatedHandler): void {
    this.conversationCreatedHandlers.add(handler);
  }

  public offConversationCreated(handler: ConversationCreatedHandler): void {
    this.conversationCreatedHandlers.delete(handler);
  }

  public onConversationUpdated(handler: ConversationUpdatedHandler): void {
    this.conversationUpdatedHandlers.add(handler);
  }

  public offConversationUpdated(handler: ConversationUpdatedHandler): void {
    this.conversationUpdatedHandlers.delete(handler);
  }

  public onStatusChanged(handler: ConversationStatusChangedHandler): void {
    this.statusChangedHandlers.add(handler);
  }

  public offStatusChanged(handler: ConversationStatusChangedHandler): void {
    this.statusChangedHandlers.delete(handler);
  }

  public onMessageCreated(handler: MessageCreatedHandler): void {
    this.messageCreatedHandlers.add(handler);
  }

  public offMessageCreated(handler: MessageCreatedHandler): void {
    this.messageCreatedHandlers.delete(handler);
  }

  public onAssigneeChanged(handler: AssigneeChangedHandler): void {
    this.assigneeChangedHandlers.add(handler);
  }

  public offAssigneeChanged(handler: AssigneeChangedHandler): void {
    this.assigneeChangedHandlers.delete(handler);
  }

  public onTyping(handler: TypingHandler): void {
    this.typingHandlers.add(handler);
  }

  public offTyping(handler: TypingHandler): void {
    this.typingHandlers.delete(handler);
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Check if currently listening
   */
  public isActive(): boolean {
    return this.isListening;
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return chatwootWebSocketService.isConnected();
  }

  /**
   * Clean up all handlers and state
   */
  public cleanup(): void {
    this.stopListening();
    this.conversationCreatedHandlers.clear();
    this.conversationUpdatedHandlers.clear();
    this.statusChangedHandlers.clear();
    this.messageCreatedHandlers.clear();
    this.assigneeChangedHandlers.clear();
    this.typingHandlers.clear();
    this.processedEvents.clear();
    this.currentAccountId = null;
  }

  /**
   * Clear the deduplication cache (useful for testing or forced refresh)
   */
  public clearDeduplicationCache(): void {
    this.processedEvents.clear();
    logger.debug("Deduplication cache cleared");
  }
}

// Export singleton instance
export const chatwootConversationsWebSocketHelper = new ChatwootConversationsWebSocketHelper();

