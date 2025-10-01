/**
 * Ticket WebSocket Service
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/realtime-and-webhooks.md
 *
 * Handles all 12 real-time ticket events via Socket.IO
 * Connects to /messaging namespace
 * Events are broadcast to organization room: org:${printHouseId}
 */

import { Socket } from 'socket.io-client';
import { messagingService } from './messaging-socket.service';
import {
  TICKET_EVENTS,
  TicketCreatedPayload,
  TicketAssignedPayload,
  TicketStatusChangedPayload,
  TicketReplySentPayload,
  TicketReopenedPayload,
  TicketMergedPayload,
  TicketsBulkAssignedPayload,
  TicketMessageReceivedPayload,
  TicketCustomerUpdatedPayload,
  SLABreachedPayload,
  TicketAutoResponsePayload,
  WebhookMessageProcessedPayload,
  TicketCreatedHandler,
  TicketAssignedHandler,
  TicketStatusChangedHandler,
  TicketReplySentHandler,
  TicketReopenedHandler,
  TicketMergedHandler,
  TicketsBulkAssignedHandler,
  TicketMessageReceivedHandler,
  TicketCustomerUpdatedHandler,
  SLABreachedHandler,
  TicketAutoResponseHandler,
  WebhookMessageProcessedHandler,
} from '@/widgets/frontdesk/providers/tickets/types';

class TicketSocketService {
  private socket: Socket | null = null;
  private currentPrintHouseId: string | null = null;
  private eventHandlers: Map<string, Set<(...args: any[]) => void>> = new Map();

  /**
   * Initialize socket connection and subscribe to ticket events
   * @param printHouseId - Current organization/tenant ID for filtering events
   */
  async connect(authToken: string, printHouseId: string): Promise<void> {
    // Use existing messaging service connection
    await messagingService.connect(authToken);
    this.socket = messagingService.getSocket();
    this.currentPrintHouseId = printHouseId;

    if (!this.socket) {
      throw new Error('Failed to connect to messaging service');
    }

    console.log('[TicketSocket] Connected to /messaging namespace for tenant:', printHouseId);
    this.registerAllEvents();
  }

  /**
   * Disconnect from socket and clean up listeners
   */
  disconnect(): void {
    if (this.socket) {
      this.removeAllTicketListeners();
      this.socket = null;
      this.currentPrintHouseId = null;
      this.eventHandlers.clear();
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // ============================================
  // Event Registration (12 Ticket Events)
  // ============================================

  private registerAllEvents(): void {
    if (!this.socket) return;

    // Register all 12 ticket events
    this.socket.on(TICKET_EVENTS.CREATED, this.handleTicketCreated.bind(this));
    this.socket.on(TICKET_EVENTS.ASSIGNED, this.handleTicketAssigned.bind(this));
    this.socket.on(TICKET_EVENTS.STATUS_CHANGED, this.handleTicketStatusChanged.bind(this));
    this.socket.on(TICKET_EVENTS.REPLY_SENT, this.handleTicketReplySent.bind(this));
    this.socket.on(TICKET_EVENTS.REOPENED, this.handleTicketReopened.bind(this));
    this.socket.on(TICKET_EVENTS.MERGED, this.handleTicketMerged.bind(this));
    this.socket.on(TICKET_EVENTS.BULK_ASSIGNED, this.handleTicketsBulkAssigned.bind(this));
    this.socket.on(TICKET_EVENTS.MESSAGE_RECEIVED, this.handleTicketMessageReceived.bind(this));
    this.socket.on(TICKET_EVENTS.CUSTOMER_UPDATED, this.handleTicketCustomerUpdated.bind(this));
    this.socket.on(TICKET_EVENTS.SLA_BREACHED, this.handleSLABreached.bind(this));
    this.socket.on(TICKET_EVENTS.AUTO_RESPONSE, this.handleTicketAutoResponse.bind(this));
    this.socket.on(TICKET_EVENTS.WEBHOOK_PROCESSED, this.handleWebhookMessageProcessed.bind(this));

    console.log('[TicketSocket] Registered all 12 ticket event listeners');
  }

  private removeAllTicketListeners(): void {
    if (!this.socket) return;

    Object.values(TICKET_EVENTS).forEach((eventName) => {
      this.socket!.removeAllListeners(eventName);
    });

    console.log('[TicketSocket] Removed all ticket event listeners');
  }

  // ============================================
  // Event Filters (Multi-tenancy)
  // ============================================

  /**
   * Filter events by printHouseId to ensure tenant isolation
   */
  private shouldProcessEvent(payload: { printHouseId?: string }): boolean {
    if (!payload.printHouseId || !this.currentPrintHouseId) {
      console.warn('[TicketSocket] Event missing printHouseId, dropping event');
      return false;
    }

    if (payload.printHouseId !== this.currentPrintHouseId) {
      console.warn(
        `[TicketSocket] Event from different tenant (${payload.printHouseId}), expected ${this.currentPrintHouseId}`
      );
      return false;
    }

    return true;
  }

  // ============================================
  // Event Handlers (Internal)
  // ============================================

  private handleTicketCreated(payload: TicketCreatedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.created:', payload);
    this.emit(TICKET_EVENTS.CREATED, payload);
  }

  private handleTicketAssigned(payload: TicketAssignedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.assigned:', payload);
    this.emit(TICKET_EVENTS.ASSIGNED, payload);
  }

  private handleTicketStatusChanged(payload: TicketStatusChangedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.status.changed:', payload);
    this.emit(TICKET_EVENTS.STATUS_CHANGED, payload);
  }

  private handleTicketReplySent(payload: TicketReplySentPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.reply.sent:', payload);
    this.emit(TICKET_EVENTS.REPLY_SENT, payload);
  }

  private handleTicketReopened(payload: TicketReopenedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.reopened:', payload);
    this.emit(TICKET_EVENTS.REOPENED, payload);
  }

  private handleTicketMerged(payload: TicketMergedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.merged:', payload);
    this.emit(TICKET_EVENTS.MERGED, payload);
  }

  private handleTicketsBulkAssigned(payload: TicketsBulkAssignedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] tickets.bulkAssigned:', payload);
    this.emit(TICKET_EVENTS.BULK_ASSIGNED, payload);
  }

  private handleTicketMessageReceived(payload: TicketMessageReceivedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.message.received:', payload);
    this.emit(TICKET_EVENTS.MESSAGE_RECEIVED, payload);
  }

  private handleTicketCustomerUpdated(payload: TicketCustomerUpdatedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.customer.updated:', payload);
    this.emit(TICKET_EVENTS.CUSTOMER_UPDATED, payload);
  }

  private handleSLABreached(payload: SLABreachedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.warn('[TicketSocket] sla.breached:', payload);
    this.emit(TICKET_EVENTS.SLA_BREACHED, payload);
  }

  private handleTicketAutoResponse(payload: TicketAutoResponsePayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] ticket.autoResponse:', payload);
    this.emit(TICKET_EVENTS.AUTO_RESPONSE, payload);
  }

