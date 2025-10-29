# FrontDesk V2

A modern, Chatwoot-inspired messaging hub built with React, TypeScript, and Recoil.

## 📋 Project Status

✅ **Completed:**

- Complete folder structure (76 files)
- Comprehensive TypeScript type definitions based on Chatwoot DTOs
- All enums matching Chatwoot backend models

🚧 **In Progress:**

- Component implementation
- State management with Recoil
- WebSocket integration
- API service layer

---

## 🏗️ Architecture Overview

### Three-Column Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Left Sidebar]  [Middle Panel]  [Center Panel]  [Right] │
│   Navigation      Conversations    Messages    Details    │
│   240px           380px           flex-1        340px     │
└─────────────────────────────────────────────────────────┘
```

### State Management (Recoil)

- **Atoms**: Primitive state units (conversations, messages, filters)
- **Selectors**: Derived state (filtered conversations, unread counts)
- **AtomFamily**: Per-conversation/per-message state

### Data Flow

```
API/WebSocket → Recoil Atoms → React Components → UI
                    ↓
              Selectors (computed state)
```

---

## 📁 Folder Structure

```
src/widgets/frontdesk-v2/
├── layouts/                    # Layout components
│   └── three-column/          # Main 3-column layout
├── navigation/                # Left sidebar navigation
│   ├── workspace-selector/
│   ├── search-bar/
│   ├── nav-tree/
│   ├── teams-list/
│   ├── channels-list/
│   └── user-profile-card/
├── conversations/             # Middle & Center panels
│   ├── list/                 # Conversation list (middle)
│   │   ├── conversation-card/
│   │   └── hooks/
│   └── thread/               # Message thread (center)
│       ├── message-list/
│       ├── message-composer/
│       └── hooks/
├── contact-details/          # Right sidebar
│   ├── contact-card/
│   └── accordion-sections/
├── components/               # Shared UI components
│   └── ui/
├── hooks/                    # Global hooks
├── types/                    # TypeScript definitions
│   ├── enums.ts             ✅ COMPLETE
│   ├── conversation.types.ts ✅ COMPLETE
│   ├── message.types.ts      ✅ COMPLETE
│   ├── contact.types.ts      ✅ COMPLETE
│   ├── agent.types.ts        ✅ COMPLETE
│   ├── inbox.types.ts        ✅ COMPLETE
│   ├── team.types.ts         ✅ COMPLETE
│   └── index.ts              ✅ COMPLETE
└── frontdesk-v2-widget.tsx   # Main entry point
```

---

## 🎯 Type Definitions

### Core Enums

#### Conversation Status

```typescript
enum ConversationStatus {
  OPEN = "open",
  RESOLVED = "resolved",
  PENDING = "pending",
  SNOOZED = "snoozed",
}
```

#### Conversation Priority

```typescript
enum ConversationPriority {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}
```

#### Message Type

```typescript
enum MessageType {
  INCOMING = 0, // From contact
  OUTGOING = 1, // From agent
  ACTIVITY = 2, // System message
  TEMPLATE = 3, // Template message
}
```

#### Message Status

```typescript
enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}
```

### Core Interfaces

#### Conversation

```typescript
interface Conversation {
  id: number;
  uuid: string;
  status: ConversationStatus;
  priority: ConversationPriority | null;
  inbox_id: number;
  unread_count: number;
  messages: Message[];
  labels: string[];
  custom_attributes: Record<string, any>;
  can_reply: boolean;
  muted: boolean;
  // ... timestamps, meta, SLA
}
```

#### Message

```typescript
interface Message {
  id: number;
  content: string;
  message_type: MessageType;
  status: MessageStatus;
  sender_type: SenderType;
  conversation_id: number;
  created_at: number;
  attachments?: Attachment[];
  // ... additional fields
}
```

#### Contact

```typescript
interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  thumbnail: string | null;
  availability_status: "online" | "offline";
  custom_attributes: Record<string, any>;
  // ... additional fields
}
```

---

## 🚀 Next Steps

### Phase 1: Layout & Navigation (Week 1)

- [ ] Implement `ThreeColumnLayout`
- [ ] Build `LeftSidebar` with navigation tree
- [ ] Create `WorkspaceSelector` dropdown
- [ ] Add `SearchBar` functionality

### Phase 2: Conversation List (Week 2)

- [ ] Create `ConversationList` with virtualization
- [ ] Build `ConversationCard` component
- [ ] Implement `ConversationTabs` (Mine/Unassigned/All)
- [ ] Add filtering and sorting
- [ ] Set up Recoil atoms for conversations

### Phase 3: Message Thread (Week 3)

- [ ] Implement `MessageList` with virtualization
- [ ] Build `MessageBubble` (incoming/outgoing)
- [ ] Create `MessageComposer` with rich text
- [ ] Add file upload support
- [ ] Implement typing indicators
- [ ] Set up Recoil atoms for messages

### Phase 4: Contact Details (Week 4)

- [ ] Build `ContactCard` with profile info
- [ ] Implement accordion sections
- [ ] Add conversation actions
- [ ] Show previous conversations

### Phase 5: Real-time & Polish (Week 5)

- [ ] Integrate WebSocket for real-time updates
- [ ] Implement optimistic updates
- [ ] Add keyboard shortcuts
- [ ] Performance optimization
- [ ] Error handling & loading states

---

## 🔧 Development Guidelines

### Component Structure

```typescript
// Use Composition API with TypeScript
interface Props {
  conversationId: number;
}

