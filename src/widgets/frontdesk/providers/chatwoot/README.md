# Chatwoot Provider - Code Organization

This directory contains the Chatwoot provider implementation for FrontDesk. The code is organized for maximum reusability and maintainability.

## Directory Structure

```
chatwoot/
├── hooks/                        # React hooks (30+ hooks)
│   ├── core/                     # Reusable base hooks
│   │   ├── use-chatwoot-data-fetch.ts    # Base data fetching hook
│   │   ├── use-chatwoot-filters.ts       # Base filter management hook
│   │   └── index.ts
│   │
│   ├── actions/                  # Action hooks (user interactions)
│   ├── document/                 # Document-related hooks
│   ├── resources/                # Resource management hooks
│   ├── utils/                    # Utility hooks
│   │
│   ├── Domain-specific hooks:
│   │   ├── use-chatwoot-conversations.ts
│   │   ├── use-chatwoot-inboxes.ts
│   │   ├── use-chatwoot-messages.ts
│   │   ├── use-chatwoot-notifications.ts
│   │   ├── use-chatwoot-provider.ts      # Main orchestrator
│   │   ├── use-chatwoot-router.ts
│   │   ├── use-chatwoot-profile.ts
│   │   ├── use-chatwoot-labels.ts
│   │   ├── use-chatwoot-dashboard-stats.ts
│   │   ├── use-chatwoot-oauth.ts
│   │   ├── use-chatwoot-permissions.ts
│   │   ├── use-chatwoot-warnings.ts
│   │   ├── use-compose-conversation.ts
│   │   ├── use-message-sender.ts
│   │   └── ...
│   │
│   └── index.ts                  # Main hooks export
│
├── components/                   # UI components (40+ components)
│   ├── chatwoot-conversation-list.tsx
│   ├── chatwoot-message-viewer.tsx
│   ├── chatwoot-reply-composer.tsx
│   ├── chatwoot-conversation-filters.tsx
│   ├── chatwoot-notifications-view.tsx
│   ├── compose/                  # Compose conversation components
│   ├── conversation-list/        # Conversation list components
│   ├── dashboard/                # Dashboard components
│   ├── filters/                  # Filter components
│   ├── notifications/            # Notification components
│   └── ...
│
├── views/                        # View components (9 views)
│   ├── dashboard-view.tsx
│   ├── my-inbox-view.tsx
│   ├── all-conversations-view.tsx
│   ├── mentions-view.tsx
│   ├── unattended-view.tsx
│   ├── channels-view.tsx
│   ├── settings-view.tsx
│   ├── oauth-callback-view.tsx
│   ├── webhook-test-view.tsx
│   └── settings/                 # Settings subpages
│       ├── general-settings-subpage.tsx
│       ├── profile-settings-subpage.tsx
│       ├── inboxes-subpage.tsx
│       ├── inbox-detail-settings.tsx
│       ├── agents-subpage.tsx
│       ├── teams-subpage.tsx
│       ├── labels-subpage.tsx
│       └── tabs/                 # Inbox detail tabs
│
├── utils/                        # Utility functions
│   ├── filter-utils.ts           # Filter-related utilities
│   ├── api-response-utils.ts     # API response parsing utilities
│   ├── validation-utils.ts       # Validation utilities
│   ├── format-utils.ts           # Formatting utilities
│   └── index.ts
│
├── config/                       # Configuration
│   ├── channel-features.config.ts     # Feature flags per channel
│   └── inbox-settings.config.ts       # Inbox settings configuration
│
├── constants/                    # Shared constants
│   └── index.ts
│
├── contexts/                     # React contexts
│   └── chatwoot-provider-context.tsx
│
├── styles/                       # Shared styles
│   └── compose-styles.ts         # Compose modal styles
│
├── types/                        # TypeScript types
│   └── index.ts
│
└── README.md                     # This file
```

## Core Hooks

### `useChatwootDataFetch`

A base hook for data fetching with built-in:
- Loading state management
- Error handling
- Automatic refetch prevention
- Filter-based caching

**Usage:**
```typescript
const { data, loading, error, refresh } = useChatwootDataFetch({
  fetchFn: async () => await chatwootService.inboxes.listAllInboxes(),
  extractData: extractPayload,
  autoFetch: true,
  createFilterKey: () => `inboxes-${accountId}`,
});
```

### `useChatwootFilters`

A base hook for managing filter state with:
- Type-safe filter updates
- Validation support
- Filter reset capability

**Usage:**
```typescript
const { filters, updateFilters, resetFilters } = useChatwootFilters({
  initialFilters: { status: ConversationStatus.OPEN },
  onFiltersChange: (newFilters) => console.log(newFilters),
});
```

## Utility Functions

### Filter Utilities (`utils/filter-utils.ts`)

- `getConversationStatusLabel()` - Get human-readable status labels
- `getAssigneeTypeLabel()` - Get assignee type labels
- `getSortByLabel()` - Get sort by option labels
- `matchesStatusFilter()` - Check if conversation matches status filter
- `buildConversationFilters()` - Build conversation filters with inbox support
- `createFilterKey()` - Create stable filter key for caching

### API Response Utilities (`utils/api-response-utils.ts`)

- `extractPayload()` - Extract data array from API response
- `extractMetadata()` - Extract metadata from API response
- `extractPaginationInfo()` - Extract pagination info from metadata
- `extractCounts()` - Extract counts from metadata

## Configuration

### Channel Features (`config/channel-features.config.ts`)

Feature flags that determine which features are available per channel type:
- Message attachments
- Rich text editor
- Email-specific fields (to, cc, bcc)
- WhatsApp templates
- File upload types

**Usage:**
```typescript
import { getChannelFeatures } from './config/channel-features.config';

const features = getChannelFeatures(channelType);
if (features.supportsAttachments) {
  // Show attachment button
}
```

### Inbox Settings (`config/inbox-settings.config.ts`)

Configuration for inbox settings tabs and fields:
- General settings (name, greeting message, enable/disable)
- Business hours configuration
- CSAT survey settings
- Advanced configuration
- Bot configuration
- Collaborators management

## Contexts

### `ChatwootProviderContext`

React context for sharing provider state across components without prop drilling:
- Profile data
- Selected account
- Inboxes
- Filters
- Router methods

## Constants

Shared constants are defined in `constants/index.ts`:
- Default pagination values
- API response keys
- Refresh intervals
- Cache keys
- Channel types
- View names

## Best Practices

1. **Use Base Hooks**: When creating new hooks, extend `useChatwootDataFetch` or `useChatwootFilters` instead of reimplementing patterns.

2. **Use Utilities**: Import utilities from `utils/` instead of duplicating logic.

3. **Filter Management**: Use `buildConversationFilters()` and `createFilterKey()` for consistent filter handling.

4. **API Response Parsing**: Always use `extractPayload()`, `extractMetadata()`, etc. for parsing API responses.

5. **Constants**: Use shared constants from `constants/index.ts` instead of magic numbers/strings.

## Refactoring Benefits

✅ **Reduced Duplication**: Common patterns extracted into base hooks and utilities  
✅ **Better Type Safety**: Utility functions are properly typed  
✅ **Easier Maintenance**: Changes to common patterns only need to be made in one place  
✅ **Improved Testability**: Utilities can be tested in isolation  
✅ **Consistent Behavior**: All hooks use the same patterns for data fetching and filtering

## Migration Notes

When adding new features:
1. Check if you can extend existing core hooks
2. Use utility functions for common operations
3. Follow the established patterns for consistency
4. Update this README if you add new patterns




