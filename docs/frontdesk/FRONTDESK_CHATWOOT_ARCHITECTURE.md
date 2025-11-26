# FrontDesk Chatwoot Architecture & Workspace Guide

This document provides a comprehensive overview of the FrontDesk Chatwoot feature implementation, its connection to the Chatwoot backend, and how to use the Chatwoot frontend demo as a reference.

## 🎯 Scope: FrontDesk Chatwoot Feature Only

**Important:** In `gomake-web`, we are working **exclusively** with the FrontDesk Chatwoot feature. This document helps identify the relevant code and understand the architecture when working in this workspace.

---

## 📁 Workspace Projects Overview

### 1. **gomake-web** (Frontend - THIS PROJECT)

**Location:** `/Users/omarsabbah/Desktop/gomake-services/gomake-web`

- **Technology:** Next.js 13.5.4, React 18, TypeScript, Recoil
- **Purpose:** Frontend application including FrontDesk unified messaging hub
- **FrontDesk Chatwoot:** `src/widgets/frontdesk/providers/chatwoot/`

### 2. **messaging-hub-v2** (Backend Proxy)

**Location:** `/Users/omarsabbah/Desktop/gomake-services/messaging-hub-v2`

- **Technology:** NestJS, TypeScript
- **Purpose:** Proxy service between GoMake frontend and Chatwoot
- **Function:** JWT validation, auto-provisioning, path transformation

### 3. **chatwoot** (Customer Support Platform - Reference)

**Location:** `/Users/omarsabbah/Desktop/messaging/chatwoot`

- **Technology:** Ruby on Rails 7.1, Vue 3, PostgreSQL, Redis
- **Purpose:** Open-source customer support platform (v4.7.0)
- **Frontend Demo:** `app/javascript/dashboard/` - **Use this as reference!**

---

## 🏗️ FrontDesk Chatwoot Architecture

### Connection Flow

```
FrontDesk Chatwoot Provider (gomake-web)
    ↓ JWT Bearer Token
messaging-hub-v2 (NestJS Proxy)
    ↓ Auto-provisioning + Path Transformation
Chatwoot Backend (Rails API)
    ↓ Response
FrontDesk Chatwoot Provider (gomake-web)
```

### Directory Structure

```
src/widgets/frontdesk/providers/chatwoot/
├── chatwoot-provider-view.tsx          # Main router (6+ views)
├── components/                        # 30+ UI components
│   ├── conversation-list/            # Conversation list UI
│   ├── reply-composer/               # Message composer
│   ├── dashboard/                    # Dashboard components
│   ├── filters/                      # Filter components
│   └── ...
├── hooks/                             # Custom React hooks
│   ├── core/                         # Reusable base hooks
│   ├── use-chatwoot-provider.ts      # Main orchestrator
│   ├── use-chatwoot-conversations.ts # Conversation management
│   ├── use-chatwoot-messages.ts      # Message handling
│   └── ...
├── views/                             # 9 distinct views
│   ├── dashboard-view.tsx            # Stats & activity
│   ├── my-inbox-view.tsx             # Assigned conversations
│   ├── all-conversations-view.tsx    # Team conversations
│   ├── mentions-view.tsx             # Mentions
│   ├── unattended-view.tsx          # Unassigned
│   ├── channels-view.tsx             # Inbox-specific
│   ├── settings-view.tsx             # Settings management
│   ├── oauth-callback-view.tsx       # OAuth callback handler
│   ├── webhook-test-view.tsx         # Webhook testing
│   └── settings/                     # Settings subpages
│       ├── general-settings-subpage.tsx
│       ├── profile-settings-subpage.tsx
│       ├── inboxes-subpage.tsx
│       ├── inbox-detail-settings.tsx
│       ├── agents-subpage.tsx
│       ├── teams-subpage.tsx
│       ├── labels-subpage.tsx
│       └── tabs/                     # Inbox detail tabs
├── utils/                             # Utility functions
├── config/                            # Configuration
└── types/                             # TypeScript types

src/services/frontdesk/api/chatwoot/
├── chatwoot.service.ts                # Main aggregator service
├── chatwoot-http-client.ts            # Base HTTP client
├── services/                           # 13 API services (10 main + 3 helpers)
│   ├── chatwoot-profile.service.ts         # User profile
│   ├── chatwoot-conversations.service.ts   # Conversation management
│   ├── chatwoot-messages.service.ts        # Message operations
│   ├── chatwoot-inboxes.service.ts         # Inbox/channel management
│   ├── chatwoot-contacts.service.ts        # Contact management
│   ├── chatwoot-notifications.service.ts   # Notification operations
│   ├── chatwoot-agents.service.ts          # Agent/user management
│   ├── chatwoot-teams.service.ts           # Team management
│   ├── chatwoot-labels.service.ts          # Label management
│   ├── chatwoot-oauth.service.ts           # OAuth authorization
│   ├── chatwoot-contact-resolution.service.ts      # Helper: Contact resolution
│   ├── chatwoot-inbox-resolution.service.ts        # Helper: Inbox resolution
│   └── chatwoot-conversation-composer.service.ts   # Helper: Compose validation
└── types/                              # TypeScript types

src/store/frontdesk/atoms/
└── chatwoot.atoms.ts                  # Recoil state atoms
```

