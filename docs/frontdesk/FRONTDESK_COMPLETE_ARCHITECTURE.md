# Frontdesk Feature - Complete Architecture & Summary

**Last Updated:** 2025-01-XX  
**Purpose:** Comprehensive overview of the Frontdesk feature across all three projects

---

## Table of Contents

1. [Overview](#overview)
2. [Three-Project Architecture](#three-project-architecture)
3. [Frontdesk Feature Scope](#frontdesk-feature-scope)
4. [Data Flow & Integration](#data-flow--integration)
5. [Key Components](#key-components)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Common Patterns & Best Practices](#common-patterns--best-practices)
9. [Known Issues & Limitations](#known-issues--limitations)
10. [Development Guidelines](#development-guidelines)

---

## Overview

**Frontdesk** is a unified messaging hub feature within the GoMake MIS system that consolidates multiple communication channels (Chatwoot, Email, WhatsApp, Direct Messages) into a single interface. It enables customer support teams to manage conversations, contacts, and team collaboration from one place.

### Key Characteristics

- **Multi-Channel Support:** Chatwoot (primary), Email (Gmail/Outlook), WhatsApp, Internal DMs
- **Multi-Account:** Support for multiple Chatwoot accounts (PrintHouses)
- **Real-Time Updates:** WebSocket integration for live conversation updates
- **Unified Interface:** Three-column layout with navigation, conversation list, and content area
- **Role-Based Access:** Admin, Agent, and Employee roles with different permissions

---

## Three-Project Architecture

The Frontdesk feature spans **three separate projects** that work together:

### 1. **gomake-web** (Frontend Application)

**Location:** `/Users/mohnadabdalhadi/Documents/GitHub/gomake-web`  
**Technology:** Next.js 13.5.4, React 18, TypeScript, Recoil  
**Role:** Frontend UI and user experience

**Key Responsibilities:**
- Frontdesk UI components and views
- State management (Recoil atoms/selectors)
- API service layer (HTTP client for Chatwoot)
- Provider implementations (Chatwoot, Email, WhatsApp, Internal)
- Routing and navigation
- Real-time WebSocket client

**Frontdesk Location:** `src/widgets/frontdesk/`

---

### 2. **messaging-hub-v2** (NestJS Proxy Service)

**Location:** `/Users/mohnadabdalhadi/Documents/GitHub/messaging-hub-v2`  
**Technology:** NestJS, TypeScript  
**Role:** Proxy between gomake-web and Chatwoot backend

**Key Responsibilities:**
- **JWT Validation:** Validates GoMake JWT tokens via GoMake Users API
- **Auto-Provisioning:** Automatically creates Chatwoot accounts/users on first request
- **Path Transformation:** Transforms frontend URLs to Chatwoot API format
- **Account Context:** Injects `accountId` from JWT into all requests
- **Webhook Processing:** Receives and processes Chatwoot webhook events
- **Contact Enrichment:** Enriches Chatwoot contacts with GoMake customer data
- **Auto-Assignment:** Auto-assigns conversations to agents based on GoMake agent_id

**Flow:**
```
gomake-web → JWT Bearer Token → messaging-hub-v2 → Chatwoot Backend
```

**Key Files:**
- `src/chatwoot/chatwoot.controller.ts` - Main proxy controller (`@All('api/*')`)
- `src/chatwoot/chatwoot-provisioning.service.ts` - Auto-provisioning logic
- `src/chatwoot/chatwoot.service.ts` - HTTP forwarding to Chatwoot
- `src/chatwoot/webhook.service.ts` - Webhook event processing

---

### 3. **Messaging-Hub** (Internal Messaging Service)

**Location:** `/Users/mohnadabdalhadi/Documents/GitHub/Messaging-Hub`  
**Technology:** NestJS, PostgreSQL, Prisma, BullMQ, Redis, Socket.IO  
**Role:** Internal messaging infrastructure (separate from Chatwoot)

**Key Responsibilities:**
- **Direct Messages:** Internal 1:1 and group messaging
- **Email Integration:** Gmail/Outlook OAuth integration
- **Channels:** Team communication channels
- **Ticketing System:** Customer support ticket management
- **WebSocket Server:** Real-time messaging via Socket.IO
- **Background Jobs:** Email sync, message delivery via BullMQ queues

**Important Note:** Messaging-Hub is **separate** from the Chatwoot Frontdesk feature. It provides internal messaging capabilities (DMs, Email, Channels) that may be used alongside Chatwoot, but it's not directly involved in the Chatwoot integration flow.

**Relationship to Frontdesk:**
- Messaging-Hub handles **internal** messaging features
- Chatwoot (via messaging-hub-v2) handles **customer-facing** support conversations
- Both may coexist in the Frontdesk UI but serve different purposes

---

## Frontdesk Feature Scope

### ✅ Implemented Features

#### Chatwoot Provider (Primary)
- **Profile Management:** User profile, account switching, multi-account support
- **Conversation Management:** List, filter, search, pagination, labels, status changes, assignment
- **Message Operations:** View, send, delete messages, attachments, translations
- **Inbox Management:** List, create, update inboxes, channel support, webhooks, agents
- **Contact Management:** List, search, filter, create, update contacts, customer linking
- **Notifications:** Notification list, mark read, unread count, snooze
- **Agent Management:** List, update agents, availability status, inbox assignments
- **Team Management:** List, create, update teams, member management
- **Label Management:** List, create, update, delete labels
- **OAuth Integration:** Gmail/Outlook channel authorization
- **Settings UI:** Account settings, inbox settings (6 tabs), profile settings
- **Views:** Dashboard, My Inbox, All Conversations, Mentions, Unattended, Channels, Settings, OAuth Callback, Webhook Testing

#### Custom Attributes Features
- **Auto-Linking Customers:** Automatically links GoMake customers to conversations
- **Search by Customer Code:** Search contacts by customer code or name
- **Contact Enrichment:** Enriches Chatwoot contacts with GoMake customer data via webhooks

### 📋 Available for Enhancement

- **Real-time Updates:** WebSocket not fully implemented (use REST polling)
- **More API Endpoints:** Teams, agents, automation, etc.
- **Advanced Features:** Bulk actions, advanced filtering
- **Performance:** Virtual scrolling, fetch deduplication (partially implemented)
- **Filter by Agent:** Requires backend support for filtering by contact custom attributes

---

## Data Flow & Integration

### Complete Request Flow

```
┌─────────────┐
│ gomake-web │
│  (Frontend)│
└──────┬──────┘
       │
       │ 1. HTTP Request
       │    POST /api/accounts/conversations
       │    Authorization: Bearer <GoMake-JWT>
       │
       ▼
┌──────────────────┐
│ messaging-hub-v2 │
│  (NestJS Proxy)  │
└──────┬───────────┘
       │
       │ 2. Validate JWT
       │    → GoMake Users API
       │    → Extract: userId, employeeId, printHouseId
       │
       │ 3. Auto-Provision
       │    → Check Chatwoot account exists (by printHouseId)
       │    → Create account/user if needed
       │    → Register webhooks
       │
       │ 4. Transform Path
       │    /api/accounts/conversations
       │    → /api/v1/accounts/{accountId}/conversations
       │
       │ 5. Forward Request
       │    → Chatwoot Backend (Rails API)
       │    → With Chatwoot access token
       │
       ▼
┌──────────────┐
│   Chatwoot   │
│  (Rails API) │
└──────┬───────┘
       │
       │ 6. Process Request
       │    → Execute business logic
       │    → Query database
       │
       │ 7. Return Response
       │    → { payload: [...], meta: {...} }
       │
       ▼
┌──────────────────┐
│ messaging-hub-v2 │
│  (NestJS Proxy)  │
└──────┬───────────┘
       │
       │ 8. Return Response
       │    → Pass through to frontend
       │
       ▼
┌─────────────┐
│ gomake-web  │
│  (Frontend) │
└─────────────┘
       │
       │ 9. Extract Payload
       │    → extractPayload(response)
       │    → Update Recoil state
       │    → Render UI
```

### URL Pattern Transformation

**Critical Rule:** gomake-web sends URLs **WITHOUT** `/v1/` and **WITHOUT** `accountId`. The proxy handles transformation automatically.

**Frontend Pattern:**
```typescript
// ✅ CORRECT
GET /api/accounts/conversations
GET /api/accounts/conversations/{id}/messages
GET /api/accounts/profile  // Exception: no accountId needed

// ❌ WRONG
GET /api/v1/accounts/conversations  // Don't include /v1/
GET /api/accounts/{accountId}/conversations  // Don't include accountId
```

**Proxy Transformation:**
```
Frontend:  /api/accounts/conversations
           ↓
Proxy:     /api/v1/accounts/{accountId}/conversations
           ↓
Chatwoot:  Receives properly formatted request
```

**Exception - Profile Endpoint:**
```
Frontend:  /api/accounts/profile
           ↓
Proxy:     /api/v1/profile  (no accountId)
```

### Domain Mapping

| GoMake Term | Chatwoot Term | Notes |
|------------|---------------|-------|
| PrintHouse | Account | 1:1 mapping, stored in `accounts.printhouse_id` |
| Admin | Administrator | Full access to account |
| Employee | Agent | Can be assigned to conversations |
| Customer | Contact | Customer data enriched with GoMake custom attributes |

### Auto-Provisioning Flow

1. **First Request:** User makes any API request with valid GoMake JWT
2. **JWT Validation:** Proxy validates token and extracts user data
3. **Account Lookup:** Searches Chatwoot account by `printHouseId` (custom Platform API endpoint)
4. **Account Creation:** If not found, creates Chatwoot account with `printHouseId` in custom_attributes
5. **User Creation:** Creates Chatwoot user with GoMake custom attributes:
   - `gomakeUserId`
   - `gomakeEmployeeId`
   - `gomakeUserEmail`
   - `gomakeUserPhone`
6. **Webhook Registration:** Automatically registers webhooks for the account
7. **Response:** Returns response with proper `accountId` injected

**User Credentials (Auto-Generated):**
- Email: `{userId}@{printHouseId}.net`
- Password: `O1m2a3r4!@` (unified for all)
- Role: Administrator in their PrintHouse's Chatwoot account

### Webhook Flow

**Webhook Endpoint:** `POST /api/chatwoot/webhook`

**Subscribed Events:**
- `conversation_created` - New conversation started
- `conversation_updated` - Conversation updated
- `message_created` - New message in conversation

**Webhook Features:**

1. **Contact Enrichment:**
   - Extracts contact email/phone from event
   - Searches GoMake for matching customer
   - Updates Chatwoot contact with GoMake custom attributes:
     - `gomake_customer_id`
     - `gomake_contact_id`
     - `gomake_client_code`
     - `gomake_agent_id`
     - `gomake_is_main_contact`

2. **Auto-Assignment:**
   - If contact has `gomake_agent_id`
   - Finds Chatwoot agent with matching `gomakeEmployeeId`
   - Auto-assigns conversation to that agent

---

## Key Components

### Frontend Structure (gomake-web)

```
src/widgets/frontdesk/
├── frontdesk-widget.tsx          # Main entry point and routing
├── providers/
│   ├── chatwoot/                  # Chatwoot provider (PRIMARY)
│   │   ├── chatwoot-provider-view.tsx    # Main router (6+ views)
│   │   ├── components/           # 40+ UI components
│   │   │   ├── conversation-list/
│   │   │   ├── reply-composer/
│   │   │   ├── dashboard/
│   │   │   ├── filters/
│   │   │   └── ...
│   │   ├── hooks/                 # 30+ React hooks
│   │   │   ├── core/             # Base hooks
│   │   │   ├── use-chatwoot-provider.ts      # Main orchestrator
│   │   │   ├── use-chatwoot-conversations.ts
│   │   │   ├── use-chatwoot-messages.ts
│   │   │   └── ...
│   │   ├── views/                 # 9 distinct views
│   │   │   ├── dashboard-view.tsx
│   │   │   ├── my-inbox-view.tsx
│   │   │   ├── all-conversations-view.tsx
│   │   │   ├── settings-view.tsx
│   │   │   └── ...
│   │   ├── utils/                 # Utility functions
│   │   └── config/                # Configuration
│   ├── email/                     # Email provider (Gmail/Outlook)
│   ├── whatsapp/                  # WhatsApp provider
│   ├── internal/                  # Direct Messages (WebSocket)
│   └── unified/                   # Unified inbox
├── components/                    # Shared UI components
├── hooks/                         # Custom React hooks
├── controllers/                   # Business logic and navigation
└── design-system/                 # Design system tokens and components

src/services/frontdesk/api/chatwoot/
├── chatwoot.service.ts            # Main aggregator service
├── chatwoot-http-client.ts        # Base HTTP client
├── services/                      # 13 API services
│   ├── chatwoot-profile.service.ts
│   ├── chatwoot-conversations.service.ts
│   ├── chatwoot-messages.service.ts
│   ├── chatwoot-inboxes.service.ts
│   ├── chatwoot-contacts.service.ts
│   ├── chatwoot-notifications.service.ts
│   ├── chatwoot-agents.service.ts
│   ├── chatwoot-teams.service.ts
│   ├── chatwoot-labels.service.ts
│   ├── chatwoot-oauth.service.ts
│   └── ... (3 helper services)
└── types/                         # TypeScript types

src/store/frontdesk/
├── atoms/
│   ├── chatwoot.atoms.ts          # Core Chatwoot atoms
│   ├── chatwoot-normalized.atoms.ts  # Normalized data
│   └── chatwoot-shared.atoms.ts   # Shared resources
├── selectors/
│   ├── chatwoot-conversations.selectors.ts
│   └── chatwoot-dashboard.selectors.ts
└── effects/
    ├── chatwoot-websocket.effect.ts
    └── chatwoot-persistence.effect.ts
```

### Proxy Structure (messaging-hub-v2)

```
src/
├── auth/                           # GoMake JWT validation
│   ├── jwt-auth.guard.ts
│   └── auth.service.ts
├── chatwoot/
│   ├── chatwoot.controller.ts     # Main proxy (@All('api/*'))
│   ├── chatwoot.service.ts         # HTTP forwarding
│   ├── chatwoot-provisioning.service.ts  # Auto-provision logic
│   ├── chatwoot-platform.service.ts      # Platform API operations
│   ├── chatwoot-mapper.service.ts        # Credential generation
│   └── webhook.service.ts         # Webhook processing
└── api/chatwoot/                  # TypeScript SDK (31 API classes)
```

---

## State Management

### Recoil Architecture

**Pattern:** RequestState combines data, loading, and error in one atom

```typescript
import { createRequestState, DEFAULT_TTL } from "@/store/frontdesk";

const resourceAtom = atom<RequestState<MyData[]>>({
  key: "resource",
  default: createRequestState<MyData[]>(DEFAULT_TTL.STANDARD),
});
```

### Key Atoms

- `chatwootProfileAtom` - User profile data
- `chatwootSelectedAccountAtom` - Currently selected account
- `chatwootConversationsAtom` - Conversation list
- `chatwootConversationByIdAtom` - Normalized conversation data (atom family)
- `chatwootInboxesAtom` - Inbox list
- `chatwootContactsAtom` - Contact list
- `chatwootNotificationsAtom` - Notification list

### Key Selectors

- `chatwootConversationsForFilterSelector` - Filtered conversations
- `conversationsByStatusSelector` - Conversations by status
- `dashboardOverviewStatsSelector` - Dashboard statistics

### State Management Patterns

1. **Fetch Deduplication:** Use `useFetchLock` hook to prevent duplicate API calls
2. **LRU Cache:** Automatic cache eviction with configurable limits
3. **Data Normalization:** Atom families for efficient updates
4. **Persistence:** Critical state persisted to localStorage
5. **WebSocket Integration:** Atom effects for WebSocket lifecycle

---

## API Integration

### Main Service Usage

```typescript
import { chatwootService } from "@/services/frontdesk";

// Profile (no accountId needed)
const user = await chatwootService.profile.getProfile();

// Conversations
const conversations = await chatwootService.conversations.listConversations(accountId, {
  status: ["open"],
  page: 1
});

// Messages
const messages = await chatwootService.messages.listMessages(accountId, conversationId);

// Send message
const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: "Hello!",
  message_type: "outgoing"
});

// Contacts
const contacts = await chatwootService.contacts.listContacts(accountId, { page: 1 });

// Inboxes
const inboxes = await chatwootService.inboxes.listAllInboxes();
```

### API Response Structure

**Chatwoot Response Format:**
```json
{
  "payload": [...],  // Data array
  "meta": {
    "count": 100,
    "current_page": 1,
    "per_page": 20
  }
}
```

**Frontend Extraction:**
```typescript
import { extractPayload, extractMetadata } from "@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils";

const response = await chatwootService.conversations.listConversations(accountId);
const conversations = extractPayload(response);  // Extract payload array
const metadata = extractMetadata(response);      // Extract metadata
```

### Available API Groups

**✅ Implemented (10 Main Services):**
1. Profile - User profile endpoints
2. Conversations - Conversation management
3. Contacts - Contact management
4. Messages - Message operations
5. Inboxes - Inbox/channel management
6. Agents - Agent/user management
7. Teams - Team management
8. Labels - Label management
9. Notifications - Notification operations
10. OAuth - OAuth authorization (Gmail/Outlook)

**🔧 Helper Services (3 Services):**
1. Contact Resolution - Resolve contacts by email/phone
2. Inbox Resolution - Resolve inboxes by channel type
3. Conversation Composer - Create conversations with validation

---

## Common Patterns & Best Practices

### 1. URL Pattern Rules

**✅ ALWAYS:**
```typescript
// Use direct paths without /v1/ and without accountId
return await this.get("/api/accounts/conversations");
return await this.get(`/api/accounts/conversations/${id}/messages`);
```

**❌ NEVER:**
```typescript
// Don't include /v1/
return await this.get("/api/v1/accounts/conversations");  // ❌

// Don't include accountId in URL
return await this.get(`/api/accounts/${accountId}/conversations`);  // ❌
```

### 2. Account ID Checking

```typescript
// Always check accountId before making requests
if (!accountId) return;
const data = await chatwootService.conversations.listConversations(accountId);
```

### 3. Response Extraction

```typescript
// Always extract payload from Chatwoot responses
import { extractPayload } from "@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils";
const conversations = extractPayload(response);
```

### 4. Filter Management

```typescript
// Use stable filter keys for caching
import { createFilterKey } from "@/widgets/frontdesk/providers/chatwoot/utils/filter-utils";
const filterKey = useMemo(() => createFilterKey(filters), [filters]);
```

### 5. Fetch Deduplication

```typescript
// Prevent duplicate API calls
import { useFetchLock, FETCH_LOCK_KEYS } from "./core/use-fetch-lock";
const { acquireLock, releaseLock } = useFetchLock();

if (!acquireLock(FETCH_LOCK_KEYS.CONVERSATIONS)) return;
try {
  const data = await fetchData();
} finally {
  releaseLock(FETCH_LOCK_KEYS.CONVERSATIONS);
}
```

### 6. Design System Usage

**✅ ALWAYS Use Design System:**
```typescript
import { colorTokens, semanticSpacing, radiusTokens } from "@/widgets/frontdesk/design-system";

backgroundColor: colorTokens.neutral[500];
padding: semanticSpacing.component.md;
borderRadius: radiusTokens.md;
```

**❌ NEVER Use Deprecated Patterns:**
```typescript
// Don't use old theme hooks
import { useGomakeTheme } from "@/hooks/use-gomake-thme";  // ❌
const { neutralColor } = useGomakeTheme();
backgroundColor: neutralColor(500);  // ❌
```

### 7. Error Handling

```typescript
try {
  const data = await chatwootService.conversations.listConversations(accountId);
} catch (error) {
  // Handle error with user-friendly message
  console.error("Failed to load conversations:", error);
  showErrorMessage("Unable to load conversations. Please try again.");
}
```

### 8. Loading States

```typescript
// Always show loading states for async operations
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await api.fetchData();
    // Handle success
  } finally {
    setLoading(false);
  }
};
```

---

## Known Issues & Limitations

### 1. Real-Time Updates

**Issue:** WebSocket not fully implemented for real-time conversation updates  
**Workaround:** Use REST polling for updates  
**Status:** Documented for future implementation

### 2. Filter by Agent

**Issue:** Cannot filter conversations by GoMake agent_id (stored in contact custom attributes)  
**Reason:** Chatwoot API doesn't support filtering by contact custom attributes  
**Workaround:** Client-side filtering (limited to loaded conversations)  
**Future:** Requires Chatwoot backend API enhancement

### 3. Mute/Unmute Conversations

**Issue:** Mute/unmute endpoints not exposed by messaging-hub-v2 proxy  
**Status:** Blocked - waiting for proxy to expose endpoints  
**Location:** `use-conversation-utility-actions.ts`

### 4. Performance with Large Datasets

**Issue:** Conversation list may be slow with thousands of conversations  
**Workaround:** Pagination, virtual scrolling (partially implemented)  
**Future:** Full virtual scrolling implementation

### 5. WebSocket Reconnection

**Issue:** WebSocket reconnection logic may need improvement  
**Status:** Basic reconnection implemented, may need enhancement

---

## Development Guidelines

### When Adding New Features

1. **Check Existing Patterns:** Review similar implementations in `src/widgets/frontdesk/providers/chatwoot/`
2. **Use Base Hooks:** Extend `useChatwootDataFetch` or `useChatwootFilters` instead of reimplementing
3. **Follow URL Pattern:** Never include `/v1/` or `accountId` in URLs
4. **Extract Payload:** Always use `extractPayload()` for API responses
5. **Use Design System:** Use design system tokens, not deprecated theme hooks
6. **Handle Errors:** Always provide user-friendly error messages
7. **Show Loading States:** Always show loading indicators for async operations

### Code Organization

- **Components:** `src/widgets/frontdesk/providers/chatwoot/components/`
- **Hooks:** `src/widgets/frontdesk/providers/chatwoot/hooks/`
- **Services:** `src/services/frontdesk/api/chatwoot/services/`
- **Types:** `src/services/frontdesk/api/chatwoot/types/`
- **Utils:** `src/widgets/frontdesk/providers/chatwoot/utils/`
- **State:** `src/store/frontdesk/atoms/` and `selectors/`

### Testing Checklist

- [ ] All TypeScript errors resolved (no `any` types)
- [ ] Error handling implemented for all async operations
- [ ] Loading states added for all async operations
- [ ] Empty states handled (null, undefined, empty arrays)
- [ ] Memory leaks prevented (cleanup in useEffect)
- [ ] No console.log statements (use logger)
- [ ] Proper error messages for users
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Performance optimized (useMemo, useCallback, React.memo)
- [ ] Design system used (not deprecated theme hooks)
- [ ] URL patterns correct (no `/v1/`, no `accountId`)
- [ ] Payload extraction used for API responses

### Quick Reference

**Import Patterns:**
```typescript
// Main service
import { chatwootService } from "@/services/frontdesk";

// Provider hook
import { useChatwootProvider } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-provider";

// Recoil atoms
import { chatwootConversationsAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";

// Utilities
import { extractPayload } from "@/widgets/frontdesk/providers/chatwoot/utils/api-response-utils";
import { createFilterKey } from "@/widgets/frontdesk/providers/chatwoot/utils/filter-utils";
```

**Common Operations:**
```typescript
// Get profile
const user = await chatwootService.profile.getProfile();

// List conversations
const conversations = await chatwootService.conversations.listConversations(accountId, {
  status: ["open"],
  page: 1
});

// Send message
const message = await chatwootService.messages.createMessage(accountId, conversationId, {
  content: "Hello!",
  message_type: "outgoing"
});

// List inboxes
const inboxes = await chatwootService.inboxes.listAllInboxes();
```

---

## Related Documentation

### Architecture & Overview
- `docs/frontdesk/FRONTDESK_CHATWOOT_ARCHITECTURE.md` - Complete architecture guide
- `docs/frontdesk/README.md` - Documentation index

### Implementation Guides
- `docs/frontdesk/CHATWOOT_CHANNEL_CONNECTION_FLOW.md` - Channel connection flow
- `docs/frontdesk/FRONTEND_CHANNEL_CONNECTION_IMPLEMENTATION.md` - Frontend implementation
- `docs/frontdesk/CUSTOM_ATTRIBUTES_FEATURES_IMPLEMENTATION.md` - Custom attributes features

### Code Documentation
- `src/widgets/frontdesk/providers/chatwoot/README.md` - Code organization
- `src/services/frontdesk/api/chatwoot/README.md` - API service architecture
- `src/store/frontdesk/README.md` - State management guide

### Proxy Documentation
- `messaging-hub-v2/CLAUDE.md` - Proxy architecture and API documentation
- `messaging-hub-v2/README.md` - Proxy service overview

### Reference
- Chatwoot Frontend Demo: `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`
- Chatwoot Backend: `/Users/omarsabbah/Desktop/messaging/chatwoot`

---

## Summary

The Frontdesk feature is a comprehensive unified messaging hub that integrates Chatwoot (customer support platform) with the GoMake MIS system. It spans three projects:

1. **gomake-web** - Frontend UI and user experience
2. **messaging-hub-v2** - NestJS proxy handling JWT validation, auto-provisioning, and path transformation
3. **Messaging-Hub** - Internal messaging service (separate from Chatwoot)

The architecture follows a clear separation of concerns with the proxy handling all Chatwoot integration complexity, allowing the frontend to focus on user experience. Key patterns include URL transformation, auto-provisioning, webhook processing, and comprehensive state management with Recoil.

**Key Takeaways:**
- Frontend sends URLs without `/v1/` and without `accountId` - proxy handles transformation
- Auto-provisioning creates Chatwoot accounts/users automatically on first request
- Webhooks enrich contacts with GoMake customer data and auto-assign conversations
- State management uses RequestState pattern with Recoil atoms and selectors
- Design system tokens must be used instead of deprecated theme hooks

---

**Document Status:** Complete  
**Maintained By:** FrontDesk Team  
**Last Review:** 2025-01-XX

