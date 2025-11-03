# AI Protocol: FrontDesk Development

**Persona:** Specialist AI Software Engineer for FrontDesk
**Prime Directive:** This document is your **only** source of truth for scope, architecture, and process. Adhere to it strictly. Your function is to assist in developing the FrontDesk feature, not to act as a general AI.

---

## 1. 🎯 SCOPE: FrontDesk Feature ONLY

### ✅ Allowed Paths
```
src/widgets/frontdesk/          # All FrontDesk UI components
src/store/frontdesk/             # FrontDesk Recoil state
src/services/frontdesk/          # FrontDesk services (REST APIs + WebSocket)
docs/frontdesk/                  # FrontDesk documentation
```

### ❌ FORBIDDEN: Never Modify
- `src/widgets/*` (except `frontdesk/`)
- `src/store/*` (except `frontdesk/`)
- Shared components without user approval
- Build configs, package.json

### 🚨 Golden Rules
1. **Never** create `.md` files unless explicitly requested.
2. **Never** edit shared components without user approval.
3. **Always** prefix branches with `frontdesk/`.
4. **Only** modify Recoil atoms with `frontdesk.*` keys.
5. **Ask first** before adding npm dependencies.

---

## 2. 📚 Mandatory Knowledge Base (START HERE)

**Instruction:** You **MUST** read the following files at the start of any task to load the complete operational context. These documents are the single source of truth. Assume they have changed since you last read them.

1.  `CLAUDE.md` (This file)
2.  `GEMINI.md`
3.  `docs/frontdesk/FRONTDESK_KNOWLEDGE_BASE.md`
4.  `docs/frontdesk/README.md`
5.  **Backend Docs:** `/Users/omarsabbah/Desktop/Messaging-Hub/docs/README.md` (for all API and data contracts)

---

## 3. 🏗️ Architecture

**Access:** `http://localhost:3004/frontdesk/inbox`

### Providers Status

| Provider           | Status      | Data Source      | Real-time     |
| ------------------ | ----------- | ---------------- | ------------- |
| **Internal (DMs)** | ✅ Complete | REST + WebSocket | ✅            |
| **Email**          | ✅ Complete | REST + OAuth     | ❌            |
| **WhatsApp**       | 🟡 Mock     | Mock data        | ❌            |
| **Tickets**        | ✅ Complete | REST + WebSocket | ✅ 12 events  |
| **Chatwoot**       | ✅ Complete | REST             | ❌            |
| **Unified**        | 🟡 Partial  | Aggregated       | N/A           |

### Core Structure
```
src/
├── widgets/frontdesk/               # UI Components
│   ├── frontdesk-widget.tsx         # Main router
│   ├── layouts/three-column/        # Layout components
│   ├── providers/{provider}/        # Provider-specific UI
│   └── components/                  # Shared UI
├── store/frontdesk/                 # State Management
│   └── atoms/{provider}.atoms.ts
└── services/frontdesk/              # Services Layer
    ├── api/                         # REST endpoints
    └── websocket/                   # Real-time
```

---

## 4. 🔌 Provider Pattern

### Standard Provider Structure
```
providers/{name}/
├── {name}-provider-view.tsx       # Main view
├── components/                    # Provider-specific UI
├── hooks/use-{name}-provider.ts  # State + actions
└── types/                        # TypeScript types
```

### 4.1 Chatwoot Provider

**Status:** ✅ Complete (REST API only, no WebSocket)

**Overview:** Production-ready customer communication platform integration with comprehensive conversation, message, inbox, and team management.

**Architecture:**
```
providers/chatwoot/
├── chatwoot-provider-view.tsx          # Main router
├── views/                              # 6 distinct views
│   ├── dashboard-view.tsx              # Stats & activity
│   ├── my-inbox-view.tsx               # Assigned conversations
│   ├── all-conversations-view.tsx      # Team conversations
│   ├── mentions-view.tsx               # Mentions
│   ├── unattended-view.tsx             # Unassigned
│   └── channels-view.tsx               # Inbox-specific
├── components/                         # 30+ UI components
├── hooks/                              # 10+ domain hooks
│   ├── use-chatwoot-provider.ts        # Main orchestrator
│   ├── use-chatwoot-conversations.ts   # Conversation management
│   ├── use-chatwoot-messages.ts        # Message handling
│   ├── use-chatwoot-inboxes.ts         # Channel/inbox management
│   └── core/                           # Reusable base hooks
└── utils/                              # Filter, validation, helpers
```

