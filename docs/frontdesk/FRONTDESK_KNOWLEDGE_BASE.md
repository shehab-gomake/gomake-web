# FrontDesk AI Knowledge Base

This document provides a comprehensive, synthesized guide to the FrontDesk unified messaging hub. It is designed to give an AI developer a deep understanding of the architecture, components, data flows, and development patterns required to build, maintain, and extend the feature.

## 1. Core Principles & Mission

- **Mission**: To unify Direct Messages, Email, WhatsApp, and Support Tickets into a single, consistent, real-time workspace for customer communication.
- **Architectural Goal**: A consistent tri-pane workspace (`Navigation` | `List` | `Detail`) across all providers.
- **Development Principle**: Mirror existing patterns. Prefer extending shared components and hooks over creating new ones. Do not introduce new architectural patterns without a strong reason.

---

## 2. System Architecture

### 2.1. Codebase Structure

The FrontDesk module is primarily located within `src/widgets/frontdesk/`.

```
src/
├── widgets/frontdesk/
│   ├── frontdesk-widget.tsx      # Entry point, routing, and main layout
│   ├── providers/                # Logic for each communication channel
│   │   ├── internal/             # Direct Messages (DMs) via WebSocket
│   │   ├── email/                # Gmail provider (OAuth)
│   │   ├── whatsapp/             # WhatsApp provider
│   │   ├── tickets/              # Support Tickets provider
│   │   └── unified/              # Unified inbox view
│   ├── components/               # Shared React components (e.g., message bubbles, conversation list)
│   ├── hooks/                    # Custom React hooks for provider logic
│   └── controllers/              # Business logic, navigation, and actions
│
├── store/frontdesk/
│   ├── atoms/                    # Recoil state atoms, scoped per provider
│   └── selectors/                # Recoil selectors for derived state (e.g., message aggregation)
│
└── services/
    ├── api-service/frontdesk/     # REST API calls (e.g., tickets.service.ts)
    └── websocket/                # WebSocket services (e.g., ticket-socket.service.ts)
```

### 2.2. Layout System

- The primary layout is `ThreeColumnLayout` (`src/widgets/frontdesk/layouts/three-column/`), providing a responsive three-column view.
- **Known Gap**: Providers currently implement their own custom layouts. A key architectural goal is to refactor all providers to use `ThreeColumnLayout` for consistency.

### 2.3. State Management (Recoil)

- **Library**: Recoil.
- **Organization**: State is scoped per-provider.
  - **Atoms**: Located in `src/store/frontdesk/atoms/`. Naming convention: `frontdesk.{provider}.{data}` (e.g., `frontdesk.directMessages.conversations`).
  - **Selectors**: Located in `src/store/frontdesk/selectors/`. Used for derived data, filtering, and aggregation.
- **Access Pattern**: Components should read state via `useRecoilValue` and update it via provider hooks, not directly with `useSetRecoilState` for business logic.

### 2.4. Services Layer

- **REST APIs**: Service classes are located in `src/services/api-service/frontdesk/`. All calls use a shared `axios` instance.
- **WebSockets**: Real-time communication is handled by services in `src/services/websocket/`. These services are typically singletons that manage the socket connection and event handling.

---

## 3. Providers Deep Dive

### 3.1. Internal (Direct Messages)

- **Functionality**: Real-time 1:1 and group chat.
- **Real-time**: Uses `messaging-service.ts` for WebSocket communication.
- **Key Features**: Typing indicators, presence, read receipts, optimistic message sending with `tempId`.
- **Archiving**: Conversations can be archived/unarchived via `POST /dms/:id/archive` and `POST /dms/:id/unarchive`.
- **API**: See `direct-messages-frontend.md` for full REST and WebSocket API contracts.

### 3.2. Email (Gmail/Outlook)

- **Functionality**: Connects to Gmail/Outlook accounts to manage emails.
- **Authentication**: Uses a 3-step OAuth2 flow initiated by `GET /auth/oauth/google`. The frontend redirects the user and the backend handles the token exchange.
- **Key Features**: Multi-account support, label management, rich text composition, and conversation threading.
- **API**: Endpoints like `GET /email/accounts`, `GET /email/accounts/:accountId/messages`, and `POST /email/accounts/:accountId/send`.

### 3.3. WhatsApp

- **Status**: **Partial / Mock Data**. This provider is not connected to a real API.
- **Task**: When integrating, replace the mock data in `use-whatsapp-provider.ts` with real API calls and WebSocket subscriptions, following the patterns from the Direct Messages and Email providers.

### 3.4. Tickets

- **Status**: **Fully Integrated**.
- **Functionality**: A complete support ticketing system that consolidates requests from other channels.
- **Architecture**:
    - **Hook**: `use-tickets-provider.ts` is the main entry point, containing over 700 lines of logic for API calls, WebSocket handling, and state management.
    - **API Service**: `tickets.service.ts` implements 15+ REST endpoints for full CRUD.
    - **WebSocket Service**: `ticket-socket.service.ts` handles 12+ real-time events for instant UI updates (e.g., `ticket.created`, `ticket.assigned`).
- **Key Features**: Multi-channel support, status/priority management, assignments, SLA monitoring, and a complete audit trail.
- **V2 Migration**: The system has been migrated to a V2 unified ticketing API, which is provider-agnostic. Key changes include using `providerConversationId` and `providerChannelId` for ticket creation. A `conversation.needs.review` event powers a new "Review Queue" for incoming messages without a ticket.

