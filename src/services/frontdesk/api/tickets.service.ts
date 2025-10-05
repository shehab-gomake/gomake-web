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
  Provider,
  ProvidersResponse,
  ProviderChannel,
  ProviderChannelsResponse,
  Tag,
  AddTagsDto,
  CreateTagDto,
  UpdateTagDto,
  ListTagsQueryDto,
  GetPopularTagsQueryDto,
  TagsListResponse,
} from '@/widgets/frontdesk/providers/tickets/types';

const TICKETS_BASE_URL = '/tickets';
const PROVIDERS_URL = '/providers';
const PROVIDER_CHANNELS_URL = '/provider-channels';

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
    if (filters?.createdBy) params.append('createdBy', filters.createdBy);
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
    return await this.patch<GenericSuccessResponse>(
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
    return await this.patch<GenericSuccessResponse>(
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

  // ============================================
  // Providers (Simplified API)
  // ============================================

  /**
   * Get All Providers for Organization
   * GET /api/providers
   * Returns all communication providers (Gmail accounts, WhatsApp numbers, SMS, etc.)
   */
  async getProviders(): Promise<Provider[]> {
    const response = await this.get<ProvidersResponse | Provider[]>(PROVIDERS_URL);

    // Handle both response formats:
    // 1. Wrapped: { data: [...] }
    // 2. Direct array: [...]
    if (Array.isArray(response)) {
      console.log('[TicketsService] Providers returned as direct array');
      return response;
    }

    if (response && typeof response === 'object' && 'data' in response) {
      console.log('[TicketsService] Providers returned wrapped in {data: [...]}');
      return response.data || [];
    }

    console.warn('[TicketsService] ⚠️ Unexpected response format from /providers:', response);
    return [];
  }

  /**
   * Get Single Provider by ID
   * GET /api/providers/:id
   */
  async getProviderById(providerId: string): Promise<Provider> {
    return await this.get<Provider>(
      `${PROVIDERS_URL}/${encodeURIComponent(providerId)}`
    );
  }

  // ============================================
  // Provider Channels (Legacy - Deprecated)
  // ============================================

  /**
   * Get All Provider Channels for Organization
   * GET /api/provider-channels
   * Returns all communication channels (email accounts, WhatsApp numbers, etc.)
   * @deprecated Use getProviders() instead
   */
  async getProviderChannels(): Promise<ProviderChannel[]> {
    const response = await this.get<ProviderChannelsResponse | ProviderChannel[]>(PROVIDER_CHANNELS_URL);

    // Handle both response formats:
    // 1. Wrapped: { data: [...] }
    // 2. Direct array: [...]
    if (Array.isArray(response)) {
      console.log('[TicketsService] Provider channels returned as direct array');
      return response;
    }

    if (response && typeof response === 'object' && 'data' in response) {
      console.log('[TicketsService] Provider channels returned wrapped in {data: [...]}');
      return response.data || [];
    }

    console.warn('[TicketsService] ⚠️ Unexpected response format from /provider-channels:', response);
    return [];
  }

  /**
   * Get Single Provider Channel by ID
   * GET /api/provider-channels/:id
   * @deprecated Use getProviderById() instead
   */
  async getProviderChannelById(channelId: string): Promise<ProviderChannel> {
    return await this.get<ProviderChannel>(
      `${PROVIDER_CHANNELS_URL}/${encodeURIComponent(channelId)}`
    );
  }

  // ============================================
  // Tag Management
  // ============================================

  /**
   * List All Tags (with optional filters)
   * GET /api/tickets/tags?category=PRIORITY&search=urgent
   */
  async listTags(query?: ListTagsQueryDto): Promise<Tag[]> {
    const params = new URLSearchParams();

    if (query?.category) params.append('category', query.category);
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await this.get<TagsListResponse | Tag[]>(`${TICKETS_BASE_URL}/tags${queryString}`);

    // Handle both response formats
    if (Array.isArray(response)) {
      return response;
    }
    return response.tags || [];
  }

  /**
   * Get Popular Tags
   * GET /api/tickets/tags/popular?limit=10
   */
  async getPopularTags(query?: GetPopularTagsQueryDto): Promise<Tag[]> {
    const params = new URLSearchParams();

    if (query?.category) params.append('category', query.category);
    if (query?.limit) params.append('limit', query.limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.get<Tag[]>(`${TICKETS_BASE_URL}/tags/popular${queryString}`);
  }

  /**
   * Suggest Tags (Autocomplete)
   * GET /api/tickets/tags/suggest?query=bu&limit=5
   */
  async suggestTags(query: string, limit?: number, category?: string): Promise<Tag[]> {
    const params = new URLSearchParams();
    params.append('query', query);
    if (limit) params.append('limit', limit.toString());
    if (category) params.append('category', category);

    return await this.get<Tag[]>(`${TICKETS_BASE_URL}/tags/suggest?${params.toString()}`);
  }

  /**
   * Create Tag (Admin/Manager)
   * POST /api/tickets/tags
   */
  async createTag(data: CreateTagDto): Promise<Tag> {
    return await this.post<Tag>(`${TICKETS_BASE_URL}/tags`, data);
  }

  /**
   * Update Tag (Admin/Manager)
   * PATCH /api/tickets/tags/:tagId
   */
  async updateTag(tagId: string, data: UpdateTagDto): Promise<Tag> {
    return await this.patch<Tag>(
      `${TICKETS_BASE_URL}/tags/${encodeURIComponent(tagId)}`,
      data
    );
  }

  /**
   * Delete Tag (Admin/Manager)
   * DELETE /api/tickets/tags/:tagId
   */
  async deleteTag(tagId: string): Promise<GenericSuccessResponse> {
    return await this.delete<GenericSuccessResponse>(
      `${TICKETS_BASE_URL}/tags/${encodeURIComponent(tagId)}`
    );
  }

  /**
   * Get Tags for a Ticket
   * GET /api/tickets/:id/tags
   */
  async getTicketTags(ticketId: string): Promise<Tag[]> {
    return await this.get<Tag[]>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/tags`
    );
  }

  /**
   * Add Tags to Ticket (auto-creates if needed)
   * POST /api/tickets/:id/tags
   */
  async addTagsToTicket(ticketId: string, tags: string[]): Promise<Tag[]> {
    return await this.post<Tag[]>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/tags`,
      { tags }
    );
  }

  /**
   * Remove Tag from Ticket
   * DELETE /api/tickets/:id/tags/:tagId
   */
  async removeTagFromTicket(ticketId: string, tagId: string): Promise<GenericSuccessResponse> {
    return await this.delete<GenericSuccessResponse>(
      `${TICKETS_BASE_URL}/${encodeURIComponent(ticketId)}/tags/${encodeURIComponent(tagId)}`
    );
  }
}

// Export singleton instance
export const ticketsService = new TicketsService();