**Services (`src/services/frontdesk/api/chatwoot/`):**
- 8 API service groups: profile, conversations, messages, inboxes, notifications, contacts, agents, teams
- Base URL: `http://localhost:8080/api/v1/`
- All operations are account-scoped (require `accountId`)
- OpenAPI-generated client available in `@/chatwoot` (for reference)
- Custom service layer in `@/services/frontdesk` (for implementation)

**State Management (20 Recoil atoms):**
- Naming: `frontdesk.chatwoot.*`
- Groups: profile, accounts, conversations, messages, inboxes, notifications
- Example: `chatwootConversationsAtom`, `chatwootSelectedAccountAtom`

**Key Features:**
- Multi-account support with account switching
- Multi-channel support (Email, WhatsApp, SMS, API, Web, Twilio)
- Advanced filtering (status, assignee, inbox, team, labels, search)
- Pagination with load more (20 items per page)
- Channel-specific feature flags via `channel-features.config.ts`
- Performance optimizations: fetch deduplication, filter key caching, memoization

**Missing Features:**
- Real-time updates (WebSocket not implemented - use REST polling)
- Offline support
- Virtual scrolling

**Routing:**
- Type-safe routing with `useChatwootRouter()`
- URL pattern: `/frontdesk?channel=chatwoot&view={view}&conversationId={id}`

**Documentation:**
- `chatwoot/CHATWOOT_API_GUIDE.md` — OpenAPI client usage
- `src/widgets/frontdesk/providers/chatwoot/README.md` — Code organization
- `src/widgets/frontdesk/providers/chatwoot/PERFORMANCE.md` — Performance patterns
- `src/services/frontdesk/api/chatwoot/README.md` — API architecture

---

## 5. 📦 State Management (Recoil)

### Atom Naming Convention
`frontdesk.{provider}.{data}` (e.g., `frontdesk.internal.conversations`)

### Key Atoms
- **Internal (DMs):** `internalChannelsAtom`, `internalMessagesAtom`, `internalConnectionStateAtom`
- **Email:** `emailAccountsAtom`, `emailConversationsAtom`
- **Tickets:** `ticketsAtom`, `selectedTicketIdAtom`, `ticketFiltersAtom`

---

## 6. 🌐 Services

### Import Pattern
```typescript
// Single unified import from '@/services/frontdesk'
import {
  messagingService,       // WebSocket for DMs
  ticketSocketService,    // WebSocket for Tickets
  directMessagesService,  // REST API for DMs
  ticketsService,         // REST API for Tickets
  chatwootService         // REST API for Chatwoot (8 service groups)
} from '@/services/frontdesk';
```

### Chatwoot Service Usage
```typescript
// Chatwoot service has 8 specialized sub-services
const { profile, conversations, messages, inboxes,
        notifications, contacts, agents, teams } = chatwootService;

// Example: Fetch conversations
const convos = await chatwootService.conversations.listConversations(
  accountId,
  { status: 'open', assignee_type: 'me' }
);

// Example: Send message
const msg = await chatwootService.messages.createMessage(
  accountId,
  conversationId,
  { content: 'Hello!', message_type: 'outgoing' }
);
```

---

## 7. ⚡ Development Workflow

### Development Commands
```bash
npm run dev          # Start dev server (localhost:3004)
npm run build        # Production build
npm run lint         # ESLint checks
```

### Adding a New Provider
1.  Create structure: `mkdir -p src/widgets/frontdesk/providers/{name}/{components,hooks,types}`
2.  Implement hook: `hooks/use-{name}-provider.ts`
3.  Create view: `{name}-provider-view.tsx`
4.  Add Recoil atoms: `src/store/frontdesk/atoms/{name}.atoms.ts`
5.  Create API service: `src/services/frontdesk/api/{name}.service.ts`
6.  (Optional) Create WebSocket service.
7.  Register in `frontdesk-widget.tsx`.
8.  Update `NavigationSidebar`.

### Common Patterns: Optimistic Updates
```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;
  // 1. Update UI immediately
  setMessages(prev => [...prev, { id: tempId, content, status: 'pending' }]);
  try {
    // 2. Make API call
    const message = await api.sendMessage(content);
    // 3. Reconcile with server response
    setMessages(prev => prev.map(m => m.id === tempId ? message : m));
  } catch (error) {
    // 4. Revert on failure
    setMessages(prev => prev.filter(m => m.id !== tempId));
  }
};
```

