# CLAUDE_FRONTDESK.md

**FrontDesk-Only Development Context** — Strict scope isolation for the unified messaging hub feature.

---

## 🎯 SCOPE: FrontDesk Feature ONLY

### ✅ Allowed Paths
```
src/widgets/frontdesk/          # All FrontDesk UI components (222 files)
src/store/frontdesk/             # FrontDesk Recoil state
src/services/api-service/frontdesk/  # FrontDesk REST APIs
src/services/websocket/messaging-service.ts  # WebSocket singleton for DMs
docs/frontdesk/                  # FrontDesk documentation
```

### 📖 Backend Documentation (ALWAYS CONSULT)
```
/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/
├── README.md                    # Overview and delivery checklist
├── api-reference.md             # REST endpoints, DTOs, error semantics
├── ui-implementation.md         # Screen blueprints, component patterns
├── state-and-testing.md         # Redux/Recoil patterns, WebSocket middleware
└── realtime-and-webhooks.md     # Socket.IO events, webhook flows
```

**🚨 CRITICAL: When working on Tickets Provider:**
1. **ALWAYS** read backend docs first before implementing features
2. **ALWAYS** match DTOs exactly as specified in `api-reference.md`
3. **ALWAYS** implement all 12 WebSocket events from `realtime-and-webhooks.md`
4. **ALWAYS** follow UI patterns from `ui-implementation.md`
5. Backend docs are the **single source of truth** for Tickets integration

### ❌ FORBIDDEN: Never Modify
- `src/widgets/*` (except `frontdesk/`)
- `src/store/*` (except `frontdesk/`)
- `src/components/*` (shared components — ask first)
- `src/utils/*` (global utilities)
- Build configs, package.json, tsconfig.json
- Any file outside the allowed paths above

### 🚨 Golden Rules
1. **Never** create `.md` files unless explicitly requested
2. **Never** edit shared components without user approval
3. **Always** prefix branches with `frontdesk/`
4. **Only** modify Recoil atoms with `frontdesk.*` keys
5. **Ask first** before adding npm dependencies

---

## 🏗️ Architecture Overview

**Access:** `http://localhost:3004/frontdesk/inbox`

### Providers (Communication Channels)

| Provider | Status | Data Source | Real-time | Hook |
|----------|--------|-------------|-----------|------|
| **Internal (DMs)** | ✅ Complete | REST + WebSocket | ✅ | `useDirectMessages` |
| **Email** | ✅ Complete | REST + OAuth | ❌ | `useEmailProvider` |
| **WhatsApp** | 🟡 Mock | Mock data | ❌ | `useWhatsAppProvider` |
| **Tickets** | 🔴 Needs Real API | Mock data → Real API | ✅ 12 events | `useTicketsProvider` |
| **Unified** | 🟡 Partial | Aggregated | N/A | `useAggregatedConversations` |

### Core Structure
```
src/widgets/frontdesk/
├── frontdesk-widget.tsx              # Main router & layout entry
├── layouts/three-column/
│   └── ThreeColumnLayout.tsx         # 3-column layout (Nav | List | Content)
├── providers/
│   ├── internal/                     # Direct Messages (WebSocket)
│   ├── email/                        # Gmail/Outlook (OAuth)
│   ├── whatsapp/                     # WhatsApp (mock)
│   ├── tickets/                      # Support Tickets (mock)
│   ├── unified/                      # Aggregated inbox
│   └── base/provider.interface.ts    # Base provider interface
├── components/                       # Shared UI (conversation, message)
└── hooks/                            # Custom hooks

src/store/frontdesk/
├── atoms/
│   ├── internal.atoms.ts             # DM state
│   ├── email.atoms.ts                # Email accounts & messages
│   ├── whatsapp.atoms.ts             # WhatsApp state
│   ├── tickets.atoms.ts              # Ticket state
│   └── unified.atoms.ts              # Unified inbox state
└── selectors/                        # Derived state

src/services/
├── api-service/frontdesk/
│   ├── frontdesk-endpoints.ts        # API endpoint definitions
│   └── providers/internal/
│       └── direct-messages.service.ts
└── websocket/
    └── messaging-service.ts          # WebSocket singleton (DMs only)
```

---

## 🔌 Provider Pattern

### Standard Provider Structure
```
provider/
├── {provider}-provider-view.tsx       # Main view component
├── components/                        # Provider-specific UI
├── hooks/
│   └── use-{provider}-provider.ts    # State + actions
├── types/                            # TypeScript types
└── utils/                            # Provider-specific utilities
```

