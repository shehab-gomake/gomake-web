import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { gmailConnectionState, gmailOAuthState } from "@/store/frontdesk/providers/gmail";
import { getUserToken } from "@/services/storage-data";
import { useSnackBar } from "@/hooks/use-snack-bar";

export const useGmailAuth = () => {
  const [connectionState, setConnectionState] = useRecoilState(gmailConnectionState);
  const [oauthState, setOAuthState] = useRecoilState(gmailOAuthState);
  const { alertSuccess, alertFault } = useSnackBar();

  // Check Gmail connection status
  const checkConnection = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const userToken = getUserToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      };

      // Call messaging service directly (no Next.js proxy) for gmail/profile
      const baseUrl = (process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/gmail/profile`, {
        method: "GET",
        headers,
      });

      console.log("Gmail profile response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to check connection: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gmail profile response:", data);

      if (data.success) {
        setConnectionState({
          connected: data.data?.connected || false,
          email: data.data?.email,
          loading: false,
          error: undefined,
        });
      } else {
        setConnectionState(prev => ({
          ...prev,
          connected: false,
          loading: false,
          error: data.error || data.message || "Failed to check connection",
        }));
      }
    } catch (err: any) {
      console.error("Error checking Gmail connection:", err);
      setConnectionState({
        connected: false,
        email: undefined,
        loading: false,
        error: err.message || "Failed to check connection status",
      });
    }
  }, [setConnectionState]);

  // Initiate OAuth flow
  const initiateAuth = useCallback(async () => {
    setOAuthState(prev => ({ ...prev, isAuthenticating: true, error: undefined }));

    try {
      const userToken = getUserToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      };

      const baseUrlAuth = (process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");
      const response = await fetch(`${baseUrlAuth}/api/gmail/auth-url`, {
        method: "GET",
        headers,
      });

      console.log("Gmail auth URL response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to get auth URL: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gmail auth URL response:", data);

      if (data.success && data.data?.url) {
        setOAuthState(prev => ({
          ...prev,
          authUrl: data.data.url,
          isAuthenticating: true,
          error: undefined,
        }));

        // Open OAuth popup
        openAuthPopup(data.data.url);
      } else {
        const error = data.error || data.message || "Failed to get authorization URL";
        setOAuthState(prev => ({
          ...prev,
          isAuthenticating: false,
          error,
        }));
        alertFault(error);
      }
    } catch (err: any) {
      console.error("Error getting auth URL:", err);
      const error = err.message || "Failed to initiate authentication";
      setOAuthState(prev => ({
        ...prev,
        isAuthenticating: false,
        error,
      }));
      alertFault(error);
    }
  }, [setOAuthState, alertFault]);

  // Open OAuth popup window
  const openAuthPopup = useCallback((authUrl: string) => {
    const allowedOrigin = (() => {
      try {
        const base = (process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");
        return new URL(base).origin;
      } catch {
        return "http://localhost:3000";
      }
    })();
    const popup = window.open(
      authUrl,
      "gmail-oauth",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    if (!popup) {
      const error = "Failed to open authentication popup. Please check your popup blocker.";
      setOAuthState(prev => ({
        ...prev,
        isAuthenticating: false,
        error,
      }));
      alertFault(error);
      return;
    }

    // Listen for OAuth completion message
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && event.origin !== allowedOrigin) return;

      if (event.data?.source === "gmail-oauth") {
        popup.close();
        setOAuthState(prev => ({
          ...prev,
          isAuthenticating: false,
          authUrl: undefined,
          error: undefined,
        }));

        if (event.data.status === "success") {
          alertSuccess(`Gmail connected successfully: ${event.data.email}`);
          checkConnection(); // Refresh connection status
        } else {
          const error = event.data.error || "Authentication failed";
          setOAuthState(prev => ({ ...prev, error }));
          alertFault(error);
        }

        window.removeEventListener("message", messageListener);
      }
    };

    window.addEventListener("message", messageListener);

    // Handle popup closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setOAuthState(prev => ({
          ...prev,
          isAuthenticating: false,
          authUrl: undefined,
        }));
        window.removeEventListener("message", messageListener);
      }
    }, 1000);
  }, [setOAuthState, alertFault, alertSuccess, checkConnection]);

  // Disconnect Gmail
  const disconnect = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, loading: true }));

    try {
      const userToken = getUserToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      };

      const baseUrlDisconnect = (process.env.NEXT_PUBLIC_MESSAGING_SERVICE_URL || "http://localhost:3000").replace(/\/$/, "");
      const response = await fetch(`${baseUrlDisconnect}/api/gmail/disconnect`, {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });

      console.log("Gmail disconnect response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to disconnect: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gmail disconnect response:", data);

      if (data.success) {
        setConnectionState({
          connected: false,
          email: undefined,
          loading: false,
          error: undefined,
        });
        alertSuccess("Gmail disconnected successfully");
      } else {
        const error = data.error || data.message || "Failed to disconnect Gmail";
        setConnectionState(prev => ({
          ...prev,
          loading: false,
          error,
        }));
        alertFault(error);
      }
    } catch (err: any) {
      console.error("Error disconnecting Gmail:", err);
      const error = err.message || "Failed to disconnect Gmail";
      setConnectionState(prev => ({
        ...prev,
        loading: false,
        error,
      }));
      alertFault(error);
    }
  }, [setConnectionState, alertSuccess, alertFault]);

  // Check connection on component mount with debounce to prevent duplicate calls
  useEffect(() => {
    // Only check connection if we haven't checked recently
    if (!connectionState.loading) {
      const timeoutId = setTimeout(() => {
        checkConnection();
      }, 100); // Small delay to let other auth calls complete first

      return () => clearTimeout(timeoutId);
    }
  }, [checkConnection, connectionState.loading]);

  return {
    connectionState,
    oauthState,
    checkConnection,
    initiateAuth,
    disconnect,
    isConnected: connectionState.connected,
    isLoading: connectionState.loading || oauthState.isAuthenticating,
  };
};
