# CLAUDE_FRONTDESK.md

**FrontDesk-Only Development Context** — Strict scope isolation for the unified messaging hub feature.

---

## 🎯 SCOPE: FrontDesk Feature ONLY

### ✅ Allowed Paths
```
src/widgets/frontdesk/          # All FrontDesk UI components
src/store/frontdesk/             # FrontDesk Recoil state
src/services/frontdesk/          # FrontDesk services (REST APIs + WebSocket)
docs/frontdesk/                  # FrontDesk documentation
```

### 📖 Backend Documentation (ALWAYS CONSULT)
**Tickets Backend Docs:** `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`
- `api-reference.md` - REST endpoints, DTOs (MUST match exactly)
- `realtime-and-webhooks.md` - 12 WebSocket events (MUST implement all)
- `ui-implementation.md` - Screen layouts, component patterns

### ❌ FORBIDDEN: Never Modify
- `src/widgets/*` (except `frontdesk/`)
- `src/store/*` (except `frontdesk/`)
- Shared components without approval
- Build configs, package.json

### 🚨 Golden Rules
1. **Never** create `.md` files unless explicitly requested
2. **Never** edit shared components without user approval
3. **Always** prefix branches with `frontdesk/`
4. **Only** modify Recoil atoms with `frontdesk.*` keys
5. **Ask first** before adding npm dependencies

---

## 🏗️ Architecture

**Access:** `http://localhost:3004/frontdesk/inbox`

### Providers Status

| Provider | Status | Data Source | Real-time |
|----------|--------|-------------|-----------|
| **Internal (DMs)** | ✅ Complete | REST + WebSocket | ✅ |
| **Email** | ✅ Complete | REST + OAuth | ❌ |
| **WhatsApp** | 🟡 Mock | Mock data | ❌ |
| **Tickets** | 🔴 Needs Real API | Mock → Real API | ✅ 12 events |
| **Unified** | 🟡 Partial | Aggregated | N/A |

### Core Structure
```
src/
├── widgets/frontdesk/               # UI Components
│   ├── frontdesk-widget.tsx         # Main router
│   ├── layouts/three-column/        # Layout components
│   ├── providers/{provider}/        # Provider-specific UI
│   │   ├── components/
│   │   ├── hooks/use-{provider}-provider.ts
│   │   └── types/
│   └── components/                  # Shared UI
├── store/frontdesk/                 # State Management
│   ├── atoms/{provider}.atoms.ts
│   └── selectors/
└── services/frontdesk/              # Services Layer
    ├── api/                         # REST endpoints
    │   ├── direct-messages.service.ts
    │   ├── tickets.service.ts
    │   └── index.ts
    └── websocket/                   # Real-time
        ├── messaging-socket.service.ts
        ├── ticket-socket.service.ts
        └── index.ts
```

---

## 🔌 Provider Pattern

### Standard Provider Structure
```
providers/{name}/
├── {name}-provider-view.tsx       # Main view
├── components/                    # Provider-specific UI
├── hooks/use-{name}-provider.ts  # State + actions
├── types/                        # TypeScript types
└── utils/                        # Utilities
```

### Hook Signature (Standard)
```typescript
export function useProviderName() {
  return {
    isConnected: boolean,
    isLoading: boolean,
    error: Error | null,
    conversations: Conversation[],
    messages: Message[],
    selectedConversation: Conversation | null,
    sendMessage: (content: string) => Promise<void>,
    selectConversation: (id: string) => void,
    refresh: () => Promise<void>,
  }
}
```

---

## 📦 State Management (Recoil)

### Atom Naming: `frontdesk.{provider}.{data}`
```typescript
frontdesk.internal.conversations
frontdesk.email.accounts
frontdesk.tickets.selectedView
```

### Key Atoms
- **Internal (DMs):** `internalChannelsAtom`, `internalMessagesAtom`, `internalConnectionStateAtom`
- **Email:** `emailAccountsAtom`, `emailConversationsAtom`
- **Tickets:** `ticketsAtom`, `selectedTicketIdAtom`, `ticketFiltersAtom`

---

## 🌐 Services

### Import Pattern
```typescript
// Single unified import
import {
  messagingService,           // WebSocket for DMs
  ticketSocketService,        // WebSocket for Tickets
  directMessagesService,      // REST API for DMs
  ticketsService              // REST API for Tickets
} from '@/services/frontdesk';
```

### REST API Example
```typescript
// src/services/frontdesk/api/tickets.service.ts
class TicketsService {
  async getTickets(filters: TicketFilters): Promise<TicketWithDetails[]>
  async createFromConversation(dto: CreateFromConversationDto): Promise<TicketWithDetails>
  async replyToTicket(id: string, dto: ReplyToTicketDto): Promise<void>
}
```

### WebSocket Example
```typescript
// Connect
await ticketSocketService.connect(authToken, printHouseId);

// Listen to events
ticketSocketService.onTicketCreated((ticket) => { /* handle */ });
ticketSocketService.onTicketAssigned((data) => { /* handle */ });
```

---

## ⚡ Quick Reference

### Development Commands
```bash
npm run dev          # Start dev server (localhost:3004)
npm run build        # Production build
npm run lint         # ESLint checks
```

### Adding a New Provider
1. Create structure: `mkdir -p src/widgets/frontdesk/providers/{name}/{components,hooks,types}`
2. Implement hook: `hooks/use-{name}-provider.ts`
3. Create view: `{name}-provider-view.tsx`
4. Add Recoil atoms: `src/store/frontdesk/atoms/{name}.atoms.ts`
5. Create API service: `src/services/frontdesk/api/{name}.service.ts`
6. (Optional) Create WebSocket: `src/services/frontdesk/websocket/{name}-socket.service.ts`
7. Register in `frontdesk-widget.tsx`
8. Update `NavigationSidebar`

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

---

## 📚 Documentation

### Full Documentation
- [FRONTDESK_ARCHITECTURE.md](docs/frontdesk/FRONTDESK_ARCHITECTURE.md) — Complete architecture
- [DEVELOPER_GUIDE.md](docs/frontdesk/DEVELOPER_GUIDE.md) — Development patterns
- [TICKETS_PROVIDER_GUIDE.md](docs/frontdesk/TICKETS_PROVIDER_GUIDE.md) — Tickets implementation

### Backend Documentation (Tickets)
**Location:** `/Users/omarsabbah/Desktop/Messaging-Hub/docs/developer/ticketing/frontend-ticketing/`

**🚨 MANDATORY READING BEFORE TICKETS WORK:**
1. Read `api-reference.md` for exact DTOs and endpoints
2. Read `realtime-and-webhooks.md` for 12 WebSocket events
3. Read `ui-implementation.md` for component patterns
4. Backend docs are the **single source of truth**

---

## 🚀 AI Instructions

### Priority Order
1. **Tickets Provider** → ALWAYS consult backend docs first
2. Fix bugs → Use existing patterns
3. Add features → Follow provider structure
4. Refactor → Get user approval first
5. Document → Only if explicitly asked

### Tickets-Specific Rules
- Match DTOs exactly as specified in `api-reference.md`
- Implement all 12 WebSocket events from `realtime-and-webhooks.md`
- Test role-based permissions (USER/MANAGER/ADMIN)
- Handle multi-channel messages (EMAIL/WHATSAPP/SMS)
- Preserve tenant isolation (printHouseId scoping)

### Workflow
1. Read this file first to understand scope
2. Use allowed paths only (`src/widgets/frontdesk/`, `src/store/frontdesk/`, `src/services/frontdesk/`)
3. Follow provider pattern for new features
4. Test changes before committing
5. Never create docs unless requested
