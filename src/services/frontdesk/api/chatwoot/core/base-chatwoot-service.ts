/**
 * Base Chatwoot Service
 * 
 * Provides common functionality for all Chatwoot API services.
 * Most Chatwoot endpoints require account_id in the path.
 * 
 * This base class provides helper methods for building account-scoped URLs.
 */

import { ChatwootHttpClient } from "../chatwoot-http-client";

export abstract class BaseChatwootService extends ChatwootHttpClient {
  protected readonly API_BASE = "/api/v1";

  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * Build account-scoped endpoint URL
   * Chatwoot endpoints follow: /api/v1/accounts/{account_id}/...
   * 
   * @param accountId - The numeric ID of the account
   * @param path - The endpoint path (e.g., "conversations", "contacts/{id}")
   * @returns Full endpoint URL
   * 
   * @example
   * ```typescript
   * this.accountScopedUrl(123, "conversations") 
   * // => "/api/v1/accounts/123/conversations"
   * 
   * this.accountScopedUrl(123, "conversations/456/messages")
   * // => "/api/v1/accounts/123/conversations/456/messages"
   * ```
   */
  protected accountScopedUrl(accountId: number, path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this.API_BASE}/accounts/${accountId}/${normalizedPath}`;
  }

  /**
   * Build non-account-scoped endpoint URL
   * Some endpoints like profile don't require account_id
   * 
   * @param path - The endpoint path (e.g., "accounts/profile")
   * @returns Full endpoint URL
   * 
   * @example
   * ```typescript
   * this.globalUrl("accounts/profile")
   * // => "/api/v1/accounts/profile"
   * ```
   */
  protected globalUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this.API_BASE}/${normalizedPath}`;
  }
}

