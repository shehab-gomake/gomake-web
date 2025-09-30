# GoMake Front Desk — Mock Frontend Upgrade Plan

A structured, execution-ready plan to transform the current empty front desk into a polished, fully mocked Helpdesk UI (no backend wiring yet). The target look & feel mirrors the reference screenshots you shared: a modern ticketing/helpdesk workspace with a left navigation rail, inbox views, a central list, a detail/work area, and a right metadata panel, plus drawers for creating knowledge, etc.

---

## 0) Guiding Principles

- **Pixel polish over plumbing**: Focus on UX, interactions, and visual fidelity using mock data.
- **Component-driven**: Break down by reusable, tested components.
- **Accessible & responsive**: WCAG AA, keyboard-first, works on 1280px+ and down to 1024px.
- **Design tokens**: Colors, radii, shadows, spacing via a single theme.
- **Fast iteration**: Storybook-first, hot-reload, visual tests.

---

## 1) Tech Stack (assumed)

- **Framework**: React + Vite (or Next.js App Router if preferred).
- **Styling**: Tailwind CSS + shadcn/ui for primitives (Button, Input, Card, Drawer, Tabs, Tooltip, Badge, Dropdown, Toast, Skeleton, Avatar).
- **Icons**: lucide-react.
- **State**: Zustand or Jotai for local app state; React Query optionally for mock fetch layer.
- **Mock API**: MirageJS or MSW (service worker) to emulate endpoints.
- **Quality**: TypeScript, ESLint, Prettier, Husky + lint-staged.
- **Docs/Fixtures**: Storybook + Chromatic (or Loki) for visual regression.

> If the repo already uses different tooling, keep structure but map tasks accordingly.

---

## 2) Information Architecture & Routes

- **/frontdesk** → Layout shell with 3 columns: Left Nav Rail, Inbox Column, Work Area (List + Detail), Right Meta Panel.
- **Nested views**

  - `/frontdesk/my-tickets`
  - `/frontdesk/past-due`
  - `/frontdesk/high-priority`
  - `/frontdesk/unassigned`
  - `/frontdesk/all`
  - `/frontdesk/live-chats` (stub)
  - `/frontdesk/boards` (stub)

- **Ticket deep-link**: `/frontdesk/:view/:ticketId`
- **Drawers**: `/frontdesk/knowledge/new` (URL state-backed), `/frontdesk/compose` (modal state).

---

## 3) Data Model (mock)

```ts
// Ticket
id: string
code: string // e.g., OPS-102
subject: string
createdAt: string
updatedAt: string
status: 'To Do' | 'In Progress' | 'Done' | 'On Hold'
priority: 'Low' | 'Medium' | 'High' | 'Urgent'
assignees: User[]
reporter: User
project: string | null
type: 'Task' | 'Bug' | 'Question'
dueDate?: string | null
tags: string[]
messagePreview: string
messages: Message[]
linkedTickets: { code: string; status: string; assignees: User[]; }[]
attachments: Attachment[]

// Message
id: string
from: User
cc?: User[]
visibility: 'public' | 'private'
bodyHtml: string
createdAt: string

// User
id: string
name: string
email: string
avatarUrl?: string

// Filters
views: Array<{ id: string; name: string; count?: number }>
```

---

## 4) Visual/UX Targets (derived from reference)

- **Left Nav Rail**: vertical icons, hover tooltips, active state.
- **Inbox Column**: view tabs, search input, list with badges (project, status counts, SLA dates), bulk select.
- **Center Work Area**: ticket header (code, subject, created date), tabs for Public Reply / Private Comment, rich-text editor toolbar, attachment chips, canned responses, draft-saving indicator, Add to KB action.
- **Right Meta Panel**: status picker, priority dropdown, assignee, project, type, due date, reporter, tags, collapsible sections (Tasks, Collected Fields, Linked Tickets, History).
- **Drawers/Modals**: Create Knowledge (form with required fields, autocomplete), Create (+ split button), Add to KB confirmation toast.
- **Empty States**: unified inbox empty, selected view with zero results, no ticket selected.
- **Draft Conflict Banner**: slim inline banner showing another user editing; CTA to "Take control".

---

## 5) EPICS → User Stories → Tasks & Acceptance Criteria

### EPIC A — Design System & Theme

**Stories**

1. **As a dev**, I want a tokenized theme so components share colors/radii/shadows.

   - Tasks:

     - Create Tailwind config with CSS variables for theme (light first, dark later).
     - Add shadcn/ui install and generate base primitives.
     - Implement AppShell layout primitives (Rail, Column, Panel, Resizer, Divider).

   - **Acceptance**: Tokens documented in Storybook; components render with tokens; dark mode toggles behind a flag.

2. **Iconography & Badges**

   - Tasks: add lucide-react, design Badge variants (status, priority, count), Avatar sizes.
   - **Acceptance**: Badge variants in Storybook with controls.

---