export const ConversationCard: React.FC<Props> = ({ conversationId }) => {
  // Recoil hooks
  const conversation = useRecoilValue(conversationAtom(conversationId));

  // Component logic
  return <div>{/* UI */}</div>;
};
```

### State Management Pattern

```typescript
// Atom for primitive state
export const conversationsAtom = atom<Conversation[]>({
  key: "frontdeskV2.conversations",
  default: [],
});

// Selector for derived state
export const unreadConversationsSelector = selector({
  key: "frontdeskV2.unreadConversations",
  get: ({ get }) => {
    const conversations = get(conversationsAtom);
    return conversations.filter((c) => c.unread_count > 0);
  },
});

// AtomFamily for per-item state
export const messagesByConversationAtom = atomFamily<Message[], number>({
  key: "frontdeskV2.messagesByConversation",
  default: [],
});
```

### API Integration

```typescript
// services/frontdesk-v2/api/conversations.service.ts
export const conversationsService = {
  getAll: (filters: ConversationFilters) => apiClient.get("/conversations", { params: filters }),

  getById: (id: number) => apiClient.get(`/conversations/${id}`),

  updateStatus: (id: number, status: ConversationStatus) => apiClient.patch(`/conversations/${id}`, { status }),
};
```

### WebSocket Pattern

```typescript
// Real-time event handlers
socket.on("message.created", (data: Message) => {
  // Add message to Recoil state
  setMessages((prev) => [...prev, data]);
});

socket.on("conversation.status_changed", (data) => {
  // Update conversation status
  updateConversation(data.id, { status: data.status });
});
```

---

## 📊 Data Models Reference

All type definitions are based on Chatwoot's Swagger DTOs:

- **Source**: `/Users/omarsabbah/Desktop/chatwoot/swagger/definitions/resource/`
- **Files**: `conversation.yml`, `message.yml`, `contact.yml`, `inbox.yml`, `agent.yml`

### Key Relationships

```
Conversation
  ├── has many Messages
  ├── belongs to Contact
  ├── belongs to Inbox
  ├── belongs to Agent (assignee)
  └── belongs to Team

Message
  ├── belongs to Conversation
  ├── belongs to Sender (Contact or Agent)
  └── has many Attachments

Contact
  └── has many ContactInboxes
```

---

## 🎨 UI Component Mapping

| Component           | Description                       | Priority |
| ------------------- | --------------------------------- | -------- |
| `ThreeColumnLayout` | Main app shell                    | P0       |
| `ConversationList`  | Virtualized list of conversations | P0       |
| `ConversationCard`  | Individual conversation preview   | P0       |
| `MessageList`       | Virtualized message thread        | P0       |
| `MessageBubble`     | Individual message display        | P0       |
| `MessageComposer`   | Rich text message input           | P0       |
| `ContactCard`       | Contact profile details           | P1       |
| `NavTree`           | Collapsible navigation            | P1       |
| `SearchBar`         | Global search                     | P2       |
| `WorkspaceSelector` | Account/workspace switcher        | P2       |

---

## 📝 Notes

- All components return `null` or `{}` - ready for implementation
- TypeScript types are production-ready
- Follow Material-UI design system (already in project)
- Use Recoil for state management (already in project)
- Integrate with existing `@/services` pattern

---

## 🔗 Resources

- **Chatwoot Source**: `/Users/omarsabbah/Desktop/chatwoot`
- **Swagger DTOs**: `/Users/omarsabbah/Desktop/chatwoot/swagger/definitions/`
- **Vue Frontend**: `/Users/omarsabbah/Desktop/chatwoot/app/javascript/dashboard/`
- **Rails Backend**: `/Users/omarsabbah/Desktop/chatwoot/app/models/`

---

## 🎯 Success Criteria

- [ ] All 53 components implemented
- [ ] Real-time messaging via WebSocket
- [ ] Conversation filtering and sorting
- [ ] Message composer with file upload
- [ ] Contact details panel
- [ ] Typing indicators
- [ ] Optimistic UI updates
- [ ] Keyboard navigation
- [ ] Mobile responsive
- [ ] Performance: <100ms interaction time
- [ ] Accessibility: WCAG 2.1 AA compliant

---

**Last Updated**: 2025-01-29
**Version**: 0.1.0
**Status**: Foundation Complete ✅
