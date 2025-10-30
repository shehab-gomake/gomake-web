/**
 * Chatwoot Conversations Service
 *
 * Handles all conversation-related endpoints.
 * All endpoints require account_id.
 *
 * @see ConversationsApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import {
  ConversationListParams,
  ConversationListResponse,
  ConversationDetailResponse,
  ChatwootConversation,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
} from "../types/conversations.types";

/**
 * ConversationFilterRequest payload
 * Used for filtering conversations with custom filters (POST endpoint)
 */
export interface ConversationFilterRequest {
  payload?: {
    q?: string;
    status?: string[];
    inbox_id?: number[];
    labels?: string[];
    assignee_type?: string;
    team_id?: number[];
    [key: string]: any;
  };
  page?: number;
}

/**
 * ChatwootConversationsService
 * Handles conversation-related API operations
 *
 * @example
 * ```typescript
 * const conversationsService = new ChatwootConversationsService();
 *
 * // List conversations
 * const conversations = await conversationsService.listConversations(accountId, { page: 1 });
 *
 * // Get conversation details
 * const conversation = await conversationsService.getConversationDetails(accountId, conversationId);
 * ```
 */
export class ChatwootConversationsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }
  /**
   * List Conversations
   * GET /api/accounts/conversations
   *
   * Supported query parameters:
   * - status: Filter by conversation status (all, open, resolved, pending, snoozed)
   * - assignee_type: Filter by assignee (me, unassigned, all, assigned)
   * - sort_by: Sort order (last_activity_at_desc, last_activity_at_asc, created_at_desc, created_at_asc)
   * - page: Page number for pagination (default: 1)
   * - q: Search query string
   * - inbox_id: Filter by specific inbox ID
   * - team_id: Filter by specific team ID
   * - labels: Filter by conversation labels (can be array)
   *
   * @param params - Query parameters (page, status, inbox_id, etc.)
   * @returns Promise with conversation list
   *
   * @example
   * ```typescript
   * // Get open conversations assigned to me
   * const conversations = await service.listConversations({
   *   status: ConversationStatus.OPEN,
   *   assignee_type: ConversationAssigneeType.ME,
   *   sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
   *   page: 1
   * });
   *
   * // Get all conversations with labels
   * const conversations = await service.listConversations({
   *   labels: ["urgent", "follow-up"]
   * });
   * ```
   */
  async listConversations(params?: ConversationListParams): Promise<ConversationListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      // Handle status - can be single value or array
      if (params.status !== undefined) {
        if (Array.isArray(params.status)) {
          params.status.forEach((status) => queryParams.append("status", status));
        } else {
          queryParams.append("status", params.status);
        }
      }

      // Handle assignee_type (single value)
      if (params.assignee_type !== undefined) {
        queryParams.append("assignee_type", params.assignee_type);
      }

      // Handle sort_by
      if (params.sort_by !== undefined) {
        queryParams.append("sort_by", String(params.sort_by));
      }

      // Handle page
      if (params.page !== undefined) {
        queryParams.append("page", String(params.page));
      }

      // Handle search query
      if (params.q !== undefined && params.q !== "") {
        queryParams.append("q", params.q);
      }

      // Handle inbox_id (single value in query params)
      if (params.inbox_id !== undefined) {
        queryParams.append("inbox_id", String(params.inbox_id));
      }

      // Handle team_id
      if (params.team_id !== undefined) {
        queryParams.append("team_id", String(params.team_id));
      }

      // Handle labels - can be single string or array
      if (params.labels !== undefined) {
        if (Array.isArray(params.labels)) {
          params.labels.forEach((label) => queryParams.append("labels", label));
        } else {
          queryParams.append("labels", params.labels);
        }
      }

      // Handle limit
      if (params.limit !== undefined) {
        queryParams.append("limit", String(params.limit));
      }
    }

    const queryString = queryParams.toString();
    const url = `${this.API_BASE}/accounts/conversations${queryString ? `?${queryString}` : ""}`;
    return await this.get<ConversationListResponse>(url);
  }

  /**
   * Get Conversation Details
   * GET /api/accounts/conversations/{conversation_id}
   *
   * @param accountId - The numeric ID of the account (not used in URL, but kept for API compatibility)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with conversation details
   */
  async getConversationDetails(accountId: number, conversationId: number): Promise<ConversationDetailResponse> {
    return await this.get<ConversationDetailResponse>(this.globalUrl(`accounts/conversations/${conversationId}`));
  }

  /**
   * Filter Conversations
   * POST /api/accounts/{account_id}/conversations/filter
   *
   * @param accountId - The numeric ID of the account
   * @param filterRequest - Filter criteria and pagination
   * @returns Promise with filtered conversation list
   */
  async filterConversations(accountId: number, filterRequest: ConversationFilterRequest): Promise<any> {
    return await this.post<any>(this.accountScopedUrl(accountId, "conversations/filter"), filterRequest);
  }

  /**
   * Create New Conversation
   * POST /api/accounts/{account_id}/conversations
   *
   * @param accountId - The numeric ID of the account
   * @param payload - Conversation creation payload
   * @returns Promise with created conversation
   */
  async createConversation(accountId: number, payload: any): Promise<ConversationDetailResponse> {
    return await this.post<ConversationDetailResponse>(this.accountScopedUrl(accountId, "conversations"), payload);
  }

  /**
   * Update Conversation
   * PATCH /api/accounts/{account_id}/conversations/{conversation_id}
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Update payload
   * @returns Promise with updated conversation
   */
  async updateConversation(accountId: number, conversationId: number, payload: any): Promise<ConversationDetailResponse> {
    return await this.patch<ConversationDetailResponse>(
      this.accountScopedUrl(accountId, `conversations/${conversationId}`),
      payload
    );
  }

  /**
   * Toggle Conversation Status
   * POST /api/accounts/{account_id}/conversations/{conversation_id}/toggle_status
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with toggled conversation
   */
  async toggleConversationStatus(accountId: number, conversationId: number): Promise<any> {
    return await this.post<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}/toggle_status`));
  }

  /**
   * Toggle Conversation Priority
   * POST /api/accounts/{account_id}/conversations/{conversation_id}/toggle_priority
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with toggled conversation
   */
  async toggleConversationPriority(accountId: number, conversationId: number): Promise<any> {
    return await this.post<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}/toggle_priority`));
  }

  /**
   * Add Labels to Conversation
   * POST /api/accounts/{account_id}/conversations/{conversation_id}/labels
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param labels - Array of label names
   * @returns Promise with updated labels
   */
  async addConversationLabels(accountId: number, conversationId: number, labels: string[]): Promise<any> {
    return await this.post<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}/labels`), { labels });
  }

  /**
   * List Conversation Labels
   * GET /api/accounts/{account_id}/conversations/{conversation_id}/labels
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with conversation labels
   */
  async listConversationLabels(accountId: number, conversationId: number): Promise<any> {
    return await this.get<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}/labels`));
  }

  /**
   * Update Conversation Custom Attributes
   * POST /api/accounts/{account_id}/conversations/{conversation_id}/custom_attributes
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param customAttributes - Custom attributes object
   * @returns Promise with updated conversation
   */
  async updateConversationCustomAttributes(
    accountId: number,
    conversationId: number,
    customAttributes: Record<string, any>
  ): Promise<any> {
    return await this.post<any>(
      this.accountScopedUrl(accountId, `conversations/${conversationId}/custom_attributes`),
      customAttributes
    );
  }

  /**
   * Get Conversation Counts/Meta
   * GET /api/accounts/{account_id}/conversations/meta
   *
   * @param accountId - The numeric ID of the account
   * @returns Promise with conversation metadata (counts, etc.)
   */
  async getConversationMeta(accountId: number): Promise<any> {
    return await this.get<any>(this.accountScopedUrl(accountId, "conversations/meta"));
  }
}