### EPIC B — Layout Shell & Navigation

**Stories**

1. **Left Navigation Rail**

   - Tasks: Build NavRail with items (Inbox, Tickets, Chats, Boards, Settings), tooltips, keyboard nav.
   - **Acceptance**: Active route highlighted; fully keyboard accessible; tooltips on hover/focus.

2. **3-Column Responsive Layout**

   - Tasks: CSS grid with resizable gutters; collapse right panel on <1280px; hide left rail on <1100px with flyout.
   - **Acceptance**: Resizing persists in localStorage; panels collapse smoothly; no horizontal scroll at 1024px.

---

### EPIC C — Inbox & Views

**Stories**

1. **View Switcher & Counts**

   - Tasks: Build views (My Tickets, Past Due, High Priority, Unassigned, All Tickets), compute counts from mock store.
   - **Acceptance**: Changing view filters list; counts update; URL reflects view.

2. **Search & Quick Filters**

   - Tasks: Implement search input debounce; chips for Email/WhatsApp/DM; unread badge; sort & filter dropdowns.
   - **Acceptance**: Search narrows list across subject/messagePreview; filters are combinable; clear-all works.

3. **Ticket List**

   - Tasks: Virtualized list (optional), row composition: title, project tag, status dots, due date, assignee avatars, labels.
   - **Acceptance**: 1k+ items scroll smoothly; row hover states; selected row syncs to detail pane.

4. **Empty States & Skeletons**

   - Tasks: Design zero-result states and loading skeletons.
   - **Acceptance**: Shown appropriately; copy matches brand tone.

---

### EPIC D — Ticket Detail & Composer

**Stories**

1. **Ticket Header**

   - Tasks: Render code, subject, createdAt, participants pills, actions (copy link, more menu).
   - **Acceptance**: Matches reference spacing & typography.

2. **Message Thread**

   - Tasks: Render list of messages with avatars, visibility tags, timestamps, attachment chips.
   - **Acceptance**: Public vs Private clearly distinguished; long messages collapse with "Show more".

3. **Reply Tabs (Public / Private)**

   - Tasks: Tabs component; per-tab composer state; draft autosave to localStorage.
   - **Acceptance**: Switching tabs preserves draft; last-saved indicator every 2s idle.

4. **Rich Text Composer**

   - Tasks: Toolbar (B, I, U, lists, quote, code inline), mention dropdown (fake), insert emoji, attach file (fake list), canned responses dropdown.
   - **Acceptance**: Keyboard shortcuts; paste plain text; drag-and-drop to attachments list; toasts for actions.

5. **Add to Knowledge Base**

   - Tasks: "Add to KB" action opens drawer; pre-fills inquiry/response; save as draft.
   - **Acceptance**: Drawer form validates required fields; shows success toast; appears in right rail history.

6. **Draft Conflict Banner**

   - Tasks: Simulate “Mike is editing” banner using random timer.
   - **Acceptance**: Banner appears; clicking “Take Control” toggles ownership state; composer disabled while conflicted.

---

### EPIC E — Right Meta Panel

**Stories**

1. **Editable Fields**

   - Tasks: Priority, Assigned To (self/others), Project, Type, Due Date, Reporter, Tags.
   - **Acceptance**: Each control has inline validation & clear buttons; changes reflect immediately in list badges.

2. **Collapsible Sections**

   - Tasks: Tasks, Collected Fields (key/value), Linked Tickets (list with status chips), History (audit-like log).
   - **Acceptance**: Remember collapse state; history records edits from this session.

---

### EPIC F — Drawers, Modals, Toasters

**Stories**

1. **Global Create Split-Button**

   - Tasks: Primary + caret; options: Ticket, Knowledge, Task (stubs).
   - **Acceptance**: Opens proper modal/drawer; keyboard accessible; outside-click to close.

2. **Knowledge Create Drawer**

   - Tasks: Form fields (Inquiry, Response, Dialogue select, Expiration, Autocomplete toggle).
   - **Acceptance**: Required fields marked; save buttons (KB vs Local Draft) behave as expected.

---

### EPIC G — Mock Data & Services

**Stories**

1. **Fixtures & Generators**

   - Tasks: Seed 250–500 tickets with realistic names, varied statuses, messages, attachments.
   - **Acceptance**: Data persists across reloads (localStorage); seed reset command.

2. **Mock Service Layer**

   - Tasks: MSW/Mirage routes for list, detail, update, search; latency injection for loaders/skeletons.
   - **Acceptance**: Network tab shows fake calls; can switch “offline” mode for error states.

---

### EPIC H — Accessibility, i18n, Perf

**Stories**

1. **A11y Pass**

   - Tasks: Landmarks, focus traps in drawers/modals, ARIA for tabs, listbox, toasts; color contrast.
   - **Acceptance**: Axe devtools shows 0 critical issues; keyboard-only flows succeed.

