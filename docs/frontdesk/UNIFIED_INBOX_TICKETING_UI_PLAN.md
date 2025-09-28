# Unified Inbox Ticketing UI Plan

## Objective
- Introduce ticket-aware UI surfaces inside the existing FrontDesk unified inbox with the smallest possible layout and component churn.
- Preserve the current three-column structure (`NavigationSidebar` → `DynamicListPanel` → `ContentArea`) while layering ticket metadata, actions, and filters on top of the existing provider aggregation flow.
- Match the ticketing system blueprint in `UNIFIED_TICKETING_SYSTEM_DESIGN.md` (ticket lifecycle, assignment, SLA tracking) while reusing FrontDesk components wherever possible.

## Current Unified Inbox Snapshot
- `frontdesk-widget.tsx` renders `ThreeColumnLayout` with `NavigationSidebar` (channel switching) + `DynamicListPanel` (search + list) + `ContentArea` (provider view).
- `UnifiedProvider` already holds the inbox list pane (380px) and message preview panel, using `UnifiedConversationList` for grouped conversations and a header with filter/sort button groups.
- `UnifiedConversationList` renders name, provider glyph, unread badge, last message timestamp, optional account chip, and priority chip derived from `UnifiedConversation`.
- `useUnifiedProvider` leverages `aggregateConversations` selector output, but email/WhatsApp data is stubbed pending real atoms; internal DM data is live.

## Ticketing Requirements Touchpoints
- Tickets reuse `Conversation` threads with additional metadata: ticket number, status lifecycle (`OPEN`, `PENDING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED`), priority (`LOW`→`URGENT`), SLA timestamps, assignment (agent, manager), category and tags, plus audit trail (`TicketHistory`).
- Closed tickets should be read-only; resolved tickets can auto-reopen on customer reply; managers control assignments and reopen actions.
- Agents need quick visibility into ticket status, ownership, priority, SLA breaches, and must be able to reply using the existing provider channel determined by the last inbound message.
- Managers require filtering for unassigned/backlog queues and high-priority tickets, plus bulk assignment workflows (future work).

## Minimal UI Adjustments

### 1. Navigation & Global Filters
- Keep `NavigationSidebar` unchanged; treat ticketing as the new default behavior for `all/email/whatsapp/internal` channels.
- Update the `unreadCountByProviderSelector` wiring to surface ticket-aware counts (filter by `ticketStatus !== 'CLOSED'`).
- Extend the `UnifiedProvider` filter menu to include ticket status choices (`Open`, `Pending`, `In Progress`, `Resolved`, `Reopened`, `Closed`*) and an "Unassigned" quick toggle sourced from `Ticket.assigneeId`.
- Reuse existing filter badge counter; a closed-ticket view is optional (only load when explicitly filtered to minimize data churn).

### 2. List Panel Header Enhancements
- In `UnifiedProvider` header add inline summary chips for ticket SLA: e.g., `SLA Breached` (red) when `ticket.sla.breached === true`, `Due in <Xh` (amber) when `firstResponseDue`/`resolutionDue` within 12h.
- Promote `searchQuery` placeholder to "Search tickets, contacts, #numbers" and support `#1234` ticket-number lookup via `aggregateConversations` search.
- Add a lightweight "Views" dropdown (optional) to pre-filter: `My tickets`, `Unassigned`, `All active`; implement as presets that call `updateFilters` (no new state slice).

### 3. Conversation List Item Decorators
- Extend `UnifiedConversation` type with `ticketId`, `ticketNumber`, `status`, `assigneeName`, `sla` summary (normal/at risk/breached) pulled from the new backend response.
- In `UnifiedConversationList`:
  - Prefix title with `#<ticketNumber>` when available (e.g., `#1042 · ACME Corp`).
  - Replace current priority chip with combined status/priority pill: status color (map statuses to theme palette) + uppercase priority text when `priority !== 'low'`.
  - Show assignee initials/avatar fallback on the right column (reuse `Avatar` + `Tooltip`).
  - Overlay SLA indicator dot (green/amber/red) on the unread badge using `Badge` `anchorOrigin` to avoid layout shifts.
  - Display tags (category, channel) as `Chip` row below last message only when space allows (truncate to two chips to avoid layout expansion).
- Maintain existing group-by-date section headers to avoid structural changes.

