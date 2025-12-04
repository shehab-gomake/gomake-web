/**
 * Base Chatwoot Service
 * 
 * Provides common functionality for all Chatwoot API services.
 * 
 * ⚠️ CRITICAL: URL Pattern Rules
 * 
 * gomake-web sends URLs WITHOUT /v1/ and WITHOUT accountId:
 * - ✅ CORRECT: /api/accounts/conversations
 * - ❌ WRONG: /api/v1/accounts/{accountId}/conversations
 * 
 * The messaging-hub-v2 proxy automatically:
 * 1. Adds /v1/ prefix
 * 2. Injects accountId from JWT context
 * 3. Transforms: /api/accounts/conversations → /api/v1/accounts/{accountId}/conversations
 * 
 * Exception: Profile endpoint
 * - gomake-web: /api/accounts/profile
 * - Proxy transforms to: /api/v1/profile (no accountId)
 * 
 * @see .cursor/FRONTDESK_CHATWOOT_COMPLETE_FLOW.md for complete flow documentation
 */

import { ChatwootHttpClient } from "../chatwoot-http-client";

export abstract class BaseChatwootService extends ChatwootHttpClient {
  /**
   * Base API path for gomake-web requests.
   * 
   * ⚠️ DO NOT use /api/v1/ - the proxy adds it automatically.
   * ⚠️ DO NOT include {accountId} - the proxy injects it from JWT.
   */
  protected readonly API_BASE = "/api/accounts";

  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * Build account-scoped endpoint URL
   * 
   * ⚠️ DEPRECATED: This method builds incorrect URLs with /v1/ and accountId.
   * Use direct string paths instead: `/api/accounts/{resource}`
   * 
   * @deprecated Use direct paths like `/api/accounts/conversations` instead
   * @param accountId - The numeric ID of the account (NOT used in URL, kept for API consistency)
   * @param path - The endpoint path (e.g., "conversations", "contacts/{id}")
   * @returns Full endpoint URL
   * 
   * @example
   * ```typescript
   * // ❌ DON'T USE THIS METHOD
   * this.accountScopedUrl(123, "conversations") 
   * // => "/api/v1/accounts/123/conversations" (WRONG!)
   * 
   * // ✅ USE DIRECT PATHS INSTEAD
   * return await this.get("/api/accounts/conversations");
   * ```
   */
  protected accountScopedUrl(accountId: number, path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    // ⚠️ WARNING: This builds incorrect URLs. Use direct paths instead.
    return `${this.API_BASE}/${normalizedPath}`;
  }

  /**
   * Build non-account-scoped endpoint URL
   * 
   * ⚠️ DEPRECATED: Use direct string paths instead.
   * 
   * @deprecated Use direct paths like `/api/accounts/profile` instead
   * @param path - The endpoint path (e.g., "profile")
   * @returns Full endpoint URL
   * 
   * @example
   * ```typescript
   * // ❌ DON'T USE THIS METHOD
   * this.globalUrl("profile")
   * 
   * // ✅ USE DIRECT PATHS INSTEAD
   * return await this.get("/api/accounts/profile");
   * ```
   */
  protected globalUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    // ⚠️ WARNING: This builds incorrect URLs. Use direct paths instead.
    return `${this.API_BASE}/${normalizedPath}`;
  }
}

