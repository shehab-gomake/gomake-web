/**
 * useWhatsAppOAuth Hook
 *
 * Manages WhatsApp Embedded Signup flow for connecting WhatsApp Business channels.
 *
 * Flow:
 * 1. Get WhatsApp config from backend (App ID, Config ID)
 * 2. Load and initialize Facebook SDK
 * 3. Launch FB.login with WhatsApp Business onboarding
 * 4. Listen for WA_EMBEDDED_SIGNUP postMessage with business data
 * 5. Send authorization code + business data to backend
 * 6. Backend exchanges code for token and creates inbox
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  chatwootOAuthLoadingAtom,
  chatwootOAuthErrorAtom,
  chatwootOAuthProviderAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import {
  chatwootOAuthService,
  type WhatsAppAuthorizationResponse,
} from "@/services/frontdesk/api/chatwoot/services/chatwoot-oauth.service";
import {
  setupFacebookSdk,
  launchWhatsAppEmbeddedSignup,
  createWhatsAppSignupMessageHandler,
  isValidWhatsAppBusinessData,
  type WhatsAppEmbeddedSignupData,
} from "../utils/facebook-sdk.utils";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";

/**
 * WhatsApp OAuth result interface
 */
export interface WhatsAppOAuthResult {
  success: boolean;
  accountId?: number;
  inboxId?: number;
  inboxName?: string;
}

/**
 * WhatsApp business data received from embedded signup
 */
interface WhatsAppBusinessData {
  business_id: string;
  waba_id: string;
  phone_number_id?: string;
}

/**
 * useWhatsAppOAuth Hook
 *
 * @returns WhatsApp OAuth authentication methods and state
 *
 * @example
 * ```typescript
 * const { authenticate, isAuthenticating, error } = useWhatsAppOAuth();
 *
 * const handleConnect = async () => {
 *   try {
 *     const result = await authenticate();
 *     console.log(`Connected WhatsApp inbox: ${result.inboxId}`);
 *   } catch (err) {
 *     console.error('WhatsApp connection failed:', err);
 *   }
 * };
 * ```
 */
