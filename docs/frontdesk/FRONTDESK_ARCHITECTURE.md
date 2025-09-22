# FrontDesk Messaging Hub - Complete Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Features](#core-features)
5. [Navigation Flow](#navigation-flow)
6. [Provider System](#provider-system)
7. [State Management](#state-management)
8. [UI Components](#ui-components)
9. [API Integration](#api-integration)
10. [Development Guide](#development-guide)
11. [Troubleshooting](#troubleshooting)

---

## Overview

FrontDesk is a unified messaging hub that consolidates multiple communication channels (Email, WhatsApp, Internal Chat) into a single, efficient three-column interface. It provides a seamless experience for managing all customer communications from one centralized location.

### Key Benefits
- **Unified Inbox**: View all messages from all channels in one place
- **Multi-Account Support**: Manage multiple accounts per provider
- **Real-time Updates**: WebSocket-powered instant messaging
- **Smart Navigation**: Smooth, app-like transitions without page refreshes
- **Extensible Architecture**: Easy to add new communication providers

---

## Architecture

### Three-Column Layout Design

```
┌────────────┬──────────────────┬────────────────────────────┐
│            │                  │                            │
│ Navigation │   List Panel     │      Content Area          │
│  (100px)   │    (380px)       │        (Flexible)          │
│            │                  │                            │
├────────────┼──────────────────┼────────────────────────────┤
│ • Channels │ • Conversations  │ • Message Thread           │
│   - All    │ • Search Bar     │ • Message Composer         │
│   - Email  │ • Filters        │ • Attachments              │
│   - WhatsApp│ • Account Select │ • User Info               │
│   - Internal│                  │                            │
│            │                  │                            │
│ • System   │                  │                            │
│   - Inbox  │                  │                            │
│   - Assigned│                 │                            │
│   - Admin  │                  │                            │
│   - Settings│                 │                            │
└────────────┴──────────────────┴────────────────────────────┘
```

### Component Hierarchy

```
FrontdeskWidget (Main Container)
├── ThreeColumnLayout
│   ├── NavigationSidebar
│   │   ├── ChannelSection
│   │   │   ├── All Channels
│   │   │   ├── Email
│   │   │   ├── WhatsApp
│   │   │   └── Internal
│   │   └── SystemSection
│   │       ├── Inbox
│   │       ├── Assigned
│   │       ├── Admin
│   │       └── Settings
│   ├── DynamicListPanel
│   │   ├── Header
│   │   │   ├── Title
│   │   │   ├── AccountSelector
│   │   │   └── SearchBar
│   │   └── ConversationList
│   │       └── ConversationItems
│   └── ContentArea
│       └── ProviderView
│           ├── MessageViewer
│           ├── MessageComposer
│           └── ProviderSpecificUI
```

---

## File Structure

```
src/widgets/frontdesk/
├── frontdesk-widget.tsx                 # Main widget entry point
├── README.md                            # Quick reference guide
│
├── layouts/                             # Layout components
│   ├── three-column/
│   │   ├── ThreeColumnLayout.tsx       # Main layout container
│   │   ├── ThreeColumnLayout.styles.ts # Styled components
│   │   └── index.ts                    # Exports
│   │
│   ├── components/
│   │   ├── NavigationSidebar/          # Left navigation
│   │   │   ├── NavigationSidebar.tsx
│   │   │   ├── NavigationSidebar.styles.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── DynamicListPanel/           # Middle list panel
│   │   │   ├── DynamicListPanel.tsx
│   │   │   ├── DynamicListPanel.styles.ts
│   │   │   └── index.ts
│   │   │
│   │   └── ContentArea/                # Right content area
│   │       ├── ContentArea.tsx
│   │       ├── ContentArea.styles.ts
│   │       └── index.ts
│   │
│   └── index.ts                        # Layout exports
│
├── providers/                           # Communication providers
│   ├── base/                           # Base provider architecture
│   │   ├── BaseProvider.tsx            # Abstract base class
│   │   └── provider.interface.ts       # Provider contracts
│   │
│   ├── unified/                        # Unified inbox provider
│   │   ├── UnifiedProvider.tsx         # Main component
│   │   ├── components/
│   │   │   ├── UnifiedConversationList.tsx
│   │   │   └── ConversationIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useUnifiedProvider.ts
│   │   │   └── useAggregatedConversations.ts
│   │   ├── types/
│   │   │   └── unified.types.ts
│   │   └── utils/
│   │       └── conversation-aggregator.ts
│   │
│   ├── email/                          # Email provider
│   │   ├── email-provider-view.tsx     # Main email view
│   │   ├── components/
│   │   │   ├── email-auth-modal.tsx    # OAuth authentication
│   │   │   ├── email-conversation-list.tsx
│   │   │   ├── email-message-viewer.tsx
│   │   │   └── email-composer.tsx
│   │   ├── hooks/
│   │   │   ├── use-email-provider.ts
│   │   │   ├── use-email-accounts.ts
│   │   │   └── use-email-messages.ts
│   │   ├── types/
│   │   │   └── email.types.ts
│   │   └── utils/
│   │       ├── date-utils.ts
│   │       └── html-decode.ts
│   │
│   ├── whatsapp/                       # WhatsApp provider
│   │   ├── whatsapp-provider-view.tsx
│   │   └── [similar structure...]
│   │
│   ├── internal/                       # Internal chat provider
│   │   ├── internal-provider-view.tsx
│   │   ├── components/
│   │   │   ├── ChannelSidebar.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── UserPresence.tsx
│   │   ├── hooks/
│   │   │   └── use-internal-provider.ts
│   │   └── types/
│   │       └── internal.types.ts
│   │
│   └── registry/                       # Provider management
│       └── ProviderRegistry.tsx        # Dynamic provider loading
│
├── controllers/                         # Business logic controllers
│   └── NavigationController.ts         # Navigation state management
│
├── components/                          # Shared components
│   ├── ui/                            # Reusable UI components
│   │   ├── ConversationList/
│   │   ├── MessageViewer/
│   │   ├── AccountSelector/
│   │   ├── SearchBar/
│   │   └── ChannelIndicator/
│   │
│   └── shared/                         # Shared utilities
│       └── BaseMessageInput.tsx
│
└── hooks/                              # Custom hooks
    └── [shared hooks]

src/store/frontdesk/                    # State management
├── atoms/                              # Recoil atoms
│   ├── navigation.atoms.ts            # Navigation state
│   ├── unified.atoms.ts               # Unified view state
│   ├── email.atoms.ts                 # Email state
│   ├── whatsapp.atoms.ts              # WhatsApp state
│   └── internal.atoms.ts              # Internal chat state
│
├── selectors/                          # Recoil selectors
│   ├── navigation.selectors.ts        # Navigation computed values
│   └── aggregation.selectors.ts       # Cross-provider aggregation
│
└── index.ts                           # State exports
```

---

## Core Features

### 1. Unified Inbox
- **Aggregated View**: Combines conversations from all providers
- **Smart Sorting**: By date, priority, unread status
- **Filtering**: By provider, read/unread, priority, date range
- **Search**: Global search across all conversations
- **Channel Indicators**: Visual badges showing message source (📧 💬 🏢)

### 2. Multi-Account Management
- **Multiple Accounts**: Support for multiple accounts per provider
- **Account Switching**: Seamless switching without losing context
- **Account-specific Views**: Separate conversation lists per account
- **OAuth Integration**: Secure authentication for email providers

### 3. Real-time Messaging
- **WebSocket Connection**: Instant message delivery
- **Typing Indicators**: See when others are typing
- **Presence Status**: Online/offline/away indicators
- **Read Receipts**: Message read status tracking
- **Optimistic Updates**: Instant UI feedback

### 4. Navigation System
- **Smooth Transitions**: No page refreshes when switching views
- **URL Synchronization**: Browser history and bookmarkable URLs
- **State Persistence**: Maintains selection across refreshes
- **Keyboard Shortcuts**: Quick navigation (coming soon)

### 5. Provider Architecture
- **Extensible Design**: Easy to add new providers
- **Standardized Interface**: All providers implement IProvider
- **Lazy Loading**: Providers load on-demand
- **Independent State**: Each provider manages its own state

---

## Navigation Flow

### URL Structure
```
/frontdesk/inbox/unified    → All conversations
/frontdesk/inbox/email      → Email conversations
/frontdesk/inbox/whatsapp   → WhatsApp conversations
/frontdesk/inbox/internal   → Internal chat
/frontdesk/assigned         → Assigned conversations
/frontdesk/admin           → Admin panel
/frontdesk/settings        → User settings
```

### Navigation State Management
```typescript
// Navigation happens in three layers:

1. User Action (Click)
   ↓
2. State Update (Immediate UI response)
   ↓
3. URL Update (Browser history)

// Example flow:
handleChannelChange('email')
  → setCurrentChannel('email')        // Instant UI update
  → window.history.pushState(...)     // Update URL without reload
```

### Smooth Transitions
- **CSS Animations**: 200ms fade/slide transitions
- **State-first Updates**: UI changes before URL updates
- **History API**: Uses browser history API instead of router.push()
- **Optimistic UI**: Shows expected state immediately

---

## Provider System

### Provider Interface (IProvider)
Every provider must implement:

```typescript
interface IProvider {
  // Identification
  providerId: string;
  providerName: string;
  providerIcon: React.ReactNode;
  capabilities: ProviderCapabilities;
  
  // State
  isConnected: boolean;
  accounts: Account[];
  conversations: Conversation[];
  messages: Message[];
  
  // Core Methods
  connect(account?: Account): Promise<void>;
  disconnect(accountId?: string): Promise<void>;
  fetchConversations(): Promise<Conversation[]>;
  fetchMessages(conversationId: string): Promise<Message[]>;
  sendMessage(conversationId: string, content: string): Promise<void>;
  
  // Events
  onNewMessage?: (message: Message) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
}
```

### Adding a New Provider

1. **Create Provider Directory**
```bash
src/widgets/frontdesk/providers/newprovider/
├── NewProvider.tsx
├── components/
├── hooks/
├── types/
└── utils/
```

2. **Implement Provider Class**
```typescript
export class NewProvider extends BaseProvider {
  readonly providerId = 'newprovider';
  readonly providerName = 'New Provider';
  
  async connect() {
    // Implementation
  }
  
  async fetchConversations() {
    // Implementation
  }
}
```

3. **Register Provider**
```typescript
// In ProviderRegistry.tsx
const providerRegistry = {
  // ...existing providers
  newprovider: {
    component: NewProviderView,
    name: 'New Provider',
    requiresAuth: true
  }
};
```

---

## State Management

### Recoil Architecture

#### Navigation State
```typescript
// Atoms
selectedSectionAtom      // Current section (inbox/assigned/admin/settings)
selectedChannelAtom       // Current channel (all/email/whatsapp/internal)
selectedConversationIdAtom // Selected conversation
selectedAccountsAtom      // Selected accounts per provider

// Selectors
currentNavigationStateSelector // Combined navigation state
isInboxSectionSelector        // Whether in inbox section
currentRoutePathSelector       // Current route path
```

#### Provider State
```typescript
// Email Provider
emailAccountsAtom            // Connected accounts
emailConversationsAtom       // Conversations by account
emailMessagesAtom           // Current messages
emailConnectionStateAtom    // Connection status

// Similar structure for WhatsApp and Internal providers
```

#### Unified View State
```typescript
// Aggregation
aggregatedConversationsSelector // All conversations combined
totalUnreadCountSelector        // Total unread across providers
unreadCountByProviderSelector   // Unread per provider
recentConversationsSelector     // Last 24 hours
```

### State Flow
```
User Action
    ↓
Recoil Atom Update
    ↓
Selector Recalculation
    ↓
Component Re-render
    ↓
UI Update
```

---

## UI Components

### Shared Components

#### ConversationList
- Displays list of conversations
- Supports grouping by date
- Shows unread badges
- Handles selection state

#### MessageViewer
- Renders message thread
- Supports rich content
- Shows timestamps
- Handles attachments

#### AccountSelector
- Dropdown for multi-account providers
- Shows account status
- Handles account switching

#### SearchBar
- Global search functionality
- Debounced input
- Search history (coming soon)

### Component Props Pattern
```typescript
interface ComponentProps {
  // Data
  items: Item[];
  selectedId?: string;
  
  // Handlers
  onSelect: (item: Item) => void;
  onAction?: (action: string, item: Item) => void;
  
  // UI State
  loading?: boolean;
  error?: string;
  
  // Customization
  renderItem?: (item: Item) => ReactNode;
  className?: string;
}
```

---

## API Integration

### Service Layer Structure
```
src/services/api-service/frontdesk/
├── base/
│   ├── api-client.ts         # Axios instance
│   └── api-types.ts          # Common types
│
├── providers/
│   ├── email/
│   │   ├── email.service.ts
│   │   └── email.types.ts
│   │
│   ├── whatsapp/
│   │   ├── whatsapp.service.ts
│   │   └── whatsapp.types.ts
│   │
│   └── internal/
│       ├── internal.service.ts
│       └── internal.types.ts
│
└── ServiceFactory.ts         # Service instantiation
```

### API Endpoints
```typescript
// Email Provider
GET    /api/frontdesk/email/accounts
GET    /api/frontdesk/email/conversations
GET    /api/frontdesk/email/messages/:conversationId
POST   /api/frontdesk/email/send
POST   /api/frontdesk/email/oauth/connect
DELETE /api/frontdesk/email/oauth/disconnect

// WhatsApp Provider
GET    /api/frontdesk/whatsapp/accounts
GET    /api/frontdesk/whatsapp/conversations
POST   /api/frontdesk/whatsapp/send
POST   /api/frontdesk/whatsapp/qr-code

// Internal Chat (WebSocket)
ws://   /messaging/connect
emit    'channel:join'
emit    'message:send'
on      'message:receive'
```

### WebSocket Integration
```typescript
// Messaging Service
class MessagingService {
  private socket: Socket;
  
  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });
  }
  
  sendMessage(channelId: string, content: string) {
    this.socket.emit('message:send', {
      channelId,
      content,
      tempId: generateTempId()
    });
  }
}
```

---

## Development Guide

### Setting Up Development Environment

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:3004
NEXT_PUBLIC_SOCKET_URL=ws://localhost:3004
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Run Development Server**
```bash
npm run dev
```

### Code Style Guidelines

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

// 2. Types/Interfaces
interface ComponentProps {
  // Props definition
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({
  prop1,
  prop2
}) => {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // 7. Render
  return (
    <Box>
      {/* JSX */}
    </Box>
  );
};
```

#### Naming Conventions
- **Components**: PascalCase (e.g., `MessageViewer`)
- **Files**: kebab-case for views, PascalCase for components
- **Hooks**: camelCase with 'use' prefix (e.g., `useEmailProvider`)
- **Types**: PascalCase with descriptive suffixes (e.g., `EmailMessage`)
- **Atoms**: camelCase with 'Atom' suffix (e.g., `emailAccountsAtom`)
- **Selectors**: camelCase with 'Selector' suffix

### Testing

#### Unit Tests
```typescript
// Component test example
describe('NavigationSidebar', () => {
  it('should render all channels', () => {
    const { getByText } = render(
      <NavigationSidebar {...props} />
    );
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('WhatsApp')).toBeInTheDocument();
  });
});
```

#### Integration Tests
```typescript
// Provider test example
describe('EmailProvider', () => {
  it('should fetch conversations', async () => {
    const provider = new EmailProvider();
    await provider.connect();
    const conversations = await provider.fetchConversations();
    expect(conversations).toHaveLength(10);
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. Provider Not Loading
**Problem**: Provider shows blank screen
**Solution**: 
- Check ProviderRegistry configuration
- Verify lazy import path
- Check browser console for errors
- Ensure provider component exports correctly

#### 2. Navigation Not Working
**Problem**: Clicking navigation doesn't change view
**Solution**:
- Check NavigationController hooks
- Verify state updates in React DevTools
- Ensure route parameters are correct
- Check for JavaScript errors

#### 3. Messages Not Updating
**Problem**: Real-time messages not appearing
**Solution**:
- Verify WebSocket connection status
- Check authentication token
- Monitor network tab for socket events
- Verify message event handlers

#### 4. State Not Syncing
**Problem**: UI state doesn't match expected state
**Solution**:
- Check Recoil atom keys for uniqueness
- Verify selector dependencies
- Use Recoil DevTools to inspect state
- Check for race conditions

### Performance Optimization

#### 1. Code Splitting
```typescript
// Lazy load providers
const EmailProvider = lazy(() => import('./EmailProvider'));
```

#### 2. Memoization
```typescript
// Memoize expensive calculations
const sortedConversations = useMemo(() => {
  return conversations.sort(byDate);
}, [conversations]);
```

#### 3. Virtual Scrolling
```typescript
// Use react-window for large lists
import { FixedSizeList } from 'react-window';
```

#### 4. Debouncing
```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

### Debug Mode
Enable debug logging:
```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  window.FRONTDESK_DEBUG = true;
}
```

---

## Future Enhancements

### Planned Features
- [ ] **Slack Integration**: Add Slack as a provider
- [ ] **Microsoft Teams**: Support for Teams messaging
- [ ] **SMS/Twilio**: SMS messaging support
- [ ] **Voice Integration**: Voice call logs and recordings
- [ ] **AI Assistant**: Smart replies and message categorization
- [ ] **Bulk Actions**: Select multiple conversations
- [ ] **Templates**: Message templates and quick replies
- [ ] **Analytics**: Message volume and response time metrics
- [ ] **Mobile App**: React Native mobile application
- [ ] **Offline Support**: Work offline with sync capability

### Technical Improvements
- [ ] **GraphQL API**: Migrate from REST to GraphQL
- [ ] **Server-Side Rendering**: Improve initial load time
- [ ] **Progressive Web App**: Add PWA capabilities
- [ ] **E2E Testing**: Comprehensive Cypress tests
- [ ] **Accessibility**: Full WCAG 2.1 AA compliance
- [ ] **Internationalization**: Multi-language support
- [ ] **Dark Mode**: System-aware theme switching

---

## Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement feature following guidelines
3. Write tests for new functionality
4. Update documentation
5. Submit pull request with description
6. Address code review feedback
7. Merge after approval

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Includes TypeScript types
- [ ] Has appropriate error handling
- [ ] Includes loading/error states
- [ ] Mobile responsive
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Performant (no unnecessary re-renders)
- [ ] Documented (JSDoc comments)

---

## Support & Resources

### Documentation
- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [Recoil Documentation](https://recoiljs.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.IO Documentation](https://socket.io/docs)

### Internal Resources
- Design System: `src/styles/theme`
- Component Library: `src/components`
- API Documentation: `docs/api`
- Architecture Decisions: `docs/adr`

### Contact
- **Team Lead**: FrontDesk Team
- **Slack Channel**: #frontdesk-dev
- **Email**: frontdesk@gomake.com

---

*Last Updated: December 2024*
*Version: 1.0.0*