# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## FrontDesk Feature Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels into a single interface: **Direct Messages**, **Email (Gmail/Outlook)**, **WhatsApp**, and **Support Tickets**.

**Access:** `http://localhost:3004/frontdesk/inbox`

## Essential Commands

```bash
# Development
npm run dev          # Starts dev server on port 3004
npm run build        # Production build with increased memory allocation
npm run lint         # Run ESLint checks
npm run test         # Run Jest tests with coverage
```

## FrontDesk Architecture

### Core Structure
```
src/widgets/frontdesk/
├── frontdesk-widget.tsx              # Main entry point and routing
│
├── layouts/                          # Layout system
│   └── three-column/
│       └── ThreeColumnLayout.tsx     # Unified three-column layout (Nav | List | Content)
│
├── providers/                        # Communication channel implementations
│   ├── internal/                     # Direct Messages (✅ Complete, WebSocket, Real-time)
│   ├── email/                        # Gmail/Outlook (✅ Complete, OAuth, REST API)
│   ├── whatsapp/                     # WhatsApp (🟡 Partial, Mock data)
│   ├── tickets/                      # Support Tickets (🟡 Partial, Mock data)
│   ├── unified/                      # Unified inbox (🟡 Partial, aggregation only)
│   └── base/                         # Base interfaces & adapters
│
├── design-system/                    # Reusable design components (Panel, EmptyState, etc.)
├── components/                       # Shared UI (conversation, message, search)
├── hooks/                           # Custom React hooks
└── controllers/                     # Business logic and navigation

src/store/frontdesk/                 # Recoil state management
├── atoms/
│   ├── direct-messages.atoms.ts     # DM state
│   ├── email.atoms.ts               # Email accounts & messages
│   ├── whatsapp.atoms.ts            # WhatsApp state
│   └── tickets.atoms.ts             # Ticket management state
└── selectors/                       # Derived state and aggregations

src/services/
├── api-service/frontdesk/           # REST API services per provider
└── websocket/
    └── messaging-service.ts         # WebSocket client singleton (for DMs)
```

### Providers Status

| Provider | Status | Real API | WebSocket | OAuth | Notes |
|----------|--------|----------|-----------|-------|-------|
| Internal (DMs) | ✅ Complete | ✅ | ✅ | N/A | Full real-time messaging |
| Email | ✅ Complete | ✅ | ❌ | ✅ | Gmail & Outlook OAuth |
| WhatsApp | 🟡 Partial | ❌ Mock | ❌ | ❌ | Pending API integration |
| Tickets | 🟡 Partial | ❌ Mock | ❌ | N/A | Pending API integration |
| Unified | 🟡 Partial | N/A | N/A | N/A | Aggregates but can't show messages |

### Layout System

**ThreeColumnLayout** (`src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx`):
- Column 1: Navigation sidebar (220px, collapses to 60px on mobile)
- Column 2: List panel (280px, optional/hideable)
- Column 3: Main content (flexible width)

**Current Issue:** Providers still implement custom layouts instead of fully using `ThreeColumnLayout`.

### State Management Pattern
- Uses **Recoil** for state management
- Atom naming convention: `frontdesk.{provider}.{data}` (e.g., `frontdesk.email.accounts`)
- Each provider has dedicated atoms in `src/store/frontdesk/atoms/`
- WebSocket events update Recoil atoms for real-time sync (Direct Messages)
- Provider hooks encapsulate all state logic and expose consistent APIs

### Provider Implementation Pattern
Each provider follows this consistent structure:

```
provider/
├── {provider}-provider-view.tsx       # Main view component
├── components/                        # Provider-specific UI components
├── hooks/
│   └── use-{provider}-provider.ts    # Main hook: state + actions
├── types/                            # TypeScript type definitions
└── utils/                            # Provider-specific utilities
```