### Hook Signature (Standard Pattern)
```typescript
export function useProviderName() {
  return {
    // Connection
    isConnected: boolean,
    isLoading: boolean,
    error: Error | null,

    // Data
    conversations: Conversation[],
    messages: Message[],
    selectedConversation: Conversation | null,

    // Actions
    sendMessage: (content: string) => Promise<void>,
    selectConversation: (id: string) => void,
    refresh: () => Promise<void>,
  }
}
```

### Exception: Tickets Provider
- **No** `-provider-view.tsx` file
- Integrated directly into `frontdesk-widget.tsx`
- Uses `ticket-list-panel.tsx` + `ticket-detail-view.tsx`

**Backend Integration (MUST FOLLOW):**
- Base URL: `${API_BASE}/api/tickets`
- Auth: `Authorization: Bearer ${jwt}` on all requests
- Tenant scoping: Automatic via `printHouseId` from JWT
- WebSocket: `/messaging` namespace with 12 ticket events
- Full API contract: See backend docs at `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/api-reference.md`

**Tickets API Endpoints:**
```typescript
// Core operations
GET    /api/tickets                        # List tickets (paginated)
POST   /api/tickets/create-from-conversation  # Create from conversation
POST   /api/tickets/:id/reply               # Reply to ticket
PATCH  /api/tickets/:id/status              # Update status
POST   /api/tickets/:id/reopen              # Reopen ticket (manager)

// Assignment (Manager/Admin only)
POST   /api/tickets/:id/assign              # Assign to agent
POST   /api/tickets/bulk-assign              # Bulk assign
GET    /api/tickets/dashboard/unassigned    # Unassigned tickets
GET    /api/tickets/dashboard/workload      # Agent workload

// Discovery
GET    /api/tickets/:id/related             # Related tickets
GET    /api/tickets/:id/history             # Ticket history
GET    /api/tickets/customer/:identifier    # Customer history

// Management (Manager/Admin only)
POST   /api/tickets/:sourceId/merge         # Merge tickets
PATCH  /api/tickets/:id/priority            # Update priority
```

**WebSocket Events (12 Real-time Events):**
```typescript
// Subscribe to: socket.io('/messaging', { auth: { token } })
// All events broadcast to: org:${printHouseId}

ticket.created                  # New ticket created
ticket.assigned                 # Ticket assigned to agent
ticket.status.changed           # Status updated
ticket.reply.sent               # Reply sent to customer
ticket.reopened                 # Ticket reopened
ticket.merged                   # Tickets merged
tickets.bulkAssigned            # Bulk assignment completed
ticket.message.received         # Inbound message from webhook
ticket.customer.updated         # Customer lookup completed
sla.breached                    # SLA deadline exceeded
ticket.autoResponse             # Auto-response sent
webhook.message.processed       # Webhook processing result
```

---

## 📦 State Management (Recoil)

### Atom Naming Convention
```typescript
// Format: frontdesk.{provider}.{data}
frontdesk.internal.conversations
frontdesk.email.accounts
frontdesk.tickets.selectedView
```

### Key Atoms by Provider

**Internal (DMs)**
- `internalChannelsAtom` — Conversations list
- `internalMessagesAtom` — Messages for active conversation
- `internalConnectionStateAtom` — WebSocket connection
- `internalUserPresenceAtom` — User online/offline status

**Email**
- `emailAccountsAtom` — Connected Gmail/Outlook accounts
- `emailConversationsAtom` — Emails keyed by account ID
- `emailSelectedConversationAtom` — Active email thread

**Tickets** (Backend-driven — MUST match backend DTOs)
- `ticketsAtom` — All tickets (matches `TicketWithDetails[]` from backend)
- `selectedTicketViewAtom` — Current view filter
- `selectedTicketIdAtom` — Active ticket ID
- `ticketFiltersAtom` — Filter state (status, priority, assignee, etc.)
- `ticketPaginationAtom` — Pagination metadata from API

