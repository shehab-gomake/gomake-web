# Frontend Channel Connection Implementation Guide

This guide provides step-by-step instructions for implementing Gmail, WhatsApp, and Microsoft channel connections in your frontend.

---

## Table of Contents

1. [Gmail/Google Connection](#gmailgoogle-connection)
2. [WhatsApp Connection](#whatsapp-connection)
3. [Microsoft/Outlook Connection](#microsoftoutlook-connection)
4. [Complete Code Examples](#complete-code-examples)

---

## Gmail/Google Connection

### Step-by-Step Frontend Flow

#### Step 1: User Clicks "Connect Gmail" Button

**UI Component** (React/Next.js example):

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const ConnectGmailButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectGmail = async () => {
    setIsLoading(true);
    try {
      // Step 2: Call authorization endpoint
      const response = await fetch(`/api/v1/accounts/${accountId}/google/authorization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Your auth token
        },
        body: JSON.stringify({}), // Empty body
      });

      if (!response.ok) {
        throw new Error("Failed to get authorization URL");
      }

      const data = await response.json();

      // Step 3: Redirect user to Google OAuth URL
      if (data.success && data.url) {
        window.location.href = data.url; // Redirect to Google
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Gmail connection error:", error);
      // Show error message to user
      alert("Failed to connect Gmail. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleConnectGmail} disabled={isLoading}>
      {isLoading ? "Connecting..." : "Connect Gmail"}
    </Button>
  );
};
```

#### Step 2: First API Call - Get Authorization URL

**Endpoint:**

```
POST /api/v1/accounts/:account_id/google/authorization
```

**Request:**

```http
POST /api/v1/accounts/123/google/authorization
Headers:
  Authorization: Bearer <your_access_token>
  Content-Type: application/json
Body: {}  // Empty body
```

**Response:**

```json
{
  "success": true,
  "url": "https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=email%20profile%20https://mail.google.com/&response_type=code&prompt=consent&access_type=offline&state=<signed_account_id>"
}
```

**TypeScript Interface:**

```typescript
interface GoogleAuthorizationResponse {
  success: boolean;
  url?: string;
}

interface GoogleAuthorizationError {
  success: false;
  error?: string;
}
```

#### Step 3: Redirect User to Google OAuth

```typescript
// After receiving response from Step 2
if (data.success && data.url) {
  // Redirect entire browser window to Google OAuth
  window.location.href = data.url;

  // User will now be on Google's OAuth consent screen
  // After authorization, Google redirects to: /google/callback?code=...&state=...
}
```

#### Step 4: Backend Handles OAuth Callback

**Important:** The callback is handled by the **backend**, not the frontend!

- Google redirects to: `{FRONTEND_URL}/google/callback?code=<auth_code>&state=<signed_account_id>`
- Backend processes the callback:
  - Exchanges code for access token
  - Creates/updates channel and inbox
  - Redirects user back to frontend

#### Step 5: Backend Redirects User Back to Frontend

**Two possible redirect destinations:**

**A. New Inbox (First Time Connection):**

```
/app/accounts/:account_id/settings/inboxes/new/:inbox_id/agents
```

→ **Agents Assignment Page**

**B. Existing Inbox (Reauthorization):**

```
/app/accounts/:account_id/settings/inboxes/:inbox_id
```

→ **Inbox Settings Page**

#### Step 6: Frontend Receives Redirect (Optional Handling)

**If you want to detect when user returns from OAuth:**

```typescript
// In your inbox settings/agents page component
useEffect(() => {
  // Check URL params for OAuth success indicators
  const urlParams = new URLSearchParams(window.location.search);
  const inboxId = urlParams.get("inbox_id") || router.query.inbox_id;

  if (inboxId) {
    // Refresh inbox list or show success message
    showSuccessMessage("Gmail connected successfully!");
    refreshInboxes(); // Reload inbox list
  }
}, []);
```

---

## WhatsApp Connection

### Step-by-Step Frontend Flow

#### Step 1: User Clicks "Connect WhatsApp" Button

#### Step 2: Load Facebook SDK

**Required SDK:** Facebook SDK for JavaScript

```typescript
// Install: npm install facebook-sdk or use CDN
// CDN: <script src="https://connect.facebook.net/en_US/sdk.js"></script>

const loadFacebookSDK = (appId: string, apiVersion: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if SDK already loaded
    if (window.FB) {
      resolve();
      return;
    }

    // Load SDK script
    const script = document.createElement("script");
    script.src = `https://connect.facebook.net/en_US/sdk.js`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      window.FB.init({
        appId: appId,
        version: apiVersion, // e.g., "v18.0"
        cookie: true,
        xfbml: true,
      });
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Facebook SDK"));
    };

    document.body.appendChild(script);
  });
};
```

#### Step 3: Initialize WhatsApp Embedded Signup

```typescript
const initWhatsAppEmbeddedSignup = (configurationId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          // Get authorization code
          const code = response.authResponse.code;
          resolve(code);
        } else {
          reject(new Error("User cancelled login"));
        }
      },
      {
        config_id: configurationId,
        response_type: "code",
        extras: {
          setup: {
            // WhatsApp Embedded Signup specific config
          },
        },
      }
    );
  });
};
```

#### Step 4: Listen for Business Data (postMessage)

**Meta SDK sends business data via postMessage:**

```typescript
const setupMessageListener = (onBusinessData: (data: WhatsAppBusinessData) => void) => {
  const handleMessage = (event: MessageEvent) => {
    // Verify origin for security
    if (event.origin !== "https://www.facebook.com") {
      return;
    }

    const data = event.data;

    if (data.event === "FINISH" || data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING") {
      const businessData = data.data;

      // Validate business data
      if (businessData.business_id && businessData.waba_id && businessData.phone_number_id) {
        onBusinessData(businessData);
      }
    } else if (data.event === "CANCEL") {
      // User cancelled
      console.log("User cancelled WhatsApp signup");
    } else if (data.event === "error") {
      // Error occurred
      console.error("WhatsApp signup error:", data.error_message);
    }
  };

  window.addEventListener("message", handleMessage);

  // Return cleanup function
  return () => {
    window.removeEventListener("message", handleMessage);
  };
};
```

**Business Data Type:**

```typescript
interface WhatsAppBusinessData {
  business_id: string;
  waba_id: string; // WhatsApp Business Account ID
  phone_number_id?: string; // Phone Number ID (optional)
}
```

#### Step 5: Complete Signup - Send to Backend

**After receiving both authorization code and business data:**

```typescript
const completeWhatsAppSignup = async (code: string, businessData: WhatsAppBusinessData) => {
  try {
    const response = await fetch(`/api/v1/accounts/${accountId}/whatsapp/authorization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        code: code,
        business_id: businessData.business_id,
        waba_id: businessData.waba_id,
        phone_number_id: businessData.phone_number_id || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to connect WhatsApp");
    }

    const data = await response.json();

    // Step 6: Handle success
    if (data.success && data.id) {
      // Redirect to agents assignment page
      router.push(`/frontdesk/settings/inboxes/new/${data.id}/agents`);
    }
  } catch (error) {
    console.error("WhatsApp connection error:", error);
    alert("Failed to connect WhatsApp. Please try again.");
  }
};
```

#### Step 6: Handle Success Response

**Response:**

```json
{
  "success": true,
  "id": 123,
  "name": "WhatsApp Inbox",
  "channel_type": "whatsapp"
}
```

**Redirect:**

```typescript
// Redirect to agents assignment page
router.push(`/frontdesk/settings/inboxes/new/${inboxId}/agents`);
```

---

## Microsoft/Outlook Connection

### Step-by-Step Frontend Flow

**Microsoft/Outlook uses the exact same flow as Gmail!**

**Only difference:** Change the endpoint:

```typescript
// Instead of:
POST /api/v1/accounts/:account_id/google/authorization

// Use:
POST /api/v1/accounts/:account_id/microsoft/authorization
```

**Complete Example:**

```typescript
const handleConnectOutlook = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(
      `/api/v1/accounts/${accountId}/microsoft/authorization`, // ← Different endpoint
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}), // Empty body
      }
    );

    const data = await response.json();

    if (data.success && data.url) {
      window.location.href = data.url; // Redirect to Microsoft OAuth
    }
  } catch (error) {
    console.error("Outlook connection error:", error);
    alert("Failed to connect Outlook. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

**Callback URL:** `/microsoft/callback` (handled by backend)

---

## Complete Code Examples

### Gmail Connection Hook (React)

```typescript
import { useState } from "react";
import { useRouter } from "next/router";

interface UseGmailConnectionOptions {
  accountId: string;
  accessToken: string;
  onSuccess?: (inboxId: number) => void;
  onError?: (error: Error) => void;
}

export const useGmailConnection = ({ accountId, accessToken, onSuccess, onError }: UseGmailConnectionOptions) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const connectGmail = async () => {
    setIsConnecting(true);
    try {
      // Step 1: Get authorization URL
      const response = await fetch(`/api/v1/accounts/${accountId}/google/authorization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to get authorization URL");
      }

      const data = await response.json();

      if (!data.success || !data.url) {
        throw new Error("Invalid response from server");
      }

      // Step 2: Redirect to Google OAuth
      window.location.href = data.url;

      // User will be redirected back by backend after OAuth
      // Backend redirects to inbox settings or agents page
    } catch (error) {
      setIsConnecting(false);
      const err = error instanceof Error ? error : new Error("Unknown error");
      onError?.(err);
      throw err;
    }
  };

  return {
    connectGmail,
    isConnecting,
  };
};
```

### WhatsApp Connection Hook (React)

```typescript
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

interface WhatsAppBusinessData {
  business_id: string;
  waba_id: string;
  phone_number_id?: string;
}

interface UseWhatsAppConnectionOptions {
  accountId: string;
  accessToken: string;
  whatsappAppId: string;
  whatsappApiVersion: string;
  whatsappConfigurationId: string;
  onSuccess?: (inboxId: number) => void;
  onError?: (error: Error) => void;
}

export const useWhatsAppConnection = ({
  accountId,
  accessToken,
  whatsappAppId,
  whatsappApiVersion,
  whatsappConfigurationId,
  onSuccess,
  onError,
}: UseWhatsAppConnectionOptions) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<WhatsAppBusinessData | null>(null);
  const router = useRouter();

  // Load Facebook SDK
  const loadFacebookSDK = useCallback(async () => {
    if (window.FB) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        window.FB.init({
          appId: whatsappAppId,
          version: whatsappApiVersion,
          cookie: true,
          xfbml: true,
        });
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Facebook SDK"));
      };

      document.body.appendChild(script);
    });
  }, [whatsappAppId, whatsappApiVersion]);

  // Initialize WhatsApp Embedded Signup
  const initEmbeddedSignup = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.FB.login(
        (response) => {
          if (response.authResponse && response.authResponse.code) {
            resolve(response.authResponse.code);
          } else {
            reject(new Error("User cancelled login"));
          }
        },
        {
          config_id: whatsappConfigurationId,
          response_type: "code",
        }
      );
    });
  }, [whatsappConfigurationId]);

  // Complete signup flow
  const completeSignup = useCallback(
    async (code: string, businessData: WhatsAppBusinessData) => {
      try {
        const response = await fetch(`/api/v1/accounts/${accountId}/whatsapp/authorization`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            code,
            business_id: businessData.business_id,
            waba_id: businessData.waba_id,
            phone_number_id: businessData.phone_number_id || "",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to connect WhatsApp");
        }

        const data = await response.json();

        if (data.success && data.id) {
          onSuccess?.(data.id);
          router.push(`/frontdesk/settings/inboxes/new/${data.id}/agents`);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        onError?.(err);
        throw err;
      }
    },
    [accountId, accessToken, router, onSuccess, onError]
  );

  // Listen for business data from Meta SDK
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com") {
        return;
      }

      const data = event.data;

      if (data.event === "FINISH" || data.event === "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING") {
        const business = data.data;
        if (business.business_id && business.waba_id) {
          setBusinessData(business);

          // If we already have auth code, complete signup
          if (authCode) {
            completeSignup(authCode, business);
          }
        }
      } else if (data.event === "CANCEL") {
        setIsConnecting(false);
      } else if (data.event === "error") {
        setIsConnecting(false);
        onError?.(new Error(data.error_message || "WhatsApp signup error"));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [authCode, completeSignup, onError]);

  // Complete signup when both code and business data are available
  useEffect(() => {
    if (authCode && businessData) {
      completeSignup(authCode, businessData);
    }
  }, [authCode, businessData, completeSignup]);

  const connectWhatsApp = async () => {
    setIsConnecting(true);
    try {
      // Step 1: Load Facebook SDK
      await loadFacebookSDK();

      // Step 2: Initialize Embedded Signup
      const code = await initEmbeddedSignup();
      setAuthCode(code);

      // Step 3: Wait for business data via postMessage
      // (handled by useEffect message listener)
    } catch (error) {
      setIsConnecting(false);
      const err = error instanceof Error ? error : new Error("Unknown error");
      onError?.(err);
    }
  };

  return {
    connectWhatsApp,
    isConnecting,
  };
};
```

### Usage Example

```tsx
import { useGmailConnection, useWhatsAppConnection } from "@/hooks/use-channel-connection";

export const ChannelConnectionPage = () => {
  const accountId = "123";
  const accessToken = "your-access-token";

  const { connectGmail, isConnecting: isConnectingGmail } = useGmailConnection({
    accountId,
    accessToken,
    onSuccess: (inboxId) => {
      console.log("Gmail connected! Inbox ID:", inboxId);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const { connectWhatsApp, isConnecting: isConnectingWhatsApp } = useWhatsAppConnection({
    accountId,
    accessToken,
    whatsappAppId: "your-app-id",
    whatsappApiVersion: "v18.0",
    whatsappConfigurationId: "your-config-id",
    onSuccess: (inboxId) => {
      console.log("WhatsApp connected! Inbox ID:", inboxId);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  return (
    <div>
      <button onClick={connectGmail} disabled={isConnectingGmail}>
        {isConnectingGmail ? "Connecting..." : "Connect Gmail"}
      </button>

      <button onClick={connectWhatsApp} disabled={isConnectingWhatsApp}>
        {isConnectingWhatsApp ? "Connecting..." : "Connect WhatsApp"}
      </button>
    </div>
  );
};
```

---

## Summary

### Gmail/Google Flow

1. **Frontend:** `POST /api/v1/accounts/:account_id/google/authorization` (empty body)
2. **Backend:** Returns `{ success: true, url: "<google_oauth_url>" }`
3. **Frontend:** Redirects user to `url`
4. **User:** Authorizes on Google
5. **Google:** Redirects to `/google/callback?code=...&state=...` (backend handles)
6. **Backend:** Processes callback, creates/updates inbox, redirects to frontend
7. **Frontend:** User lands on inbox settings or agents page

### WhatsApp Flow

1. **Frontend:** Load Facebook SDK
2. **Frontend:** Initialize WhatsApp Embedded Signup (popup)
3. **User:** Completes Meta login (popup)
4. **SDK:** Returns authorization code
5. **SDK:** Sends business data via postMessage
6. **Frontend:** `POST /api/v1/accounts/:account_id/whatsapp/authorization` with code + business data
7. **Backend:** Creates inbox, returns `{ success: true, id, name, channel_type }`
8. **Frontend:** Redirects to agents assignment page

### Key Differences

|                      | Gmail                        | WhatsApp                 |
| -------------------- | ---------------------------- | ------------------------ |
| **First Endpoint**   | `POST /google/authorization` | Load SDK (no endpoint)   |
| **SDK Required**     | ❌ No                        | ✅ Yes (Facebook SDK)    |
| **User Flow**        | Redirect to OAuth            | Popup + postMessage      |
| **Backend Callback** | ✅ Yes (`/google/callback`)  | ❌ No (frontend handles) |
| **Final Step**       | Backend redirects            | Frontend redirects       |

---

## Error Handling

### Common Errors

**Gmail:**

- `401 Unauthorized` → Check access token
- `403 Forbidden` → User not administrator
- `Invalid response` → Check backend configuration

**WhatsApp:**

- `SDK load failed` → Check Facebook App ID
- `User cancelled login` → User closed popup
- `Missing business data` → Wait for postMessage event
- `Invalid parameters` → Check required fields (code, business_id, waba_id)

### Error Handling Example

```typescript
try {
  await connectGmail();
} catch (error) {
  if (error.message.includes("401")) {
    // Handle authentication error
    router.push("/login");
  } else if (error.message.includes("403")) {
    // Handle permission error
    alert("You must be an administrator to connect channels");
  } else {
    // Generic error
    alert("Failed to connect. Please try again.");
  }
}
```

---

## Testing Checklist

- [ ] Gmail connection flow works end-to-end
- [ ] WhatsApp SDK loads correctly
- [ ] WhatsApp popup opens and closes properly
- [ ] Business data received via postMessage
- [ ] Error handling works for all failure cases
- [ ] Redirect to correct page after success
- [ ] Loading states show correctly
- [ ] Multiple simultaneous connections don't conflict