  private handleWebhookMessageProcessed(payload: WebhookMessageProcessedPayload): void {
    if (!this.shouldProcessEvent(payload)) return;
    console.log('[TicketSocket] webhook.message.processed:', payload);
    this.emit(TICKET_EVENTS.WEBHOOK_PROCESSED, payload);
  }

  // ============================================
  // Public Event Listeners (for consumers)
  // ============================================

  /**
   * Subscribe to ticket.created event
   */
  onTicketCreated(handler: TicketCreatedHandler): void {
    this.on(TICKET_EVENTS.CREATED, handler);
  }

  /**
   * Subscribe to ticket.assigned event
   */
  onTicketAssigned(handler: TicketAssignedHandler): void {
    this.on(TICKET_EVENTS.ASSIGNED, handler);
  }

  /**
   * Subscribe to ticket.status.changed event
   */
  onTicketStatusChanged(handler: TicketStatusChangedHandler): void {
    this.on(TICKET_EVENTS.STATUS_CHANGED, handler);
  }

  /**
   * Subscribe to ticket.reply.sent event
   */
  onTicketReplySent(handler: TicketReplySentHandler): void {
    this.on(TICKET_EVENTS.REPLY_SENT, handler);
  }

  /**
   * Subscribe to ticket.reopened event
   */
  onTicketReopened(handler: TicketReopenedHandler): void {
    this.on(TICKET_EVENTS.REOPENED, handler);
  }

  /**
   * Subscribe to ticket.merged event
   */
  onTicketMerged(handler: TicketMergedHandler): void {
    this.on(TICKET_EVENTS.MERGED, handler);
  }

  /**
   * Subscribe to tickets.bulkAssigned event
   */
  onTicketsBulkAssigned(handler: TicketsBulkAssignedHandler): void {
    this.on(TICKET_EVENTS.BULK_ASSIGNED, handler);
  }

  /**
   * Subscribe to ticket.message.received event
   */
  onTicketMessageReceived(handler: TicketMessageReceivedHandler): void {
    this.on(TICKET_EVENTS.MESSAGE_RECEIVED, handler);
  }

  /**
   * Subscribe to ticket.customer.updated event
   */
  onTicketCustomerUpdated(handler: TicketCustomerUpdatedHandler): void {
    this.on(TICKET_EVENTS.CUSTOMER_UPDATED, handler);
  }

  /**
   * Subscribe to sla.breached event
   */
  onSLABreached(handler: SLABreachedHandler): void {
    this.on(TICKET_EVENTS.SLA_BREACHED, handler);
  }

  /**
   * Subscribe to ticket.autoResponse event
   */
  onTicketAutoResponse(handler: TicketAutoResponseHandler): void {
    this.on(TICKET_EVENTS.AUTO_RESPONSE, handler);
  }

  /**
   * Subscribe to webhook.message.processed event
   */
  onWebhookMessageProcessed(handler: WebhookMessageProcessedHandler): void {
    this.on(TICKET_EVENTS.WEBHOOK_PROCESSED, handler);
  }

  // ============================================
  // Event Emitter Pattern (Internal)
  // ============================================

  private on(eventName: string, handler: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set());
    }
    this.eventHandlers.get(eventName)!.add(handler);
  }

  private emit(eventName: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`[TicketSocket] Error in ${eventName} handler:`, error);
        }
      });
    }
  }

  /**
   * Remove a specific event listener
   */
  removeListener(eventName: string, handler: (...args: any[]) => void): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners(eventName?: string): void {
    if (eventName) {
      this.eventHandlers.delete(eventName);
    } else {
      this.eventHandlers.clear();
    }
  }
}

// Singleton instance
export const ticketSocketService = new TicketSocketService();
