# Frontend IA & Wireframes — Messaging Hub (Next.js)

This document defines the UI tree, navigation, lists (fields, buttons, menus), and wireframe sketches for the multi‑tenant messaging hub. It is intentionally detailed so a designer can jump straight to high‑fidelity mocks.

---

## 1) Information Architecture (Sitemap)

```
App Shell (Header + Left Nav)
├── Home (Overview)
│   ├── My Inbox summary (counts by provider)
│   ├── Team Queues summary (per team)
│   └── My Work summary (WorkItems by status)
├── Inbox
│   ├── Unified (All providers)
│   ├── Gmail
│   │   ├── Personal
│   │   └── Team Mailboxes (e.g., Finance)
│   ├── WhatsApp (by connected numbers)
│   └── Internal (DMs, Channels)
├── Team Queues
│   ├── <Team A>
│   │   ├── Unassigned
│   │   ├── Assigned
│   │   └── All
│   └── <Team B> ...
├── Assigned to Me (Work Board)
│   ├── Board (Kanban)
│   └── List (compact)
├── Conversations
│   ├── All
│   ├── Mentions
│   └── With Links (Jobs/Invoices)
├── Clients (optional v1.5)
│   ├── Handles (email/phone)
│   └── Client Profiles (read‑only)
├── Admin
│   ├── Provider Accounts
│   │   ├── Personal Accounts
│   │   └── Team Accounts
│   ├── Routing Rules (optional)
│   └── Roles & Access (read‑only in v1)
└── Settings (user‑level)
    ├── Notifications & Shortcuts
    ├── Default From Accounts
    └── Presence/Privacy
```

---

## 2) App Shell

### 2.1 Header (Top Bar)

* Left: App logo, product name
* Global search (⌘/Ctrl + K): search conversations, clients, work items
* Provider filter chips: All | Gmail | WhatsApp | Internal (context‑aware)
* Tenant switcher (if user belongs to multiple tenants)
* Notifications bell (assignments, mentions, failures)
* User menu: profile, keyboard shortcuts, logout

### 2.2 Left Navigation

* Home
* Inbox ▸ Unified / Gmail / WhatsApp / Internal
* Team Queues ▸ (dynamic list of teams)
* Assigned to Me ▸ Board / List
* Conversations ▸ All / Mentions / With Links
* Admin ▸ Provider Accounts / Routing Rules / Roles (read‑only)
* Settings

---

## 3) Core Layout Patterns

* Two‑pane (List + Detail) for Inbox/Queues/Conversations
* Kanban board for Assigned to Me
* Drawers for side info (Conversation details, Client info, Links)
* Modals for connect flows, send message, confirm destructive actions
* Toasts for success/errors; inline banners for warnings (e.g., token expired)

---

## 4) Inbox — List View (Unified)

### 4.1 Filters & Sorting (above the list)

* Scope: Personal | My Teams | All I can see
* Provider: All | Gmail | WhatsApp | Internal
* Owner: Personal (my personal accounts) | Team (mailboxes I’m in)
* Assignee: Me | Unassigned | Anyone | [specific user]
* Status: Open | Pending | Closed (conversation level)
* Labels: multi‑select (e.g., Billing, Priority)
* Linked Entities: Job | Invoice | Receipt | None
* Date: Quick ranges + exact
* Sort: Last activity (desc) | Unread first | Priority
* Search: Query box (subject/text/participants)

### 4.2 List Row Anatomy

