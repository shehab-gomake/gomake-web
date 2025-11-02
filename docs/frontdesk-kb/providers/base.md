# Base Provider Interfaces

## Overview

The base provider system defines standardized interfaces and abstract classes that all FrontDesk communication providers must implement. This ensures consistent APIs across different communication channels (Internal DMs, Email, WhatsApp, Tickets) and enables unified inbox functionality.

## File Structure

```
src/widgets/frontdesk/providers/base/
├── provider.interface.ts              # Legacy provider interface (IProvider)
├── unified-provider.interface.ts      # Modern unified provider interface
├── BaseProvider.tsx                   # Abstract base class implementation
├── index.ts                          # Public exports
└── adapters/                         # Legacy-to-unified adapters
    ├── internal-provider.adapter.ts  # Internal DM adapter
    ├── email-provider.adapter.ts     # Email provider adapter
    └── index.ts                      # Adapter exports
```

## Core Interfaces

### 1. UnifiedProvider Interface

The modern, standardized interface that all providers should implement.

**Location:** `unified-provider.interface.ts`

**Key Types:**

```typescript
export interface UnifiedProvider {
  // Identity
  readonly id: ProviderId;              // 'internal' | 'email' | 'whatsapp' | 'tickets'
  readonly name: string;
  readonly displayName: string;
  readonly icon: React.ReactNode;
  readonly capabilities: ProviderCapabilities;

  // Connection State
  connection: ConnectionState;

  // Account Management (for multi-account providers)
  accounts?: AccountManagement;

  // Current User
  currentUser: User | null;

  // Conversations
  conversations: ConversationList;
  selectedConversation: Conversation | null;

  // Messages
  messages?: MessageList;

  // Search
  search?: SearchState;

  // Real-time Features
  typingUsers?: Record<string, string[]>;
  onlineUsers?: string[];

  // Actions
  actions: ProviderActions;

  // Provider-specific extensions
  extensions?: Record<string, any>;
}
```

### 2. Provider Capabilities

Declares what features a provider supports using capability-based feature detection.

```typescript
export interface ProviderCapabilities {
  // Account Management
  multiAccount: boolean;           // Can connect multiple accounts
  authentication: boolean;         // Requires OAuth/auth flow

  // Conversation Features
  createConversation: boolean;
  groupConversations: boolean;
  archiveConversation: boolean;
  deleteConversation: boolean;
  favoriteConversation: boolean;
  muteConversation: boolean;

  // Message Features
  sendMessage: boolean;
  editMessage: boolean;
  deleteMessage: boolean;
  replyToMessage: boolean;
  forwardMessage: boolean;
  reactions: boolean;

  // Rich Content
  attachments: boolean;
  images: boolean;
  videos: boolean;
  richText: boolean;

  // Real-time Features
  typing: boolean;
  presence: boolean;
  readReceipts: boolean;

  // Organization Features
  labels: boolean;
  folders: boolean;
  filters: boolean;

  // Search Features
  globalSearch: boolean;
  conversationSearch: boolean;
  fullTextSearch: boolean;

  // Pagination
  infiniteScroll: boolean;
  pagination: boolean;
}
```

### 3. Connection State

```typescript
export interface ConnectionState {
  status: ConnectionStatus;         // 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastConnectedAt?: Date;
  reconnectAttempts?: number;
}
```

### 4. Conversation

```typescript
export interface Conversation {
  id: string;
  type: ConversationType;           // 'dm' | 'group' | 'channel' | 'ticket' | 'email'
  name: string;
  subject?: string;
  avatar?: string;
  snippet?: string;

  participants: Participant[];
  participantCount?: number;

  unreadCount: number;
  isFavorite?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;

  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt?: Date;

  providerId: ProviderId;
  providerData?: Record<string, any>;

  labels?: string[];
  tags?: string[];
}
```

### 5. Message