export const useWhatsAppOAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useRecoilState(chatwootOAuthLoadingAtom);
  const [error, setError] = useRecoilState(chatwootOAuthErrorAtom);
  const setCurrentProvider = useSetRecoilState(chatwootOAuthProviderAtom);
  const { refresh: refreshInboxes } = useChatwootInboxes();

  // Store business data received from postMessage
  const businessDataRef = useRef<WhatsAppBusinessData | null>(null);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  // Store message handler for cleanup
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

  // Cleanup message handler on unmount
  useEffect(() => {
    return () => {
      if (messageHandlerRef.current) {
        window.removeEventListener("message", messageHandlerRef.current);
      }
    };
  }, []);

  /**
   * Initialize Facebook SDK with WhatsApp config
   */
  const initializeSdk = useCallback(async () => {
    if (sdkInitialized) return;

    try {
      const config = await chatwootOAuthService.getWhatsAppConfig();
      await setupFacebookSdk(config.appId, config.apiVersion);
      setSdkInitialized(true);
      return config;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize WhatsApp SDK";
      throw new Error(errorMessage);
    }
  }, [sdkInitialized]);

  /**
   * Authenticate with WhatsApp Embedded Signup
   *
   * This implementation follows Chatwoot's approach:
   * - Both FB.login code and WA_EMBEDDED_SIGNUP business data can arrive in any order
   * - We wait for BOTH before completing the signup
   * - Handle the case where business data arrives before or after the code
   *
   * @param inboxId - Optional inbox ID for reauthorization
   * @returns Promise with OAuth result
   * @throws Error if OAuth fails
   */
  const authenticate = useCallback(
    async (inboxId?: number): Promise<WhatsAppOAuthResult> => {
      setIsAuthenticating(true);
      setError(null);
      setCurrentProvider("whatsapp");
      businessDataRef.current = null;

      // Track state for the two async operations
      let authCode: string | null = null;
      let businessData: WhatsAppBusinessData | null = null;

      try {
        // 1. Get config and initialize SDK
        const config = await chatwootOAuthService.getWhatsAppConfig();

        if (!sdkInitialized) {
          await setupFacebookSdk(config.appId, config.apiVersion);
          setSdkInitialized(true);
        }

        // 2. Create a promise that resolves when BOTH code and business data are received
        const completePromise = new Promise<{ code: string; businessData: WhatsAppBusinessData }>((resolve, reject) => {
          // Timeout after 5 minutes
          const timeoutId = setTimeout(() => {
            const missing = [];
            if (!authCode) missing.push("authorization code");
            if (!businessData) missing.push("business data");
            reject(
              new Error(
                `WhatsApp signup incomplete: waiting for ${missing.join(
                  " and "
                )}. Please complete the full WhatsApp Business setup.`
              )
            );
          }, 5 * 60 * 1000);

          // Function to check if we have both pieces
          const tryComplete = () => {
            if (authCode && businessData) {
              clearTimeout(timeoutId);
              resolve({ code: authCode, businessData });
            }
          };

          // 3. Set up message handler for WA_EMBEDDED_SIGNUP data
          const handler = createWhatsAppSignupMessageHandler((data: WhatsAppEmbeddedSignupData) => {
            console.log("[WhatsApp OAuth] Received postMessage event:", data.event, data.data);

            // Handle CANCEL event
            if (data.event === "CANCEL") {
              clearTimeout(timeoutId);
              reject(new Error("WhatsApp signup was cancelled"));
              return;
            }

            // Handle error events
            if (data.event === "error" || data.event === "ERROR" || data.data?.error) {
              clearTimeout(timeoutId);
              reject(new Error(data.data?.error || "WhatsApp signup error"));
              return;
            }

            // Check for FINISH event with valid business data
            if (
              (data.event === "FINISH" || data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING") &&
              data.data &&
              isValidWhatsAppBusinessData(data.data)
            ) {
              console.log("[WhatsApp OAuth] Received valid business data:", data.data);
              businessData = {
                business_id: data.data.business_id!,
                waba_id: data.data.waba_id!,
                phone_number_id: data.data.phone_number_id,
              };
              businessDataRef.current = businessData;
              tryComplete();
            }
          });

          messageHandlerRef.current = handler;
          window.addEventListener("message", handler);

          // 4. Launch WhatsApp Embedded Signup (FB.login)
          launchWhatsAppEmbeddedSignup(config.configId)
            .then((code) => {
              console.log("[WhatsApp OAuth] Received auth code from FB.login");
              authCode = code;
              tryComplete();
            })
            .catch((err) => {
              clearTimeout(timeoutId);
              reject(err);
            });
        });

        // 5. Wait for both code and business data
        const { code, businessData: finalBusinessData } = await completePromise;

        // Cleanup message handler
        if (messageHandlerRef.current) {
          window.removeEventListener("message", messageHandlerRef.current);
          messageHandlerRef.current = null;
        }

        // 6. Send to backend for token exchange and inbox creation
        console.log("[WhatsApp OAuth] Sending authorization to backend...");
        const response: WhatsAppAuthorizationResponse = await chatwootOAuthService.authorizeWhatsApp({
          code,
          business_id: finalBusinessData.business_id,
          waba_id: finalBusinessData.waba_id,
          phone_number_id: finalBusinessData.phone_number_id,
          inbox_id: inboxId,
        });

        // 7. Refresh inboxes
        await refreshInboxes();

        return {
          success: response.success,
          accountId: response.accountId,
          inboxId: response.inboxId,
          inboxName: response.inboxName,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "WhatsApp authentication failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsAuthenticating(false);
        setCurrentProvider(null);
        // Cleanup message handler
        if (messageHandlerRef.current) {
          window.removeEventListener("message", messageHandlerRef.current);
          messageHandlerRef.current = null;
        }
      }
    },
    [setIsAuthenticating, setError, setCurrentProvider, sdkInitialized, refreshInboxes]
  );

  /**
   * Clear OAuth error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Check if WhatsApp is configured on the server
   */
  const checkConfiguration = useCallback(async (): Promise<boolean> => {
    try {
      await chatwootOAuthService.getWhatsAppConfig();
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    authenticate,
    initializeSdk,
    checkConfiguration,
    isAuthenticating,
    error,
    clearError,
    sdkInitialized,
  };
};