**Backend DTO (MUST MATCH EXACTLY):**
```typescript
// Source: Messaging-Hub/docs/developer/ticketing/frontend-ticketing/api-reference.md
interface TicketWithDetails {
  id: string;
  conversationId: string;
  printHouseId: string;
  ticketNumber: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerName?: string | null;
  customerId?: string | null;  // GoMake customer ID
  assigneeId?: string | null;
  managerId?: string | null;
  categoryId?: string | null;
  tags: string[];
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  reopenedAt?: string | null;
  reopenCount: number;
  mergedIntoId?: string | null;
  createdAt: string;
  updatedAt: string;
  // Hydrated relationships:
  assignee?: { id: string; name: string; email: string } | null;
  manager?: { id: string; name: string; email: string } | null;
  category?: { id: string; name: string; priority: string } | null;
  conversation: {
    id: string;
    name: string;
    createdAt: string;
    lastMessageAt: string | null;
    messages: Array<{
      id: string;
      content: string;
      createdAt: string;
      direction: 'INBOUND' | 'OUTBOUND';
    }>;
  };
  sla?: {
    firstResponseDue: string;
    resolutionDue: string;
    firstResponseAt?: string | null;
    resolvedAt?: string | null;
    breached: boolean;
    breachedAt?: string | null;
  } | null;
}
```

### Selector Pattern
```typescript
// Derived state in src/store/frontdesk/selectors/
export const filteredConversationsSelector = selector({
  key: 'frontdesk.{provider}.filteredConversations',
  get: ({ get }) => {
    const conversations = get(conversationsAtom);
    const query = get(searchQueryAtom);
    return conversations.filter(c => c.name.includes(query));
  }
});
```

---

## 🌐 API & WebSocket

### REST API
```typescript
// Example: src/services/api-service/frontdesk/providers/internal/direct-messages.service.ts
class DirectMessagesService {
  async getConversations(): Promise<Conversation[]> { /* ... */ }
  async sendMessage(conversationId: string, content: string): Promise<Message> { /* ... */ }
  async markAsRead(conversationId: string): Promise<void> { /* ... */ }
}
```

### WebSocket (DMs Only)
```typescript
import { messagingService } from '@/services/websocket/messaging-service';

// Connect (singleton)
await messagingService.connect(authToken);

// Send message
messagingService.sendMessage(conversationId, content);

// Listen for events
messagingService.on('dm:newMessage', (message) => {
  setMessages(prev => [...prev, message]);
});

// Events:
// - dm:newMessage
// - dm:userTyping
// - dm:messageRead
// - dm:conversationUpdated
```

---

## ⚡ Quick Reference

### Development Commands
```bash
npm run dev          # Start dev server (localhost:3004)
npm run build        # Production build
npm run lint         # ESLint checks
npm run test         # Jest tests
```

### Adding a New Provider (Checklist)
1. Create provider structure: `mkdir -p src/widgets/frontdesk/providers/{name}/{components,hooks,types}`
2. Implement hook: `hooks/use-{name}-provider.ts`
3. Create view: `{name}-provider-view.tsx` using `ThreeColumnLayout`
4. Add Recoil atoms: `src/store/frontdesk/atoms/{name}.atoms.ts`
5. Create API service: `src/services/api-service/frontdesk/providers/{name}/`
6. Register in `frontdesk-widget.tsx` router (case statement)
7. Update `NavigationSidebar` with icon/route

### Common Patterns

**Optimistic Updates**
```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;
  setMessages(prev => [...prev, { id: tempId, content, status: 'pending' }]);

  try {
    const message = await api.sendMessage(content);
    setMessages(prev => prev.map(m => m.id === tempId ? message : m));
  } catch (error) {
    setMessages(prev => prev.filter(m => m.id !== tempId));
  }
};
```

**Pagination**
```typescript
const loadMore = async () => {
  const newData = await api.fetchPage(page + 1);
  setData(prev => [...prev, ...newData]);
  setHasMore(newData.length > 0);
  setPage(p => p + 1);
};
```

### Debugging

**Enable Debug Logging**
```javascript
localStorage.setItem('FRONTDESK_DEBUG', 'true');
```

**Inspect WebSocket**
- DevTools → Network → WS filter
- View frames for message flow

**Inspect Recoil State**
- React DevTools → Components → RecoilRoot
- View atom values in real-time

---

## 🔧 Known Issues & Next Steps

### Current Limitations
1. Providers use custom layouts instead of fully adopting `ThreeColumnLayout`
2. WhatsApp provider uses mock data (no real API)
3. **🔴 URGENT: Tickets provider uses mock data** — Real backend API exists and is fully documented
4. Unified inbox can't display messages from selected conversations
5. No keyboard shortcuts implemented

