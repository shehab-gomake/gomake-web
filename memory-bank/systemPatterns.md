# System Patterns: gomake-web

## Architecture Overview

FrontDesk follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│  (React Components + Three-Column Layout)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         State Management Layer               │
│        (Recoil Atoms + Selectors)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Services Layer                      │
│    (REST API + WebSocket Services)           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Backend Integration                  │
│      (Messaging-Hub NestJS API)              │
└─────────────────────────────────────────────┘
```

### Three-Column Layout Pattern

Every provider uses consistent layout:

1. **Left Column**: Navigation sidebar (provider selection)
2. **Middle Column**: List panel (conversations/tickets with filters)
3. **Right Column**: Content area (conversation details/message composer)

## Key Technical Decisions

### 1. **Recoil for State Management** ✅

**Decision**: Use Recoil instead of Redux or Context API
**Rationale**:

- Atomic state updates minimize re-renders
- Selector pattern for derived state
- Easy integration with React Suspense
- Less boilerplate than Redux

### 2. **Provider Pattern** ✅

**Decision**: Each communication channel is an isolated provider
**Rationale**:

- Independent development and testing
- Easy to add new providers
- Consistent interface via adapter pattern
- Provider-specific state scoped by naming (`frontdesk.{provider}.*`)

### 3. **Centralized Routing** ✅

**Decision**: Type-safe routing system with deep linking
**Rationale**:

- Single source of truth for routes
- TypeScript ensures compile-time route validation
- Deep linking support for bookmarking conversations
- Programmatic navigation without string literals

### 4. **Optimistic Updates** ✅

**Decision**: Update UI immediately, reconcile with server response
**Rationale**:

- Perceived performance improvement
- Better user experience
- Graceful error handling with rollback

### 5. **WebSocket for Real-time** ✅

**Decision**: Socket.IO for DMs and Tickets, polling for Email
**Rationale**:

- Native real-time support for WebSocket-enabled providers
- Email providers (Gmail) don't offer WebSocket
- Connection state management built into services
- Auto-reconnect logic

## Design Patterns

### 1. **Provider Pattern**

```typescript
interface ProviderHook {
  loading: boolean;
  error: Error | null;
  conversations: Conversation[];
  sendMessage: (content: string) => Promise<void>;
  // ... other actions
}

function useInternalProvider(): ProviderHook;
function useEmailProvider(): ProviderHook;
function useTicketsProvider(): ProviderHook;
```

### 2. **Adapter Pattern**

Normalizes different data structures to unified interface:

```typescript
// Email adapter converts Gmail API responses
class EmailProviderAdapter implements UnifiedProvider {
  adaptConversation(emailThread: GmailThread): Conversation;
  adaptMessage(gmailMessage: GmailMessage): Message;
}
```

### 3. **Service Singleton Pattern**

```typescript
// WebSocket services are singletons
export const messagingService = new MessagingService();
export const ticketSocketService = new TicketSocketService();
```

### 4. **Optimistic Update Pattern**

```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;

  // 1. Optimistic update
  setMessages((prev) => [...prev, { id: tempId, content, status: "pending" }]);

  try {
    // 2. API call
    const message = await api.sendMessage(content);

    // 3. Reconcile
    setMessages((prev) => prev.map((m) => (m.id === tempId ? message : m)));
  } catch (error) {
    // 4. Rollback on failure
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
    showError(error);
  }
};
```

### 5. **Custom Hook Pattern**

Business logic encapsulated in hooks:

```typescript
function useConversationMessages(conversationId: string) {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const loadMessages = useCallback(() => { ... }, [conversationId]);
  const sendMessage = useCallback(() => { ... }, [conversationId]);

  return { messages, loadMessages, sendMessage };
}
```

## Component Relationships

### Provider View Structure

```
{Provider}ProviderView.tsx
├── use{Provider}Provider.ts (hook)
│   ├── Recoil atoms/selectors
│   ├── API service calls
│   └── WebSocket event handlers
├── ThreeColumnLayout
│   ├── NavigationSidebar (shared)
│   ├── {Provider}ListPanel (provider-specific)
│   └── {Provider}DetailView (provider-specific)
└── {Provider}Components/ (provider-specific)
```

### State Flow

```
User Action → Component → Custom Hook → Service → Backend
                ↓              ↓            ↓
           Optimistic     Recoil Atom   WebSocket/REST
              Update        Update        Response
                                ↓
                          Reconciliation
```

## Data Flow

### 1. **Initial Load**

```
Component Mount
  → useEffect calls custom hook
    → Hook calls REST API service
      → Service fetches data
        → Updates Recoil atom
          → Component re-renders
```

### 2. **Real-time Update (WebSocket)**

```
Backend Event
  → WebSocket service receives event
    → Service updates Recoil atom
      → Subscribed components re-render
```

### 3. **User Action (Optimistic)**

```
User clicks "Send"
  → Component calls hook method
    → Hook updates atom (optimistic)
      → Component re-renders immediately
        → Hook calls API
          → API success → reconcile atom
          → API failure → rollback atom
```

## Integration Points

### 1. **Messaging-Hub Backend**

- **Location**: `http://localhost:3000`
- **Authentication**: JWT tokens in headers
- **REST APIs**: CRUD operations for messages, conversations, tickets
- **WebSocket**: Real-time events on `ws://localhost:3000`

### 2. **Recoil State Persistence**

- **Storage**: `localStorage`
- **Keys**: `recoil-persist-*`
- **Data**: User preferences, selected conversations, filters

### 3. **OAuth Providers**

- **Gmail**: OAuth 2.0 flow via backend
- **Redirect**: Backend handles token exchange
- **Frontend**: Displays OAuth button, receives success/failure

