# Chatwoot Test Infrastructure - Visual Structure

## Project Tree

```
gomake-web/
│
├── chatwoot/                                    # OpenAPI Generated Client (existing)
│   ├── api.ts
│   ├── configuration.ts
│   └── index.ts
│
├── src/
│   ├── services/frontdesk/
│   │   ├── api/
│   │   │   ├── chatwoot.service.ts             # ✨ NEW - Service Layer
│   │   │   ├── index.ts                        # ✏️ MODIFIED - Export chatwoot service
│   │   │   ├── direct-messages.service.ts      # (existing)
│   │   │   └── tickets.service.ts              # (existing)
│   │   │
│   │   └── websocket/                          # (existing - unchanged)
│   │
│   ├── widgets/
│   │   ├── header/
│   │   │   └── header.tsx                      # ✏️ MODIFIED - Added test button
│   │   │
│   │   └── frontdesk/
│   │       ├── frontdesk-widget.tsx            # (existing - unchanged)
│   │       └── providers/
│   │           ├── chatwoot-test/              # ✨ NEW - Test Provider
│   │           │   └── chatwoot-test-page.tsx
│   │           ├── internal/                   # (existing - unchanged)
│   │           ├── email/                      # (existing - unchanged)
│   │           ├── whatsapp/                   # (existing - unchanged)
│   │           └── tickets/                    # (existing - unchanged)
│   │
│   └── pages/frontdesk/
│       ├── chatwoot-test/                      # ✨ NEW - Route Definition
│       │   └── index.page.tsx
│       ├── [frontdeskRoute]/                   # (existing - unchanged)
│       └── index.page.tsx                      # (existing - unchanged)
│
├── FRONTDESK_MIGRATION_PLAN.md                 # (existing - reference)
├── CHATWOOT_TEST_SETUP.md                      # ✨ NEW - Documentation
└── CHATWOOT_TEST_STRUCTURE.md                  # ✨ NEW - This file
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Top Navigation Bar (header.tsx)               │ │
│  │  [FrontDesk] [🐛 Chatwoot Test] [Notifications] ...   │ │
│  └─────────────────────┬──────────────────────────────────┘ │
│                        │ Click                               │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   /frontdesk/chatwoot-test (index.page.tsx)           │ │
│  │   Wraps chatwoot-test-page.tsx in CustomerAuthLayout  │ │
│  └─────────────────────┬──────────────────────────────────┘ │
│                        │ Renders                             │
│                        ▼                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      Chatwoot Test Page (chatwoot-test-page.tsx)      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Button  │  │  Button  │  │  Button  │  ...        │ │
│  │  │ List Conv│  │List Inbox│  │List Cont.│            │ │
│  │  └─────┬────┘  └────┬─────┘  └────┬─────┘            │ │
│  │        │             │             │                   │ │
│  │        ▼             ▼             ▼                   │ │
│  │  ┌────────────────────────────────────────────┐       │ │
│  │  │        Test Result Display Area            │       │ │
│  │  │  [Success/Error/Loading States + Console]  │       │ │
│  │  └────────────────────────────────────────────┘       │ │
│  └─────────────────────┬──────────────────────────────────┘ │
└────────────────────────┼────────────────────────────────────┘
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Service Layer (chatwoot.service.ts)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  getChatwootConversationsApi()                       │  │
│  │  getChatwootMessagesApi()                            │  │
│  │  getChatwootContactsApi()                            │  │
│  │  getChatwootInboxesApi()                             │  │
│  │                                                       │  │
│  │  Configuration:                                       │  │
│  │  - basePath: NEXT_PUBLIC_CHATWOOT_API_URL           │  │
│  │  - auth: Bearer token from getUserToken()           │  │
│  └────────────────────┬─────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                         │ Uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      OpenAPI Generated Client (chatwoot/)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ConversationsApi                                     │  │
│  │  MessagesApi                                          │  │
│  │  ContactsApi                                          │  │
│  │  InboxesApi                                           │  │
│  │  Configuration                                        │  │
│  └────────────────────┬─────────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 Chatwoot Backend API                        │
│                 (NEXT_PUBLIC_CHATWOOT_API_URL)              │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
CustomerAuthLayout
└── ChatwootTestPage
    ├── Paper (MUI Container)
    │   ├── Typography (Title)
    │   ├── Alert (Info - Environment Details)
    │   ├── Stack (Test Buttons Container)
    │   │   ├── Box (Test: List Conversations)
    │   │   │   ├── Button
    │   │   │   └── Alert (Result Display)
    │   │   ├── Box (Test: List Inboxes)
    │   │   │   ├── Button
    │   │   │   └── Alert (Result Display)
    │   │   ├── Box (Test: List Contacts)
    │   │   │   ├── Button
    │   │   │   └── Alert (Result Display)
    │   │   ├── Box (Test: Get Messages)
    │   │   │   ├── Button
    │   │   │   └── Alert (Result Display)
    │   │   └── Box (Clear Results)
    │   │       └── Button
    │   └── Alert (Warning - Expected Behavior)
    └── State Management (useState)
        └── results: Record<string, TestResult>
```

