# Data & Integration Reference

Keep this open to avoid breaking contracts. Cross-check details with the deeper docs linked throughout.

## Shared Principles
- **HTTP Client**: FrontDesk REST calls extend `MessagingHubHttpClient` (`src/services/messaging-hub-http-client.ts`). Examples: `src/services/frontdesk/api/direct-messages.service.ts`, `src/widgets/frontdesk/providers/email/utils/email-api-client.ts`.
- **Typing**: Define request/response interfaces per provider under `src/widgets/frontdesk/providers/<provider>/types/` or shared `src/interfaces/frontdesk/`.
- **Recoil Sync**: Treat atoms as the single source of truth for provider state; derive UI-ready data in selectors.

## Providers Overview
### Direct Messages (`internal`)
- REST endpoints documented in [direct-messages-frontend.md](../01-providers/direct-messages/direct-messages-frontend.md).
- WebSocket namespace `messaging`; connect via `messaging-socket.service.ts` (exported as `messagingService`) or channel utilities in `direct-messages-websocket.service.ts`.
- Critical atoms live in `src/store/frontdesk/atoms/internal.atoms.ts` (e.g., `internalChannelsAtom`, `internalMessagesAtom`, `internalConnectionStateAtom`, `internalTypingUsersAtom`).
- Optimistic updates rely on `tempId`—`MessageConfirmed` events reconcile pending messages.

### Email
- REST access uses the `emailApiClient` in `src/widgets/frontdesk/providers/email/utils/email-api-client.ts` (extends `MessagingHubHttpClient`).
- OAuth state flows through `emailAccountsAtom` and selectors; never store tokens client-side beyond existing patterns.
- Rendering: reuse `EmailSidebar`, `EmailThreadViewer` components where possible.

### WhatsApp
- Currently mock-driven (see `src/widgets/frontdesk/providers/whatsapp/hooks/use-whatsapp-provider.ts`). Treat upcoming integrations as greenfield and align with real backend endpoints when they arrive.
- Replace `setTimeout` mocks with HTTP calls (via `MessagingHubHttpClient`) plus WebSocket parity when backend is ready.

### Unified Inbox
- Aggregates conversations from all providers. Conversations must include metadata (`provider`, `conversationId`, counts).
- Detail rendering should lazy-load the appropriate provider component based on `provider` key.

## State Management Patterns
- Atom keys follow `frontdesk.<provider>.<resource>`—maintain naming discipline to prevent collisions.
- Use selectors for derived data (e.g., sorting, filtering) to keep components thin.
- Reset atoms on provider switch if stale data causes bleed-over; leverage `useResetRecoilState` inside provider teardown logic.

## API Reference Touchpoints
- See [API_REFERENCE.md](../03-api/API_REFERENCE.md) and [API_INTEGRATION_GUIDE.md](../03-api/API_INTEGRATION_GUIDE.md) for endpoint catalogues.
- When extending APIs, update those files alongside service changes.
- Enforce consistent error handling: surface toast/snackbar messaging via existing utilities instead of inline `alert` calls.

## Real-Time Integration Checklist
1. Call `messagingService.connect(token)` once per session (app shell level). The service lives in `src/services/frontdesk/websocket/messaging-socket.service.ts`.
2. Providers join rooms on mount and leave on unmount (use helpers from `direct-messages-websocket.service.ts` where available).
3. Handle `messageConfirmed`, `newMessage`, `typing`, `presence` events per provider guide.
4. Debounce or throttle typing events to reduce noise.
5. Reflect server state in atoms before rendering to avoid flicker.

## Data Safety
- Never log full message bodies in production builds.
- Strip or sanitize HTML content before rendering email bodies.
- Respect multi-tenant boundaries; all requests require tenant-aware headers (handled inside `MessagingHubHttpClient`—verify before modifying).

If unsure about a contract, pause and validate with backend documentation before merging.