```typescript
export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;                // 'text' | 'file' | 'image' | 'video' | 'audio' | 'system'
  content: string;

  userId: string;
  user: User;

  to?: string[];
  cc?: string[];
  bcc?: string[];

  isRead?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;

  createdAt: Date;
  updatedAt?: Date;

  attachments?: Attachment[];

  replyToId?: string;
  threadId?: string;

  reactions?: Reaction[];

  providerId: ProviderId;
  providerData?: Record<string, any>;

  tempId?: string;                  // For optimistic updates
  pending?: boolean;
}
```

### 6. Provider Actions

All provider actions available through the unified interface.

```typescript
export interface ProviderActions {
  // Connection
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  reconnect?: () => Promise<void>;

  // Conversations
  fetchConversations: (options?: FetchOptions) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deselectConversation: () => void;
  refreshConversations: () => Promise<void>;
  loadMoreConversations?: () => Promise<void>;

  // Conversation Management (capability-based)
  createConversation?: (participants: string[], name?: string) => Promise<string>;
  archiveConversation?: (conversationId: string) => Promise<void>;
  unarchiveConversation?: (conversationId: string) => Promise<void>;
  deleteConversation?: (conversationId: string) => Promise<void>;
  favoriteConversation?: (conversationId: string) => Promise<void>;
  unfavoriteConversation?: (conversationId: string) => Promise<void>;
  muteConversation?: (conversationId: string) => Promise<void>;
  unmuteConversation?: (conversationId: string) => Promise<void>;
  markAsRead?: (conversationId: string) => Promise<void>;
  markAsUnread?: (conversationId: string) => Promise<void>;

  // Messages
  fetchMessages: (conversationId: string, options?: FetchOptions) => Promise<void>;
  loadMoreMessages?: (conversationId: string) => Promise<void>;
  sendMessage?: (conversationId: string, content: string, options?: SendMessageOptions) => Promise<void>;
  editMessage?: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage?: (messageId: string) => Promise<void>;
  replyToMessage?: (messageId: string, content: string) => Promise<void>;
  forwardMessage?: (messageId: string, toConversationId: string) => Promise<void>;
  addReaction?: (messageId: string, emoji: string) => Promise<void>;
  removeReaction?: (messageId: string, emoji: string) => Promise<void>;

  // Typing & Presence
  startTyping?: (conversationId: string) => void;
  stopTyping?: (conversationId: string) => void;
  updatePresence?: (status: UserPresence) => void;

  // Search
  searchConversations?: (query: string) => Promise<void>;
  searchMessages?: (query: string, conversationId?: string) => Promise<void>;
  clearSearch?: () => void;
}
```

## Legacy Interface (IProvider)

The original provider interface, maintained for backward compatibility. New implementations should use `UnifiedProvider` instead.

**Location:** `provider.interface.ts`

**Key differences from UnifiedProvider:**
- Flatter structure (no nested state objects)
- Direct property access instead of grouped state
- Event handler callbacks instead of action methods
- Less capability-based design

## BaseProvider Abstract Class

Abstract base class providing common functionality for providers.

**Location:** `BaseProvider.tsx`

**Features:**
- Default implementations for common methods
- State management helpers
- Event handler support
- Capability-based method guards

**Usage:**

```typescript
export class CustomProvider extends BaseProvider {
  readonly providerId = 'custom';
  readonly providerName = 'Custom Provider';
  readonly providerIcon = <CustomIcon />;
  readonly capabilities = {
    multiAccount: false,
    sendMessage: true,
    // ... other capabilities
  };

  async connect() {
    this.isConnecting = true;
    try {
      // Connection logic
      this.updateConnectionState(true);
    } catch (error) {
      this.updateConnectionState(false, error.message);
    }
  }

  async fetchConversations() {
    // Implementation
  }

  async fetchMessages(conversationId: string) {
    // Implementation
  }

  async sendMessage(conversationId: string, content: string) {
    // Implementation
  }
}
```

## Adapters

Adapters wrap legacy provider hooks to conform to the UnifiedProvider interface, enabling gradual migration.

### Available Adapters

#### 1. InternalProviderAdapter

**Location:** `adapters/internal-provider.adapter.ts`

Wraps `useInternalProvider` hook for Internal DMs.

**Capabilities:**
- Single account
- Group conversations
- Real-time messaging
- Typing indicators
- Presence tracking
- Archive support
- Favorites
- Search (global + conversation)

