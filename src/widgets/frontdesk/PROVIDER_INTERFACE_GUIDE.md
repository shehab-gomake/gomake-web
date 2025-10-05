## Provider Interface Migration Guide

This guide explains how to standardize all FrontDesk providers using the Unified Provider Interface.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Using Adapters](#using-adapters)
4. [Implementing New Providers](#implementing-new-providers)
5. [Migration Strategy](#migration-strategy)
6. [API Reference](#api-reference)

---

## Overview

### Problem

Each FrontDesk provider (Internal, Email, WhatsApp, Tickets) has a different API:

```typescript
// Internal Provider - 60 return values
const internal = useInternalProvider();
internal.selectConversation(conversation); // Takes object
internal.sendMessage(content);            // Direct send

// Email Provider - 45 return values
const email = useEmailProvider();
email.handleConversationSelect(conversation); // Different name
email.handleSendEmail(draft);                 // Different signature

// WhatsApp Provider - 14 return values
const whatsapp = useWhatsAppProvider();
whatsapp.handleConversationSelect(item);  // Different type
whatsapp.handleSendReply(text);           // Different name
```

### Solution

Unified Provider Interface with adapters:

```typescript
// All providers conform to same interface
const provider: UnifiedProvider = adapter.adapt(legacyHook);

// Consistent API
provider.actions.selectConversation(conversationId);
provider.actions.sendMessage(conversationId, content);
```

---

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    UnifiedProvider Interface                 │
│  (Standard API for all providers)                           │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                            │
┌───────┴──────┐                            ┌───────┴──────┐
│   Adapters   │                            │ New Providers│
│ (wrap legacy)│                            │(direct impl) │
└───────┬──────┘                            └──────────────┘
        │
        │ wraps
        │
┌───────┴──────────────────────────────┐
│     Legacy Provider Hooks            │
│  - useInternalProvider()             │
│  - useEmailProvider()                │
│  - useWhatsAppProvider()             │
│  - useTicketsProvider()              │
└──────────────────────────────────────┘
```

### Key Interfaces

#### 1. UnifiedProvider

Main interface that all providers implement:

```typescript
interface UnifiedProvider {
  // Identity
  readonly id: ProviderId;
  readonly name: string;
  readonly capabilities: ProviderCapabilities;

  // State
  connection: ConnectionState;
  currentUser: User | null;
  conversations: ConversationList;
  selectedConversation: Conversation | null;
  messages?: MessageList;
  search?: SearchState;

  // Actions
  actions: ProviderActions;
}
```

#### 2. ProviderCapabilities

Declares what features a provider supports:

```typescript
interface ProviderCapabilities {
  multiAccount: boolean;
  createConversation: boolean;
  sendMessage: boolean;
  typing: boolean;
  presence: boolean;
  search: boolean;
  // ... 20+ capability flags
}
```

#### 3. ProviderAdapter

Wraps legacy hooks:

```typescript
interface ProviderAdapter<T> {
  adapt(legacyHook: T): UnifiedProvider;
}
```

---

## Using Adapters

### Basic Usage

```typescript
import { useInternalProvider } from '@/widgets/frontdesk/providers/internal/hooks';
import { internalProviderAdapter } from '@/widgets/frontdesk/providers/base/adapters';

function MyComponent() {
  // Get legacy hook
  const internalHook = useInternalProvider();

  // Wrap with adapter
  const provider = internalProviderAdapter.adapt(internalHook);

  // Use unified interface
  console.log(provider.capabilities.typing); // true
  console.log(provider.conversations.items.length);

  await provider.actions.sendMessage(conversationId, 'Hello!');
}
```

### With Multiple Providers

```typescript
import { internalProviderAdapter, emailProviderAdapter } from '@/widgets/frontdesk/providers/base/adapters';

function UnifiedInbox() {
  const internal = internalProviderAdapter.adapt(useInternalProvider());
  const email = emailProviderAdapter.adapt(useEmailProvider());

  // Combine conversations from all providers
  const allConversations = [
    ...internal.conversations.items,
    ...email.conversations.items,
  ];

  return (
    <ConversationList conversations={allConversations} />
  );
}
```

### Capability Detection

```typescript
function ConversationActions({ provider }: { provider: UnifiedProvider }) {
  const { capabilities, actions } = provider;

  return (
    <div>
      {capabilities.archiveConversation && (
        <button onClick={() => actions.archiveConversation?.(id)}>
          Archive
        </button>
      )}

      {capabilities.favoriteConversation && (
        <button onClick={() => actions.favoriteConversation?.(id)}>
          Favorite
        </button>
      )}

      {capabilities.typing && (
        <TypingIndicator provider={provider} />
      )}
    </div>
  );
}
```

---

## Implementing New Providers

### Option 1: Direct Implementation (Recommended for new providers)

```typescript
import type { UnifiedProvider } from '@/widgets/frontdesk/providers/base/unified-provider.interface';

export function useMyNewProvider(): UnifiedProvider {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  return {
    id: 'my-provider',
    name: 'my-provider',
    displayName: 'My Provider',
    icon: <MyIcon />,

    capabilities: {
      multiAccount: false,
      sendMessage: true,
      // ... declare all capabilities
    },

    connection: {
      status: 'connected',
      connected: true,
      connecting: false,
      error: null,
    },

    currentUser: { /* ... */ },
    conversations: { /* ... */ },
    selectedConversation: null,

    actions: {
      connect: async () => { /* ... */ },
      disconnect: async () => { /* ... */ },
      selectConversation: (id) => { /* ... */ },
      sendMessage: async (id, content) => { /* ... */ },
      // ... implement all actions
    },
  };
}
```

### Option 2: Adapter (For legacy providers)

```typescript
import type { ProviderAdapter } from '@/widgets/frontdesk/providers/base/unified-provider.interface';

export class MyProviderAdapter implements ProviderAdapter<MyLegacyHook> {
  adapt(hook: MyLegacyHook): UnifiedProvider {
    return {
      id: 'my-provider',
      name: 'my-provider',

      // Map legacy properties to unified interface
      connection: {
        status: hook.connectionStatus,
        connected: hook.isConnected,
        // ...
      },

      conversations: {
        items: hook.conversations.map(conv => ({
          // Transform legacy conversation to standard format
        })),
        // ...
      },

      actions: {
        sendMessage: async (id, content) => {
          // Call legacy method with transformation
          await hook.legacySendMethod(id, content);
        },
        // ...
      },
    };
  }
}

export const myProviderAdapter = new MyProviderAdapter();
```

---

## Migration Strategy

### Phase 1: Create Adapters (Current)

✅ Create adapter layer without breaking changes
✅ Test adapters wrap legacy hooks correctly
✅ Document adapter usage

**Timeline**: 1-2 days
**Risk**: Low (no breaking changes)

### Phase 2: Gradual Provider Updates

For each provider:

1. ✅ Create adapter
2. ⏳ Update provider hook to directly implement UnifiedProvider
3. ⏳ Remove adapter once hook is updated
4. ⏳ Update all components using the provider

**Timeline**: 1-2 days per provider
**Risk**: Low (one provider at a time)

### Phase 3: Enable Unified Features

Once all providers use unified interface:

1. ⏳ Implement unified inbox
2. ⏳ Create shared components (ConversationList, MessageView, etc.)
3. ⏳ Add cross-provider search
4. ⏳ Add unified notifications

**Timeline**: 1 week
**Risk**: Low (all providers already standardized)

---

## API Reference

### Core Types

#### ConnectionStatus

```typescript
type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';
```

#### Conversation

```typescript
interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  subject?: string;
  participants: Participant[];
  unreadCount: number;
  isFavorite?: boolean;
  isArchived?: boolean;
  lastMessageAt?: Date;
  createdAt: Date;
  providerId: ProviderId;
}
```

#### Message

```typescript
interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  userId: string;
  user: User;
  createdAt: Date;
  attachments?: Attachment[];
  providerId: ProviderId;
}
```

### Provider Actions

#### Core Actions (Required)

```typescript
interface ProviderActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  fetchConversations: (options?: FetchOptions) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deselectConversation: () => void;
  fetchMessages: (conversationId: string, options?: FetchOptions) => Promise<void>;
}
```

#### Optional Actions (Capability-based)

```typescript
interface ProviderActions {
  // Conversation Management
  createConversation?: (participants: string[]) => Promise<string>;
  archiveConversation?: (id: string) => Promise<void>;
  deleteConversation?: (id: string) => Promise<void>;
  favoriteConversation?: (id: string) => Promise<void>;

  // Messages
  sendMessage?: (conversationId: string, content: string) => Promise<void>;
  editMessage?: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage?: (messageId: string) => Promise<void>;

  // Real-time
  startTyping?: (conversationId: string) => void;
  stopTyping?: (conversationId: string) => void;

  // Search
  searchConversations?: (query: string) => Promise<void>;
  searchMessages?: (query: string, conversationId?: string) => Promise<void>;
}
```

---

## Examples

### Example 1: Unified Conversation List

```typescript
function UnifiedConversationList({ providers }: { providers: UnifiedProvider[] }) {
  // Aggregate conversations from all providers
  const allConversations = useMemo(() => {
    return providers.flatMap(p =>
      p.conversations.items.map(conv => ({
        ...conv,
        providerName: p.displayName,
        providerIcon: p.icon,
      }))
    ).sort((a, b) =>
      (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0)
    );
  }, [providers]);

  return (
    <div>
      {allConversations.map(conv => (
        <ConversationItem
          key={`${conv.providerId}-${conv.id}`}
          conversation={conv}
          provider={providers.find(p => p.id === conv.providerId)!}
        />
      ))}
    </div>
  );
}
```

### Example 2: Provider-Agnostic Message Send

```typescript
function MessageInput({ provider, conversationId }: Props) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!provider.capabilities.sendMessage) {
      alert('This provider does not support sending messages');
      return;
    }

    await provider.actions.sendMessage?.(conversationId, message);
    setMessage('');
  };

  if (!provider.capabilities.sendMessage) {
    return <div>Read-only conversation</div>;
  }

  return (
    <div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        onFocus={() => provider.actions.startTyping?.(conversationId)}
        onBlur={() => provider.actions.stopTyping?.(conversationId)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

### Example 3: Cross-Provider Search

```typescript
function GlobalSearch({ providers }: { providers: UnifiedProvider[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (query: string) => {
    const allResults = await Promise.all(
      providers
        .filter(p => p.capabilities.globalSearch)
        .map(async p => {
          await p.actions.searchConversations?.(query);
          return p.search?.conversationResults || [];
        })
    );

    setResults(allResults.flat());
  };

  return (
    <div>
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search all providers..."
      />
      <SearchResults results={results} />
    </div>
  );
}
```

---

## Best Practices

### 1. Always Check Capabilities

```typescript
// ✅ Good
if (provider.capabilities.archiveConversation) {
  await provider.actions.archiveConversation?.(id);
}

// ❌ Bad - assumes feature exists
await provider.actions.archiveConversation(id); // Might be undefined
```

### 2. Use Type Guards

```typescript
function isMessagingProvider(provider: UnifiedProvider): boolean {
  return provider.capabilities.sendMessage &&
         provider.messages !== undefined;
}

if (isMessagingProvider(provider)) {
  // TypeScript knows provider.messages exists here
  const messageCount = provider.messages.items.length;
}
```

### 3. Handle Provider-Specific Extensions

```typescript
// Email provider has label support
if (provider.id === 'email' && provider.extensions?.labels) {
  const labels = provider.extensions.labels;
  // Use email-specific functionality
}
```

### 4. Graceful Degradation

```typescript
function ConversationActions({ provider, conversationId }: Props) {
  return (
    <div>
      {/* Core actions - always available */}
      <button onClick={() => provider.actions.selectConversation(conversationId)}>
        Open
      </button>

      {/* Optional actions - check capability */}
      {provider.capabilities.archiveConversation && (
        <button onClick={() => provider.actions.archiveConversation?.(conversationId)}>
          Archive
        </button>
      )}

      {/* Fallback for unsupported features */}
      {!provider.capabilities.deleteConversation && (
        <span title="This provider doesn't support deleting conversations">
          Delete (unavailable)
        </span>
      )}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: TypeScript errors with optional methods

**Problem**: TypeScript complains about potentially undefined methods.

**Solution**: Use optional chaining and capability checks:

```typescript
// ❌ Error: might be undefined
provider.actions.sendMessage(id, content);

// ✅ Correct
if (provider.capabilities.sendMessage) {
  await provider.actions.sendMessage?.(id, content);
}
```

### Issue: Data not updating after action

**Problem**: Called an action but UI doesn't reflect changes.

**Solution**: Ensure you're using the provider's reactive state:

```typescript
// ✅ Correct - use provider's reactive state
const conversations = provider.conversations.items;

// ❌ Wrong - stale reference
const conversations = [...provider.conversations.items];
```

### Issue: Can't access provider-specific features

**Problem**: Need email labels, but UnifiedProvider doesn't have them.

**Solution**: Use provider extensions:

```typescript
if (provider.id === 'email') {
  const labels = provider.extensions?.labels;
  const selectLabel = provider.extensions?.selectLabel;
}
```

---

## Resources

- **Interface Definition**: [unified-provider.interface.ts](./providers/base/unified-provider.interface.ts)
- **Adapters**: [providers/base/adapters/](./providers/base/adapters/)
- **Analysis**: [PROVIDER_INTERFACE_ANALYSIS.md](./PROVIDER_INTERFACE_ANALYSIS.md)
- **Examples**: See `examples/` directory (TODO)

---

## Questions?

For questions or issues:
1. Check this guide first
2. Review the interface definition
3. Look at existing adapter implementations
4. Ask in #frontdesk-dev channel