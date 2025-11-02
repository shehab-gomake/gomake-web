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
}

