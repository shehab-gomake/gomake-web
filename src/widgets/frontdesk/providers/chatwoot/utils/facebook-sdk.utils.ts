/**
 * Facebook SDK Utilities
 *
 * Utilities for loading and interacting with the Facebook JavaScript SDK.
 * Used for WhatsApp Embedded Signup flow.
 *
 * @see https://developers.facebook.com/docs/javascript/
 */

declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options?: FacebookLoginOptions
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

/**
 * Facebook login response structure
 */
export interface FacebookLoginResponse {
  authResponse?: {
    code?: string;
    accessToken?: string;
    expiresIn?: number;
    signedRequest?: string;
    userID?: string;
  } | null;
  status: "connected" | "not_authorized" | "unknown";
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

/**
 * Facebook login options for WhatsApp Embedded Signup
 */
export interface FacebookLoginOptions {
  config_id: string;
  response_type: "code" | "token";
  override_default_response_type: boolean;
  extras: {
    setup: Record<string, unknown>;
    featureType: "whatsapp_business_app_onboarding";
    sessionInfoVersion: string;
  };
}

/**
 * WhatsApp Embedded Signup data from postMessage
 */
export interface WhatsAppEmbeddedSignupData {
  type: "WA_EMBEDDED_SIGNUP";
  data?: {
    business_id?: string;
    waba_id?: string;
    phone_number_id?: string;
    current_step?: string;
    error?: string;
  };
  version?: string;
  event?:
    | "FINISH"
    | "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"
    | "CANCEL"
    | "ERROR"
    | "error"
    | "SUBMIT"
    | "PHONE_OTP_REQUEST"
    | "BIZ_PHONE_VERIFIED";
}

/**
 * Load the Facebook SDK script
 * @returns Promise that resolves when SDK is loaded
 */
export const loadFacebookSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.FB) {
      resolve();
      return;
    }

    // Check if script is already in DOM
    if (document.getElementById("facebook-jssdk")) {
      // Wait for fbAsyncInit to be called
      const originalInit = window.fbAsyncInit;
      window.fbAsyncInit = () => {
        originalInit?.();
        resolve();
      };
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      // Script loaded, wait for fbAsyncInit
      // FB.init will be called in initializeFacebook
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK"));
    };

    // Insert script
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  });
};

/**
 * Initialize the Facebook SDK
 * Must be called after loadFacebookSdk
 *
 * @param appId - Facebook App ID
 * @param apiVersion - Facebook API version (e.g., "v22.0")
 * @returns Promise that resolves when SDK is initialized
 */
export const initializeFacebook = (
  appId: string,
  apiVersion: string = "v22.0"
): Promise<void> => {
  return new Promise((resolve) => {
    const init = () => {
      window.FB.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: apiVersion,
      });
      resolve();
    };

    if (window.FB) {
      init();
    } else {
      window.fbAsyncInit = init;
    }
  });
};

/**
 * Setup Facebook SDK (load and initialize)
 *
 * @param appId - Facebook App ID
 * @param apiVersion - Facebook API version (default: "v22.0")
 * @returns Promise that resolves when SDK is ready
 */
export const setupFacebookSdk = async (
  appId: string,
  apiVersion: string = "v22.0"
): Promise<void> => {
  await loadFacebookSdk();
  await initializeFacebook(appId, apiVersion);
};

/**
 * Check if WhatsApp embedded signup data is valid
 *
 * @param data - Data from WA_EMBEDDED_SIGNUP message
 * @returns True if data contains required business info
 */
export const isValidWhatsAppBusinessData = (
  data: WhatsAppEmbeddedSignupData["data"]
): boolean => {
  return Boolean(data?.business_id && data?.waba_id);
};

/**
 * Create a message handler for WhatsApp Embedded Signup events
 *
 * Listens for postMessage events from facebook.com containing
 * WA_EMBEDDED_SIGNUP data with business_id, waba_id, etc.
 *
 * @param onData - Callback when valid WA_EMBEDDED_SIGNUP data is received
 * @returns Event handler function (use with addEventListener/removeEventListener)
 */
export const createWhatsAppSignupMessageHandler = (
  onData: (data: WhatsAppEmbeddedSignupData) => void
): ((event: MessageEvent) => void) => {
  return (event: MessageEvent) => {
    // Only accept messages from Facebook
    if (!event.origin?.endsWith("facebook.com")) {
      return;
    }

    try {
      let data: WhatsAppEmbeddedSignupData;

      // Parse data if it's a string
      if (typeof event.data === "string") {
        data = JSON.parse(event.data);
      } else if (typeof event.data === "object" && event.data !== null) {
        data = event.data as WhatsAppEmbeddedSignupData;
      } else {
        return;
      }

      // Only process WA_EMBEDDED_SIGNUP messages
      if (data.type === "WA_EMBEDDED_SIGNUP") {
        onData(data);
      }
    } catch {
      // Ignore non-JSON or invalid messages
    }
  };
};

/**
 * Launch WhatsApp Embedded Signup flow
 *
 * Opens Facebook's WhatsApp Business onboarding flow.
 * User will configure their WhatsApp Business account.
 *
 * @param configId - WhatsApp Configuration ID from Meta Developer Console
 * @returns Promise that resolves with authorization code from FB.login
 * @throws Error if user cancels or login fails
 */
export const launchWhatsAppEmbeddedSignup = (
  configId: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error("Facebook SDK not loaded. Call setupFacebookSdk first."));
      return;
    }

    window.FB.login(
      (response: FacebookLoginResponse) => {
        if (response.authResponse?.code) {
          resolve(response.authResponse.code);
        } else if (response.error) {
          reject(new Error(response.error.message || "Facebook login failed"));
        } else if (response.status === "not_authorized") {
          reject(new Error("User did not authorize the application"));
        } else {
          reject(new Error("WhatsApp signup was cancelled"));
        }
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "whatsapp_business_app_onboarding",
          sessionInfoVersion: "3",
        },
      }
    );
  });
};




