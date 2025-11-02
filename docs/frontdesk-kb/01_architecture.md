# System Architecture

This document provides a comprehensive overview of the FrontDesk system architecture, including the codebase structure, data flow patterns, and integration points.

## Table of Contents
1. [Codebase Structure](#1-codebase-structure)
2. [Three-Column Layout Architecture](#2-three-column-layout-architecture)
3. [State Management](#3-state-management)
4. [Services Layer](#4-services-layer)
5. [Data Flow Patterns](#5-data-flow-patterns)
6. [Integration Points](#6-integration-points)

---

## 1. Codebase Structure

The FrontDesk module follows a clean, modular architecture with clear separation of concerns.

```
src/
├── widgets/frontdesk/                    # UI Components & Business Logic
│   ├── frontdesk-widget.tsx              # Main entry point & routing coordinator
│   │
│   ├── routing/                          # Centralized routing system
│   │   ├── index.ts                      # Public API exports
│   │   ├── types.ts                      # Route type definitions
│   │   ├── route-parser.ts               # URL parsing logic
│   │   ├── route-builder.ts              # Route construction utilities
│   │   └── hooks/
│   │       └── use-frontdesk-router.ts   # Main routing hook
│   │
│   ├── layouts/                          # Layout components
│   │   ├── three-column/                 # Three-column layout system
│   │   │   ├── ThreeColumnLayout.tsx     # Main layout wrapper
│   │   │   └── index.ts
│   │   └── components/                   # Layout subcomponents
│   │       ├── NavigationSidebar.tsx     # Left: Provider navigation
│   │       ├── DynamicListPanel.tsx      # Middle: List/filter panel
│   │       └── ContentArea.tsx           # Right: Main content
│   │
│   ├── providers/                        # Communication providers
│   │   ├── base/                         # Base interfaces & adapters
│   │   │   ├── provider.interface.ts     # Legacy provider interface
│   │   │   ├── unified-provider.interface.ts  # Unified provider interface
│   │   │   └── adapters/                 # Adapter pattern implementations
│   │   │       ├── email-provider.adapter.ts
│   │   │       └── internal-provider.adapter.ts
│   │   │
│   │   ├── internal/                     # Direct Messages (DMs)
│   │   │   ├── direct-messages-provider-view.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-internal-provider.ts
│   │   │   ├── components/               # DM-specific UI
│   │   │   └── types/                    # DM type definitions
│   │   │
│   │   ├── email/                        # Email provider (Gmail)
│   │   │   ├── email-provider-view.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-email-provider.ts
│   │   │   └── components/               # Email-specific UI
│   │   │
│   │   ├── whatsapp/                     # WhatsApp provider
│   │   │   ├── whatsapp-provider-view.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-whatsapp-provider.ts
│   │   │   └── components/               # WhatsApp-specific UI
│   │   │
│   │   ├── tickets/                      # Support Tickets provider
│   │   │   ├── hooks/
│   │   │   │   └── use-tickets-provider.ts
│   │   │   ├── components/
│   │   │   │   ├── ticket-list-panel.tsx
│   │   │   │   └── ticket-detail-view.tsx
│   │   │   └── types/                    # Ticket type definitions
│   │   │
│   │   └── unified/                      # Unified inbox view
│   │       └── UnifiedProvider.tsx
│   │
│   ├── components/                       # Shared React components
│   ├── design-system/                    # Storybook components & design tokens
│   ├── hooks/                            # Reusable React hooks
│   ├── types/                            # Shared TypeScript type definitions
│   └── utils/                            # Utility functions
│
├── store/frontdesk/                      # Recoil State Management
│   ├── atoms/                            # Recoil state atoms (per-provider)
│   │   ├── tickets.atoms.ts              # Ticket state
│   │   ├── internal.atoms.ts             # Direct messages state
│   │   ├── email.atoms.ts                # Email state
│   │   ├── whatsapp.atoms.ts             # WhatsApp state
│   │   ├── unified.atoms.ts              # Unified view state
│   │   ├── navigation.atoms.ts           # Navigation state
│   │   └── notifications.atoms.ts        # Notification state
│   │
│   ├── selectors/                        # Recoil selectors for derived state
│   │   ├── navigation.selectors.ts       # Navigation-derived values
│   │   └── aggregation.selectors.ts      # Cross-provider aggregation
│   │
│   └── index.ts                          # Public exports
│
└── services/frontdesk/                   # External Service Integration
    ├── api/                              # REST API clients
    │   ├── tickets.service.ts            # Tickets REST API
    │   ├── direct-messages.service.ts    # Direct Messages REST API
    │   ├── notifications.service.ts      # Notifications REST API
    │   └── index.ts
    │
    ├── websocket/                        # WebSocket services
    │   ├── messaging-socket.service.ts   # Core WebSocket service
    │   ├── direct-messages-websocket.service.ts  # DM real-time
    │   ├── ticket-socket.service.ts      # Ticket real-time (20 events)
    │   ├── notifications-websocket.service.ts    # Notification real-time
    │   └── index.ts
    │
    ├── utils/                            # Service utilities
    │   └── notification-type-mapper.ts   # Notification type mapping
    │
    └── index.ts                          # Unified service exports
```

### Key Design Principles

1. **Separation of Concerns**: UI components, state management, and services are cleanly separated
2. **Provider Pattern**: Each communication channel is a self-contained provider
3. **Centralized State**: All state is managed via Recoil with scoped atoms
4. **Type Safety**: Full TypeScript coverage with strict typing
5. **Adapter Pattern**: Legacy providers are wrapped to conform to unified interface

---

## 2. Three-Column Layout Architecture

FrontDesk uses a responsive three-column layout for optimal user experience.

```
┌─────────────────────────────────────────────────────────────────────┐
│  FrontDesk Widget (frontdesk-widget.tsx)                            │
├─────────┬──────────────────────┬───────────────────────────────────┤
│         │                      │                                   │
│  Nav    │   List Panel         │      Content Area                 │
│  Side   │   (Middle Column)    │      (Right Column)               │
│  bar    │                      │                                   │
│         │                      │                                   │
│  (Left) │  - Conversation List │  - Provider-specific view         │
│         │  - Ticket List       │  - Email threads                  │
│         │  - Filters           │  - DM conversations               │
│         │  - Search            │  - Ticket details                 │
│         │                      │  - Unified inbox                  │
│         │                      │                                   │
│  220px  │     Variable         │       Flexible                    │
│  (64px  │     (~300-400px)     │       (remaining space)           │
│  when   │                      │                                   │
│  collapsed)                    │                                   │
│         │                      │                                   │
└─────────┴──────────────────────┴───────────────────────────────────┘
```

### Component Hierarchy

```tsx
<ThreeColumnLayout
  navigationWidth={sidebarCollapsed ? 64 : 220}

  navigationContent={
    <NavigationSidebar
      selectedChannel={currentChannel}
      selectedSection={currentSection}
      selectedTicketView={selectedTicketView}
      onChannelSelect={handleChannelChange}
      onSectionSelect={handleSectionChange}
      onTicketViewSelect={handleTicketViewChange}
      channelBadges={channelBadges}  // Unread counts
      isCollapsed={sidebarCollapsed}
    />
  }

  listContent={
    isInTicketMode ? (
      <TicketListPanel
        tickets={filteredTickets}
        selectedTicketId={selectedTicketId}
        onTicketSelect={handleTicketSelect}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    ) : (
      <DynamicListPanel
        channel={currentChannel}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    )
  }

  mainContent={
    isInTicketMode ? (
      <TicketDetailView
        ticket={selectedTicket}
        onClose={handleTicketClose}
        onReply={handleReply}
      />
    ) : (
      renderProviderContent() // Email, WhatsApp, Internal, Unified
    )
  }

  hideMiddleColumn={!isInTicketMode}
/>
```

### Layout Behavior

- **Navigation Sidebar**: Always visible, collapsible to 64px icon-only mode
- **List Panel**: Conditionally shown (tickets, conversations, etc.)
- **Content Area**: Main interaction area, changes based on selected provider
- **Responsive**: Adapts to screen size, stacks columns on mobile

---

## 3. State Management

FrontDesk uses **Recoil** for predictable, atomic state management.

### Atom Naming Convention

All atoms follow the pattern: `frontdesk.{provider}.{data}`

```typescript
// Examples:
frontdesk.internal.conversations    // DM conversations
frontdesk.email.accounts            // Email accounts
frontdesk.tickets.all               // All tickets
frontdesk.navigation.selectedChannel // Selected channel
frontdesk.notifications.all         // All notifications
```

### State Architecture

```
State Tree (Recoil Atoms)
├── Navigation State (navigation.atoms.ts)
│   ├── selectedSectionAtom           # Current section: inbox/assigned/admin/settings
│   ├── selectedChannelAtom           # Current channel: all/email/whatsapp/internal
│   ├── selectedConversationIdAtom    # Active conversation ID
│   ├── sidebarCollapsedAtom          # Sidebar collapsed state (persisted)
│   └── navigationHistoryAtom         # History stack for back/forward
│
├── Internal/DM State (internal.atoms.ts)
│   ├── internalChannelsAtom          # List of DM conversations
│   ├── internalMessagesAtom          # Messages for active conversation
│   ├── internalConnectionStateAtom   # WebSocket connection status
│   ├── internalTypingUsersAtom       # Typing indicators by conversation
│   └── internalUserPresenceAtom      # Online/offline status by user
│
├── Email State (email.atoms.ts)
│   ├── emailAccountsAtom             # Connected Gmail accounts
│   ├── emailSelectedAccountAtom      # Currently selected account
│   ├── emailConversationsAtom        # Email threads by account
│   ├── emailMessagesAtom             # Messages in selected thread
│   └── emailLabelsAtom               # Gmail labels/folders
│
├── WhatsApp State (whatsapp.atoms.ts)
│   ├── whatsappAccountsAtom          # Connected WhatsApp numbers
│   ├── whatsappConversationsAtom     # WhatsApp chats by account
│   ├── whatsappMessagesAtom          # Messages in selected chat
│   └── whatsappGroupsAtom            # WhatsApp groups
│
├── Tickets State (tickets.atoms.ts)
│   ├── ticketsAtom                   # All tickets (TicketWithDetails[])
│   ├── selectedTicketIdAtom          # Currently selected ticket
│   ├── ticketFiltersAtom             # Active filters (status, priority, tags)
│   ├── ticketViewStatusMapAtom       # Read/unread status per ticket
│   ├── unreadTicketsCountAtom        # Total unread tickets
│   ├── relatedTicketsAtom            # Related tickets for current ticket
│   ├── ticketHistoryAtom             # History entries for current ticket
│   ├── tagsAtom                      # All available tags
│   ├── popularTagsAtom               # Popular/frequently used tags
│   ├── reviewQueueConversationsAtom  # Conversations awaiting ticket creation
│   ├── ticketSocketConnectedAtom     # WebSocket connection status
│   └── openTicketTabsAtom            # Open ticket tabs for navigation
│
├── Unified State (unified.atoms.ts)
│   ├── unifiedConversationsAtom      # Aggregated conversations from all providers
│   ├── unifiedFiltersAtom            # Filters for unified view
│   └── unifiedSortOptionsAtom        # Sort options for unified view
│
└── Notifications State (notifications.atoms.ts)
    ├── frontdeskNotificationsAtom    # All FrontDesk notifications
    ├── notificationsLoadingAtom      # Loading state
    └── notificationsErrorAtom        # Error state
```

### Selectors for Derived State

```typescript
// Navigation-derived values
currentNavigationStateSelector       // Complete navigation state
isInboxSectionSelector               // Boolean: in inbox section
canNavigateBackSelector              // Boolean: can go back
currentRoutePathSelector             // Generated route path

// Cross-provider aggregation
aggregatedConversationsSelector      // All conversations from all providers
totalUnreadCountSelector             // Total unread across all providers
unreadCountByProviderSelector        // Unread count by provider
recentConversationsSelector          // Recent conversations (last 24h)

// Ticket-specific
selectedTicketSelector               // Currently selected ticket (backend format)
filteredTicketsSelector              // Filtered tickets based on view
ticketCountsSelector                 // Counts for each ticket view
activeFilterCountSelector            // Number of active filters

// Notifications
notificationCountsSelector           // Unread counts by type
messageNotificationsSelector         // Message notifications only
ticketNotificationsSelector          // Ticket notifications only
```

### State Update Patterns

**Direct Updates** (via provider hooks):
```typescript
// Component never calls setRecoilState directly for business logic
// Instead, uses provider hook methods

const ticketsProvider = useTicketsProvider();
await ticketsProvider.updateTicketStatus(ticketId, 'RESOLVED');
// Hook internally updates ticketsAtom with optimistic update
```

**Optimistic Updates** (for real-time UX):
```typescript
// 1. Update UI immediately
setTickets(prev => [...prev, optimisticTicket]);

// 2. Make API call
const ticket = await api.createTicket(data);

// 3. Reconcile with server response
setTickets(prev => prev.map(t => t.id === tempId ? ticket : t));

// 4. Handle errors (revert if needed)
catch (error) {
  setTickets(prev => prev.filter(t => t.id !== tempId));
}
```

---

## 4. Services Layer

The services layer handles all external communication (REST APIs and WebSockets).

### Service Architecture

```
Services Layer
│
├── REST API Services
│   ├── ticketsService
│   │   ├── listTickets(filters)
│   │   ├── getTicketById(id)
│   │   ├── createTicketFromConversation(data)
│   │   ├── replyToTicket(id, content, conversationId)
│   │   ├── updateTicket(id, data)
│   │   ├── assignTicket(id, assigneeId)
│   │   ├── getRelatedTickets(id)
│   │   ├── addTagsToTicket(id, tags)
│   │   └── markTicketAsRead(id)
│   │
│   ├── directMessagesService
│   │   ├── getConversations()
│   │   ├── getMessages(conversationId)
│   │   ├── createConversation(data)
│   │   └── searchMessages(query)
│   │
│   └── notificationsService
│       ├── getNotifications(params)
│       ├── markAsRead(id)
│       └── markAllAsRead()
│
└── WebSocket Services
    ├── messagingService (Core Socket)
    │   ├── connect(authToken)
    │   ├── disconnect()
    │   ├── sendMessage(data)
    │   ├── joinChannel(data)
    │   ├── startTyping(data)
    │   ├── stopTyping(data)
    │   ├── onNewMessage(handler)
    │   ├── onUserTyping(handler)
    │   └── onUserOnline/Offline(handler)
    │
    ├── ticketSocketService (20 Ticket Events)
    │   ├── connect(authToken)
    │   ├── onTicketCreated(handler)
    │   ├── onTicketUpdated(handler)
    │   ├── onTicketAssigned(handler)
    │   ├── onTicketStatusChanged(handler)
    │   ├── onTicketReplySent(handler)
    │   ├── onTicketReopened(handler)
    │   ├── onTicketMerged(handler)
    │   ├── onTicketsBulkAssigned(handler)
    │   ├── onTicketMessageReceived(handler)
    │   ├── onTicketCustomerUpdated(handler)
    │   ├── onSLABreached(handler)
    │   ├── onTicketAutoResponse(handler)
    │   ├── onWebhookMessageProcessed(handler)
    │   ├── onMessageDelivered(handler)
    │   ├── onMessageDeliveryFailed(handler)
    │   ├── onConversationNeedsReview(handler)
    │   ├── onTicketTagsAdded(handler)
    │   ├── onTicketTagRemoved(handler)
    │   ├── onTagCreated(handler)
    │   └── onTagDeleted(handler)
    │
    └── notificationsWebSocketService
        ├── connect(authToken)
        ├── onNotificationReceived(handler)
        └── onNotificationUpdated(handler)
```

### Import Pattern

FrontDesk uses a **unified service import** for clean code:

```typescript
// Single import for all services
import {
  messagingService,       // WebSocket for DMs
  ticketSocketService,    // WebSocket for Tickets
  directMessagesService,  // REST API for DMs
  ticketsService,         // REST API for Tickets
  notificationsService    // REST API for Notifications
} from '@/services/frontdesk';
```

### Authentication & Connection

All services use JWT bearer token authentication:

```typescript
// Services automatically get token from storage
const token = getUserToken();

// REST API: Token in Authorization header
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// WebSocket: Token in auth handshake
socket = io(serverUrl, {
  auth: {
    token: token,
    sessionId: generateSessionId()
  }
});
```

---

## 5. Data Flow Patterns

### Provider Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│  Component renders (e.g., TicketDetailView)                          │
└─────────────────────────┬───────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Provider Hook (e.g., useTicketsProvider)                            │
│  - Reads from Recoil atoms                                           │
│  - Provides state + action methods                                   │
└─────────────────────────┬──────────────┬──────────────────────────-─┘
                          │              │
          User Action     │              │  Real-time Event
                          ▼              ▼
                    ┌──────────┐    ┌──────────┐
                    │   API    │    │ WebSocket│
                    │ Service  │    │ Service  │
                    └─────┬────┘    └────┬─────┘
                          │              │
                          ▼              ▼
                    ┌──────────────────────┐
                    │   Backend Server     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Response/Event      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Update Recoil Atom  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Component Re-renders│
                    └──────────────────────┘
```

### Example: Sending a Ticket Reply

```typescript
// 1. User clicks "Send" in UI
handleSendReply(content);

// 2. Component calls provider hook method
await ticketsProvider.replyToTicket(ticketId, content, conversationId);

// 3. Provider hook applies optimistic update
setRecoilState(ticketsAtom, tickets =>
  tickets.map(t => t.id === ticketId ? {
    ...t,
    lastReply: { content, pending: true }
  } : t)
);

// 4. Provider calls API service
const response = await ticketsService.replyToTicket(ticketId, content, conversationId);

// 5. API service makes HTTP request
POST /api/tickets/:id/reply
Body: { content, conversationId }

// 6. Backend processes and responds
{ success: true, message: {...} }

// 7. Backend also emits WebSocket event
emit('ticket.reply.sent', { ticketId, message })

// 8. WebSocket handler receives event
ticketSocketService.onTicketReplySent(payload => {
  // Update atom with server data
  setRecoilState(ticketsAtom, tickets =>
    tickets.map(t => t.id === payload.ticketId ? {
      ...t,
      lastReply: payload.message
    } : t)
  );
});

// 9. Component automatically re-renders with new data
```

---

## 6. Integration Points

### Backend API Integration

**Base URL**: Configurable via `config.api_server` or `config.messaging_server`

**Endpoints**:
- `/api/tickets/*` - Ticket management
- `/api/providers/*` - Provider/channel information
- `/api/messages/*` - Direct messages
- `/api/notifications/*` - Notification management

**Authentication**: JWT Bearer token from `getUserToken()`

### WebSocket Integration

**Namespace**: `/messaging`

**Connection**:
```typescript
// Shared connection for all real-time features
messagingService.connect(authToken);

// Feature-specific services use the same socket
ticketSocketService.connect(authToken);  // Reuses messagingService socket
```

**Room Isolation**: Backend automatically joins clients to organization room (`org:${printHouseId}`) based on JWT token

### Email Provider Integration

**OAuth Flow**:
1. User clicks "Connect Email"
2. Frontend calls `emailProvider.authenticate('google')`
3. Opens OAuth popup window
4. User authorizes Gmail access
5. Backend exchanges code for tokens
6. Frontend receives account details
7. Emails are synced via REST API (no real-time)

### Notification Integration

**Sources**:
- **WebSocket**: Real-time notifications via `notificationsWebSocketService`
- **REST API**: Initial load and historical notifications
- **Deep Links**: Notifications include routing information

**Types**:
- Message notifications (DM_RECEIVED, DM_MENTION)
- Ticket notifications (TICKET_ASSIGNED, TICKET_SLA_BREACH, etc.)

**Flow**:
```typescript
// 1. Backend emits notification
emit('notification.new', {
  type: 'TICKET_ASSIGNED',
  ticketId: 'T-123',
  ...metadata
});

// 2. Frontend receives via WebSocket
notificationsWebSocketService.onNotificationReceived(notification => {
  // Add to atom
  setRecoilState(frontdeskNotificationsAtom, prev => [notification, ...prev]);
});

// 3. User clicks notification
// Routing system extracts deep link and navigates
navigate(RouteBuilder.ticketDetail(notification.ticketId));
```

---

## Summary

FrontDesk's architecture is designed for:

- **Scalability**: New providers can be added without touching core code
- **Maintainability**: Clear separation of concerns and consistent patterns
- **Type Safety**: Full TypeScript coverage ensures reliability
- **Real-time**: WebSocket integration keeps UI instantly up-to-date
- **Performance**: Optimistic updates and efficient state management
- **Extensibility**: Adapter pattern allows gradual migration to unified interface

The three-column layout, centralized routing, atomic state management, and unified service layer work together to create a robust, maintainable messaging platform.
