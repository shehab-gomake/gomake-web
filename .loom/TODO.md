# FrontDesk Chatwoot - Inception Tasks

## Phase 1: Inception (Complete)
- [x] Soul Scan (Audit File Structure).
- [x] Atlas Initialization (Create Documentation).
- [x] Task Tracking Setup.
- [x] Finalize Alignment Report.

## Phase 2: Stabilization (Priority)
- [x] **WebSocket Audit**:
    - [x] Service logic (`chatwoot-websocket.service.ts`) is sound.
    - [x] Test Suite (`webhook-test-view.tsx`) is implemented and routed.
    - [ ] **Manual Verification Required**:
        1. Open FrontDesk > Chatwoot > Settings > Webhook Test.
        2. Verify connection status to `messaging-hub-v2`.
        3. Send a test message from another client and watch for events.
- [ ] **Styling Unification**:
    - [x] Audit `ChatwootConversationListItem`: Uses `DSConversationListItem` (Pass).
    - [ ] Ensure new changes use these primitives.

## Phase 3: Implementation
- [ ] Refine Chatwoot Provider features.
- [ ] Optimize Performance (Virtual Scrolling, Memoization).

## Backlog
- [ ] Complete Unified Inbox Aggregation.
- [ ] Normalize Message Types across providers.