---

## 🔌 Key Components

### Main Provider Hook: `useChatwootProvider`

**Location:** `src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider.ts`

**Responsibilities:**

- Profile management
- Account selection
- Conversation filtering
- Inbox management
- Router coordination

**Usage:**

```typescript
const { profile, conversations, selectedAccountId, router } = useChatwootProvider();
```

### Main Service: `chatwootService`

**Location:** `src/services/frontdesk/api/chatwoot/chatwoot.service.ts`

**API Groups:**

- `profile` - User profile (no account_id needed)
- `conversations` - Conversation management
- `messages` - Message operations
- `inboxes` - Inbox/channel management
- `contacts` - Contact management
- `notifications` - Notification operations
- `agents` - Agent/user management
- `teams` - Team management
- `labels` - Label management
- `oauth` - OAuth authorization (Gmail/Outlook)

**Usage:**

```typescript
import { chatwootService } from "@/services/frontdesk";

// Profile operations
const user = await chatwootService.profile.getProfile();

// Conversation operations
const conversations = await chatwootService.conversations.listConversations(accountId, { status: ["open"], page: 1 });

// Message operations
const messages = await chatwootService.messages.listMessages(accountId, conversationId);
```

### HTTP Client: `ChatwootHttpClient`

**Location:** `src/services/frontdesk/api/chatwoot/chatwoot-http-client.ts`

**Features:**

- JWT Bearer token authentication
- Base URL: `http://localhost:8080` (dev) or Cloud Run URL (prod)
- Account-scoped URL building
- Error handling
- Response parsing

---

## 🎨 Using Chatwoot Frontend as Reference

The Chatwoot backend includes a complete frontend demo at `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`. **Use this as a reference** when implementing FrontDesk Chatwoot features.

### Key Reference Files

#### 1. **API Client Pattern**

**Location:** `chatwoot/app/javascript/dashboard/api/ApiClient.js`

**Pattern:**

```javascript
class ApiClient {
  constructor(resource, options = {}) {
    this.resource = resource;
    this.options = options;
  }

  get accountIdFromRoute() {
    // Extract accountId from URL
  }

  baseUrl() {
    // Build account-scoped URLs
    return `/api/v1/accounts/${accountId}/${resource}`;
  }
}
```

**Reference when:** Implementing new API services or understanding URL patterns

#### 2. **Component Structure**

**Location:** `chatwoot/app/javascript/dashboard/components/widgets/`

**Contains:**

- Conversation list components
- Message viewer components
- Filter components
- Layout patterns

**Reference when:**

- Building UI components
- Understanding component behavior
- Layout patterns

#### 3. **State Management**

**Location:** `chatwoot/app/javascript/dashboard/store/modules/`

**Contains:**

- Vuex modules for conversations, messages, inboxes
- State structure examples

**Reference when:**

- Understanding data structures
- State management patterns
- Data flow

#### 4. **API Service Examples**

**Location:** `chatwoot/app/javascript/dashboard/api/conversations.js`

**Example:**

```javascript
class ConversationApi extends ApiClient {
  constructor() {
    super("conversations", { accountScoped: true });
  }

  getLabels(conversationID) {
    return axios.get(`${this.url}/${conversationID}/labels`);
  }
}
```

**Reference when:**

- Implementing new API endpoints
- Understanding request/response patterns
- Error handling

---

## 📊 Current Implementation Status

### ✅ Complete Features

