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

export type TagCategory =
  | 'GENERAL'
  | 'PRIORITY'
  | 'DEPARTMENT'
  | 'STATUS'
  | 'CUSTOMER'
  | 'PRODUCT';

// ============================================
// Tag System
// ============================================

export interface Tag {
  id: string;
  printHouseId: string;
  name: string; // normalized (lowercase)
  displayName: string; // preserves original case
  color?: string | null; // hex color (#FF5733)
  category: TagCategory;
  description?: string | null;
  usageCount: number;
  isSystem: boolean;
  createdBy?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

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
  tags: Tag[]; // Full tag objects with metadata
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  reopenedAt?: string | null;
  reopenCount: number;
  mergedIntoId?: string | null;
  // Origin tracking
  originProviderChannelId: string;
  // Creator and assignment tracking
  createdBy: string; // User ID who created the ticket
  assignedBy?: string | null; // User ID who assigned the ticket
  assignedAt?: string | null; // When the ticket was assigned
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Hydrated Ticket Model (with relationships)
// ============================================

export interface TicketWithDetails extends Ticket {
  // Creator details (populated from createdBy)
  creator?: {
    id: string;
    name: string;
    email: string;
  } | null;
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
  // Origin provider channel details
  originProviderChannel: {
    id: string;
    type: ChannelType;
    identifier: string; // email address or phone number
    name: string;
  };
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
      // Delivery tracking fields
      status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
      sentAt?: string;
      deliveredAt?: string;
      errorMessage?: string;
      metadata?: {
        subject?: string; // email only
        messageType?: string; // WhatsApp media type
        hasHtml?: boolean;
      };
      channelMetadata?: {
        providerMessageId?: string;
        [key: string]: any;
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
  createdBy?: string; // Filter by ticket creator
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

/**
 * Create Ticket From Conversation (Multi-Provider)
 */
export interface CreateFromConversationDto {
  providerId: string; // Provider ID from backend (from GET /providers)
  externalConversationId: string; // Gmail threadId, WhatsApp chatId, SMS conversationSid, etc.
  priority?: TicketPriority; // default MEDIUM
  categoryId?: string;
  assigneeId?: string; // Optional: Auto-assign to agent
  customerId?: string; // Optional: GoMake customer ID
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
// Providers (Simplified API)
// ============================================

/**
 * Provider - Represents a communication provider (Gmail, WhatsApp, SMS)
 */
export interface Provider {
  id: string;
  type: 'EMAIL' | 'WHATSAPP' | 'SMS' | 'PUSH';
  name: string;
  metadata: {
    email?: string;
    phone?: string;
    displayName?: string;
    [key: string]: any;
  };
}

/**
 * Response from GET /providers
 */
export interface ProvidersResponse {
  data: Provider[];
}

// ============================================
// Provider Channels (Legacy)
// ============================================

/**
 * Provider Channel - Represents a communication channel (email account, WhatsApp number, etc.)
 * @deprecated Use Provider instead
 */
export interface ProviderChannel {
  id: string;
  type: ChannelType;
  identifier: string; // support@company.com, +1234567890, etc.
  name: string;
  providerId: string;
  provider: {
    id: string;
    type: 'EMAIL' | 'WHATSAPP' | 'SMS';
    name: string;
  };
  isActive: boolean;
}

/**
 * Response from GET /provider-channels
 * @deprecated Use ProvidersResponse instead
 */
export interface ProviderChannelsResponse {
  data: ProviderChannel[];
}

// ============================================
// Review Queue (Conversations Without Tickets)
// ============================================

/**
 * Event: conversation.needs.review
 * When: Message received but no ticket exists
 */
export interface ConversationNeedsReviewPayload {
  channel: ChannelType;
  identifier: string; // email or phone
  subject?: string;
  content: string;
  preview: string; // First 100 chars
  metadata: Record<string, any>;
  printHouseId: string;
  timestamp: string;
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

// ============================================
// Tag Management DTOs
// ============================================

/**
 * Add tags to a ticket (auto-creates if needed)
 * POST /api/tickets/:id/tags
 */
export interface AddTagsDto {
  tags: string[]; // Array of tag names (1-10)
}

/**
 * Create a tag manually (admin/manager)
 * POST /api/tickets/tags
 */
export interface CreateTagDto {
  name: string;
  displayName?: string;
  color?: string; // hex color
  category?: TagCategory;
  description?: string;
}

/**
 * Update tag properties (admin/manager)
 * PATCH /api/tickets/tags/:tagId
 */
export interface UpdateTagDto {
  displayName?: string;
  color?: string;
  category?: TagCategory;
  description?: string;
}

/**
 * Remove tag from ticket
 * DELETE /api/tickets/:id/tags/:tagId
 */
export interface RemoveTagDto {
  tagId: string;
}

/**
 * Autocomplete suggestions
 * GET /api/tickets/tags/suggest?query=...
 */
export interface SuggestTagsQueryDto {
  query: string;
  limit?: number; // default 10
  category?: TagCategory;
}

/**
 * List tags with filters
 * GET /api/tickets/tags?category=...
 */
export interface ListTagsQueryDto {
  category?: TagCategory;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get popular tags
 * GET /api/tickets/tags/popular
 */
export interface GetPopularTagsQueryDto {
  category?: TagCategory;
  limit?: number; // default 10
}

/**
 * Tag list response
 */
export interface TagsListResponse {
  tags: Tag[];
  pagination?: PaginationMetadata;
}