**Usage:**

```typescript
import { internalProviderAdapter } from '@/widgets/frontdesk/providers/base/adapters';
import { useInternalProvider } from '@/widgets/frontdesk/providers/internal/hooks';

function MyComponent() {
  const internalHook = useInternalProvider();
  const unifiedProvider = internalProviderAdapter.adapt(internalHook);

  // Use unifiedProvider with standard interface
  return <ConversationList provider={unifiedProvider} />;
}
```

#### 2. EmailProviderAdapter

**Location:** `adapters/email-provider.adapter.ts`

Wraps `useEmailProvider` hook for Email integration.

**Capabilities:**
- Multi-account support
- OAuth authentication
- Rich content (HTML, attachments)
- Labels/folders
- Threading
- Star/archive
- Search

**Usage:**

```typescript
import { emailProviderAdapter } from '@/widgets/frontdesk/providers/base/adapters';
import { useEmailProvider } from '@/widgets/frontdesk/providers/email/hooks';

function MyComponent() {
  const emailHook = useEmailProvider();
  const unifiedProvider = emailProviderAdapter.adapt(emailHook);

  return <EmailThreadList provider={unifiedProvider} />;
}
```

#### Pending Adapters

- WhatsAppProviderAdapter (TODO)
- TicketsProviderAdapter (TODO)

## Hook Return Type

Standard return type for provider hooks to ensure consistency.

```typescript
export interface UseProviderResult {
  // Core provider
  provider: UnifiedProvider;

  // Convenience flags
  isReady: boolean;                // Connected and has loaded data
  isEmpty: boolean;                // No conversations
  hasSelection: boolean;           // Has selected conversation
  canSendMessage: boolean;         // Can send in selected conversation

  // Convenience accessors
  activeConversation: Conversation | null;
  activeMessages: Message[];
  unreadCount: number;

  // Convenience actions
  send: (content: string) => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}
```

## Design Principles

### 1. Capability-Based Architecture

Providers declare what they support through the `ProviderCapabilities` interface. UI components check capabilities before showing features.

```typescript
// Good - Check capability before using feature
if (provider.capabilities.reactions) {
  return <ReactionPicker onSelect={provider.actions.addReaction} />;
}

// Bad - Assume all providers support reactions
return <ReactionPicker onSelect={provider.actions.addReaction} />;
```

### 2. Optional Methods

Not all providers need all features. Methods that depend on capabilities should be optional in the interface.

```typescript
// Optional methods for capability-dependent features
actions: {
  sendMessage?: (conversationId: string, content: string) => Promise<void>;
  addReaction?: (messageId: string, emoji: string) => Promise<void>;
}
```

### 3. Consistent Naming

Standardized method and property names across all providers.

- Use `conversations` not `threads` or `channels`
- Use `sendMessage` not `send` or `postMessage`
- Use `markAsRead` not `read` or `setRead`

### 4. Type Safety

Enforce interface implementation through TypeScript.

```typescript
// Provider must implement UnifiedProvider
class MyProvider implements UnifiedProvider {
  // TypeScript will error if any required properties are missing
}
```

### 5. Extensibility

Allow provider-specific features through the `extensions` property.

```typescript
// Email-specific extensions
provider.extensions = {
  labels: gmailLabels,
  selectLabel: (id: string) => void,
  compose: () => void,
};

// Tickets-specific extensions
provider.extensions = {
  priorities: ['low', 'medium', 'high', 'urgent'],
  statuses: ['open', 'in_progress', 'resolved', 'closed'],
  assignTicket: (ticketId: string, userId: string) => Promise<void>,
};
```

## Migration Guide

### From Legacy IProvider to UnifiedProvider

**Step 1:** Implement the new interface alongside the old one

```typescript
export function useMyProvider(): UseProviderResult & LegacyProviderHook {
  // Existing implementation
  const legacyHook = useLegacyMyProvider();

  // Create unified provider
  const unifiedProvider: UnifiedProvider = {
    id: 'myprovider',
    name: 'myprovider',
    displayName: 'My Provider',
    icon: <Icon />,
    capabilities: { /* ... */ },
    connection: { /* ... */ },
    // ... map rest of interface
  };

  return {
    ...legacyHook,
    provider: unifiedProvider,
    // ... convenience properties
  };
}
```

