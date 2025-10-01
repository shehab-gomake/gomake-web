/**
 * WebSocket Event Types for Tickets System
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/realtime-and-webhooks.md
 *
 * All 12 real-time events for ticketing system.
 * Events are broadcast to organization room: `org:${printHouseId}`
 */

import { TicketWithDetails, ChannelType } from './api.types';

// ============================================
// WebSocket Event Payloads (12 Events)
// ============================================

/**
 * Event: ticket.created
 * When: Ticket created manually or via service
 */
export interface TicketCreatedPayload {
  ticket: TicketWithDetails;
  conversationId?: string;
  channel?: ChannelType;
  customerIdentifier?: string;
  printHouseId: string;
}

/**
 * Event: ticket.assigned
 * When: Manager assigns a ticket
 */
export interface TicketAssignedPayload {
  ticketId: string;
  assigneeId: string;
  managerId: string;
  ticket: TicketWithDetails;
  printHouseId: string;
}

/**
 * Event: ticket.status.changed
 * When: Agent/manager changes status
 */
export interface TicketStatusChangedPayload {
  ticketId: string;
  userId: string;
  oldStatus: string;
  newStatus: string;
  ticket: TicketWithDetails;
  printHouseId: string;
}

/**
 * Event: ticket.reply.sent
 * When: Outbound reply queued
 */
export interface TicketReplySentPayload {
  ticketId: string;
  userId: string;
  content: string;
  isFirstResponse: boolean;
  messageId: string;
  printHouseId: string;
}

/**
 * Event: ticket.reopened
 * When: Manual or auto reopen
 */
export interface TicketReopenedPayload {
  ticketId: string;
  userId: string;
  isAutoReopen: boolean;
  ticket: TicketWithDetails;
  printHouseId: string;
}

/**
 * Event: ticket.merged
 * When: Tickets merged
 */
export interface TicketMergedPayload {
  sourceTicketId: string;
  targetTicketId: string;
  userId: string;
  sourceTicketNumber: number;
  targetTicketNumber: number;
  printHouseId: string;
}

/**
 * Event: tickets.bulkAssigned
 * When: Manager reassigns multiple tickets
 */
export interface TicketsBulkAssignedPayload {
  ticketIds: string[];
  assigneeId: string;
  managerId: string;
  printHouseId: string;
}

/**
 * Event: ticket.message.received
 * When: Webhook ingested inbound message
 */
export interface TicketMessageReceivedPayload {
  ticketId: string;
  messageId: string;
  channel: ChannelType;
  identifier: string; // email or phone
  content?: string;
  printHouseId: string;
}

/**
 * Event: ticket.customer.updated
 * When: GoMake lookup succeeded after ticket creation
 */
export interface TicketCustomerUpdatedPayload {
  ticketId: string;
  customerId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  printHouseId: string;
}

/**
 * Event: sla.breached
 * When: First-response or resolution SLA exceeded
 */
export interface SLABreachedPayload {
  ticketId: string;
  type: 'first_response' | 'resolution';
  breachedAt: string;
  printHouseId: string;
}

/**
 * Event: ticket.autoResponse
 * When: Auto-response sent to customer
 */
export interface TicketAutoResponsePayload {
  ticketId: string;
  content: string;
  messageId: string;
  printHouseId: string;
}

/**
 * Event: webhook.message.processed
 * When: Each webhook completes
 */
export interface WebhookMessageProcessedPayload {
  webhookType: 'email' | 'whatsapp' | 'sms';
  status: 'success' | 'no_ticket' | 'error';
  action: string;
  ticketId?: string;
  identifier: string; // email or phone
  printHouseId: string;
  error?: string;
}

// ============================================
// Event Handler Types
// ============================================

export type TicketCreatedHandler = (payload: TicketCreatedPayload) => void;
export type TicketAssignedHandler = (payload: TicketAssignedPayload) => void;
export type TicketStatusChangedHandler = (payload: TicketStatusChangedPayload) => void;
export type TicketReplySentHandler = (payload: TicketReplySentPayload) => void;
export type TicketReopenedHandler = (payload: TicketReopenedPayload) => void;
export type TicketMergedHandler = (payload: TicketMergedPayload) => void;
export type TicketsBulkAssignedHandler = (payload: TicketsBulkAssignedPayload) => void;
export type TicketMessageReceivedHandler = (payload: TicketMessageReceivedPayload) => void;
export type TicketCustomerUpdatedHandler = (payload: TicketCustomerUpdatedPayload) => void;
export type SLABreachedHandler = (payload: SLABreachedPayload) => void;
export type TicketAutoResponseHandler = (payload: TicketAutoResponsePayload) => void;
export type WebhookMessageProcessedHandler = (payload: WebhookMessageProcessedPayload) => void;

// ============================================
// Event Names (constants for type safety)
// ============================================

export const TICKET_EVENTS = {
  CREATED: 'ticket.created',
  ASSIGNED: 'ticket.assigned',
  STATUS_CHANGED: 'ticket.status.changed',
  REPLY_SENT: 'ticket.reply.sent',
  REOPENED: 'ticket.reopened',
  MERGED: 'ticket.merged',
  BULK_ASSIGNED: 'tickets.bulkAssigned',
  MESSAGE_RECEIVED: 'ticket.message.received',
  CUSTOMER_UPDATED: 'ticket.customer.updated',
  SLA_BREACHED: 'sla.breached',
  AUTO_RESPONSE: 'ticket.autoResponse',
  WEBHOOK_PROCESSED: 'webhook.message.processed',
} as const;

export type TicketEventName = typeof TICKET_EVENTS[keyof typeof TICKET_EVENTS];
