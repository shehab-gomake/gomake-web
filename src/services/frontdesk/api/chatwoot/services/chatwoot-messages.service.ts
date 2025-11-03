/**
 * Chatwoot Messages Service
 * 
 * Handles all message-related endpoints.
 * All endpoints require account_id and conversation_id.
 * 
 * @see MessagesApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";

/**
 * ChatwootMessagesService
 * Handles message-related API operations
 * 
 * @example
 * ```typescript
 * const messagesService = new ChatwootMessagesService();
 * 
 * // List messages
 * const messages = await messagesService.listMessages(accountId, conversationId);
 * 
 * // Create message
 * const message = await messagesService.createMessage(accountId, conversationId, {
 *   content: "Hello!",
 *   message_type: "outgoing"
 * });
 * ```
 */
export class ChatwootMessagesService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }
  /**
   * List All Messages
   * GET /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages
   * 
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param params - Query parameters (before, after, etc.)
   * @returns Promise with message list
   */
  async listMessages(
    accountId: number,
    conversationId: number,
    params?: {
      before?: number;
      after?: number;
      [key: string]: any;
    }
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = this.accountScopedUrl(
      accountId,
      `conversations/${conversationId}/messages${queryString ? `?${queryString}` : ""}`
    );
    return await this.get<any>(url);
  }

  /**
   * Create New Message
   * POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages
   * 
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Message creation payload
   * @returns Promise with created message
   * 
   * @example
   * ```typescript
   * // Simple text message
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Hello!",
   *   message_type: "outgoing"
   * });
   * 
   * // WhatsApp template message
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Your order is confirmed",
   *   message_type: "outgoing",
   *   template_params: {
   *     name: "order_confirmation",
   *     category: "MARKETING",
   *     language: "en",
   *     processed_params: {
   *       body: { "1": "121212" }
   *     }
   *   }
   * });
   * ```
   */
  async createMessage(
    accountId: number,
    conversationId: number,
    payload: {
      content?: string;
      message_type: "incoming" | "outgoing";
      private?: boolean;
      template_params?: {
        name: string;
        category: string;
        language: string;
        processed_params?: Record<string, any>;
      };
      attachments?: any[];
      [key: string]: any;
    }
  ): Promise<any> {
    return await this.post<any>(
      this.accountScopedUrl(
        accountId,
        `conversations/${conversationId}/messages`
      ),
      payload
    );
  }

  /**
   * Delete Message
   * DELETE /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages/{message_id}
   *
   * @param accountId - The numeric ID of the account
   * @param conversationId - The numeric ID of the conversation
   * @param messageId - The numeric ID of the message
   * @returns Promise<void>
   */
  async deleteMessage(
    accountId: number,
    conversationId: number,
    messageId: number
  ): Promise<void> {
    return await this.delete<void>(
      this.accountScopedUrl(
        accountId,
        `conversations/${conversationId}/messages/${messageId}`
      )
    );
  }

  /**
   * Translate Message
   * POST /api/accounts/conversations/{conversation_id}/messages/{message_id}/translate
   *
   * Translates a message to the specified target language using the account's translation service.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param messageId - The numeric ID of the message
   * @param payload - Translation parameters
   * @returns Promise with translated content
   *
   * @example
   * ```typescript
   * // Translate message to English
   * const result = await messagesService.translateMessage(
   *   accountId,
   *   conversationId,
   *   messageId,
   *   { target_language: 'en' }
   * );
   * console.log(result.content); // Translated message content
   * ```
   */
  async translateMessage(
    accountId: number,
    conversationId: number,
    messageId: number,
    payload: {
      target_language: string;
    }
  ): Promise<{ content: string }> {
    return await this.post<{ content: string }>(
      `/api/accounts/conversations/${conversationId}/messages/${messageId}/translate`,
      payload
    );
  }
}