**Step 2:** Create an adapter if needed

```typescript
export class MyProviderAdapter implements ProviderAdapter<LegacyProviderHook> {
  adapt(hook: LegacyProviderHook): UnifiedProvider {
    return {
      // Map legacy hook to unified interface
    };
  }
}
```

**Step 3:** Update components to use unified interface

```typescript
// Old way
const { conversations, sendMessage } = useMyProvider();

// New way
const { provider } = useMyProvider();
const { conversations, actions: { sendMessage } } = provider;
```

**Step 4:** Remove legacy interface when migration complete

## Best Practices

### 1. Always Check Capabilities

```typescript
// Good
if (provider.capabilities.attachments) {
  return <AttachmentButton />;
}

// Bad - assumes feature exists
return <AttachmentButton />;
```

### 2. Handle Loading States

```typescript
if (provider.conversations.loading) {
  return <LoadingSpinner />;
}

if (provider.conversations.error) {
  return <ErrorMessage error={provider.conversations.error} />;
}

return <ConversationList items={provider.conversations.items} />;
```

### 3. Use Optimistic Updates

```typescript
async function handleSend(content: string) {
  const tempId = `temp-${Date.now()}`;

  // 1. Update UI immediately
  setMessages(prev => [...prev, {
    id: tempId,
    content,
    pending: true,
    tempId,
    // ... other fields
  }]);

  try {
    // 2. Send to server
    await provider.actions.sendMessage(conversationId, content);
  } catch (error) {
    // 3. Revert on failure
    setMessages(prev => prev.filter(m => m.tempId !== tempId));
    showError(error);
  }
}
```

### 4. Leverage TypeScript

```typescript
// Use discriminated unions for provider-specific types
type ProviderSpecific =
  | { providerId: 'email'; extensions: EmailExtensions }
  | { providerId: 'internal'; extensions: InternalExtensions }
  | { providerId: 'tickets'; extensions: TicketsExtensions };
```

## Testing

### Unit Testing Provider Implementation

```typescript
describe('MyProvider', () => {
  it('should implement UnifiedProvider interface', () => {
    const provider = new MyProvider();

    expect(provider.id).toBeDefined();
    expect(provider.capabilities).toBeDefined();
    expect(provider.actions.connect).toBeDefined();
  });

  it('should respect capabilities', async () => {
    const provider = new MyProvider();

    if (provider.capabilities.sendMessage) {
      await expect(
        provider.actions.sendMessage('conv-1', 'test')
      ).resolves.not.toThrow();
    } else {
      expect(provider.actions.sendMessage).toBeUndefined();
    }
  });
});
```

### Integration Testing Adapters

```typescript
describe('MyProviderAdapter', () => {
  it('should adapt legacy hook to unified interface', () => {
    const legacyHook = createMockLegacyHook();
    const adapter = new MyProviderAdapter();

    const unified = adapter.adapt(legacyHook);

    expect(unified).toMatchObject({
      id: expect.any(String),
      capabilities: expect.any(Object),
      connection: expect.any(Object),
      conversations: expect.any(Object),
      actions: expect.any(Object),
    });
  });
});
```

## Related Documentation

- [Internal DMs Provider](./internal_dms.md) - Direct messaging implementation
- [Email Provider](./email.md) - Email integration
- [Tickets Provider](./tickets.md) - Ticketing system
- [WhatsApp Provider](./whatsapp.md) - WhatsApp integration
- [Unified Inbox](./unified_inbox.md) - Multi-provider aggregation
- [Provider Registry](./registry.md) - Provider registration and loading

## Changelog

### v2.0.0 (Current)
- Introduced UnifiedProvider interface
- Added capability-based architecture
- Created adapter pattern for migration
- Standardized naming conventions

### v1.0.0
- Initial IProvider interface
- BaseProvider abstract class
- Basic provider pattern
