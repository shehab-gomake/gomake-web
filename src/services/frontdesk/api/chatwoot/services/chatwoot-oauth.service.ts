/**
 * Chatwoot OAuth Service
 *
 * Handles OAuth authorization flows for email channel connections (Gmail/Outlook).
 * Uses NestJS messaging hub endpoints for OAuth authorization with dynamic frontend URLs.
 *
 * Endpoint Pattern:
 * - POST /api/integrations/google/authorization
 * - POST /api/integrations/microsoft/authorization
 *
 * Base URL: Uses CHATWOOT_SERVER from config
 * Production: https://messaging-hub-1052023886201.europe-west3.run.app
 *
 * Flow:
 * 1. Frontend calls this service (POST to /api/integrations/{provider}/authorization) with frontend_url
 * 2. NestJS proxy forwards to Chatwoot with frontend_url encoded in OAuth state
 * 3. Backend returns OAuth URL
 * 4. Frontend opens URL in popup
 * 5. User authorizes on Google/Microsoft
 * 6. Provider redirects to Chatwoot callback
 * 7. Chatwoot decodes state, creates channel/inbox, and redirects popup to frontend_url
 * 8. Frontend detects success and refreshes inboxes
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
 * Handles OAuth authorization for email channel connections with dynamic frontend URLs
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
   * Get current frontend URL for OAuth redirect
   * @returns Current origin (e.g., "http://localhost:3004" or "https://printhouse.com")
   */
  private getFrontendUrl(): string {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "http://localhost:3004"; // Fallback for SSR
  }

  /**
   * Get Google OAuth Authorization URL
   * POST /api/integrations/google/authorization
   *
   * Returns an OAuth URL that opens Google's consent screen.
   * Includes frontend_url for dynamic redirect after OAuth completes.
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
    const frontendUrl = this.getFrontendUrl();
    return this.post<OAuthAuthorizationResponse>(
      "/api/integrations/google/authorization",
      { frontend_url: frontendUrl }
    );
  }

  /**
   * Get Microsoft/Outlook OAuth Authorization URL
   * POST /api/integrations/microsoft/authorization
   *
   * Returns an OAuth URL that opens Microsoft's consent screen.
   * Includes frontend_url for dynamic redirect after OAuth completes.
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
    const frontendUrl = this.getFrontendUrl();
    return this.post<OAuthAuthorizationResponse>(
      "/api/integrations/microsoft/authorization",
      { frontend_url: frontendUrl }
    );
  }
}

/**
 * Singleton instance for use across the application
 */
export const chatwootOAuthService = new ChatwootOAuthService();
