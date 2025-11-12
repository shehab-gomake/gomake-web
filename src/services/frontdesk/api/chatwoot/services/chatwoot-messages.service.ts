/**
 * Chatwoot Messages Service
 *
 * Handles all message-related endpoints.
 * All endpoints require account_id and conversation_id.
 *
 * @see MessagesApi.md
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import type {
  Message,
  MessageDetailed,
  ConversationMessages,
  ConversationMessageCreatePayload,
} from "../types/messages.types";

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
   * GET /api/accounts/conversations/{conversation_id}/messages
   *
   * Note: This endpoint does NOT use account-scoped URL pattern (no /v1/accounts/{account_id})
   * The account context is determined by the authenticated user's session.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
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
      [key: string]: unknown;
    }
  ): Promise<ConversationMessages> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const url = `/api/accounts/conversations/${conversationId}/messages${queryString ? `?${queryString}` : ""}`;
    return await this.get<ConversationMessages>(url);
  }

  /**
   * Create New Message
   * POST /api/accounts/conversations/{conversation_id}/messages
   *
   * Note: This endpoint does NOT use account-scoped URL pattern (no /v1/accounts/{account_id})
   * The account context is determined by the authenticated user's session.
   *
   * Supports both JSON payload (text-only) and FormData (with attachments).
   * When attachments are present, automatically uses multipart/form-data.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param conversationId - The numeric ID of the conversation
   * @param payload - Message creation payload
   * @returns Promise with created message
   *
   * @example
   * ```typescript
   * // Simple text message
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Hello!",
   *   message_type: "outgoing",
   *   content_type: "text"
   * });
   *
   * // Message with attachments
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Check out these files",
   *   message_type: "outgoing",
   *   attachments: [file1, file2]
   * });
   *
   * // Email message
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Hello!",
   *   message_type: "outgoing",
   *   content_type: "input_email",
   *   content_attributes: {
   *     email: {
   *       to: "recipient@example.com",
   *       cc: "cc@example.com"
   *     }
   *   }
   * });
   *
   * // WhatsApp template message
   * await messagesService.createMessage(accountId, conversationId, {
   *   content: "Your order is confirmed",
   *   message_type: "outgoing",
   *   content_type: "text",
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
    payload: ConversationMessageCreatePayload
  ): Promise<Message> {
    const url = `/api/accounts/conversations/${conversationId}/messages`;

    // Check if we have attachments - if so, use FormData
    if (payload.attachments && payload.attachments.length > 0) {
      return await this.createMessageWithAttachments(url, payload);
    }

    // Otherwise, use standard JSON payload
    return await this.post<Message>(url, payload);
  }

  /**
   * Create message with attachments using FormData
   * Private helper method that builds multipart/form-data payload
   *
   * @param url - The endpoint URL
   * @param payload - Message creation payload with attachments
   * @returns Promise with created message
   */
  private async createMessageWithAttachments(
    url: string,
    payload: ConversationMessageCreatePayload
  ): Promise<Message> {
    const formData = new FormData();

    // Add message content
    formData.append('content', payload.content);

    // Add message type (default to outgoing)
    formData.append('message_type', payload.message_type || 'outgoing');

    // Add private flag
    if (payload.private !== undefined) {
      formData.append('private', String(payload.private));
    }

    // Add content type
    if (payload.content_type) {
      formData.append('content_type', payload.content_type);
    }

    // Add content attributes (as JSON string)
    if (payload.content_attributes) {
      formData.append('content_attributes', JSON.stringify(payload.content_attributes));
    }

    // Add campaign ID
    if (payload.campaign_id) {
      formData.append('campaign_id', String(payload.campaign_id));
    }

    // Add template params (as JSON string)
    if (payload.template_params) {
      formData.append('template_params', JSON.stringify(payload.template_params));
    }

    // Add attachments using array notation (matching Chatwoot backend expectation)
    payload.attachments!.forEach((file) => {
      formData.append('attachments[]', file);
    });

    // Make request with FormData (don't set Content-Type, browser will set it with boundary)
    return await this.request<Message>(url, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set multipart/form-data with boundary
        'Content-Type': '',
      },
    });
  }

  /**
   * Delete Message
   * DELETE /api/accounts/conversations/{conversation_id}/messages/{message_id}
   *
   * Note: This endpoint does NOT use account-scoped URL pattern (no /v1/accounts/{account_id})
   * The account context is determined by the authenticated user's session.
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
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
      `/api/accounts/conversations/${conversationId}/messages/${messageId}`
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

