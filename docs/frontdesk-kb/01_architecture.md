# System Architecture

This document provides a high-level overview of the FrontDesk system architecture, including the codebase structure, state management, and services layer.

## 1. Codebase Structure

The FrontDesk module is primarily located within `src/widgets/frontdesk/`.

```
src/
├── widgets/frontdesk/
│   ├── frontdesk-widget.tsx      # Entry point, routing, and main layout
│   ├── controllers/              # Business logic controllers
│   ├── routing/                  # Centralized, type-safe routing system
│   ├── providers/                # Logic for each communication channel
│   │   ├── internal/             # Direct Messages (DMs) via WebSocket
│   │   ├── email/                # Gmail provider (OAuth)
│   │   ├── whatsapp/             # WhatsApp provider (Mocked)
│   │   ├── tickets/              # Support Tickets provider
│   │   └── unified/              # Unified inbox view
│   ├── components/               # Shared React components
│   ├── design-system/            # Storybook components and design tokens
│   ├── hooks/                    # Custom React hooks for provider logic
│   ├── layouts/                  # Reusable layout components
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
│
├── store/frontdesk/
│   ├── atoms/                    # Recoil state atoms, scoped per provider
│   └── selectors/                # Recoil selectors for derived state
│
└── services/
    ├── api/                      # REST API calls
    └── websocket/                # WebSocket service for real-time communication
```

## 2. State Management (Recoil)

- **Library**: Recoil.
- **Organization**: State is scoped per-provider.
  - **Atoms**: Located in `src/store/frontdesk/atoms/`.
  - **Selectors**: Located in `src/store/frontdesk/selectors/`.
- **Access Pattern**: Components should read state via `useRecoilValue` and update it via provider hooks, not directly with `useSetRecoilState` for business logic.

## 3. Services Layer

- **REST APIs**: Service classes are located in `src/services/frontdesk/api/`.
- **WebSockets**: Real-time communication is handled by services in `src/services/frontdesk/websocket/`.
