/**
 * useChatwootOAuth Hook
 *
 * Manages OAuth authorization flow for Chatwoot channel connections (Gmail/Outlook).
 * Uses popup-based OAuth with our backend's /auth/oauth/{provider} endpoints.
 *
 * Flow:
 * 1. User clicks "Connect Gmail" or "Connect Outlook"
 * 2. Hook calls backend to get OAuth URL
 * 3. Opens popup with OAuth URL
 * 4. User authorizes on Google/Microsoft
 * 5. Backend processes callback, creates EmailAccount
 * 6. Backend redirects popup to success page
 * 7. Hook detects popup close and fetches email accounts
 * 8. Maps EmailAccount to Chatwoot inbox format
 * 9. Updates Chatwoot inboxes state
 */

import { useState, useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  chatwootOAuthLoadingAtom,
  chatwootOAuthErrorAtom,
  chatwootOAuthProviderAtom,
  chatwootInboxesAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { chatwootOAuthService, type OAuthProvider } from "@/services/frontdesk/api/chatwoot/services/chatwoot-oauth.service";
import { emailApiClient } from "@/widgets/frontdesk/providers/email/utils/email-api-client";
import type { EmailAccount } from "@/widgets/frontdesk/providers/email/types/email.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

/**
 * OAuth result interface
 */
export interface OAuthResult {
  success: boolean;
  provider: string;
  accountsAdded: number;
}

/**
 * useChatwootOAuth Hook
 *
 * @returns OAuth authentication methods and state
 *
 * @example
 * ```typescript
 * const { authenticate, isAuthenticating, error } = useChatwootOAuth();
 *
 * // Connect Gmail
 * const handleGmailConnect = async () => {
 *   try {
 *     const result = await authenticate('google');
 *     console.log(`Added ${result.accountsAdded} Gmail accounts`);
 *   } catch (err) {
 *     console.error('Gmail OAuth failed:', err);
 *   }
 * };
 *
 * // Connect Outlook
 * const handleOutlookConnect = async () => {
 *   try {
 *     const result = await authenticate('microsoft');
 *     console.log(`Added ${result.accountsAdded} Outlook accounts`);
 *   } catch (err) {
 *     console.error('Outlook OAuth failed:', err);
 *   }
 * };
 * ```
 */
export const useChatwootOAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useRecoilState(chatwootOAuthLoadingAtom);
  const [error, setError] = useRecoilState(chatwootOAuthErrorAtom);
  const [currentProvider, setCurrentProvider] = useRecoilState(chatwootOAuthProviderAtom);
  const setInboxes = useSetRecoilState(chatwootInboxesAtom);

  /**
   * Map EmailAccount to Chatwoot inbox format
   * Creates a Chatwoot-compatible inbox structure from our backend's EmailAccount
   */
  const mapEmailAccountToInbox = useCallback((account: EmailAccount): ChatwootInbox => {
    return {
      id: parseInt(account.id) || 0,
      name: account.email,
      channel_type: "Channel::Email",
      provider: "email" as const, // Use "email" as the provider type for all email accounts
      avatar_url: undefined,
      phone_number: undefined,
      website_url: undefined,
      working_hours_enabled: false,
      enable_auto_assignment: false,
      timezone: "UTC",
      created_at: new Date(account.createdAt).getTime() / 1000,
      updated_at: new Date(account.updatedAt).getTime() / 1000,
      // Store original account data for reference (with actual provider: gmail/outlook)
      _emailAccount: account,
    };
  }, []);

  /**
   * Authenticate with OAuth provider
   *
   * @param provider - OAuth provider (google or microsoft)
   * @returns Promise with OAuth result
   * @throws Error if OAuth fails
   */
  const authenticate = useCallback(
    async (provider: OAuthProvider): Promise<OAuthResult> => {
      setIsAuthenticating(true);
      setError(null);
      setCurrentProvider(provider);

      try {
        // 1. Get OAuth URL from Chatwoot backend
        const authResponse =
          provider === "google"
            ? await chatwootOAuthService.getGoogleAuthUrl()
            : await chatwootOAuthService.getMicrosoftAuthUrl();

        const { url } = authResponse;

        // 2. Open popup
        const popup = window.open(url, "chatwoot-oauth", "width=500,height=600,left=200,top=100");

        // Check if popup was blocked
        if (!popup || popup.closed) {
          throw new Error("Popup was blocked. Please allow popups for this site.");
        }

        // 3. Wait for popup to close or receive success message
        const result = await new Promise<OAuthResult>((resolve, reject) => {
          // Listen for postMessage from success page (if backend sends one)
          const messageHandler = (event: MessageEvent) => {
            if (event.data.source === "chatwoot-oauth" || event.data.source === "email-oauth") {
              window.removeEventListener("message", messageHandler);

              if (event.data.status === "success") {
                resolve({
                  success: true,
                  provider,
                  accountsAdded: 0, // Will be updated after fetching accounts
                });
              } else {
                reject(new Error(event.data.error || "Authentication failed"));
              }

              popup?.close();
            }
          };

          window.addEventListener("message", messageHandler);

          // Poll for popup close (fallback if no postMessage)
          const pollTimer = setInterval(() => {
            if (!popup || popup.closed) {
              clearInterval(pollTimer);
              window.removeEventListener("message", messageHandler);

              // Assume success if popup closed (backend redirects to success page)
              resolve({
                success: true,
                provider,
                accountsAdded: 0,
              });
            }
          }, 500);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(pollTimer);
            window.removeEventListener("message", messageHandler);
            if (popup && !popup.closed) {
              popup.close();
            }
            reject(new Error("Authentication timed out"));
          }, 5 * 60 * 1000);
        });

        // 4. Fetch email accounts from backend
        const emailAccounts = await emailApiClient.getAccounts();

        // 5. Map to Chatwoot inbox format
        const newInboxes = emailAccounts.map(mapEmailAccountToInbox);

        // 6. Update Chatwoot inboxes state (append new inboxes)
        setInboxes((prevInboxes) => {
          // Remove duplicates by ID, keeping the latest
          const inboxMap = new Map<number, ChatwootInbox>();

          // Add existing inboxes
          prevInboxes.forEach((inbox) => inboxMap.set(inbox.id, inbox));

          // Add/update with new inboxes
          newInboxes.forEach((inbox) => inboxMap.set(inbox.id, inbox));

          return Array.from(inboxMap.values());
        });

        // 7. Return result with count
        return {
          ...result,
          accountsAdded: emailAccounts.length,
        };
      } catch (err: any) {
        const errorMessage = err.message || "Authentication failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsAuthenticating(false);
        setCurrentProvider(null);
      }
    },
    [setIsAuthenticating, setError, setCurrentProvider, setInboxes, mapEmailAccountToInbox]
  );

  /**
   * Clear OAuth error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    authenticate,
    isAuthenticating,
    error,
    currentProvider,
    clearError,
  };
};
