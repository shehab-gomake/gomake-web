/**
 * Chatwoot OAuth Service
 *
 * Handles OAuth authorization flows for channel connections (Gmail/Outlook/WhatsApp).
 * Uses NestJS messaging hub endpoints for OAuth authorization with dynamic frontend URLs.
 *
 * Endpoint Pattern:
 * - POST /api/integrations/google/authorization
 * - POST /api/integrations/microsoft/authorization
 * - POST /api/integrations/whatsapp/config
 * - POST /api/integrations/whatsapp/authorization
 *
 * Base URL: Uses CHATWOOT_SERVER from config
 * Production: https://messaging-hub-1052023886201.europe-west3.run.app
 *
 * Gmail/Outlook Flow:
 * 1. Frontend calls this service (POST to /api/integrations/{provider}/authorization) with frontend_url
 * 2. NestJS proxy forwards to Chatwoot with frontend_url encoded in OAuth state
 * 3. Backend returns OAuth URL
 * 4. Frontend opens URL in popup
 * 5. User authorizes on Google/Microsoft
 * 6. Provider redirects to Chatwoot callback
 * 7. Chatwoot decodes state, creates channel/inbox, and redirects popup to frontend_url
 * 8. Frontend detects success and refreshes inboxes
 *
 * WhatsApp Embedded Signup Flow:
 * 1. Frontend calls getWhatsAppConfig() to get FB App ID and Config ID
 * 2. Frontend loads Facebook SDK and calls FB.login() with config_id
 * 3. User completes WhatsApp Business setup in Meta's embedded flow
 * 4. Frontend receives: code (from FB.login), business_id, waba_id, phone_number_id (from WA_EMBEDDED_SIGNUP message)
 * 5. Frontend calls authorizeWhatsApp() with all params
 * 6. Backend exchanges code for access token and creates WhatsApp inbox
 */

import { ChatwootHttpClient } from "../chatwoot-http-client";

/**
 * OAuth provider types
 * "google" for Gmail, "microsoft" for Outlook, "whatsapp" for WhatsApp Business
 */
export type OAuthProvider = "google" | "microsoft" | "whatsapp";

/**
 * Response from OAuth authorization endpoint (Google/Microsoft)
 */
export interface OAuthAuthorizationResponse {
  url: string;
  state?: string;
  provider?: string;
}

/**
 * WhatsApp Embedded Signup configuration from backend
 */
export interface WhatsAppConfigResponse {
  appId: string;
  configId: string;
  apiVersion: string;
}

/**
 * WhatsApp authorization request payload
 */
export interface WhatsAppAuthorizationPayload {
  code: string;
  business_id: string;
  waba_id: string;
  phone_number_id?: string;
  inbox_id?: number;
}

/**
 * WhatsApp authorization response
 */
export interface WhatsAppAuthorizationResponse {
  success: boolean;
  accountId: number;
  inboxId: number;
  inboxName: string;
  channelType: string;
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
    return this.post<OAuthAuthorizationResponse>("/api/integrations/google/authorization", { frontend_url: frontendUrl });
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
    return this.post<OAuthAuthorizationResponse>("/api/integrations/microsoft/authorization", { frontend_url: frontendUrl });
  }

  /**
   * Get WhatsApp Embedded Signup Configuration
   * POST /api/integrations/whatsapp/config
   *
   * Returns the Facebook App ID, Configuration ID, and API version
   * needed to initialize the Facebook SDK for WhatsApp Embedded Signup.
   *
   * @returns Promise with WhatsApp configuration
   * @throws Error if WhatsApp is not configured on the server
   *
   * @example
   * ```typescript
   * const { appId, configId, apiVersion } = await service.getWhatsAppConfig();
   * // Use these values to initialize Facebook SDK
   * ```
   */
  async getWhatsAppConfig(): Promise<WhatsAppConfigResponse> {
    return this.post<WhatsAppConfigResponse>("/api/integrations/whatsapp/config", {});
  }

  /**
   * Complete WhatsApp Embedded Signup Authorization
   * POST /api/integrations/whatsapp/authorization
   *
   * After the user completes the Facebook Embedded Signup flow:
   * - FB.login() returns an authorization code
   * - WA_EMBEDDED_SIGNUP message provides business_id, waba_id, phone_number_id
   *
   * This method sends all data to backend for token exchange and inbox creation.
   *
   * @param payload - WhatsApp authorization data from embedded signup
   * @returns Promise with created inbox information
   * @throws Error if authorization fails
   *
   * @example
   * ```typescript
   * const result = await service.authorizeWhatsApp({
   *   code: "auth_code_from_fb_login",
   *   business_id: "123456",
   *   waba_id: "789012",
   *   phone_number_id: "345678"
   * });
   * console.log(`Created inbox: ${result.inboxId}`);
   * ```
   */
  async authorizeWhatsApp(payload: WhatsAppAuthorizationPayload): Promise<WhatsAppAuthorizationResponse> {
    return this.post<WhatsAppAuthorizationResponse>("/api/integrations/whatsapp/authorization", payload);
  }
}

/**
 * Singleton instance for use across the application
 */
export const chatwootOAuthService = new ChatwootOAuthService();
