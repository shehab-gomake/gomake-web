/**
 * Backend API Types for Tickets System
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/api-reference.md
 *
 * These types match the backend DTOs exactly. Do not modify without consulting backend docs.
 */

// ============================================
// Enums (from Prisma schema)
// ============================================

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ChannelType = 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';

export type MessageDirection = 'INBOUND' | 'OUTBOUND';

// ============================================
// Core Ticket Model
// ============================================

export interface Ticket {
  id: string;
  conversationId: string;
  printHouseId: string;
  ticketNumber: number;
  status: TicketStatus;
  priority: TicketPriority;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  customerId?: string | null; // GoMake ID, may be null when lookup fails
  assigneeId?: string | null;
  managerId?: string | null;
  categoryId?: string | null;
  tags: string[];
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  reopenedAt?: string | null;
  reopenCount: number;
  mergedIntoId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Hydrated Ticket Model (with relationships)
// ============================================

export interface TicketWithDetails extends Ticket {
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
  manager?: {
    id: string;
    name: string;
    email: string;
  } | null;
  category?: {
    id: string;
    name: string;
    priority: TicketPriority;
  } | null;
  conversation: {
    id: string;
    name: string;
    createdAt: string;
    lastMessageAt: string | null;
    messages: Array<{
      id: string;
      content: string;
      createdAt: string;
      direction: MessageDirection;
      channel?: ChannelType;
      fromIdentifier?: string;
      metadata?: {
        subject?: string; // email only
        messageType?: string; // WhatsApp media type
        hasHtml?: boolean;
      };
    }>;
  };
  sla?: {
    firstResponseDue: string;
    resolutionDue: string;
    firstResponseAt?: string | null;
    resolvedAt?: string | null;
    breached: boolean;
    breachedAt?: string | null;
  } | null;
}

// ============================================
// Pagination
// ============================================

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedTicketsResponse {
  tickets: TicketWithDetails[];
  pagination: PaginationMetadata;
}

// ============================================
// Filters & Query Parameters
// ============================================

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  managerId?: string;
  categoryId?: string;
  customerEmail?: string;
  customerPhone?: string;
  tags?: string[];
  page?: number; // default 1, min 1
  limit?: number; // default 20, max 100
  sortBy?: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Request DTOs
// ============================================

export interface CreateFromConversationDto {
  conversationId: string;
  priority?: TicketPriority; // default MEDIUM
  categoryId?: string;
}

export interface ReplyTicketDto {
  content: string;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
}

export interface UpdateTicketPriorityDto {
  priority: TicketPriority;
}

export interface MergeTicketDto {
  targetTicketId: string;
}

export interface AssignTicketDto {
  assigneeId: string;
}

export interface BulkAssignTicketsDto {
  ticketIds: string[];
  assigneeId: string;
}

// ============================================
// Response DTOs
// ============================================

export interface ReplyTicketResponse {
  success: true;
  message: 'Reply sent successfully';
  messageId: string; // new outbound message ID
  ticket: Ticket; // status set to PENDING
}

export interface AssignTicketResponse {
  success: true;
  message: 'Ticket assigned successfully';
  ticket: TicketWithDetails; // includes assignee, manager, category
}

export interface BulkAssignResponse {
  success: true;
  message: string;
  ticketIds: string[];
}

export interface ReopenTicketResponse {
  success: true;
  ticket: Ticket;
  message: string;
}

export interface GenericSuccessResponse {
  success: true;
  message: string;
  ticket?: Ticket;
}

// ============================================
// Related Tickets & History
// ============================================

export interface RelatedTicket {
  id: string;
  ticketNumber: number;
  status: TicketStatus;
  priority: TicketPriority;
  customerEmail?: string | null;
  customerPhone?: string | null;
  createdAt: string;
}

export interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  userId: string;
  action:
    | 'created'
    | 'assigned'
    | 'status_changed'
    | 'priority_changed'
    | 'category_changed'
    | 'closed'
    | 'reopened'
    | 'merged'
    | 'bulk_assigned'
    | 'message_received'
    | 'emails_synced';
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ============================================
// Dashboard / Management
// ============================================

export interface AgentWorkload {
  agent: {
    id: string;
    name: string;
    email: string;
  };
  openTickets: number; // OPEN, IN_PROGRESS, PENDING
  totalTickets: number; // all tickets assigned to agent
  avgResponseTimeHours: number | null; // placeholder, always null currently
}

// ============================================
// Error Response
// ============================================

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}
