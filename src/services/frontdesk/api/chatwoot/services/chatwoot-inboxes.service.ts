/**
 * Chatwoot Inboxes Service
 *
 * Handles all inbox (channel) related endpoints.
 * All endpoints require account_id.
 *
 * In Chatwoot, "inboxes" are channels like Email, WhatsApp, Facebook, etc.
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import {
  InboxListResponse,
  InboxDetailResponse,
  ChatwootInbox,
} from "../types/inboxes.types";

/**
 * ChatwootInboxesService
 * Handles inbox-related API operations
 *
 * @example
 * ```typescript
 * const inboxesService = new ChatwootInboxesService();
 *
 * // List all inboxes (channels)
 * const inboxes = await inboxesService.listAllInboxes();
 *
 * // Get specific inbox details
 * const inbox = await inboxesService.getInbox(accountId, inboxId);
 * ```
 */
export class ChatwootInboxesService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * List All Inboxes (Channels)
   * GET /api/accounts/inboxes
   *
   * Returns all inboxes (channels) for the current account.
   * In Chatwoot, inboxes represent different communication channels
   * like Email, WhatsApp, Facebook, Web Widget, etc.
   *
   * @returns Promise with inbox list
   *
   * @example
   * ```typescript
   * const inboxes = await service.listAllInboxes();
   * console.log(`Found ${inboxes.payload.length} inboxes`);
   * inboxes.payload.forEach(inbox => {
   *   console.log(`- ${inbox.name} (${inbox.channel_type})`);
   * });
   * ```
   */
  async listAllInboxes(): Promise<InboxListResponse> {
    // Use /api/accounts/inboxes (without /v1)
    return await this.get<InboxListResponse>("/api/accounts/inboxes");
  }

  /**
   * Get Inbox Details
   * GET /api/accounts/{accountId}/inboxes/{inboxId}
   *
   * Returns detailed information about a specific inbox.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with inbox details
   *
   * @example
   * ```typescript
   * const inbox = await service.getInbox(1, 2);
   * console.log(inbox.payload.name, inbox.payload.channel_type);
   * ```
   */
  async getInbox(accountId: number, inboxId: number): Promise<InboxDetailResponse> {
    return await this.get<InboxDetailResponse>(this.accountScopedUrl(accountId, `inboxes/${inboxId}`));
  }

  /**
   * Update Inbox Settings
   * PATCH /api/v1/accounts/{accountId}/inboxes/{inboxId}
   *
   * Update inbox configuration including name, greeting message, features, etc.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @param updates - Partial inbox settings to update
   * @returns Promise with updated inbox
   */
  async updateInbox(
    accountId: number,
    inboxId: number,
    updates: Partial<ChatwootInbox>
  ): Promise<InboxDetailResponse> {
    return await this.patch<InboxDetailResponse>(
      this.accountScopedUrl(accountId, `inboxes/${inboxId}`),
      updates
    );
  }

  /**
   * Upload Inbox Avatar
   * POST /api/v1/accounts/{accountId}/inboxes/{inboxId}/avatar
   *
   * Upload a new avatar image for the inbox.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @param file - The image file to upload
   * @returns Promise with updated inbox
   */
  async uploadAvatar(
    accountId: number,
    inboxId: number,
    file: File
  ): Promise<InboxDetailResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    return await this.post<InboxDetailResponse>(
      this.accountScopedUrl(accountId, `inboxes/${inboxId}/avatar`),
      formData
    );
  }

  /**
   * Delete Inbox Avatar
   * DELETE /api/v1/accounts/{accountId}/inboxes/{inboxId}/avatar
   *
   * Remove the current avatar image from the inbox.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with updated inbox
   */
  async deleteAvatar(accountId: number, inboxId: number): Promise<InboxDetailResponse> {
    return await this.delete<InboxDetailResponse>(
      this.accountScopedUrl(accountId, `inboxes/${inboxId}/avatar`)
    );
  }

  /**
   * Delete Inbox
   * DELETE /api/v1/accounts/{accountId}/inboxes/{inboxId}
   *
   * Permanently delete an inbox and all its conversations.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with void
   */
  async deleteInbox(accountId: number, inboxId: number): Promise<void> {
    return await this.delete<void>(this.accountScopedUrl(accountId, `inboxes/${inboxId}`));
  }

  /**
   * Add Agents to Inbox
   * POST /api/v1/accounts/{accountId}/inbox_members
   *
   * Assign agents to an inbox for handling conversations.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @param agentIds - Array of agent IDs to assign
   * @returns Promise with response
   */
  async addAgentsToInbox(
    accountId: number,
    inboxId: number,
    agentIds: number[]
  ): Promise<any> {
    return await this.post<any>(
      this.accountScopedUrl(accountId, "inbox_members"),
      {
        inbox_id: inboxId,
        user_ids: agentIds,
      }
    );
  }

  /**
   * Get Inbox Agents
   * GET /api/v1/accounts/{accountId}/inbox_members/{inboxId}
   *
   * Get list of agents assigned to an inbox.
   *
   * @param accountId - The numeric ID of the account
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with agents list
   */
  async getInboxAgents(accountId: number, inboxId: number): Promise<any> {
    return await this.get<any>(
      this.accountScopedUrl(accountId, `inbox_members/${inboxId}`)
    );
  }
}