- **Profile Management** - User profile, account switching
- **Conversation Management** - List, filter, search, pagination, labels, status changes
- **Message Operations** - View, send, delete messages, attachments, translations
- **Inbox Management** - List, create, update inboxes, channel support, webhooks, agents
- **Contact Management** - List, search, filter, create, update contacts
- **Notifications** - Notification list, mark read, unread count, snooze
- **Agent Management** - List, update agents, availability status, inbox assignments
- **Team Management** - List, create, update teams, member management
- **Label Management** - List, create, update, delete labels
- **OAuth Integration** - Gmail/Outlook channel authorization
- **Multi-Account Support** - Account switching, scoping
- **Filtering** - Status, assignee, inbox, team, labels, search, priority
- **Settings UI** - Account settings, inbox settings (6 tabs), profile settings
- **Views** - Dashboard, My Inbox, All Conversations, Mentions, Unattended, Channels, Settings, OAuth Callback, Webhook Testing

### 📋 Available for Enhancement

- **Real-time Updates** - WebSocket not implemented (use REST polling)
- **More API Endpoints** - Teams, agents, automation, etc.
- **Advanced Features** - Bulk actions, advanced filtering
- **Performance** - Virtual scrolling, fetch deduplication (partially implemented)

---

## 🔗 Integration Points

### Authentication Flow

1. FrontDesk sends request with GoMake JWT Bearer token
2. `messaging-hub-v2` validates token via GoMake Users API
3. Auto-provisions Chatwoot account/user if needed
4. Transforms path: `/api/conversations` → `/api/v1/accounts/{accountId}/conversations`
5. Forwards request to Chatwoot with user's access token
6. Returns response to FrontDesk

### API Endpoints

**Base URL (Development):** `http://localhost:8080`  
**Base URL (Production):** `https://messaging-hub-1052023886201.europe-west3.run.app`

**Pattern:** All endpoints follow `/api/v1/accounts/{accountId}/...` format (except profile)

**Authentication:** JWT Bearer token in `Authorization` header

---

## 🛠️ Development Guidelines

### When Adding New Features

1. **Check Chatwoot Frontend** - Reference `chatwoot/app/javascript/dashboard/` for patterns
2. **Use Existing Services** - Extend `chatwootService` rather than creating new clients
3. **Follow Provider Pattern** - Use hooks in `hooks/` directory
4. **State Management** - Use Recoil atoms in `src/store/frontdesk/atoms/chatwoot.atoms.ts`
5. **Type Safety** - Use TypeScript types from `src/services/frontdesk/api/chatwoot/types/`

### Code Organization

- **Components:** `src/widgets/frontdesk/providers/chatwoot/components/`
- **Hooks:** `src/widgets/frontdesk/providers/chatwoot/hooks/`
- **Services:** `src/services/frontdesk/api/chatwoot/services/`
- **Types:** `src/services/frontdesk/api/chatwoot/types/`
- **Utils:** `src/widgets/frontdesk/providers/chatwoot/utils/`

### Best Practices

1. **Use Base Hooks** - Extend `useChatwootDataFetch` or `useChatwootFilters`
2. **Account Scoping** - Always use `accountScopedUrl()` for account-based endpoints
3. **Error Handling** - Use HTTP client's built-in error handling
4. **Filter Management** - Use `buildConversationFilters()` and `createFilterKey()`
5. **API Response Parsing** - Use utilities like `extractPayload()`, `extractMetadata()`

---

## 📚 Related Documentation

- `docs/frontdesk/CHATWOOT_CHANNEL_CONNECTION_FLOW.md` - Channel connection flow
- `docs/frontdesk/FRONTEND_CHANNEL_CONNECTION_IMPLEMENTATION.md` - Implementation details
- `src/widgets/frontdesk/providers/chatwoot/README.md` - Code organization
- `src/widgets/frontdesk/providers/chatwoot/PERFORMANCE.md` - Performance patterns
- `src/services/frontdesk/api/chatwoot/README.md` - API service architecture

---

## 🚀 Quick Reference

### Import Pattern

```typescript
// Main service
import { chatwootService } from "@/services/frontdesk";

// Provider hook
import { useChatwootProvider } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider";

// Recoil atoms
import { chatwootConversationsAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
```

### Common Operations

```typescript
// Get profile
const user = await chatwootService.profile.getProfile();

// List conversations
const conversations = await chatwootService.conversations.listConversations(accountId, { status: ["open"], page: 1 });

// Send message
const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: "Hello!",
  message_type: "outgoing",
});

// List inboxes
const inboxes = await chatwootService.inboxes.listAllInboxes();
```

---

**Last Updated:** 2025-11-23
**Maintained By:** FrontDesk Team