* Leading: Provider icon (Gmail/WA/Internal), unread dot
* Primary line: Subject (email) or Conversation title (first participants)
* Secondary: Snippet (last message text), badges for entity links (Job #, Invoice #)
* Meta (right): Assignee avatar (or team), unread count badge, last activity timestamp
* Labels: colored pills
* WA delivery status (for latest outbound): sent/delivered/read ticks

### 4.3 Row Actions (hover or kebab menu)

* Open
* Assign… (modal with RBAC)
* Create Work Item
* Add/Remove Label
* Link Entity… (Job/Invoice)
* Mark as Read/Unread
* Mute Notifications (per conversation)
* Copy Link

### 4.4 Bulk Actions (when rows selected)

* Assign to…

* Mark Read/Unread
* Add Label
* Create Work Items (one each)

### 4.5 Empty States

* No conversations match → show tips + clear filters button
* No providers connected → CTA to connect Gmail/WhatsApp

---

## 5) Conversation Detail View

Layout: Three sections — Header, Message thread, Right side drawer (toggleable)

### 5.1 Header

* Breadcrumb: Inbox / Team / Folder
* Title: Subject (email) or Participants (WA/Internal)
* Provider badge
* Owner: Personal / Team name
* Assignee: avatar + name (editable if permitted)
* Labels: pills (editable)
* Buttons: Assign, Create Work Item, More (mute, move, link entity)

### 5.2 Messages Thread

* Messages in chronological order, grouped by day
* Each message bubble:
  * Header: Sender name, handle (email/phone), timestamp
  * Body: text (rendering HTML email as simplified content), attachments preview
  * Status: WA ticks for our outbound; “Sent via finance@mail.com” footnote for email
* Typing indicator (Internal only) at bottom of thread

### 5.3 Composer (bottom)

* From selector: dropdown of ProviderAccounts user can send as (personal Gmail, team Gmail, WA number, Internal identity)
* To/CC/BCC (email only, collapsible)
* Message box (multiline)
* Attachments button
* Quick actions: Insert template (WA, optional), Insert internal note toggle
* Send (primary)
* Send & Create Work Item (split button)

### 5.4 Right Drawer: “Details”

* Participants (agent/client handles, presence for Internal)
* Client (resolved from email/phone; link to CRM if available)
* Linked Entities (Job/Invoice/Receipt list; Add link button)
* Activity (assignment changes, labels, notes)
* Provider info (account name, last sync, errors)

---

## 6) Assigned to Me — Work Board

### 6.1 Board View (Kanban)

Columns (default): Backlog, In Progress, Waiting, Done, Canceled

Card Anatomy

* Title
* Related Conversation icon + quick link
* Client name (if resolved)
* Due date (if any), Priority tag
* Assignee avatar (you)

Board Controls

* Filters: Status (columns visible), Labels, Provider, Linked Entity
* Search box
* Add Work Item (+) → modal (title, link to conversation/message)
* Bulk actions: Change status, Add label

Card Actions (hover/kebab)

* Open details (side drawer)
* Reassign (RBAC)
* Link entity (Job/Invoice)
* Delete (if permitted)

### 6.2 List View

* Table columns: Title, Status, Related Conversation, Labels, Due, Updated, Actions

### 6.3 Work Item Detail (Drawer)

* Title editable, Description
* Status dropdown, Priority, Due date
* Links (entities + conversation/message)
* Activity (WorkLog)

---

## 7) Team Queues

### 7.1 Team Switcher (sub‑nav)

* Tabs: Unassigned, Assigned, All
* Counters for each

### 7.2 List Behaviors

* Same as Inbox rows, but Assignee column more prominent
* Quick action: Assign to me button on each row (if permitted)

---

## 8) Admin — Provider Accounts

### 8.1 Overview

* Personal Accounts (user’s own)
* Team Accounts (by team)

Row fields

* Provider (icon), Display From (e.g., finance@mail.com)
* Owner (User/Team)
* Status (Active/Revoked)
* Last Sync / Errors
* Actions: Connect / Reconnect, Revoke, Set default From

### 8.2 Connect Flows

* Gmail (personal): OAuth modal → redirect → success screen
* Gmail (team): Team selection, admin consent, OAuth → success
* WhatsApp: Phone number ID + token, webhook verify test

---

## 9) Admin — Routing Rules (Optional v1)

* Table of rules with order (drag to reorder)
* Rule card: If [Account / From domain / Keyword in subject/body] Then [Label / Assign to (user/team)]
* Buttons: New Rule, Disable/Enable, Dry‑Run

---

## 10) Settings (User)

* Default From accounts (per provider)
* Notifications preferences (assignments, mentions)
* Keyboard shortcuts cheatsheet
* Presence visibility (Internal)

---

## 11) Wireframe Sketches (ASCII)

### 11.1 App Shell & Inbox (List + Detail)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Logo  Product         ⌘K Search…    [All|Gmail|WA|Internal]  Tenant  User  │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ Home              │ Filters: Scope ▾  Provider ▾  Assignee ▾  Labels ▾     │
│ Inbox             │ Search ▢_________________________  Sort ▾              │
│  • Unified        ├─────────────────────────────────────────────────────────┤
│  • Gmail          │ ● [Gmail]  ACME PO Update        [Eli]  3  14:22       │
│  • WhatsApp       │     "Can we confirm the order…"   Labels: Billing       │
│  • Internal       │                                                             │
│ Team Queues       │ ○ [WA]     +972-55-123…  "Thanks!"    [Unassigned] 11:59 │
│  • Finance        │                                                             │
│  • Support        │ ○ [Internal] #ops  outage notes…   [Nina]  1  09:10      │
│ Assigned to Me    │                                                             │
│ Conversations     ├───────────────────────────────────┬──────────────────────┤
│ Admin             │  Message Thread                   │  Details ▸           │
│ Settings          │  ———— Today ————                  │ Participants         │
│                   │  From: ACME <a@acme.com> 14:21    │ Client: ACME (link)  │
│                   │  Body… attachments…               │ Links: Job #123      │
│                   │  From: Me (finance@mail.com) 14:22│ Assignee: Eli (✎)    │
│                   │  Reply box… [From: finance@mail]  │ Labels: Billing      │
│                   │  [Attach] [Send] [Send & Create]  │ Provider: Gmail      │
└───────────────────┴───────────────────────────────────┴──────────────────────┘
```

### 11.2 Assigned to Me — Board

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Backlog              │  In Progress           │  Waiting               │  Done │
├───────────────────────┼────────────────────────┼────────────────────────┼───────┤
│ ▣ Invoice ACME Q3     │ ▣ Create order #12345  │ ▣ Waiting on client    │ ▣ …   │
│  • WA convo • ACME    │  • Email • ACME        │  • Channel • #ops      │       │
│  Due: Sep 30  Pri: H  │  Pri: N                │  Due: Oct 2            │       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Team Queue — Unassigned

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Team: Finance   Tabs: [Unassigned] [Assigned] [All]                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ○ [Gmail] Subject…  From ACME  —  [Assign to me] [Assign…] [Label]          │
│ ○ [WA]    +972… "Need invoice"  —  [Assign to me] [Assign…] [Label]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12) Lists of Buttons, Menus, and States

### 12.1 Global

* Header: Search, Provider filter chips, Tenant switcher, Notifications, User menu
* Toasts: success/error; actionable (View Conversation, Retry)

### 12.2 Inbox/Queues list toolbar

* Filters (Scope, Provider, Owner, Assignee, Status, Labels, Linked Entity, Date)
* Actions: Assign…, Create Work Item, Mark Read/Unread, Add Label

### 12.3 Conversation header actions

* Assign (opens RBAC‑aware modal)
* Create Work Item
* More ▾ (Mute, Link Entity, Copy Link)

### 12.4 Composer actions

* From selector ▾
* To/CC/BCC (email only)
* Attach
* Insert template (WA)
* Internal note toggle
* Send (primary)
* Send & Create Work Item (split)

### 12.5 WorkItem actions

* Card: Open, Reassign, Change Status, Link Entity, Delete
* Board: Add Work Item, Filter, Bulk change

### 12.6 Admin

* Provider Accounts: Connect, Reconnect, Revoke, Set default From
* Routing Rules: New, Enable/Disable, Dry‑Run, Reorder

### 12.7 Presence & Typing (Internal)

* Presence dot on avatars (green/gray); tooltip last seen
* Typing ribbon at bottom of thread (name list compressed)

---

## 13) Empty, Loading, Error States (Examples)

* Empty Inbox: “No conversations yet. Connect a provider to get started.” [Connect Gmail] [Connect WhatsApp]
* Loading: shimmer skeletons for list rows and bubbles
* Token expired: inline banner with [Reconnect] action
* Permission denied: modal explaining required role (contact admin)

---

## 14) Keyboard Shortcuts (recommended)

* `/` focus search
* `j/k` move selection, `o` open
* `a` assign, `w` create Work Item
* `r` reply, `e` mark as read, `u` mark as unread

---

## 15) Wireframe Acceptance Checklist

* Primary tasks (read/reply/assign/create work item) are reachable in ≤ 2 clicks
* Provider differences are visible but unified (From selector, WA ticks)
* Team vs Personal clearly labeled
* Presence/typing only in Internal
* RBAC feedback is clear when actions are blocked
* All screens have meaningful empty/loading/error states

---

## 16) Next Steps for Design

1. Convert ASCII wireframes into lo‑fi Figma frames using the IA and components above.
2. Define a small design system (colors, typography, buttons, chips, pills, avatars).
3. Produce a clickable prototype for the four core flows:
   * Reply to email from team mailbox
   * Reply to WhatsApp DM
   * Assign to me → WorkItem to Done
   * Internal channel chat with presence/typing