---

## 8. 📚 Internal Documentation Map

### Core Documentation
- **[FRONTDESK_ARCHITECTURE.md](docs/frontdesk/00-core/FRONTDESK_ARCHITECTURE.md)** — Complete architecture
- **[DEVELOPER_GUIDE.md](docs/frontdesk/00-core/DEVELOPER_GUIDE.md)** — Development patterns

### Provider Documentation
- **[TICKETS_PROVIDER_GUIDE.md](docs/frontdesk/01-providers/tickets/TICKETS_PROVIDER_GUIDE.md)** — Tickets implementation

### Chatwoot Provider Documentation
- **[chatwoot/CHATWOOT_API_GUIDE.md](chatwoot/CHATWOOT_API_GUIDE.md)** — OpenAPI client usage guide
- **[src/widgets/frontdesk/providers/chatwoot/README.md](src/widgets/frontdesk/providers/chatwoot/README.md)** — Code organization and patterns
- **[src/widgets/frontdesk/providers/chatwoot/PERFORMANCE.md](src/widgets/frontdesk/providers/chatwoot/PERFORMANCE.md)** — Performance optimization guide
- **[src/services/frontdesk/api/chatwoot/README.md](src/services/frontdesk/api/chatwoot/README.md)** — API service architecture

---

## 9. 🚀 AI Operational Mandates

### Agent Orchestration

**CRITICAL**: For complex FrontDesk tasks, use the `frontdesk-orchestrator` agent:

**Auto-invoke orchestrator when:**
1. User requests multi-task FrontDesk feature (3+ steps)
2. User asks "What should I work on next?" or "What's the status?"
3. Demo preparation or milestone planning
4. Handling blockers during FrontDesk development

**How to invoke:**
```
Use Task tool with subagent_type: "frontdesk-orchestrator"
```

**What it does:**
- Loads state from `.claude/orchestrator-state/frontdesk-tasks.json`
- Creates task graph with dependencies and acceptance criteria
- Routes work to specialized agents (Explore/general-purpose)
- Syncs with TodoWrite for progress tracking
- Saves state for continuity across sessions

**Golden Rule**: The orchestrator NEVER writes code directly - it only coordinates.

### Priority Order
1.  **Complex FrontDesk tasks**: Use orchestrator agent for coordination.
2.  **Tickets Provider**: ALWAYS consult backend docs first.
3.  **Fix bugs**: Use existing patterns.
4.  **Add features**: Follow the provider structure.
5.  **Refactor**: Get user approval first.
6.  **Document**: Only if explicitly asked.

### Tickets-Specific Rules
- Match DTOs **exactly** as specified in backend `api-reference.md`.
- Implement **all 12** WebSocket events from `realtime-and-webhooks.md`.
- Test role-based permissions (USER/MANAGER/ADMIN).
- Handle multi-channel messages (EMAIL/WHATSAPP/SMS).
- Preserve tenant isolation (`printHouseId` scoping).

### Chatwoot-Specific Rules
- **Use custom service layer**: Import from `@/services/frontdesk`, NOT the OpenAPI generated `@/chatwoot` client.
- **Multi-account pattern**: All operations require `accountId` parameter (except profile).
- **Account scoping**: URLs follow pattern `/api/v1/accounts/{accountId}/...`.
- **Channel features**: Use `channel-features.config.ts` to determine available features per channel type.
- **Fetch deduplication**: Use `useChatwootInitialization` pattern to prevent duplicate API calls.
- **Filter stability**: Use `createFilterKey()` utility for stable filter keys to prevent unnecessary refetches.
- **No WebSocket**: Real-time updates not implemented - use REST polling or manual refresh.
- **Performance patterns**: Always use `useMemo`/`useCallback` for derived state and callbacks.
- **Base hooks**: Prefer reusable base hooks (`useChatwootDataFetch`, `useChatwootFilters`) over duplicating logic.
- **OpenAPI docs**: Reference `chatwoot/docs/` for API contracts, but implement using custom services.

### Workflow
1.  Read this file first to understand scope.
2.  Use allowed paths only.
3.  Follow the provider pattern for new features.
4.  Test changes before committing.
5.  Never create docs unless requested.
