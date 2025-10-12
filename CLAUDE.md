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
  ticketsService          // REST API for Tickets
} from '@/services/frontdesk';
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

- **[FRONTDESK_ARCHITECTURE.md](docs/frontdesk/00-core/FRONTDESK_ARCHITECTURE.md)** — Complete architecture
- **[DEVELOPER_GUIDE.md](docs/frontdesk/00-core/DEVELOPER_GUIDE.md)** — Development patterns
- **[TICKETS_PROVIDER_GUIDE.md](docs/frontdesk/01-providers/tickets/TICKETS_PROVIDER_GUIDE.md)** — Tickets implementation

---

## 9. 🚀 AI Operational Mandates

### Priority Order
1.  **Tickets Provider**: ALWAYS consult backend docs first.
2.  **Fix bugs**: Use existing patterns.
3.  **Add features**: Follow the provider structure.
4.  **Refactor**: Get user approval first.
5.  **Document**: Only if explicitly asked.

### Tickets-Specific Rules
- Match DTOs **exactly** as specified in backend `api-reference.md`.
- Implement **all 12** WebSocket events from `realtime-and-webhooks.md`.
- Test role-based permissions (USER/MANAGER/ADMIN).
- Handle multi-channel messages (EMAIL/WHATSAPP/SMS).
- Preserve tenant isolation (`printHouseId` scoping).

### Workflow
1.  Read this file first to understand scope.
2.  Use allowed paths only.
3.  Follow the provider pattern for new features.
4.  Test changes before committing.
5.  Never create docs unless requested.