### 3.5. Unified Inbox

- **Status**: **Partial**.
- **Functionality**: Aims to aggregate conversations from all providers into a single list.
- **Known Gap**: It can render the aggregated list but cannot yet display messages from the selected conversations. Completing this requires creating a dynamic view that can render the appropriate detail component based on the conversation's `provider` metadata.

---

## 4. Feature Guides

### 4.1. Search

- **Functionality**: Allows searching for messages across all DM conversations or within a specific one.
- **API**:
  - `GET /dms/search`: Search all conversations.
  - `GET /dms/:conversationId/search`: Search within a conversation.
- **Features**: Returns contextual snippets, text highlighting positions, and message position data to allow "jumping" directly to the message in the conversation view.
- **UI Implementation**: The frontend should use a debounced input to call the API. Results should be displayed with highlighted matches. Clicking a result should navigate to the conversation and scroll to the specific message.

---

## 5. API & Data Contracts

### 5.1. REST API Reference

A consolidated summary of key endpoints. For a full list, see `docs/frontdesk/03-api/API_REFERENCE.md`.

- **Authentication**: All endpoints require `Authorization: Bearer <JWT>`.
- **Direct Messages**:
  - `GET /dms`: List conversations.
  - `POST /dms`: Create a conversation.
  - `GET /dms/:id/messages`: Get messages for a conversation.
  - `POST /dms/:id/messages`: Send a message.
  - `POST /dms/:id/read`: Mark as read.
- **Tickets (V2)**:
  - `POST /tickets/create-from-conversation`: Create a ticket from any provider conversation.
    - Body: `{ providerConversationId, providerChannelId, priority, ... }`
  - `GET /tickets`: List tickets with filters.
  - `POST /tickets/:id/reply`: Reply to a ticket.
  - `PATCH /tickets/:id/status`: Update ticket status.
  - `POST /tickets/:id/assign`: Assign a ticket.

### 5.2. WebSocket Event Reference

- **Connection**: Connect to the `/messaging` namespace with the JWT in the `auth` object.
- **Rooms**: Join rooms to receive targeted events (e.g., `joinConversation`, `joinChannel`).
- **Direct Messages Events**:
  - **Emit**: `dm:sendMessage`, `dm:typingStart`, `dm:markAsRead`
  - **Listen**: `dm:messageConfirmed`, `dm:newMessage`, `dm:userTyping`, `dm:messageRead`
- **Tickets Events**:
  - **Listen**: `ticket.created`, `ticket.assigned`, `ticket.status.changed`, `ticket.reply.sent`, `ticket.message.received`, `sla.breached`, etc. (12+ events).

---

## 6. Development Playbooks

### 6.1. Adding a New Provider

1.  **Create Directory Structure**: `mkdir -p src/widgets/frontdesk/providers/{provider-name}/{components,hooks,types}`.
2.  **Define State**: Create atoms in `src/store/frontdesk/atoms/{provider}.atoms.ts`.
3.  **Create API Service**: Add a service class in `src/services/api-service/frontdesk/`.
4.  **Create Provider Hook**: Implement `use-{provider}-provider.ts` to manage state, API calls, and business logic.
5.  **Create Provider View**: Build the main view component, ideally using `ThreeColumnLayout`.
6.  **Register Provider**: Add a case for the new provider in `frontdesk-widget.tsx`'s routing logic.
7.  **Add Navigation**: Update `NavigationSidebar` with an icon and link for the new provider.
8.  **Document**: Update this knowledge base and other relevant documentation.

### 6.2. Fixing a Bug

1.  **Reproduce & Isolate**: Capture reproduction steps and identify the failing layer (UI, state, service).
2.  **Debug**: Use `localStorage.setItem('FRONTDESK_DEBUG', 'true')` to enable debug logs. Use browser dev tools to inspect Recoil state and network/WebSocket traffic.
3.  **Triage**:
    - **UI Glitch?** Check provider view components and Material-UI props.
    - **Stale Data?** Check Recoil atoms, selectors, and WebSocket event handlers.
    - **API Failure?** Check the relevant service class, payload shape, and auth headers.
4.  **Fix Safely**: Apply the fix in the smallest responsible module. Add tests to prevent regression.

---

## 7. Verification & Testing

### 7.1. Running Tests

- `npm run dev`: Start the development server.
- `npm run lint`: Run static analysis.
- `npm run test`: Run the Jest test suite.
- `npm run test -- --watch`: Run tests in watch mode.

### 7.2. Verification Checklists

- **New Feature**:
  - [ ] Builds locally (`npm run dev`).
  - [ ] Lints clean (`npm run lint`).
  - [ ] Tests pass, new tests added (`npm run test`).
  - [ ] UI is responsive and accessible.
  - [ ] Recoil state has safe defaults and updates correctly.
  - [ ] All API/WebSocket contracts are met.
- **Bugfix**:
  - [ ] The bug is verifiably fixed.
  - [ ] No regressions were introduced in related providers.
  - [ ] A test case covering the bug has been added.

---

## 8. Known Gaps & Future Work

- **Layout Inconsistency**: Providers need to be migrated to use the shared `ThreeColumnLayout`.
- **Mocked Providers**: The WhatsApp provider uses mock data and needs to be integrated with a real backend.
- **Unified Inbox**: The detail view for the unified inbox is not implemented.
- **Mobile Optimizations**: While responsive, the mobile experience can be further enhanced.
- **Keyboard Shortcuts**: No keyboard navigation or command palette is implemented.
