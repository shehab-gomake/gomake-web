# Technical Context: gomake-web

## Technology Stack

### Core Framework

- **Next.js 13.5.4**: React framework with SSR and static generation
- **React 18.2.0**: UI library with concurrent features
- **TypeScript 5.4.3**: Type-safe JavaScript with strict mode enabled

### State Management

- **Recoil 0.7.7**: Atomic state management library
- Atoms follow naming convention: `frontdesk.{provider}.{data}`
- Persistence via localStorage for user preferences
- Optimistic updates for better UX

### Real-time Communication

- **Socket.IO Client 4.8.1**: WebSocket client for real-time features
- Services: `messagingService` (DMs), `ticketSocketService` (Tickets)
- Auto-reconnection and connection state management
- Room-based event broadcasting

### UI Framework

- **Material-UI (MUI) 5.16.6**: Primary component library
- **Ant Design 5.20.3**: Secondary components and patterns
- **Emotion**: CSS-in-JS styling solution
- Custom design system in `src/widgets/frontdesk/design-system/`

### HTTP Client

- **Axios 1.3.4**: HTTP client with interceptors for auth
- Base client: `messaging-hub-http-client.ts`
- Service organization: `src/services/frontdesk/api/`

## Development Environment

### Prerequisites

- Node.js 16+ (recommended: 18+)
- npm 8+ or yarn
- Access to Messaging-Hub backend (port 3000)

### Setup Steps

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access FrontDesk
open http://localhost:3004/frontdesk/inbox
```

### Development Commands

```bash
npm run dev          # Start dev server (port 3004)
npm run build        # Production build (4GB memory limit)
npm run start        # Start production server
npm run lint         # ESLint checks
npm run test         # Run Jest tests with coverage
npm run test:ci      # CI-friendly test run
```

### File Organization

```
src/
├── widgets/frontdesk/           # FrontDesk feature (IN SCOPE)
├── store/frontdesk/              # Recoil state (IN SCOPE)
├── services/frontdesk/           # API services (IN SCOPE)
├── components/                   # Shared components (READ-ONLY without approval)
├── hooks/                        # Shared hooks
├── utils/                        # Utility functions
└── types/                        # Shared type definitions
```

## Dependencies

### Key Production Dependencies

- `@microsoft/signalr ^8.0.0`: SignalR client (other widgets)
- `recoil ^0.7.7`: State management
- `socket.io-client ^4.8.1`: Real-time WebSocket
- `axios ^1.3.4`: HTTP client
- `@mui/material ^5.16.6`: UI components
- `react-quill ^2.0.0`: Rich text editor
- `moment ^2.30.1`: Date/time handling
- `uuid ^9.0.0`: Unique ID generation

### Development Dependencies

- `@testing-library/react 14.0.0`: Component testing
- `jest 29.5.0`: Test runner
- `@types/*`: TypeScript type definitions

### Backend Dependency

**Critical**: FrontDesk requires Messaging-Hub backend running on port 3000

- Location: `/Users/omarsabbah/Desktop/gomake-services/Messaging-Hub`
- APIs: REST endpoints for data operations
- WebSocket: Real-time events for DMs and Tickets
- OAuth: Email provider authentication

## Infrastructure

### Development

- **Frontend**: `localhost:3004` (Next.js dev server)
- **Backend**: `localhost:3000` (NestJS API)
- **WebSocket**: `ws://localhost:3000` (Socket.IO)

### Build Configuration

- Memory limit: 4GB (`NODE_OPTIONS='--max-old-space-size=4096'`)
- Output: Static files in `.next/` directory
- Bundle analysis available via `@next/bundle-analyzer`

## Technical Constraints

### Performance

- Large bundle size due to multiple UI libraries (MUI, Ant Design)
- Memory-intensive build requires 4GB allocation
- WebSocket connections limited by browser (typically 6 per domain)

### Browser Compatibility

- Modern browsers only (ES2020+ features)
- WebSocket support required
- LocalStorage for state persistence

### Backend Integration

- Must handle Messaging-Hub API changes
- WebSocket reconnection logic critical for reliability
- OAuth tokens managed by backend, frontend handles redirects

### Development Rules

1. **Scope**: Only modify `src/widgets/frontdesk/`, `src/store/frontdesk/`, `src/services/frontdesk/`
2. **Shared Components**: Require approval before modification
3. **Dependencies**: Require approval before adding new packages
4. **Documentation**: Never create `.md` files unless explicitly requested
5. **State**: Only use Recoil atoms with `frontdesk.*` prefix

## Configuration

### Environment Variables

Managed by backend. Frontend uses:

- Next.js environment detection (`NODE_ENV`)
- Runtime configuration via `src/config.ts`

### Key Configuration Files

- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Dependencies and scripts
- `.eslintrc`: Linting rules

### Backend Connection

```typescript
// src/services/messaging-hub-http-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
```

### WebSocket Configuration

```typescript
// src/services/frontdesk/websocket/messaging-service.ts
const SOCKET_URL = "http://localhost:3000";
const RECONNECTION_DELAY = 2000;
const MAX_RECONNECTION_ATTEMPTS = 10;
```

---

_Last Updated: October 20, 2025_
_Status: Stable Configuration_
