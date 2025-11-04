/**
 * Chatwoot OAuth Service
 *
 * Handles OAuth authorization flows for email channel connections (Gmail/Outlook).
 * Integrates with our backend's OAuth endpoints at /auth/oauth/{provider}.
 *
 * This service differs from the Chatwoot reference implementation:
 * - Uses GET /auth/oauth/{provider} instead of POST /api/v1/accounts/:id/{provider}/authorization
 * - No account_id parameter needed (backend uses printHouseId from JWT)
 * - Returns OAuth URL with encrypted state for popup-based flow
 */

import { MessagingHubHttpClient } from "@/services/messaging-hub-http-client";

/**
 * OAuth provider types supported by our backend
 */
export type OAuthProvider = "google" | "outlook";

/**
 * Response from OAuth authorization endpoint
 */
export interface OAuthAuthorizationResponse {
  url: string;
  state: string;
  provider: string;
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
 * // Get Outlook OAuth URL
 * const { url } = await oauthService.getOutlookAuthUrl();
 * window.open(url, 'oauth-popup', 'width=500,height=600');
 * ```
 */
export class ChatwootOAuthService extends MessagingHubHttpClient {
  /**
   * Get Google OAuth Authorization URL
   * GET /auth/oauth/google
   *
   * Returns an OAuth URL that opens Google's consent screen.
   * User authorizes, Google redirects to our callback, and backend creates EmailAccount.
   *
   * @returns Promise with OAuth URL and state
   * @throws Error if OAuth URL generation fails
   *
   * @example
   * ```typescript
   * const { url, state } = await service.getGoogleAuthUrl();
   * console.log('Redirect to:', url);
   * // Opens popup to Google OAuth consent screen
   * const popup = window.open(url, 'oauth', 'width=500,height=600');
   * ```
   */
  async getGoogleAuthUrl(): Promise<OAuthAuthorizationResponse> {
    return this.getAuthUrl("google");
  }

  /**
   * Get Microsoft/Outlook OAuth Authorization URL
   * GET /auth/oauth/outlook
   *
   * Returns an OAuth URL that opens Microsoft's consent screen.
   * User authorizes, Microsoft redirects to our callback, and backend creates EmailAccount.
   *
   * @returns Promise with OAuth URL and state
   * @throws Error if OAuth URL generation fails
   *
   * @example
   * ```typescript
   * const { url, state } = await service.getOutlookAuthUrl();
   * console.log('Redirect to:', url);
   * // Opens popup to Microsoft OAuth consent screen
   * const popup = window.open(url, 'oauth', 'width=500,height=600');
   * ```
   */
  async getOutlookAuthUrl(): Promise<OAuthAuthorizationResponse> {
    return this.getAuthUrl("outlook");
  }

  /**
   * Generic method to get OAuth authorization URL
   * Internal helper for provider-specific methods
   *
   * @param provider - OAuth provider (google or outlook)
   * @returns Promise with OAuth URL and state
   * @private
   */
  private async getAuthUrl(provider: OAuthProvider): Promise<OAuthAuthorizationResponse> {
    return this.get<OAuthAuthorizationResponse>(`/auth/oauth/${provider}`);
  }
}

/**
 * Singleton instance for use across the application
 */
export const chatwootOAuthService = new ChatwootOAuthService();
