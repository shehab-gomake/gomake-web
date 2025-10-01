/**
 * Tickets API Service
 * Source: /Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/api-reference.md
 *
 * All REST operations for the ticketing system.
 * Base URL: /api/tickets
 * Auth: Bearer token required on all requests
 * Tenant scoping: Automatic via printHouseId from JWT
 */

import { MessagingHubHttpClient } from '@/services/messaging-hub-http-client';
import {
  TicketFilters,
  PaginatedTicketsResponse,
  TicketWithDetails,
  CreateFromConversationDto,
  ReplyTicketResponse,
  UpdateTicketStatusDto,
  UpdateTicketPriorityDto,
  AssignTicketDto,
  AssignTicketResponse,
  BulkAssignTicketsDto,
  BulkAssignResponse,
  MergeTicketDto,
  ReopenTicketResponse,
  RelatedTicket,
  TicketHistoryEntry,
  AgentWorkload,
  GenericSuccessResponse,
} from '@/widgets/frontdesk/providers/tickets/types';

const TICKETS_BASE_URL = '/api/tickets';

export class TicketsService extends MessagingHubHttpClient {
  // ============================================
  // Core Ticket Lifecycle
  // ============================================

  /**
   * List Tickets with Filters and Pagination
   * GET /api/tickets?status=OPEN&limit=20
   */
  async listTickets(filters?: TicketFilters): Promise<PaginatedTicketsResponse> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);
    if (filters?.managerId) params.append('managerId', filters.managerId);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.customerEmail) params.append('customerEmail', filters.customerEmail);
    if (filters?.customerPhone) params.append('customerPhone', filters.customerPhone);
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach((tag) => params.append('tags', tag));
    }
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.get<PaginatedTicketsResponse>(`${TICKETS_BASE_URL}${queryString}`);
  }

  /**
   * Get Single Ticket by ID
   * GET /api/tickets/:id
   */
  async getTicketById(ticketId: string): Promise<TicketWithDetails> {
    return await this.get<TicketWithDetails>(`${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}`);
  }

  /**
   * Create Ticket From Conversation
   * POST /api/tickets/create-from-conversation
   */
  async createTicketFromConversation(data: CreateFromConversationDto): Promise<TicketWithDetails> {
    return await this.post<TicketWithDetails>(`${TICKETS_BASE_URL}/create-from-conversation`, data);
  }

  /**
   * Reply to Ticket
   * POST /api/tickets/:id/reply
   */
  async replyToTicket(ticketId: string, content: string): Promise<ReplyTicketResponse> {
    return await this.post<ReplyTicketResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/reply`,
      { content }
    );
  }

  /**
   * Update Ticket Status
   * PATCH /api/tickets/:id/status
   */
  async updateTicketStatus(ticketId: string, status: string): Promise<GenericSuccessResponse> {
    return await this.put<GenericSuccessResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/status`,
      { status }
    );
  }

  /**
   * Reopen Ticket (Manager/Admin)
   * POST /api/tickets/:id/reopen
   */
  async reopenTicket(ticketId: string): Promise<ReopenTicketResponse> {
    return await this.post<ReopenTicketResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/reopen`
    );
  }

  /**
   * Update Ticket Priority (Manager/Admin)
   * PATCH /api/tickets/:id/priority
   */
  async updateTicketPriority(ticketId: string, priority: string): Promise<GenericSuccessResponse> {
    return await this.put<GenericSuccessResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/priority`,
      { priority }
    );
  }

  /**
   * Merge Tickets (Manager/Admin)
   * POST /api/tickets/:sourceId/merge
   */
  async mergeTickets(sourceId: string, targetTicketId: string): Promise<GenericSuccessResponse> {
    return await this.post<GenericSuccessResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(sourceId)}/merge`,
      { targetTicketId }
    );
  }

  // ============================================
  // Assignment & Work Management (Manager/Admin)
  // ============================================

  /**
   * Assign Ticket
   * POST /api/tickets/:id/assign
   */
  async assignTicket(ticketId: string, assigneeId: string): Promise<AssignTicketResponse> {
    return await this.post<AssignTicketResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/assign`,
      { assigneeId }
    );
  }

  /**
   * Bulk Assign Tickets
   * POST /api/tickets/bulk-assign
   */
  async bulkAssignTickets(data: BulkAssignTicketsDto): Promise<BulkAssignResponse> {
    return await this.post<BulkAssignResponse>(`${TICKETS_BASE_URL}/bulk-assign`, data);
  }

  /**
   * Get Unassigned Tickets Dashboard
   * GET /api/tickets/dashboard/unassigned?priority=HIGH&categoryId=<id>
   */
  async getUnassignedTickets(options?: {
    priority?: string;
    categoryId?: string;
  }): Promise<TicketWithDetails[]> {
    const params = new URLSearchParams();

    if (options?.priority) params.append('priority', options.priority);
    if (options?.categoryId) params.append('categoryId', options.categoryId);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.get<TicketWithDetails[]>(`${TICKETS_BASE_URL}/dashboard/unassigned${queryString}`);
  }

  /**
   * Get Agent Workload
   * GET /api/tickets/dashboard/workload
   */
  async getAgentWorkload(): Promise<AgentWorkload[]> {
    return await this.get<AgentWorkload[]>(`${TICKETS_BASE_URL}/dashboard/workload`);
  }

  // ============================================
  // Discovery & Insights
  // ============================================

  /**
   * Get Related Tickets
   * GET /api/tickets/:id/related
   */
  async getRelatedTickets(ticketId: string): Promise<RelatedTicket[]> {
    return await this.get<RelatedTicket[]>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/related`
    );
  }

  /**
   * Get Ticket History
   * GET /api/tickets/:id/history
   */
  async getTicketHistory(ticketId: string): Promise<TicketHistoryEntry[]> {
    return await this.get<TicketHistoryEntry[]>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/history`
    );
  }

  /**
   * Get Customer Ticket History
   * GET /api/tickets/customer/:identifier
   */
  async getCustomerTicketHistory(identifier: string): Promise<TicketWithDetails[]> {
    return await this.get<TicketWithDetails[]>(
      `${TICKETS_BASE_URL}/customer/${encodeURIComponent(identifier)}`
    );
  }
}

// Export singleton instance
export const ticketsService = new TicketsService();
