# FrontDesk Messaging Hub - Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Current Architecture](#current-architecture)
3. [File Structure](#file-structure)
4. [Core Features](#core-features)
5. [Providers](#providers)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Development Guide](#development-guide)

---

## Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels into a single interface. It provides a seamless experience for managing customer communications across different platforms from one centralized location.

### Key Benefits
- **Multi-Provider Support**: Currently supports **Direct Messages (Internal)**, **Email (Gmail/Outlook)**, **WhatsApp**, and **Tickets**
- **Real-time Updates**: WebSocket integration for instant messaging, typing indicators, and user presence
- **Component-Based Architecture**: Built with React, TypeScript, and Material-UI with strong componentization
- **Unified Layout System**: Consistent three-column layout across all providers
- **State Management**: Recoil-based architecture for efficient state updates

---

## Current Architecture

FrontDesk uses a modular, provider-based architecture with a consistent layout system.

### Main Application Layout

The main widget (`frontdesk-widget.tsx`) uses `ThreeColumnLayout` to provide a **flexible three-column layout**:

```
┌─────────────┬──────────────┬────────────────────┐
│             │              │                    │
│ Navigation  │    List      │   Main Content     │
│  (220px)    │   (280px)    │    (Flexible)      │
│             │              │                    │
├─────────────┼──────────────┼────────────────────┤
│ • Providers │ • Threads    │ • Message view     │
│ • Settings  │ • Emails     │ • Composer         │
│ • Tickets   │ • Contacts   │ • Details          │
└─────────────┴──────────────┴────────────────────┘
```

**ThreeColumnLayout Features:**
- Column 1: Navigation sidebar (fixed width, responsive)
- Column 2: List panel (optional, can be hidden via `hideMiddleColumn`)
- Column 3: Main content area (flexible width)
- Responsive design with mobile breakpoints
- Smooth transitions between states

**Current Implementation:**
- `frontdesk-widget.tsx` uses `ThreeColumnLayout` directly
- Provider views (DM, Email, WhatsApp) render their own **custom layouts** inside the main content area
- Tickets provider integrates directly into the widget (no separate provider view)
- Each provider implements its own internal layout structure using Material-UI `Stack` components

**Note:** The original architectural goal was for all providers to use `ThreeColumnLayout` directly, but currently only the main widget uses it. Individual providers create their own layouts. This is documented in "Known Limitations" below.

---

## File Structure

```
src/widgets/frontdesk/
├── frontdesk-widget.tsx                 # Main widget entry point & routing
│
├── layouts/                             # Layout components
│   ├── three-column/
│   │   └── ThreeColumnLayout.tsx       # Unified three-column layout
│   └── components/
│       ├── NavigationSidebar/
│       │   └── NavigationSidebar.tsx   # Main navigation sidebar
│       ├── DynamicListPanel.tsx        # Dynamic list panel wrapper
│       └── ContentArea.tsx             # Main content area wrapper
│
├── providers/                           # Communication channel implementations
│   ├── internal/                       # Direct Messages (DM) provider
│   │   ├── direct-messages-provider-view.tsx
│   │   ├── components/                 # DM-specific components
│   │   │   └── direct-messages/        # Message, ConversationList, etc.
│   │   ├── hooks/                      # use-direct-messages.ts
│   │   └── types/                      # DM type definitions
│   │
│   ├── email/                          # Email provider (Gmail/Outlook)
│   │   ├── email-provider-view.tsx
│   │   ├── components/                 # Email-specific components
│   │   │   ├── composer/               # Email composition
│   │   │   ├── conversation/           # Email conversation list
│   │   │   ├── message-viewer/         # Email viewer
│   │   │   └── sidebar/                # Account/label sidebar
│   │   ├── hooks/                      # use-email-provider.ts
│   │   ├── types/                      # Email type definitions
│   │   └── utils/                      # Email utilities
│   │
│   ├── whatsapp/                       # WhatsApp provider
│   │   ├── whatsapp-provider-view.tsx
│   │   ├── components/                 # WhatsApp-specific components
│   │   └── hooks/                      # use-whatsapp-provider.ts
│   │
│   ├── tickets/                        # Tickets/Support provider
│   │   ├── components/                 # Ticket list panel & detail view
│   │   │   ├── ticket-list-panel.tsx   # Main list component
│   │   │   ├── ticket-list-item.tsx    # Individual ticket item
│   │   │   └── ticket-detail-view.tsx  # Ticket detail view
│   │   ├── hooks/                      # use-tickets-provider.ts
│   │   ├── types/                      # Ticket type definitions
│   │   │   ├── ticket.types.ts
│   │   │   └── communication.types.ts
│   │   └── mock-data/                  # Development mock data
│   │       └── tickets.mock.ts
│   │
│   │   # Note: Tickets provider does NOT have a main -provider-view.tsx
│   │   # It's integrated directly into frontdesk-widget.tsx
│   │
│   ├── unified/                        # Unified inbox (aggregates all providers)
│   │   ├── UnifiedProvider.tsx
│   │   └── hooks/                      # useAggregatedConversations.ts
│   │
│   └── base/                           # Base provider interfaces & adapters
│       ├── provider.interface.ts
│       ├── BaseProvider.tsx
│       └── adapters/                   # Provider adapters for unified view
│
├── components/                          # Shared/reusable components
│   ├── conversation/                   # Conversation UI components
│   ├── message/                        # Message display components
│   └── search/                         # Search components
│
├── design-system/                       # Design system components
│   ├── primitives/                     # Basic UI elements
│   │   ├── Avatar/                     # Avatar components
│   │   ├── Badge/                      # Badges (status, priority, channel, etc.)
│   │   ├── Button/                     # Button variations
│   │   └── Input/                      # Input components
│   ├── compounds/                      # Composite components
│   │   ├── Panel/                      # Panel, PanelContent, PanelHeader
│   │   ├── EmptyState/                 # Empty state component
│   │   ├── ListItem/                   # ConversationListItem, TicketListItem
│   │   ├── MessageCard/                # Message card component
│   │   ├── ConnectionStates/           # Connection state components
│   │   └── ...                         # Other compound components
│   └── layouts/                        # Layout components
│       └── ThreeColumnLayout/          # Three-column layout system
│
├── hooks/                               # Custom React hooks
│   ├── use-fab-positioning.ts
│   └── ...
│
├── controllers/                         # Business logic & navigation
│
└── types/                               # Shared TypeScript types

src/store/frontdesk/                    # Recoil state management
├── atoms/                              # State atoms per provider
│   ├── direct-messages.atoms.ts
│   ├── email.atoms.ts
│   ├── whatsapp.atoms.ts
│   └── tickets.atoms.ts
└── selectors/                          # Derived state & aggregations

src/services/
├── api-service/frontdesk/              # REST API services
│   ├── direct-messages/
│   ├── email/
│   └── ...
└── websocket/                          # Real-time messaging
    └── messaging-service.ts            # WebSocket client singleton
```

---

## Core Features

### Implemented Features
*   **Multi-Provider Support**: Four active providers (Direct Messages, Email, WhatsApp, Tickets)
*   **Real-time Messaging**: WebSocket-based instant messaging with typing indicators and presence
*   **Email Integration**: OAuth authentication for Gmail and Outlook
*   **Search**: Global search across conversations and in-conversation search
*   **Message Management**: Send, receive, archive, favorite, read receipts
*   **User Presence**: Online/offline status and custom status messages
*   **Responsive Design**: Mobile and desktop optimized layouts
*   **Archiving & Organization**: Archive conversations, favorite contacts, label management

### Provider-Specific Features

**Direct Messages (Internal)**
- Real-time WebSocket messaging
- Typing indicators
- User presence tracking
- Group conversations
- Read receipts
- Message archiving

**Email**
- OAuth authentication (Google/Microsoft)
- Multiple account support
- Label/folder management
- Rich text composition
- Thread view
- Star/archive/delete

**WhatsApp**
- Conversation list
- Message threading
- Send/receive messages
- (Currently using mock data for development)

**Tickets**
- Support ticket management
- Multi-channel ticket sources (DM, Email, WhatsApp)
- Status tracking
- Assignment & priority
- Communication history

---

## Providers

### Provider Architecture Patterns

#### Standard Provider Pattern (DM, Email, WhatsApp)

Most providers follow this structure:

```typescript
Provider/
├── {provider}-provider-view.tsx    # Main view component
├── components/                      # Provider-specific UI components
├── hooks/
│   └── use-{provider}-provider.ts  # Main provider hook
├── types/                          # TypeScript type definitions
└── utils/                          # Provider-specific utilities (optional)
```

**Actual Hook Names:**
- Direct Messages: `useDirectMessages` (from `hooks/use-direct-messages.ts`)
- Email: `useEmailProvider` (from `hooks/use-email-provider.ts`)
- WhatsApp: `useWhatsAppProvider` (from `hooks/use-whatsapp-provider.ts`)

#### Tickets Provider Pattern (Exception)

The Tickets provider follows a **different pattern**:

```typescript
tickets/
├── components/                      # UI components
│   ├── ticket-list-panel.tsx       # Main list component
│   ├── ticket-list-item.tsx        # List item
│   └── ticket-detail-view.tsx      # Detail view
├── hooks/
│   └── use-tickets-provider.ts     # State management hook
├── types/                          # Type definitions
└── mock-data/                      # Mock data
```

**Key Difference:** No `-provider-view.tsx` file. Tickets are integrated directly into `frontdesk-widget.tsx` rather than having a separate provider view component.

### Provider Hooks Pattern

Provider hooks encapsulate all state and logic:

```typescript
export function useProviderName() {
  return {
    // Connection state
    isConnected: boolean,
    isLoading: boolean,
    error: Error | null,

    // Data
    conversations: Conversation[],
    messages: Message[],
    selectedConversation: Conversation | null,

    // Actions
    sendMessage: (content: string) => Promise<void>,
    selectConversation: (id: string) => void,
    refresh: () => Promise<void>,

    // ... provider-specific methods
  }
}
```

### Current Provider Status

| Provider | Status | Real API | WebSocket | OAuth |
|----------|--------|----------|-----------|-------|
| Internal (DMs) | ✅ Complete | ✅ | ✅ | N/A |
| Email | ✅ Complete | ✅ | ❌ | ✅ |
| WhatsApp | 🟡 Partial | ❌ Mock | ❌ | ❌ |
| Tickets | ✅ Complete | 🟡 Mock | ❌ | N/A |
| Unified | 🟡 Partial | N/A | N/A | N/A |

---

## State Management

FrontDesk uses **Recoil** for state management with a well-structured, granular approach:

### Atom Naming Convention
```typescript
// Format: frontdesk.{provider}.{data}
frontdesk.directMessages.conversations
frontdesk.email.accounts
frontdesk.tickets.selectedView
```

### State Organization

**Per-Provider Atoms** (`src/store/frontdesk/atoms/`)
- Each provider has dedicated atoms for its data
- Examples: `conversationsAtom`, `messagesAtom`, `selectedConversationAtom`

**Selectors** (`src/store/frontdesk/selectors/`)
- Derived state and computed values
- Cross-provider aggregations for unified view
- Filtering and sorting logic

### WebSocket Integration

The Direct Messages provider integrates WebSocket events with Recoil:

```typescript
// WebSocket event updates Recoil atom
messagingService.on('dm:newMessage', (message) => {
  // Update messages atom
  setMessages((prev) => [...prev, message]);
});
```

---

## API Integration

### REST API Services

Located in `src/services/api-service/frontdesk/`, each provider has dedicated service classes:

```typescript
// Example: Direct Messages API
class DirectMessagesService {
  async getConversations(): Promise<Conversation[]>
  async sendMessage(conversationId: string, content: string): Promise<Message>
  async markAsRead(conversationId: string): Promise<void>
}
```

### WebSocket Service

**Singleton Pattern**: `src/services/websocket/messaging-service.ts`

```typescript
import { messagingService } from '@/services/websocket/messaging-service';

// Connect
await messagingService.connect(authToken);

// Send message
messagingService.sendMessage(conversationId, content);

// Listen for events
messagingService.on('dm:newMessage', handler);
```

**Key Events:**
- `dm:newMessage` - New message received
- `dm:userTyping` - User typing indicator
- `dm:messageRead` - Read receipt
- `dm:conversationUpdated` - Conversation metadata changed

### OAuth Flow (Email Provider)

1. Frontend initiates: `GET /auth/oauth/google`
2. Backend returns authorization URL
3. User authenticates with Google/Microsoft
4. Callback handled by backend: `GET /auth/oauth/google/callback`
5. Frontend polls for account connection status

---

## Development Guide

### Adding a New Provider

Follow this checklist to add a new communication provider:

**1. Create Provider Structure**
```bash
mkdir -p src/widgets/frontdesk/providers/{provider-name}/{components,hooks,types,utils}
```

**2. Implement Provider Hook**
Create `hooks/use-{provider}-provider.ts`:
```typescript
export function useMyProvider() {
  // State management
  // API calls
  // Business logic
  return { /* exposed API */ }
}
```

**3. Create Provider View**
Create `{provider}-provider-view.tsx` that uses `ThreeColumnLayout`:
```typescript
import { ThreeColumnLayout } from '@/widgets/frontdesk/layouts/three-column';

export const MyProviderView: React.FC = () => {
  const { /* ... */ } = useMyProvider();

  return (
    <ThreeColumnLayout
      navigationContent={<NavigationSidebar />}
      listContent={<ConversationList />}
      mainContent={<MessageView />}
    />
  );
};
```

**4. Add Recoil State**
Create `src/store/frontdesk/atoms/{provider}.atoms.ts`:
```typescript
export const myProviderDataAtom = atom<Data[]>({
  key: 'frontdesk.myProvider.data',
  default: []
});
```

**5. Create API Service**
Create `src/services/api-service/frontdesk/providers/{provider}`:
```typescript
export class MyProviderService {
  async fetchData(): Promise<Data[]> { /* ... */ }
}
```

**6. Register Provider**
Update `src/widgets/frontdesk/frontdesk-widget.tsx`:
```typescript
case 'my-provider':
  return <MyProviderView />;
```

**7. Add Navigation Entry**
Update `NavigationSidebar` to include the new provider icon and route.

**8. Update Documentation**
- Add provider to this architecture doc
- Create provider-specific guide if needed
- Update `DEVELOPER_GUIDE.md`

### Running & Testing

**Start Development Server**
```bash
npm run dev
# Access at http://localhost:3004/frontdesk/inbox
```

**Build Production**
```bash
npm run build
```

**Run Tests**
```bash
npm run test
npm run test -- --watch  # Watch mode
```

**Linting**
```bash
npm run lint
```

### Debugging Tips

**Check WebSocket Connection**
```typescript
// In browser console
localStorage.setItem('FRONTDESK_DEBUG', 'true');
```

**Inspect Recoil State**
- Open React DevTools
- Navigate to Components tab
- Find `RecoilRoot` component
- Inspect atom values

**Monitor WebSocket Traffic**
- Open Browser DevTools → Network tab
- Filter by WS (WebSocket)
- View frames for message flow

### Common Patterns

**Optimistic Updates**
```typescript
const sendMessage = async (content: string) => {
  const tempId = `temp-${Date.now()}`;

  // Optimistic update
  setMessages(prev => [...prev, { id: tempId, content, status: 'pending' }]);

  try {
    const message = await api.sendMessage(content);
    // Replace temp with real
    setMessages(prev => prev.map(m => m.id === tempId ? message : m));
  } catch (error) {
    // Revert on error
    setMessages(prev => prev.filter(m => m.id !== tempId));
  }
};
```

**Pagination**
```typescript
const [page, setPage] = useState(0);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const newData = await api.fetchPage(page + 1);
  setData(prev => [...prev, ...newData]);
  setHasMore(newData.length > 0);
  setPage(p => p + 1);
};
```

### Known Limitations & Next Steps

**Current Limitations:**
1. Providers still use custom layouts instead of fully adopting `ThreeColumnLayout`
2. WhatsApp provider uses mock data
3. Tickets provider uses mock data
4. Unified inbox can't display messages from selected conversations
5. No keyboard shortcuts implemented
6. Limited mobile optimizations

**Recommended Next Steps:**
1. Migrate all provider views to use `ThreeColumnLayout` consistently
2. Implement real WhatsApp API integration
3. Complete Unified inbox message viewer
4. Add keyboard navigation shortcuts
5. Implement global command palette
6. Enhance mobile responsive design
7. Add offline support with service workers