### 4. **WebSocket Events**

**Direct Messages (Internal)**

- `message:created`
- `message:updated`
- `message:deleted`
- `typing:start`, `typing:stop`
- `user:online`, `user:offline`

**Tickets**

- 12 events including `ticket:created`, `ticket:updated`, `ticket:assigned`, etc.
- Event filtering by `printHouseId` (tenant isolation)

**Email** (Partial WebSocket support)

- `NEW_EMAIL`: New email received
- `EMAIL_UPDATED`: Email metadata changed
- `EMAIL_READ`: Email marked as read
- `EMAIL_DELETED`: Email deleted
- Events filtered by `accountId`

## Email Provider Integration Pattern

### Complete Email Reading Flow

The Email provider demonstrates full integration with Messaging-Hub backend for reading emails.

#### Architecture Layers

```typescript
┌─────────────────────────────────────────────────────────┐
│             Gmail/Outlook API (External)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Messaging-Hub Backend                       │
│  - Email Sync Worker (BullMQ)                           │
│  - REST API (/email/accounts/:id/messages)              │
│  - WebSocket Events (email:synced)                      │
│  - OAuth Token Management                               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              gomake-web Frontend                         │
│  - EmailApiClient (REST integration)                    │
│  - useEmailConversations (React hook)                   │
│  - Recoil State (emailConversationsState)               │
│  - WebSocket Service (real-time updates)                │
│  - Email Components (UI)                                │
└─────────────────────────────────────────────────────────┘
```

#### Implementation Components

**1. API Client Layer**

```typescript:38:53:src/widgets/frontdesk/providers/email/utils/email-api-client.ts
// REST API integration
async getConversations(accountId: string, params?: {
  limit?: number;
  pageToken?: string;
  query?: string;
}): Promise<ConversationListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.pageToken) queryParams.append("pageToken", params.pageToken);
  if (params?.query) queryParams.append("query", params.query);

  return this.get<ConversationListResponse>(
    `/email/accounts/${accountId}/messages${queryString}`
  );
}
```

**2. State Management Hook**

```typescript:27:61:src/widgets/frontdesk/providers/email/hooks/use-email-conversations.ts
// Combines REST API + WebSocket + Recoil state
const fetchConversations = useCallback(async (reset = false) => {
  if (!selectedAccountId) return;

  setLoading(true);
  try {
    const response = await emailApiClient.getConversations(selectedAccountId, {
      query: options.query,
      limit: options.limit || 20,
      pageToken: reset ? undefined : pageToken || undefined,
    });

    if (reset) {
      setConversations(response.conversations);
    } else {
      setConversations((prev) => [...prev, ...response.conversations]);
    }

    setPageToken(response.nextPageToken || null);
    setHasMore(!!response.nextPageToken);
  } catch (err) {
    setError(err.message || "Failed to fetch conversations");
  } finally {
    setLoading(false);
  }
}, [selectedAccountId, options, pageToken]);
```

**3. Real-time Updates**

```typescript:178:207:src/widgets/frontdesk/providers/email/hooks/use-email-conversations.ts
// WebSocket integration for real-time email updates
useEffect(() => {
  if (!selectedAccountId) return;

  if (!emailWebSocketService.isInitialized()) {
    emailWebSocketService.initialize();
  }

  const unsubscribe = emailWebSocketService.subscribe((event) => {
    if (event.accountId !== selectedAccountId) return;

    switch (event.type) {
      case 'NEW_EMAIL':
        handleNewEmail(event.data);
        break;
      case 'EMAIL_UPDATED':
        handleEmailUpdated(event.data);
        break;
      case 'EMAIL_READ':
        handleEmailRead(event.data);
        break;
      case 'EMAIL_DELETED':
        handleEmailDeleted(event.data);
        break;
    }
  });

  return () => unsubscribe();
}, [selectedAccountId]);
```

#### Backend API Endpoints Used

| Endpoint                                    | Method | Purpose                       | Hook Usage                     |
| ------------------------------------------- | ------ | ----------------------------- | ------------------------------ |
| `/email/accounts`                           | GET    | List connected accounts       | `useEmailAccounts()`           |
| `/email/accounts/:id/messages`              | GET    | Get conversations (paginated) | `useEmailConversations()`      |
| `/email/accounts/:id/conversations/:cid`    | GET    | Get conversation details      | `useFetchEmailConversation()`  |
| `/email/accounts/:id/labels`                | GET    | Get folders/labels            | `useEmailLabels()`             |
| `/email/accounts/:id/messages/:mid/read`    | POST   | Mark as read                  | `markAsRead()` action          |
| `/email/accounts/:id/messages/:mid/archive` | POST   | Archive message               | `archiveConversation()` action |
| `/email/accounts/:id/send`                  | POST   | Send email                    | `useEmailSend()`               |
| `/auth/oauth/google`                        | GET    | Get OAuth URL                 | `useEmailAuth()`               |

#### Key Features

**Pagination & Infinite Scroll**

- Uses `pageToken` from backend for Gmail/Outlook pagination
- `loadMore()` function fetches next page
- State merges new results with existing conversations

**Optimistic Updates**

- Mark as read updates UI immediately
- Rolls back on API error
- Maintains consistent state

**Real-time Sync**

- WebSocket listens for `NEW_EMAIL` events
- Adds new emails to conversation list
- Prevents duplicates by checking conversation ID

**Error Handling**

- Retries on 5xx errors (3 attempts)
- Exponential backoff
- User-friendly error messages

**Multi-Account Support**

- Switches conversations when account changes
- Maintains separate state per account
- Account selector in sidebar

---

_Last Updated: October 20, 2025_
_Status: Mature Architecture_
