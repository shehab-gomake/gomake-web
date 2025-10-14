/**
 * FrontDesk Services
 * Unified export for all FrontDesk services (WebSocket + REST API)
 *
 * Usage:
 *   import { messagingService, ticketSocketService } from '@/services/frontdesk';
 *   import { getConversationsApi, createTicketApi } from '@/services/frontdesk';
 */

// WebSocket Services
export * from './websocket';

// REST API Services
export * from './api';