## API Methods Exposed

### chatwoot.service.ts

```typescript
// Getter functions (recommended)
export const getChatwootConversationsApi(): ConversationsApi
export const getChatwootMessagesApi(): MessagesApi
export const getChatwootContactsApi(): ContactsApi
export const getChatwootInboxesApi(): InboxesApi

// Singleton instances (for convenience)
export const chatwootConversationsApi: ConversationsApi
export const chatwootMessagesApi: MessagesApi
export const chatwootContactsApi: ContactsApi
export const chatwootInboxesApi: InboxesApi

// Utility
export const resetChatwootApiInstances(): void
```

### Test Page Methods

```typescript
// Each test function follows this pattern:
const testEndpoint = async () => {
  1. Set loading state
  2. Call Chatwoot API via service
  3. Log response to console
  4. Update UI with success/error state
}

// Available tests:
- testListConversations()    → GET /api/v1/accounts/{accountId}/conversations
- testListInboxes()           → GET /api/v1/accounts/{accountId}/inboxes
- testListContacts()          → GET /api/v1/accounts/{accountId}/contacts
- testGetConversationMessages() → GET /api/v1/accounts/{accountId}/conversations/{conversationId}/messages
```

## Key Design Decisions

### 1. **Isolation**
- Separate route (`/frontdesk/chatwoot-test`)
- Separate provider directory (`chatwoot-test/`)
- No modifications to existing providers
- No shared state with current FrontDesk

### 2. **Simplicity**
- No complex UI components
- Basic Material-UI elements only
- Console logging for detailed inspection
- Minimal state management (useState)

### 3. **Testability**
- Each endpoint has dedicated test button
- Clear success/error feedback
- Timestamps for each test
- Environment info displayed

### 4. **Extensibility**
- Easy to add new test methods
- Service layer ready for migration
- Singleton pattern for API instances
- Environment-based configuration

## Visual Representation of Header Changes

```
Before:
┌─────────────────────────────────────────────────────────────┐
│ [GoMake Logo]  ...   [FrontDesk] [Notifications] [Profile]  │
└─────────────────────────────────────────────────────────────┘

After:
┌─────────────────────────────────────────────────────────────┐
│ [GoMake Logo]  ...   [FrontDesk] [🐛 Test] [Notifications] [Profile]  │
└─────────────────────────────────────────────────────────────┘
                                      ↑
                            Red bug icon - Chatwoot Test
```

## State Machine for Test Execution

```
┌──────────┐
│   IDLE   │
└────┬─────┘
     │ User clicks button
     ▼
┌──────────┐
│ LOADING  │ ← Shows CircularProgress
└────┬─────┘
     │ API Response
     ├─────────┬─────────┐
     ▼         ▼         ▼
┌─────────┐ ┌─────┐ ┌───────┐
│ SUCCESS │ │ERROR│ │ IDLE  │
└─────────┘ └─────┘ └───────┘
     │         │
     │  "Clear Results" clicked
     └─────────┴───────────────→ IDLE
```

## Integration Points

### Existing Systems Used:
1. **Authentication**: `getUserToken()` from `src/services/storage-data.ts`
2. **Layout**: `CustomerAuthLayout` from `src/layouts`
3. **Navigation**: Header component (`src/widgets/header/header.tsx`)
4. **Routing**: Next.js Pages Router

### New Systems Created:
1. **Service Layer**: Chatwoot API configuration and instances
2. **Test UI**: Minimal testing interface
3. **Route**: Dedicated test page route

### Systems NOT Modified:
1. Existing FrontDesk providers (Internal, Email, WhatsApp, Tickets)
2. Recoil state atoms
3. WebSocket services
4. Direct messages implementation

## Summary

This structure provides:
- ✅ **Clean separation** from existing code
- ✅ **Simple testing interface** with zero UI complexity
- ✅ **Foundation for migration** (Phase 1 complete)
- ✅ **Easy to extend** with more test cases
- ✅ **Easy to remove** when migration is complete


