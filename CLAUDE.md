# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## FrontDesk Feature Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels (Direct Messages, Email, WhatsApp) into a single interface. It's located at `/frontdesk/inbox` when running the development server.

## Essential Commands

```bash
# Development
npm run dev          # Starts dev server on port 3004
npm run build        # Production build with increased memory allocation
npm run lint         # Run ESLint checks
npm run test         # Run Jest tests with coverage

# Access FrontDesk
http://localhost:3004/frontdesk/inbox
```

## FrontDesk Architecture

### Core Structure
```
src/widgets/frontdesk/
├── frontdesk-widget.tsx              # Main entry point and routing
├── providers/                        # Communication channel implementations
│   ├── internal/                     # Direct Messages (WebSocket-based)
│   ├── email/                        # Gmail integration (OAuth-based)
│   ├── whatsapp/                     # WhatsApp integration
│   └── unified/                      # Unified inbox (partially implemented)
├── components/                       # Shared UI components
├── hooks/                           # Custom React hooks
└── controllers/                     # Business logic and navigation

src/store/frontdesk/                 # Recoil state management
├── atoms/                           # State atoms per provider
└── selectors/                       # Derived state and aggregations

src/services/
├── api-service/frontdesk/           # REST API services
└── websocket/                       # Real-time messaging
    └── messaging-service.ts         # WebSocket client for DMs
```

### State Management Pattern
- Uses Recoil for state management
- Each provider has dedicated atoms in `src/store/frontdesk/atoms/`
- WebSocket events update Recoil atoms for real-time sync
- Provider hooks encapsulate state logic and expose consistent APIs

### Provider Implementation Pattern
Each provider follows this structure:
1. **Main View Component**: `{provider}-provider-view.tsx`
2. **Custom Hook**: `use-{provider}-provider.ts` - manages state and business logic
3. **Components**: Provider-specific UI components
4. **API Service**: Backend integration in `src/services/api-service/frontdesk/`

### Real-time Messaging (Direct Messages)
- WebSocket service: `src/services/websocket/messaging-service.ts`
- Connection management with auto-reconnect
- Message lifecycle: `pending → sent → delivered → read`
- Typing indicators and user presence
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
import { messagingService } from '@/services/websocket/messaging-service';
// Service is a singleton - use existing instance
```

**API Calls:**
```typescript
// Services are in src/services/api-service/frontdesk/
// Check frontdesk-endpoints.ts for available endpoints
```

### Testing Changes
1. Run `npm run dev` and navigate to `/frontdesk/inbox`
2. Test all three providers: Internal (DMs), Email, WhatsApp
3. Check WebSocket connection in Network tab for DMs
4. Verify state updates in React DevTools (Recoil)

## Known Issues & TODOs

1. **Layout Inconsistency**: Each provider implements its own layout instead of using a unified structure
2. **Unified Inbox**: Partially implemented, needs completion for true multi-channel aggregation
3. **API Endpoints**: Some endpoints in `frontdesk-endpoints.ts` are placeholders
4. **OAuth Flow**: Email provider OAuth redirects need backend coordination

## Code Style Guidelines

- Components: PascalCase (`MessageList.tsx`)
- Hooks: camelCase with `use` prefix (`useDirectMessages.ts`)
- Utilities: kebab-case with `.utils.ts` suffix
- Recoil atoms: descriptive names with `Atom` suffix
- Keep provider logic isolated - avoid cross-provider dependencies