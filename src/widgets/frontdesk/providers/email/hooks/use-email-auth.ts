import { useState, useCallback } from "react";
import { emailApiClient } from "../utils/email-api-client";

export const useEmailAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (provider: string) => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Get auth URL from backend
      const { url, state } = await emailApiClient.getAuthUrl(provider);

      // Open popup
      const popup = window.open(
        url,
        "email-oauth",
        "width=500,height=600,left=200,top=100"
      );

      // Listen for callback
      return new Promise((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          if (event.data.source === "email-oauth") {
            window.removeEventListener("message", messageHandler);

            if (event.data.status === "success") {
              resolve(event.data);
            } else {
              reject(new Error(event.data.error || "Authentication failed"));
            }

            popup?.close();
          }
        };

        window.addEventListener("message", messageHandler);

        // Check if popup was blocked
        if (!popup || popup.closed) {
          window.removeEventListener("message", messageHandler);
          reject(new Error("Popup was blocked. Please allow popups for this site."));
        }
      });
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const disconnect = useCallback(async (accountId: string) => {
    try {
      await emailApiClient.disconnectAccount(accountId);
    } catch (err: any) {
      setError(err.message || "Failed to disconnect account");
      throw err;
    }
  }, []);

  return {
    authenticate,
    disconnect,
    isAuthenticating,
    error,
  };
};