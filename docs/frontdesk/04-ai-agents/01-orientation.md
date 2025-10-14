# Orientation: FrontDesk System Snapshot

Use this primer to ground yourself before touching code. It condenses the authoritative docs under `docs/frontdesk/`.

## 1. Mission & Scope
- FrontDesk unifies Direct Messages, Email, and WhatsApp conversations.
- Delivery goal: consistent tri-pane workspace (`Navigation` | `List` | `Detail`) with real-time updates.
- Stay out of non-FrontDesk modules unless the change explicitly requires cross-feature coordination.

## 2. High-Level Architecture
- Entry point: `src/widgets/frontdesk/frontdesk-widget.tsx` selects provider views.
- Layout: `src/widgets/frontdesk/layouts/three-column/ThreeColumnLayout.tsx` (currently two columns—refactor toward real three-column per [Improvement Plan](../../archive/frontdesk%20docs/FRONTDESK_IMPROVEMENT_PLAN.md)).
- Providers live under `src/widgets/frontdesk/providers/{internal,email,whatsapp,unified}/` with siblings `components/`, `hooks/`, and `controllers/`.
- State: Recoil atoms/selectors per provider in `src/store/frontdesk/`.
- APIs: REST services under `src/services/frontdesk/api/`, real-time via `src/services/frontdesk/websocket/messaging-socket.service.ts`.

## 3. Current Gaps to Watch
- Layout fragmentation: each provider ships bespoke structure—standardize during new work.
- WhatsApp provider is mostly mock data—treat any change here as greenfield integration.
- Unified inbox renders lists but not provider-specific detail views.
- Shared conversation components are not yet generic; extending them requires careful prop design.

## 4. Key Reference Docs (Load As Needed)
- [FRONTDESK_ARCHITECTURE.md](../00-core/FRONTDESK_ARCHITECTURE.md) – structural overview and refactoring goals.
- [DEVELOPER_GUIDE.md](../00-core/DEVELOPER_GUIDE.md) – quick commands, directory map, common tasks.
- [direct-messages-frontend.md](../01-providers/direct-messages/direct-messages-frontend.md) – DM REST + WebSocket contracts.
- [FRONTDESK_KNOWLEDGE_BASE.md](../FRONTDESK_KNOWLEDGE_BASE.md) – long-form system knowledge and current initiatives.
- [FRONTDESK_IMPROVEMENT_PLAN.md](../../archive/frontdesk%20docs/FRONTDESK_IMPROVEMENT_PLAN.md) – archived roadmap for historical context.

## 5. Directory Cheat Sheet
```
src/widgets/frontdesk/
├── components/            # shared UI widgets
├── controllers/           # navigation/business logic
├── hooks/                 # provider-specific behavior
├── layouts/               # structure + navigation
└── providers/             # feature entry points per channel

src/store/frontdesk/       # Recoil atoms/selectors
src/services/frontdesk/api/  # HTTP clients per provider
```

## 6. Data Flow Summary
1. UI event triggers provider hook.
2. Hook orchestrates Recoil updates + service calls.
3. REST via `MessagingHubHttpClient` derivatives (`src/services/frontdesk/api/...` or provider utility clients).
4. Real-time updates push through `messaging-socket.service.ts` (exported as `messagingService`) to Recoil.
5. Components subscribe via `useRecoilValue` or selectors.

Confirm this mental model before starting the task—misplaced code is the fastest path to regressions.
