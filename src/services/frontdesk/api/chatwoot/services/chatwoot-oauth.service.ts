/**
 * Chatwoot OAuth Service
 *
 * Handles OAuth authorization flows for email channel connections (Gmail/Outlook).
 * Uses Chatwoot backend endpoints for OAuth authorization.
 *
 * Endpoint Pattern (Chatwoot-style):
 * - POST /api/accounts/google/authorization
 * - POST /api/accounts/microsoft/authorization
 *
 * Base URL: http://localhost:8080 (Chatwoot backend)
 *
 * Flow:
 * 1. Frontend calls this service (POST to /api/accounts/{provider}/authorization)
 * 2. Backend returns OAuth URL
 * 3. Frontend opens URL in popup
 * 4. User authorizes on Google/Microsoft
 * 5. Provider redirects to backend callback
 * 6. Backend creates channel/inbox and redirects popup
 * 7. Frontend detects success and refreshes inboxes
 */

import { ChatwootHttpClient } from "../chatwoot-http-client";

/**
 * OAuth provider types
 * "google" for Gmail, "microsoft" for Outlook
 */
export type OAuthProvider = "google" | "microsoft";

/**
 * Response from OAuth authorization endpoint
 */
export interface OAuthAuthorizationResponse {
  url: string;
  state?: string;
  provider?: string;
}

/**
 * ChatwootOAuthService
 * Handles OAuth authorization for email channel connections
 *
 * @example
 * ```typescript
 * const oauthService = new ChatwootOAuthService();
 *
 * // Get Google OAuth URL
 * const { url } = await oauthService.getGoogleAuthUrl();
 * window.open(url, 'oauth-popup', 'width=500,height=600');
 *
 * // Get Microsoft/Outlook OAuth URL
 * const { url } = await oauthService.getMicrosoftAuthUrl();
 * window.open(url, 'oauth-popup', 'width=500,height=600');
 * ```
 */
export class ChatwootOAuthService extends ChatwootHttpClient {
  /**
   * Get Google OAuth Authorization URL
   * POST /api/accounts/google/authorization
   *
   * Returns an OAuth URL that opens Google's consent screen.
   * User authorizes, Google redirects to callback, and backend creates channel/inbox.
   *
   * @returns Promise with OAuth URL
   * @throws Error if OAuth URL generation fails
   *
   * @example
   * ```typescript
   * const { url } = await service.getGoogleAuthUrl();
   * // Opens popup to Google OAuth consent screen
   * const popup = window.open(url, 'oauth', 'width=500,height=600');
   * ```
   */
  async getGoogleAuthUrl(): Promise<OAuthAuthorizationResponse> {
    return this.post<OAuthAuthorizationResponse>("/api/accounts/google/authorization", {});
  }

  /**
   * Get Microsoft/Outlook OAuth Authorization URL
   * POST /api/accounts/microsoft/authorization
   *
   * Returns an OAuth URL that opens Microsoft's consent screen.
   * User authorizes, Microsoft redirects to callback, and backend creates channel/inbox.
   *
   * @returns Promise with OAuth URL
   * @throws Error if OAuth URL generation fails
   *
   * @example
   * ```typescript
   * const { url } = await service.getMicrosoftAuthUrl();
   * // Opens popup to Microsoft OAuth consent screen
   * const popup = window.open(url, 'oauth', 'width=500,height=600');
   * ```
   */
  async getMicrosoftAuthUrl(): Promise<OAuthAuthorizationResponse> {
    return this.post<OAuthAuthorizationResponse>("/api/accounts/microsoft/authorization", {});
  }
}

/**
 * Singleton instance for use across the application
 */
export const chatwootOAuthService = new ChatwootOAuthService();
