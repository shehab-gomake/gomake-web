# Chatwoot Channel Connection Flow Documentation

This document explains how Chatwoot handles OAuth connections for Gmail (Google) and WhatsApp, detailing the complete UI-to-backend flow, API requests, and responses.

---

## Table of Contents

1. [Gmail/Google OAuth Flow](#gmailgoogle-oauth-flow)
2. [WhatsApp Embedded Signup Flow](#whatsapp-embedded-signup-flow)
3. [Microsoft/Outlook OAuth Flow](#microsoftoutlook-oauth-flow)
4. [Summary & Implementation Guide](#summary--implementation-guide)

---

## Gmail/Google OAuth Flow

### UI Component Location
- **Component**: `app/javascript/dashboard/routes/dashboard/settings/inbox/channels/emailChannels/Google.vue`
- **Reusable Component**: `OAuthChannel.vue` (used by both Google and Microsoft)

### Flow Overview

```
User clicks "Connect Gmail" 
  → Frontend calls API to get authorization URL
  → Redirects user to Google OAuth consent screen
  → User authorizes → Google redirects to callback URL
  → Backend processes OAuth callback
  → Creates/updates channel and inbox
  → Redirects user to inbox settings/agents page
```

### Step-by-Step Process

#### Step 1: User Clicks "Connect Gmail" Button

**UI Component**: `OAuthChannel.vue`

```vue
<!-- The button triggers requestAuthorization() -->
<NextButton
  :is-loading="isRequestingAuthorization"
  type="submit"
  solid
  blue
  :label="submitButtonText"
/>
```

**Frontend Code** (`OAuthChannel.vue`):
```javascript
async function requestAuthorization() {
  try {
    isRequestingAuthorization.value = true;
    const response = await client.value.generateAuthorization();
    const { data: { url } } = response;
    window.location.href = url; // Redirect to Google OAuth
  } catch (error) {
    useAlert(props.errorMessage);
  } finally {
    isRequestingAuthorization.value = false;
  }
}
```

#### Step 2: Frontend API Call

**API Client**: `app/javascript/dashboard/api/channel/googleClient.js`

```javascript
class MicrosoftClient extends ApiClient {
  constructor() {
    super('google', { accountScoped: true });
  }

  generateAuthorization(payload) {
    return axios.post(`${this.url}/authorization`, payload);
  }
}
```

**Request**:
```http
POST /api/v1/accounts/:account_id/google/authorization
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
Body: {} (empty payload)
```

#### Step 3: Backend Generates OAuth URL

**Controller**: `app/controllers/api/v1/accounts/google/authorizations_controller.rb`

```ruby
def create
  redirect_url = google_client.auth_code.authorize_url(
    {
      redirect_uri: "#{base_url}/google/callback",
      scope: scope,  # 'email profile https://mail.google.com/'
      response_type: 'code',
      prompt: 'consent',      # Ensures refresh token is returned
      access_type: 'offline', # Required for refresh token
      state: state,           # Signed account ID (for security)
      client_id: GlobalConfigService.load('GOOGLE_OAUTH_CLIENT_ID', nil)
    }
  )

  if redirect_url
    render json: { success: true, url: redirect_url }
  else
    render json: { success: false }, status: :unprocessable_entity
  end
end
```

**Response**:
```json
{
  "success": true,
  "url": "https://accounts.google.com/o/oauth2/auth?client_id=...&redirect_uri=...&scope=email%20profile%20https://mail.google.com/&response_type=code&prompt=consent&access_type=offline&state=<signed_account_id>"
}
```

**Key Parameters**:
- `redirect_uri`: `{FRONTEND_URL}/google/callback`
- `scope`: `email profile https://mail.google.com/`
- `state`: Signed GlobalID of the account (15-minute expiry)
- `prompt: consent`: Forces OAuth consent screen (ensures refresh token)
- `access_type: offline`: Required for refresh token

#### Step 4: User Authorizes on Google

User is redirected to Google OAuth consent screen, selects account, grants permissions.

#### Step 5: Google Redirects to Callback

**Callback URL**: `{FRONTEND_URL}/google/callback?code=<authorization_code>&state=<signed_account_id>`

**Controller**: `app/controllers/google/callbacks_controller.rb`

```ruby
class Google::CallbacksController < OauthCallbackController
  def show
    @response = oauth_client.auth_code.get_token(
      oauth_code,  # params[:code]
      redirect_uri: "#{base_url}/google/callback"
    )
    handle_response
  rescue StandardError => e
    ChatwootExceptionTracker.new(e).capture_exception
    redirect_to '/'
  end
end
```

#### Step 6: Backend Processes OAuth Callback

**Base Controller**: `app/controllers/oauth_callback_controller.rb`

```ruby
def handle_response
  inbox, already_exists = find_or_create_inbox

  if already_exists
    redirect_to app_email_inbox_settings_url(account_id: account.id, inbox_id: inbox.id)
  else
    redirect_to app_email_inbox_agents_url(account_id: account.id, inbox_id: inbox.id)
  end
end

def find_or_create_inbox
  channel_email = find_channel_by_email
  channel_exists = channel_email.present?

  channel_email ||= create_channel_with_inbox
  update_channel(channel_email)
  channel_email.reauthorized!

  [channel_email.inbox, channel_exists]
end

def update_channel(channel_email)
  channel_email.update!({
    imap_login: users_data['email'],
    imap_address: 'imap.gmail.com',
    imap_port: '993',
    imap_enabled: true,
    provider: 'google',
    provider_config: {
      access_token: parsed_body['access_token'],
      refresh_token: parsed_body['refresh_token'],
      expires_on: (Time.current.utc + 1.hour).to_s
    }
  })
end
```

**What Happens**:
1. Extracts OAuth code from `params[:code]`
2. Extracts account from signed `state` parameter
3. Exchanges code for access token + refresh token
4. Finds existing channel by email OR creates new channel + inbox
5. Updates channel with OAuth tokens and IMAP settings
6. Marks channel as reauthorized
7. Redirects user to inbox settings (if exists) or agents page (if new)

#### Step 7: Frontend Receives Redirect

User is redirected to:
- **Existing inbox**: `/app/accounts/:account_id/settings/inboxes/:inbox_id`
- **New inbox**: `/app/accounts/:account_id/settings/inboxes/:inbox_id/agents`

---

## WhatsApp Embedded Signup Flow

### UI Component Location
- **Component**: `app/javascript/dashboard/routes/dashboard/settings/inbox/channels/WhatsappEmbeddedSignup.vue`

### Flow Overview

```
User clicks "Connect with WhatsApp Business"
  → Frontend loads Facebook SDK
  → Initializes WhatsApp Embedded Signup
  → User completes Meta login flow (popup)
  → SDK returns authorization code
  → Frontend receives business data via postMessage
  → Frontend sends code + business data to backend
  → Backend exchanges code for token
  → Backend creates channel and inbox
  → Frontend redirects to agents page
```

### Step-by-Step Process

#### Step 1: User Clicks "Connect with WhatsApp Business"

**UI Component**: `WhatsappEmbeddedSignup.vue`

```vue
<NextButton
  :disabled="isAuthenticating"
  :is-loading="isAuthenticating"
  faded
  slate
  class="w-full"
  @click="launchEmbeddedSignup"
>
  {{ $t('INBOX_MGMT.ADD.WHATSAPP.EMBEDDED_SIGNUP.SUBMIT_BUTTON') }}
</NextButton>
```

#### Step 2: Frontend Launches Embedded Signup

**Frontend Code** (`WhatsappEmbeddedSignup.vue`):

```javascript
const launchEmbeddedSignup = async () => {
  try {
    isAuthenticating.value = true;
    
    // 1. Load Facebook SDK
    await setupFacebookSdk(
      window.chatwootConfig?.whatsappAppId,
      window.chatwootConfig?.whatsappApiVersion
    );
    
    // 2. Initialize WhatsApp Embedded Signup
    const code = await initWhatsAppEmbeddedSignup(
      window.chatwootConfig?.whatsappConfigurationId
    );
    
    // 3. Store authorization code
    authCode.value = code;
    authCodeReceived.value = true;
    
    // 4. Wait for business data via postMessage
    // (handled by message listener)
  } catch (error) {
    if (error.message === 'Login cancelled') {
      // User cancelled
    } else {
      handleSignupError({ error: error.message });
    }
  }
};
```

**Key Config Values** (from `window.chatwootConfig`):
- `whatsappAppId`: Facebook App ID
- `whatsappApiVersion`: Meta API version (e.g., "v18.0")
- `whatsappConfigurationId`: WhatsApp Embedded Signup configuration ID

#### Step 3: User Completes Meta Login (Popup)

Meta SDK opens a popup, user logs into their WhatsApp Business account, selects business, phone number, etc.

#### Step 4: SDK Returns Authorization Code

After successful Meta login, the SDK returns an authorization code to the frontend.

#### Step 5: Frontend Receives Business Data

**Message Listener** (listens for postMessage from Meta SDK):

```javascript
const handleEmbeddedSignupData = async data => {
  if (data.event === 'FINISH' || data.event === 'FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING') {
    const businessDataLocal = data.data;
    
    if (isValidBusinessData(businessDataLocal)) {
      businessData.value = businessDataLocal;
      
      // If we have both code and business data, complete signup
      if (authCodeReceived.value && authCode.value) {
        await completeSignupFlow(businessDataLocal);
      }
    }
  } else if (data.event === 'CANCEL') {
    handleSignupCancellation();
  } else if (data.event === 'error') {
    handleSignupError({ error: data.error_message });
  }
};
```

**Business Data Structure**:
```javascript
{
  business_id: string,
  waba_id: string,        // WhatsApp Business Account ID
  phone_number_id: string  // Phone Number ID (optional)
}
```

#### Step 6: Frontend Sends Data to Backend

**Frontend Code**:

```javascript
const completeSignupFlow = async businessDataParam => {
  isProcessing.value = true;
  
  const params = {
    code: authCode.value,
    business_id: businessDataParam.business_id,
    waba_id: businessDataParam.waba_id,
    phone_number_id: businessDataParam?.phone_number_id || '',
  };

  const responseData = await store.dispatch(
    'inboxes/createWhatsAppEmbeddedSignup',
    params
  );

  handleSignupSuccess(responseData);
};
```

**Vuex Action** (`app/javascript/dashboard/store/modules/inboxes.js`):

```javascript
createWhatsAppEmbeddedSignup: async ({ commit }, params) => {
  try {
    commit(types.default.SET_INBOXES_UI_FLAG, { isCreating: true });
    const response = await WhatsappChannel.createEmbeddedSignup(params);
    commit(types.default.ADD_INBOXES, response.data);
    commit(types.default.SET_INBOXES_UI_FLAG, { isCreating: false });
    sendAnalyticsEvent('whatsapp');
    return response.data;
  } catch (error) {
    commit(types.default.SET_INBOXES_UI_FLAG, { isCreating: false });
    throw error;
  }
}
```

**API Client**: `app/javascript/dashboard/api/channel/whatsappChannel.js`

```javascript
createEmbeddedSignup(params) {
  return axios.post(`${this.baseUrl()}/whatsapp/authorization`, params);
}
```

#### Step 7: Backend API Request

**Request**:
```http
POST /api/v1/accounts/:account_id/whatsapp/authorization
Headers:
  Authorization: Bearer <access_token>
  Content-Type: application/json
Body:
{
  "code": "<authorization_code_from_meta>",
  "business_id": "<business_id>",
  "waba_id": "<whatsapp_business_account_id>",
  "phone_number_id": "<phone_number_id>" // optional
}
```

**Controller**: `app/controllers/api/v1/accounts/whatsapp/authorizations_controller.rb`

```ruby
def create
  validate_embedded_signup_params!
  channel = process_embedded_signup
  render_success_response(channel.inbox)
rescue StandardError => e
  render_error_response(e)
end

def validate_embedded_signup_params!
  missing_params = []
  missing_params << 'code' if params[:code].blank?
  missing_params << 'business_id' if params[:business_id].blank?
  missing_params << 'waba_id' if params[:waba_id].blank?

  return if missing_params.empty?

  raise ArgumentError, "Required parameters are missing: #{missing_params.join(', ')}"
end
```

#### Step 8: Backend Processes Signup

**Service**: `app/services/whatsapp/embedded_signup_service.rb`

```ruby
def perform
  validate_parameters!
  
  # 1. Exchange code for access token
  access_token = exchange_code_for_token
  
  # 2. Fetch phone info
  phone_info = fetch_phone_info(access_token)
  
  # 3. Validate token access
  validate_token_access(access_token)
  
  # 4. Create or reauthorize channel
  channel = create_or_reauthorize_channel(access_token, phone_info)
  
  # 5. Setup webhooks
  channel.setup_webhooks
  
  # 6. Check channel health
  check_channel_health_and_prompt_reauth(channel)
  
  channel
end
```

**What Happens**:
1. Validates required parameters (`code`, `business_id`, `waba_id`)
2. Exchanges authorization code for access token via Meta API
3. Fetches phone number information
4. Validates token has correct permissions
5. Creates new WhatsApp channel + inbox OR reauthorizes existing channel
6. Sets up webhooks for incoming messages
7. Checks channel health status
8. Returns inbox data

#### Step 9: Backend Response

**Success Response**:
```json
{
  "success": true,
  "id": 123,
  "name": "WhatsApp Inbox",
  "channel_type": "whatsapp"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Required parameters are missing: code, business_id"
}
```

#### Step 10: Frontend Handles Response

**Frontend Code**:

```javascript
const handleSignupSuccess = inboxData => {
  isProcessing.value = false;
  isAuthenticating.value = false;

  if (inboxData && inboxData.id) {
    useAlert(t('INBOX_MGMT.FINISH.MESSAGE'));
    router.replace({
      name: 'settings_inboxes_add_agents',
      params: {
        page: 'new',
        inbox_id: inboxData.id,
      },
    });
  }
};
```

User is redirected to agents assignment page.

---

## Microsoft/Outlook OAuth Flow

The Microsoft/Outlook flow is **identical** to Gmail, except:

1. **Provider**: `microsoft` instead of `google`
2. **IMAP Address**: `outlook.office365.com` instead of `imap.gmail.com`
3. **OAuth Endpoints**: Microsoft OAuth endpoints instead of Google

**Controller**: `app/controllers/api/v1/accounts/microsoft/authorizations_controller.rb`

```ruby
def create
  redirect_url = microsoft_client.auth_code.authorize_url(
    {
      redirect_uri: "#{base_url}/microsoft/callback",
      scope: scope,
      state: state,
      prompt: 'consent'
    }
  )
  render json: { success: true, url: redirect_url }
end
```

**Callback**: `app/controllers/microsoft/callbacks_controller.rb`

```ruby
def provider_name
  'microsoft'
end

def imap_address
  'outlook.office365.com'
end
```

---

## Summary & Implementation Guide

### For Gmail/Google

**Frontend Request**:
```javascript
POST /api/v1/accounts/:account_id/google/authorization
// Returns: { success: true, url: "<google_oauth_url>" }
```

**User Flow**:
1. Click "Connect Gmail" → Frontend gets OAuth URL
2. Redirect to Google → User authorizes
3. Google redirects to `/google/callback?code=...&state=...`
4. Backend processes callback → Creates/updates channel
5. Redirects to inbox settings

**Key Backend Endpoints**:
- `POST /api/v1/accounts/:account_id/google/authorization` - Get OAuth URL
- `GET /google/callback` - OAuth callback (handles token exchange)

**Required Config**:
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `FRONTEND_URL` (for callback URL)

---

### For WhatsApp

**Frontend Request**:
```javascript
POST /api/v1/accounts/:account_id/whatsapp/authorization
Body: {
  code: string,
  business_id: string,
  waba_id: string,
  phone_number_id?: string
}
```

**User Flow**:
1. Click "Connect WhatsApp" → Frontend loads Meta SDK
2. User completes Meta login (popup)
3. SDK returns authorization code
4. Frontend receives business data via postMessage
5. Frontend sends code + business data to backend
6. Backend exchanges code for token → Creates channel
7. Redirects to agents page

**Key Backend Endpoints**:
- `POST /api/v1/accounts/:account_id/whatsapp/authorization` - Complete signup

**Required Config**:
- `whatsappAppId` (Facebook App ID)
- `whatsappApiVersion` (Meta API version)
- `whatsappConfigurationId` (Embedded Signup config ID)

---

### For Microsoft/Outlook

**Same as Gmail**, but:
- Endpoint: `/api/v1/accounts/:account_id/microsoft/authorization`
- Callback: `/microsoft/callback`
- IMAP: `outlook.office365.com`

---

## Key Differences: Gmail vs WhatsApp

| Aspect | Gmail/Google | WhatsApp |
|--------|---------------|----------|
| **OAuth Flow** | Standard OAuth 2.0 (redirect) | Embedded Signup (popup + postMessage) |
| **Frontend SDK** | None needed | Facebook SDK required |
| **Authorization Code** | From URL query param | From SDK callback |
| **Business Data** | Not needed | Required (business_id, waba_id) |
| **Backend Steps** | 1 API call + 1 callback | 1 API call (all-in-one) |
| **Token Exchange** | Backend exchanges code | Backend exchanges code |
| **Callback URL** | `/google/callback` | N/A (handled by frontend) |

---

## Implementation Checklist for New Frontend

### Gmail/Google
- [ ] Create "Connect Gmail" button component
- [ ] Call `POST /api/v1/accounts/:account_id/google/authorization`
- [ ] Redirect user to returned OAuth URL
- [ ] Handle backend redirect after OAuth (backend handles callback)
- [ ] Refresh inbox list after successful connection

### WhatsApp
- [ ] Create "Connect WhatsApp" button component
- [ ] Load Facebook SDK (`setupFacebookSdk`)
- [ ] Initialize WhatsApp Embedded Signup (`initWhatsAppEmbeddedSignup`)
- [ ] Listen for postMessage events from Meta SDK
- [ ] Extract authorization code and business data
- [ ] Call `POST /api/v1/accounts/:account_id/whatsapp/authorization` with code + business data
- [ ] Handle success/error responses
- [ ] Redirect to agents page on success

### Microsoft/Outlook
- [ ] Same as Gmail, but use `/microsoft/authorization` endpoint

---

## Security Notes

1. **State Parameter (Gmail/Microsoft)**: Backend signs account ID in `state` parameter to prevent CSRF attacks
2. **Authorization Check**: Only administrators can create channels (`check_authorization` in base controller)
3. **Token Storage**: OAuth tokens stored securely in `provider_config` JSON field
4. **Refresh Tokens**: Gmail/Microsoft flow requests refresh tokens for long-term access

---

## References

- **Gmail Controller**: `app/controllers/api/v1/accounts/google/authorizations_controller.rb`
- **Gmail Callback**: `app/controllers/google/callbacks_controller.rb`
- **WhatsApp Controller**: `app/controllers/api/v1/accounts/whatsapp/authorizations_controller.rb`
- **WhatsApp Service**: `app/services/whatsapp/embedded_signup_service.rb`
- **Frontend Gmail UI**: `app/javascript/dashboard/routes/dashboard/settings/inbox/channels/emailChannels/Google.vue`
- **Frontend WhatsApp UI**: `app/javascript/dashboard/routes/dashboard/settings/inbox/channels/WhatsappEmbeddedSignup.vue`

