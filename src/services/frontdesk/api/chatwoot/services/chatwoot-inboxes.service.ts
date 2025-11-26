/**
 * Chatwoot Inboxes Service
 *
 * Handles all inbox (channel) related endpoints.
 * Account context is determined from JWT Bearer token.
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
   * GET /api/accounts/inboxes/{inboxId}
   *
   * Returns detailed information about a specific inbox.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
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
    return await this.get<InboxDetailResponse>(`/api/accounts/inboxes/${inboxId}`);
  }

  /**
   * Update Inbox Settings
   * PATCH /api/accounts/inboxes/{inboxId}
   *
   * Update inbox configuration including name, greeting message, features, etc.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
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
      `/api/accounts/inboxes/${inboxId}`,
      updates
    );
  }

  /**
   * Upload Inbox Avatar
   * POST /api/accounts/inboxes/{inboxId}/avatar
   *
   * Upload a new avatar image for the inbox.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
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
      `/api/accounts/inboxes/${inboxId}/avatar`,
      formData
    );
  }

  /**
   * Delete Inbox Avatar
   * DELETE /api/accounts/inboxes/{inboxId}/avatar
   *
   * Remove the current avatar image from the inbox.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with updated inbox
   */
  async deleteAvatar(accountId: number, inboxId: number): Promise<InboxDetailResponse> {
    return await this.delete<InboxDetailResponse>(
      `/api/accounts/inboxes/${inboxId}/avatar`
    );
  }

  /**
   * Delete Inbox
   * DELETE /api/accounts/inboxes/{inboxId}
   *
   * Permanently delete an inbox and all its conversations.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with void
   */
  async deleteInbox(accountId: number, inboxId: number): Promise<void> {
    return await this.delete<void>(`/api/accounts/inboxes/${inboxId}`);
  }

  /**
   * Update Inbox Agents (Add/Remove)
   * PATCH /api/accounts/inbox_members
   *
   * Update agents assigned to an inbox for handling conversations.
   * 
   * ⚠️ IMPORTANT: This is a REPLACEMENT operation, not additive.
   * All agents except the ones passed in the agentIds array will be REMOVED from the inbox.
   * 
   * Example:
   * - Current agents: [13, 14, 15]
   * - Call with agentIds: [13, 15]
   * - Result: Agent 14 is removed, only [13, 15] remain
   *
   * @see https://developers.chatwoot.com/api-reference/inboxes/update-agents-in-inbox
   * 
   * Note: Goes through messaging-hub-v2 proxy which handles account context via JWT.
   * Original Chatwoot endpoint: PATCH /api/v1/accounts/{account_id}/inbox_members
   * 
   * @param accountId - The numeric ID of the account (not used in URL, handled by proxy via JWT)
   * @param inboxId - The numeric ID of the inbox (sent in request body)
   * @param agentIds - Array of agent IDs to assign (REPLACES current assignments - agents not in this list will be removed)
   * @returns Promise with response containing updated agent list
   */
  async addAgentsToInbox(
    accountId: number,
    inboxId: number,
    agentIds: number[]
  ): Promise<any> {
    return await this.patch<any>(
      `/api/accounts/inbox_members`,
      {
        inbox_id: inboxId,
        user_ids: agentIds,
      }
    );
  }

  /**
   * Get Inbox Agents
   * GET /api/accounts/inbox_members/{inboxId}
   *
   * Get list of agents assigned to an inbox.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with agents list
   */
  async getInboxAgents(accountId: number, inboxId: number): Promise<any> {
    return await this.get<any>(`/api/accounts/inbox_members/${inboxId}`);
  }

  /**
   * Update Business Hours
   * PATCH /api/accounts/inboxes/{inboxId}/business_hours
   *
   * Configure working hours for the inbox.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @param schedule - Weekly schedule object with business hours
   * @returns Promise with updated inbox
   */
  async updateBusinessHours(
    accountId: number,
    inboxId: number,
    schedule: any
  ): Promise<InboxDetailResponse> {
    return await this.patch<InboxDetailResponse>(
      `/api/accounts/inboxes/${inboxId}/business_hours`,
      { business_hours: schedule }
    );
  }

  /**
   * Update CSAT Configuration
   * PATCH /api/accounts/inboxes/{inboxId}/csat
   *
   * Configure customer satisfaction survey settings.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @param config - CSAT configuration object
   * @returns Promise with updated inbox
   */
  async updateCSATConfig(
    accountId: number,
    inboxId: number,
    config: any
  ): Promise<InboxDetailResponse> {
    return await this.patch<InboxDetailResponse>(
      `/api/accounts/inboxes/${inboxId}/csat`,
      { csat_config: config }
    );
  }

  /**
   * Sync WhatsApp Templates
   * POST /api/accounts/inboxes/{inboxId}/sync_templates
   *
   * Sync message templates from WhatsApp Business Account.
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with sync result
   */
  async syncWhatsAppTemplates(
    accountId: number,
    inboxId: number
  ): Promise<any> {
    return await this.post<any>(
      `/api/accounts/inboxes/${inboxId}/sync_templates`,
      {}
    );
  }
}

