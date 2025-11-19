# Chatwoot Provider - Code Organization

This directory contains the Chatwoot provider implementation for FrontDesk. The code is organized for maximum reusability and maintainability.

## Directory Structure

```
chatwoot/
├── hooks/
│   ├── core/                    # Reusable base hooks
│   │   ├── use-chatwoot-data-fetch.ts    # Base data fetching hook
│   │   ├── use-chatwoot-filters.ts      # Base filter management hook
│   │   └── index.ts                      # Public API exports
│   │
│   ├── domain/                  # Domain-specific hooks
│   │   ├── use-chatwoot-conversations.ts
│   │   ├── use-chatwoot-inboxes.ts
│   │   ├── use-chatwoot-messages.ts
│   │   ├── use-chatwoot-notifications.ts
│   │   ├── use-chatwoot-provider.ts
│   │   └── use-chatwoot-router.ts
│   │
│   └── index.ts                 # Main hooks export
│
├── utils/                        # Utility functions
│   ├── filter-utils.ts          # Filter-related utilities
│   ├── api-response-utils.ts    # API response parsing utilities
│   └── index.ts                 # Public API exports
│
├── constants/                    # Shared constants
│   └── index.ts
│
├── components/                  # UI components
│   ├── chatwoot-conversation-filters.tsx
│   ├── chatwoot-conversation-list.tsx
│   ├── chatwoot-message-viewer.tsx
│   └── ...
│
├── views/                       # View components
│   ├── all-conversations-view.tsx
│   ├── channels-view.tsx
│   └── ...
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

## Constants

Shared constants are defined in `constants/index.ts`:
- Default pagination values
- API response keys
- Refresh intervals
- Cache keys

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