### Recommended Tasks (Priority Order)
1. **🔴 HIGH PRIORITY: Migrate Tickets provider to real backend API**
   - Follow: `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`
   - Implement all 12 WebSocket events for real-time updates
   - Replace mock data in `mock-data/tickets.mock.ts` with API calls
   - Match all DTOs exactly as specified in backend docs
   - Test role-based permissions (USER vs MANAGER vs ADMIN)

2. Migrate all provider views to use `ThreeColumnLayout` consistently
3. Implement real WhatsApp API integration
4. Complete Unified inbox message viewer
5. Add keyboard navigation shortcuts

---

## 📚 Extended Documentation

### Frontend Documentation (`docs/frontdesk/`)
- [FRONTDESK_ARCHITECTURE.md](docs/frontdesk/FRONTDESK_ARCHITECTURE.md) — Full architecture
- [DEVELOPER_GUIDE.md](docs/frontdesk/DEVELOPER_GUIDE.md) — Development guide
- [API_REFERENCE.md](docs/frontdesk/API_REFERENCE.md) — Backend API specs
- [TICKETS_PROVIDER_GUIDE.md](docs/frontdesk/TICKETS_PROVIDER_GUIDE.md) — Tickets implementation
- [direct-messages-frontend.md](docs/frontdesk/direct-messages-frontend.md) — DM provider details

### Backend Documentation (Tickets System) — **ALWAYS REFERENCE**
**Location:** `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [README.md](file:///Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/README.md) | Overview, delivery checklist, core concepts | Before starting any Tickets work |
| [api-reference.md](file:///Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/api-reference.md) | REST endpoints, DTOs, error codes | Implementing API calls |
| [ui-implementation.md](file:///Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/ui-implementation.md) | Screen layouts, component patterns, styling | Building UI components |
| [state-and-testing.md](file:///Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/state-and-testing.md) | State management, WebSocket middleware, testing | Setting up state & tests |
| [realtime-and-webhooks.md](file:///Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/realtime-and-webhooks.md) | 12 Socket.IO events, webhook flows | Implementing real-time updates |

**🚨 MANDATORY READING BEFORE TICKETS WORK:**
1. Read `README.md` for overview
2. Read `api-reference.md` for API contracts
3. Read `realtime-and-webhooks.md` for WebSocket events
4. Implement exactly as specified — these docs are the source of truth

---

## 🛡️ Safety & Workflow

### Git Workflow
- **Branch naming:** `frontdesk/{feature-name}` (e.g., `frontdesk/whatsapp-api-integration`)
- **Commits:** Only include FrontDesk files
- **PRs:** Target `main` branch

### Testing Changes
1. Start dev server: `npm run dev`
2. Navigate to `/frontdesk/inbox`
3. Test all providers: Internal, Email, WhatsApp, Tickets
4. Check WebSocket connection (DevTools → Network → WS)
5. Verify Recoil state updates (React DevTools)
6. Run tests: `npm run test`

### Code Style
- Components: `PascalCase` (`MessageList.tsx`)
- Hooks: `camelCase` with `use` prefix (`useDirectMessages.ts`)
- Utils: `kebab-case` with `.utils.ts` suffix
- Atoms: descriptive names with `Atom` suffix

---

## 🚀 Usage Instructions for AI

**When working on FrontDesk:**
1. Read this file first to understand scope
2. **FOR TICKETS WORK: Read backend docs first** (`/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`)
3. Use allowed paths only
4. Follow provider pattern for new features
5. Update Recoil atoms with `frontdesk.*` keys
6. Test changes locally before committing
7. Ask before modifying shared components
8. Never create documentation files unless requested

**Priority Order:**
1. **Tickets Provider → ALWAYS consult backend docs first**
2. Fix bugs → Use existing patterns
3. Add features → Follow provider structure (and backend docs for Tickets)
4. Refactor → Get user approval first
5. Document → Only if explicitly asked

**Tickets-Specific Rules:**
- Backend docs are the **single source of truth**
- Match DTOs exactly as specified in `api-reference.md`
- Implement all 12 WebSocket events from `realtime-and-webhooks.md`
- Test with real API endpoints (no mocks in production)
- Validate role-based permissions (USER/MANAGER/ADMIN)
- Handle multi-channel messages (EMAIL/WHATSAPP/SMS)
- Preserve tenant isolation (printHouseId scoping)
