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
  ConversationStatusToggleResponse,
  ChatwootConversation,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  ConversationType,
} from "../types/conversations.types";
import type { ConversationLabels } from "../types/labels.types";

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
   * - conversation_type: Pre-defined filter type (unattended, mention, participating)
   * - sort_by: Sort order (last_activity_at_desc, last_activity_at_asc, created_at_desc, created_at_asc)
   * - page: Page number for pagination (default: 1)
   * - q: Search query string
   * - inbox_id: Filter by specific inbox ID
   * - team_id: Filter by specific team ID
   * - labels: Filter by conversation labels (can be array)
   *
   * @param accountId - The numeric ID of the account (optional, not used in URL but kept for compatibility)
   * @param params - Query parameters (page, status, inbox_id, etc.)
   * @returns Promise with conversation list
   *
   * @example
   * ```typescript
   * // Get open conversations assigned to me for a specific inbox
   * const conversations = await service.listConversations(accountId, {
   *   status: ConversationStatus.OPEN,
   *   assignee_type: ConversationAssigneeType.ME,
   *   sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
   *   page: 1,
   *   inbox_id: 123
   * });
   *
   * // Get all conversations with labels
   * const conversations = await service.listConversations(accountId, {
   *   labels: ["urgent", "follow-up"]
   * });
   * ```
   */
  async listConversations(
    accountId: number | null,
    params?: ConversationListParams
  ): Promise<ConversationListResponse> {
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

      // Handle conversation_type (single value)
      // This is a pre-defined filter that translates to specific backend queries
      if (params.conversation_type !== undefined) {
        queryParams.append("conversation_type", params.conversation_type);
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
    // Use /api/accounts/conversations (without /v1)
    const url = `/api/accounts/conversations${queryString ? `?${queryString}` : ""}`;
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
    // Use /api/accounts/conversations/{id} (without /v1)
    return await this.get<ConversationDetailResponse>(`/api/accounts/conversations/${conversationId}`);
  }

  /**
   * Filter Conversations
   * POST /api/accounts/conversations/filter
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param filterRequest - Filter criteria and pagination
   * @returns Promise with filtered conversation list
   */
  async filterConversations(accountId: number, filterRequest: ConversationFilterRequest): Promise<ConversationListResponse> {
    return await this.post<ConversationListResponse>("/api/accounts/conversations/filter", filterRequest);
  }

  /**
   * Create New Conversation
   * POST /api/accounts/conversations
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param payload - Conversation creation payload
   * @returns Promise with created conversation
   */
  async createConversation(accountId: number, payload: any): Promise<ConversationDetailResponse> {
    return await this.post<ConversationDetailResponse>("/api/accounts/conversations", payload);
  }

  /**
   * Update Conversation
   * PATCH /api/accounts/conversations/{conversation_id}
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Update payload
   * @returns Promise with updated conversation
   */
  async updateConversation(accountId: number, conversationId: number, payload: any): Promise<ConversationDetailResponse> {
    return await this.patch<ConversationDetailResponse>(
      `/api/accounts/conversations/${conversationId}`,
      payload
    );
  }

  /**
   * Mark Conversation as Read
   * POST /api/accounts/conversations/{conversation_id}/update_last_seen
   *
   * Updates the agent's last seen timestamp, marking the conversation as read.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await service.markConversationAsRead(accountId, 123);
   * ```
   */
  async markConversationAsRead(accountId: number, conversationId: number): Promise<void> {
    return await this.post<void>(`/api/accounts/conversations/${conversationId}/update_last_seen`, {});
  }

  /**
   * Mark Conversation as Unread
   * POST /api/accounts/conversations/{conversation_id}/unread
   *
   * Marks the conversation as unread for the current agent.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await service.markConversationAsUnread(accountId, 123);
   * ```
   */
  async markConversationAsUnread(accountId: number, conversationId: number): Promise<void> {
    return await this.post<void>(`/api/accounts/conversations/${conversationId}/unread`, {});
  }

  /**
   * Update Conversation Status
   * POST /api/accounts/conversations/{conversation_id}/toggle_status
   *
   * Changes the conversation status (open, resolved, pending, snoozed).
   * For snooze, include snoozed_until timestamp.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Status change payload
   * @returns Promise with updated conversation
   *
   * @example
   * ```typescript
   * // Resolve conversation
   * await service.updateConversationStatus(accountId, 123, { status: 'resolved' });
   *
   * // Snooze conversation until tomorrow
   * await service.updateConversationStatus(accountId, 123, {
   *   status: 'snoozed',
   *   snoozed_until: '2024-12-25T10:00:00Z'
   * });
   * ```
   */
  async updateConversationStatus(
    accountId: number,
    conversationId: number,
    payload: {
      status: 'open' | 'resolved' | 'pending' | 'snoozed';
      snoozed_until?: string | number;
    }
  ): Promise<ConversationStatusToggleResponse> {
    return await this.post<ConversationStatusToggleResponse>(
      `/api/accounts/conversations/${conversationId}/toggle_status`,
      payload
    );
  }

  /**
   * @deprecated Use updateConversationStatus instead
   * Toggle Conversation Status
   * POST /api/accounts/conversations/{conversation_id}/toggle_status
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with toggled conversation
   */
  async toggleConversationStatus(accountId: number, conversationId: number): Promise<ConversationDetailResponse> {
    return await this.post<ConversationDetailResponse>(`/api/accounts/conversations/${conversationId}/toggle_status`);
  }

  /**
   * Update Conversation Priority
   * POST /api/accounts/conversations/{conversation_id}/toggle_priority
   *
   * Sets the conversation priority level.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Priority change payload
   * @returns Promise with updated conversation
   *
   * @example
   * ```typescript
   * // Set to urgent priority
   * await service.updateConversationPriority(accountId, 123, { priority: 'urgent' });
   *
   * // Remove priority
   * await service.updateConversationPriority(accountId, 123, { priority: null });
   * ```
   */
  async updateConversationPriority(
    accountId: number,
    conversationId: number,
    payload: {
      priority: 'urgent' | 'high' | 'medium' | 'low' | null;
    }
  ): Promise<ConversationDetailResponse> {
    return await this.post<ConversationDetailResponse>(
      `/api/accounts/conversations/${conversationId}/toggle_priority`,
      payload
    );
  }

  /**
   * @deprecated Use updateConversationPriority instead
   * Toggle Conversation Priority
   * POST /api/accounts/conversations/{conversation_id}/toggle_priority
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with toggled conversation
   */
  async toggleConversationPriority(accountId: number, conversationId: number): Promise<ConversationDetailResponse> {
    return await this.post<ConversationDetailResponse>(`/api/accounts/conversations/${conversationId}/toggle_priority`);
  }

  /**
   * Assign Agent to Conversation
   * POST /api/accounts/conversations/{conversation_id}/assignments?assignee_id={agent_id}
   *
   * Assigns or unassigns an agent to the conversation.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param assigneeId - The agent ID to assign, or null to unassign
   * @returns Promise with assignment result
   *
   * @example
   * ```typescript
   * // Assign agent with ID 42
   * await service.assignAgent(accountId, 123, 42);
   *
   * // Unassign agent
   * await service.assignAgent(accountId, 123, null);
   * ```
   */
  async assignAgent(
    accountId: number,
    conversationId: number,
    assigneeId: number | null
  ): Promise<ChatwootConversation> {
    const url = assigneeId !== null
      ? `/api/accounts/conversations/${conversationId}/assignments?assignee_id=${assigneeId}`
      : `/api/accounts/conversations/${conversationId}/assignments`;
    return await this.post<ChatwootConversation>(url, {});
  }

  /**
   * Assign Team to Conversation
   * POST /api/accounts/conversations/{conversation_id}/assignments
   *
   * Assigns or unassigns a team to the conversation.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param teamId - The team ID to assign, or null to unassign
   * @returns Promise with assignment result
   *
   * @example
   * ```typescript
   * // Assign team with ID 5
   * await service.assignTeam(accountId, 123, 5);
   *
   * // Unassign team
   * await service.assignTeam(accountId, 123, null);
   * ```
   */
  async assignTeam(
    accountId: number,
    conversationId: number,
    teamId: number | null
  ): Promise<ChatwootConversation> {
    return await this.post<ChatwootConversation>(
      `/api/accounts/conversations/${conversationId}/assignments`,
      { team_id: teamId }
    );
  }

  /**
   * Delete Conversation (Admin Only)
   * DELETE /api/accounts/conversations/{conversation_id}
   *
   * Soft-deletes a conversation via background job.
   * This endpoint should only be accessible to admin users.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * // Delete conversation (admin only)
   * await service.deleteConversation(accountId, 123);
   * ```
   */
  async deleteConversation(accountId: number, conversationId: number): Promise<void> {
    return await this.delete<void>(`/api/accounts/conversations/${conversationId}`);
  }

  /**
   * Add Labels to Conversation
   * POST /api/accounts/conversations/{conversation_id}/labels
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param labels - Array of label names
   * @returns Promise with updated labels
   */
  async addConversationLabels(accountId: number, conversationId: number, labels: string[]): Promise<ConversationLabels> {
    return await this.post<ConversationLabels>(`/api/accounts/conversations/${conversationId}/labels`, { labels });
  }

  /**
   * List Conversation Labels
   * GET /api/accounts/conversations/{conversation_id}/labels
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with conversation labels
   */
  async listConversationLabels(accountId: number, conversationId: number): Promise<ConversationLabels> {
    return await this.get<ConversationLabels>(`/api/accounts/conversations/${conversationId}/labels`);
  }

  /**
   * Update Conversation Custom Attributes
   * POST /api/accounts/conversations/{conversation_id}/custom_attributes
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param customAttributes - Custom attributes object
   * @returns Promise with updated conversation
   */
  async updateConversationCustomAttributes(
    accountId: number,
    conversationId: number,
    customAttributes: Record<string, unknown>
  ): Promise<ChatwootConversation> {
    return await this.post<ChatwootConversation>(
      `/api/accounts/conversations/${conversationId}/custom_attributes`,
      customAttributes
    );
  }

  /**
   * Get Conversation Counts/Meta
   * GET /api/accounts/conversations/meta
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @returns Promise with conversation metadata (counts, etc.)
   */
  async getConversationMeta(accountId: number): Promise<{ mine_count?: number; unassigned_count?: number; all_count?: number }> {
    return await this.get<{ mine_count?: number; unassigned_count?: number; all_count?: number }>("/api/accounts/conversations/meta");
  }
}
