# Provider Components Usage Guide

This guide shows how to use the extracted base components to create a new provider integration.

## Base Components

### 1. BaseConversationList
A reusable conversation list component that handles:
- Loading states
- Error handling
- Item selection
- Pagination (Load More)
- Empty states

### 2. BaseProviderView
A complete provider view layout that includes:
- Connection management
- Two-pane layout (list + detail)
- Message threading
- Reply functionality
- Settings integration

### 3. Provider Types
Standard interfaces for provider data:
- `ConversationItem`: Standard conversation format
- `ConversationMessage`: Standard message format
- `ProviderConnectionState`: Connection status

### 4. Provider Utils
Helper functions for common operations:
- `parseEmailField`: Extract name from email
- `formatTimestamp`: Format dates consistently
- `decodeHtmlEntities`: Clean HTML entities
- `mapToConversationMessage`: Convert to standard message format

## Example: Creating a New Provider

```tsx
// 1. Create provider-specific hooks
const useMyProviderAuth = () => {
  // Authentication logic
  return { isConnected, connectionEmail, ... };
};

const useMyProviderConversations = () => {
  // Fetch conversations logic
  return { conversations, loading, error, ... };
};

// 2. Map provider data to standard format
const mapToConversationItem = (item: MyProviderItem): ConversationItem => ({
  id: item.id,
  from: parseEmailField(item.sender),
  subject: item.title,
  snippet: decodeHtmlEntities(item.preview),
  receivedAt: formatTimestamp(item.timestamp),
  unread: item.isUnread,
});

// 3. Create provider view using base components
const MyProviderView = () => {
  const { isConnected, connectionEmail } = useMyProviderAuth();
  const { conversations, loading } = useMyProviderConversations();

  const items = conversations.map(mapToConversationItem);

  return (
    <BaseProviderView
      providerName="MyProvider"
      providerIcon={<MyProviderIcon />}
      connectionEmail={connectionEmail}
      isConnected={isConnected}
      conversations={items}
      conversationListComponent={
        <BaseConversationList
          items={items}
          loading={loading}
          onSelect={handleSelect}
        />
      }
      authModalComponent={<MyProviderAuthModal />}
      // ... other props
    />
  );
};
```

## Benefits

1. **Consistency**: All providers use the same UI components
2. **Maintainability**: Updates to base components affect all providers
3. **Speed**: New providers can be added quickly
4. **Type Safety**: Shared types ensure data consistency
5. **DRY**: No code duplication across providers