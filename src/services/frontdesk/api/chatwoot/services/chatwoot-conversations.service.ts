/**
 * Chatwoot Conversations Service
 *
 * Handles all conversation-related endpoints.
 * All endpoints require account_id.
 *
 * @see ConversationsApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";

/**
 * ConversationFilterRequest payload
 * Used for filtering conversations with custom filters
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
   * GET /api/v1/accounts/{account_id}/conversations
   *
   * @param accountId - The numeric ID of the account
   * @param params - Query parameters (page, status, inbox_id, etc.)
   * @returns Promise with conversation list
   */
  async listConversations(
    accountId: number,
    params?: {
      page?: number;
      status?: string[];
      inbox_id?: number[];
      assignee_type?: string;
      labels?: string[];
      [key: string]: any;
    }
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    const queryString = queryParams.toString();
    const url = this.accountScopedUrl(accountId, `conversations${queryString ? `?${queryString}` : ""}`);
    return await this.get<any>(url);
  }

  /**
   * Get Conversation Details
   * GET /api/v1/accounts/{account_id}/conversations/{conversation_id}
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @returns Promise with conversation details
   */
  async getConversationDetails(accountId: number, conversationId: number): Promise<any> {
    return await this.get<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}`));
  }

  /**
   * Filter Conversations
   * POST /api/v1/accounts/{account_id}/conversations/filter
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
   * POST /api/v1/accounts/{account_id}/conversations
   *
   * @param accountId - The numeric ID of the account
   * @param payload - Conversation creation payload
   * @returns Promise with created conversation
   */
  async createConversation(accountId: number, payload: any): Promise<any> {
    return await this.post<any>(this.accountScopedUrl(accountId, "conversations"), payload);
  }

  /**
   * Update Conversation
   * PATCH /api/v1/accounts/{account_id}/conversations/{conversation_id}
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Update payload
   * @returns Promise with updated conversation
   */
  async updateConversation(accountId: number, conversationId: number, payload: any): Promise<any> {
    return await this.patch<any>(this.accountScopedUrl(accountId, `conversations/${conversationId}`), payload);
  }

  /**
   * Toggle Conversation Status
   * POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_status
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
   * POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/toggle_priority
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
   * POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/labels
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
   * GET /api/v1/accounts/{account_id}/conversations/{conversation_id}/labels
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
   * POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/custom_attributes
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
   * GET /api/v1/accounts/{account_id}/conversations/meta
   *
   * @param accountId - The numeric ID of the account
   * @returns Promise with conversation metadata (counts, etc.)
   */
  async getConversationMeta(accountId: number): Promise<any> {
    return await this.get<any>(this.accountScopedUrl(accountId, "conversations/meta"));
  }
}