### 4. Conversation Detail Pane (Right Column)
- Replace the placeholder detail view with a ticket-focused header card that mirrors the lifecycle in `UNIFIED_TICKETING_SYSTEM_DESIGN.md`:
  - Title row renders `#ticketNumber – subject/customer name` alongside a status selector (map enum values to the color tokens used in Direct Messages) and a priority pill (`LOW → URGENT`).
  - Secondary meta row reuses `Stack`, `Chip`, and `Avatar` to show assignee/manager (with `UserSelector` modal on click), ticket category tags, and live SLA countdown chips (`TicketSLA.firstResponseDue`, `resolutionDue`).
  - Action buttons stay within the current `Box` layout: `Reply` (routes to provider composer via existing send handlers), `Assign` (opens `UserSelector`), `Change status`, `Add note` (writes to `TicketHistory` using the internal provider note composer).
- Mount this header inside `ContentArea` above the existing provider viewers (`EmailProviderView`, `WhatsAppProviderView`, `DirectMessagesProviderView`) so message rendering stays untouched.
- Add a collapsible "Ticket History" drawer on the right edge fed by `TicketHistory[]`; reuse the Direct Messages `MessageList` styling for timeline events and default it to collapsed to minimize layout change.

### 5. Workflow Hooks
- Use the existing `selectConversation` handler to navigate to provider view; extend it to stash `ticketId` in Recoil (`unifiedSelectedConversationAtom`) for downstream actions.
- Add `useUnifiedProvider` stubs for `assign`, `updateStatus`, `addTag`, `toggleSlaSnooze` that call the new ticket endpoints; wire buttons only after backend available.
- For minimal change, reuse existing toast/snackbar utilities from providers when showing success/error states.

## State & Data Updates
- Extend `unified.atoms.ts` to store ticket-centric filters (`status`, `assigneeId`, `showClosed`) without altering existing selector keys.
- Update `aggregateConversations` to accept ticket payloads (augment `BaseConversation` mapping) and propagate new fields into `UnifiedConversation`.
- Consume real email/WhatsApp ticket conversations once API provides them; until then, internal DMs remain fallback data.
- Ensure selectors exclude closed tickets by default (`filters.showClosed !== true`) so counts align with agent expectations.

## Component Reuse Strategy
- `NavigationSidebar` stays intact—reuse existing channel configuration and badge plumbing; adjust selectors so unread badges reflect ticket counts without cloning the component.
- `DynamicListPanel` already exposes `headerActions` and `accountSelector`; keep the structure and feed ticket filter chips/dropdowns through those props instead of introducing a new header.
- `UnifiedConversationList` handles grouped list rendering; extend its row layout with additional `Chip`, `Badge`, and `Avatar` instances sourced from Material UI (matching current style) rather than new bespoke components.
- `UnifiedProvider` continues to own list/header state. Layer ticket controls inside the existing MUI `Box`/`ButtonGroup` scaffolding so no alternative provider shell is needed.
- `ContentArea` still hosts provider-specific viewers (`EmailProviderView`, `WhatsAppProviderView`, `DirectMessagesProviderView`). Mount the new ticket header card *above* those child components so message rendering stays untouched.
- `MessageList`, `MessageInput`, and `UserSelector` from the internal provider can back the ticket history/note entry flows; wire them through new controller hooks instead of rebuilding equivalents.

## Component Touchpoints
- `src/widgets/frontdesk/providers/unified/UnifiedProvider.tsx`: header chips, filter menu entries, ticket action buttons, detail pane swap.
- `src/widgets/frontdesk/providers/unified/components/UnifiedConversationList.tsx`: list item badges/pills, ticket number prefix, assignee avatar.
- `src/widgets/frontdesk/providers/unified/hooks/useAggregatedConversations.ts`: new filter fields, action handlers, payload typing.
- `src/widgets/frontdesk/providers/unified/utils/conversation-aggregator.ts`: augment tagging helpers with ticket metadata + SLA logic.
- `src/store/frontdesk/atoms/unified.atoms.ts` & `selectors/aggregation.selectors.ts`: persist ticket filters, hydrate additional data, adjust unread counts.
- `src/widgets/frontdesk/layouts/components/DynamicListPanel/DynamicListPanel.tsx`: update search placeholder text and optional views dropdown slot (headerActions prop).

## Deferred Enhancements / Nice-to-Haves
- Manager dashboard (bulk assignment, workload charts) should live outside unified inbox for now; scope to future feature.
- Drag-and-drop attachments, canned replies, advanced analytics noted in `FRONTDESK_IMPROVEMENT_PLAN.md` remain future iterations.
- Mobile-responsive optimizations can follow once desktop experience stabilizes.

*Closed tickets remain discoverable via explicit filter toggle to avoid overwhelming agents with resolved history.*