**Hook Pattern:**
```typescript
export function useProviderName() {
  return {
    // Connection state
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

### Real-time Messaging (Direct Messages)
- **Singleton WebSocket service**: `src/services/frontdesk/websocket/messaging-service.ts`
- Connection management with auto-reconnect
- Message lifecycle: `pending → sent → delivered → read`
- Events: `dm:newMessage`, `dm:userTyping`, `dm:messageRead`, `dm:conversationUpdated`
- Optimistic updates with temporary IDs

## Working with FrontDesk

### Adding New Features
1. Check existing provider implementations for patterns
2. Use shared components from `src/widgets/frontdesk/components/`
3. Follow Recoil atom naming: `frontdesk.{provider}.{data}`
4. Implement hooks that expose: `loading`, `error`, `data`, and action handlers

### Common Tasks

**Update Provider State:**
```typescript
// Use provider-specific atoms
import { emailAccountsAtom } from '@/store/frontdesk/atoms/email.atoms';
```

**WebSocket Integration:**
```typescript
import { messagingService } from '@/services/frontdesk';
// Service is a singleton - use existing instance
```

**API Calls:**
```typescript
// Services are in src/services/frontdesk/api/
// Check frontdesk-endpoints.ts for available endpoints
```

### Testing Changes
1. Run `npm run dev` and navigate to `/frontdesk/inbox`
2. Test all providers: Internal (DMs), Email, WhatsApp, Tickets
3. Check WebSocket connection in Browser DevTools → Network tab → WS filter (for DMs)
4. Verify state updates in React DevTools → Recoil tab
5. Run tests: `npm run test`

## Documentation

Comprehensive documentation is available in `docs/frontdesk/`:

- **[FRONTDESK_ARCHITECTURE.md](docs/frontdesk/FRONTDESK_ARCHITECTURE.md)** - Complete architecture overview
- **[DEVELOPER_GUIDE.md](docs/frontdesk/DEVELOPER_GUIDE.md)** - Quick reference for common tasks
- **[API_REFERENCE.md](docs/frontdesk/API_REFERENCE.md)** - Backend API endpoints & WebSocket events
- **[API_INTEGRATION_GUIDE.md](docs/frontdesk/API_INTEGRATION_GUIDE.md)** - Frontend integration guide
- **[TICKETS_PROVIDER_GUIDE.md](docs/frontdesk/TICKETS_PROVIDER_GUIDE.md)** - Tickets provider documentation
- **[SEARCH_API_FRONTEND_GUIDE.md](docs/frontdesk/SEARCH_API_FRONTEND_GUIDE.md)** - Search implementation guide
- **[direct-messages-frontend.md](docs/frontdesk/direct-messages-frontend.md)** - DM provider details
- **[ai-agents/](docs/frontdesk/ai-agents/)** - AI agent guides for development

## Known Issues & Next Steps

### Current Limitations
1. **Layout Migration Incomplete**: Providers still use custom layouts instead of fully adopting `ThreeColumnLayout`
2. **WhatsApp Mock Data**: WhatsApp provider uses mock data, pending real API integration
3. **Tickets Mock Data**: Tickets provider uses mock data, pending real API integration
4. **Unified Inbox Partial**: Can aggregate conversations but can't display messages from selected conversations
5. **No Keyboard Shortcuts**: Global keyboard navigation not yet implemented

### Recommended Next Steps
1. Migrate all provider views to consistently use `ThreeColumnLayout`
2. Implement real WhatsApp API integration (replace mock data)
3. Implement real Tickets API integration (replace mock data)
4. Complete Unified inbox message viewer functionality
5. Add keyboard shortcuts for navigation and actions
6. Enhance mobile responsive design
7. Implement offline support with service workers

## Code Style Guidelines

- Components: PascalCase (`MessageList.tsx`)
- Hooks: camelCase with `use` prefix (`useDirectMessages.ts`)
- Utilities: kebab-case with `.utils.ts` suffix
- Recoil atoms: descriptive names with `Atom` suffix
- Keep provider logic isolated - avoid cross-provider dependencies