2. **i18n Ready**

   - Tasks: Extract strings to i18n (en only now); support RTL flip (behind flag).
   - **Acceptance**: Language switch toggles works in Storybook mocks; no clipped UI.

3. **Performance**

   - Tasks: Code-split drawers/modals; virtualize long lists; memoize heavy rows.
   - **Acceptance**: Lighthouse perf > 90 on desktop sample route.

---

### EPIC I — Testing & CI

**Stories**

1. **Storybook Coverage**

   - Tasks: Stories for all atomic/molecule/organisms; controls for states.
   - **Acceptance**: 90% component coverage by stories; visual snapshots configured.

2. **Unit & Interaction Tests**

   - Tasks: Vitest + Testing Library; key flows (search, select, edit right panel, draft autosave, drawer validation).
   - **Acceptance**: >80% lines in `/src/components`.

3. **E2E Happy Path**

   - Tasks: Playwright spec: open view → select ticket → add private note → change priority → open KB drawer → save draft.
   - **Acceptance**: Test passes in CI; screenshot baseline stored.

---

## 6) Task Board (sequenced, 2–3 week sprint per block)

**Sprint 1: Foundations**

- Repo setup (TS, Vite/Next, Tailwind, shadcn/ui, ESLint/Prettier, Husky)
- Theme tokens & primitives in Storybook
- AppShell layout with Nav Rail + Panels (placeholders)

**Sprint 2: Inbox & List**

- Views, counts, search/filters
- Ticket list with skeletons & empty states
- Mock data seed v1

**Sprint 3: Ticket Detail & Composer**

- Header, thread, reply tabs, composer toolbar, attachments
- Draft autosave and conflict banner

**Sprint 4: Right Panel & Drawers**

- Editable fields, collapsible sections, linked tickets, history
- Create split-button + Knowledge drawer

**Sprint 5: Polish, A11y, Testing**

- A11y pass, performance tweaks, Storybook coverage, E2E
- Visual QA to reference screenshots; design tweaks

---

## 7) Definition of Done (per feature)

- Matches reference spacing/typography within an 8px grid tolerance.
- Keyboard accessible; focus states visible; Axe 0 critical.
- Storybook story exists with edge cases.
- Unit tests for logic; E2E for core path.
- Works in Chrome + Safari latest; 1280–1920 responsive.

---

## 8) Deliverables

- Running `/frontdesk` route with mocked data and all core interactions.
- Storybook with component catalog.
- README with dev scripts, seeds, and how to flip flags (dark, RTL, offline, latency).

---

## 9) Nice-to-Haves (post-MVP)

- Board (Kanban) stub for tickets.
- Live chat stub with transcript view.
- Theme switcher (light/dark/system) surfaced in header.
- User presence/typing indicators in thread.

---

## 10) Work Breakdown (Jira-ready subtasks)

1. Setup & Tooling

   - Create app scaffold; configure Tailwind/shadcn; add linting/format
   - Install Storybook; add CI workflow

2. Theme & Tokens

   - Define color scale, spacing, radii, shadows, typography ramp
   - Map tokens to Tailwind CSS variables

3. Primitives

   - Buttons, Inputs, Selects, Switch, Tabs, Drawer, Tooltip, Badge, Avatar, Toast

4. AppShell

   - Left Rail (icons, tooltips)
   - Column grid + resizers + persistence

5. Inbox Views

   - View switcher & counts
   - Search & filters
   - Ticket list (virtualized) + skeletons + empty states

6. Ticket Detail

   - Header
   - Message thread
   - Composer (tabs, toolbar, attachments, canned responses)
   - Draft autosave + conflict banner

7. Right Panel

   - Field editors (priority, assignee, etc.)
   - Collapsible subsections (Tasks, Fields, Linked, History)

8. Drawers & Modals

   - Create split button
   - Knowledge create drawer + validations

9. Mock Services

   - Fixtures & generators
   - MSW/Mirage routes + latency + error toggles

10. Quality

- A11y pass
- Unit + E2E tests
- Visual regression baselines

---

## 11) Acceptance Review Checklist (for PM/Design)

- [ ] Visual parity with references (nav rail, list density, right panel grouping)
- [ ] Empty states copy approved
- [ ] Keyboard nav demo recorded
- [ ] Dark mode previewed (optional)
- [ ] Knowledge drawer flow signed off

---

## 12) Estimation (rough)

- **MVP mocked UI**: 4–6 weeks with 2 FE devs + 1 part-time designer.
- **Polish & tests**: +1–2 weeks.

---

## 13) Risks & Mitigations

- **Scope creep** → lock MVP; defer boards/chats beyond stubs.
- **Performance** with 1k tickets → virtualize list; memoize rows.
- **A11y regression** → integrate axe checks in CI.

---

## 14) Handoff Notes

- Provide token sheet and spacing rules.
- Export reference snapshots as PNGs into `/docs/reference/` for side-by-side QA.
- Keep all mock API contracts in `/mocks/schema.ts` for easy backend alignment later.
