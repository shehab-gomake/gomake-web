/**
 * Tickets Provider Types - Centralized Export
 */

// Backend API types (primary)
export * from './api.types';

// WebSocket event types
export * from './websocket.types';

// Transformers
export * from './transformers';

// Legacy UI types (only export non-conflicting types)
export type { TicketComment, TicketAttachment } from './ticket.types';
