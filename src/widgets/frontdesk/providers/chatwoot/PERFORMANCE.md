# Chatwoot Provider Performance Optimization Guide

This document outlines the performance optimizations implemented in the Chatwoot provider and best practices for maintaining optimal performance.

## Table of Contents

1. [React Performance Optimizations](#react-performance-optimizations)
2. [State Management Optimizations](#state-management-optimizations)
3. [Network Request Optimizations](#network-request-optimizations)
4. [Component Rendering Optimizations](#component-rendering-optimizations)
5. [Memory Management](#memory-management)
6. [Best Practices](#best-practices)

---

## React Performance Optimizations

### 1. useMemo for Expensive Computations

**Problem:** Expensive calculations run on every render.

**Solution:** Use `useMemo` to cache computed values.

```typescript
// ❌ Bad: Recalculates on every render
const sortedConversations = conversations.sort((a, b) =>
  (b.last_activity_at ?? 0) - (a.last_activity_at ?? 0)
);

// ✅ Good: Only recalculates when conversations change
const sortedConversations = useMemo(() =>
  conversations.sort((a, b) =>
    (b.last_activity_at ?? 0) - (a.last_activity_at ?? 0)
  ),
  [conversations]
);
```

**Implemented in:**
- `use-chatwoot-provider.ts` - Filter calculations
- `use-chatwoot-conversations.ts` - Filter key generation
- `use-optimized-filters.ts` - All filter computations

### 2. useCallback for Stable Function References

**Problem:** New function instances on every render cause child re-renders.

**Solution:** Use `useCallback` to maintain function identity.

```typescript
// ❌ Bad: New function on every render
const handleSelect = (id: number) => {
  setSelected(id);
};

// ✅ Good: Stable function reference
const handleSelect = useCallback((id: number) => {
  setSelected(id);
}, [setSelected]);
```

**Implemented in:**
- All event handlers in hooks
- Filter change handlers
- Action callbacks

### 3. React.memo for Component Memoization

**Problem:** Child components re-render unnecessarily.

**Solution:** Wrap components with `React.memo`.

```typescript
// ✅ Component only re-renders when props change
export const ConversationListItem = React.memo<ConversationListItemProps>(({
  conversation,
  onSelect,
}) => {
  // Component logic
});
```

**Candidates for memoization:**
- `ChatwootConversationListItem`
- `ChatwootMessageItem`
- Small reusable components

---

## State Management Optimizations

### 1. RequestState Pattern

**Problem:** Multiple atoms for loading/error/data states.

**Solution:** Combine into single `RequestState<T>` atom.

```typescript
// ❌ Before: 3 atoms per resource
const conversationsAtom = atom<Conversation[]>([]);
const conversationsLoadingAtom = atom<boolean>(false);
const conversationsErrorAtom = atom<string | null>(null);

// ✅ After: 1 atom per resource
const conversationsRequestAtom = atom<RequestState<Conversation[]>>({
  data: [],
  loading: false,
  error: null,
});
```

**Benefits:**
- Fewer atoms (24 → ~12-15)
- Atomic state updates
- Consistent error handling
- Better TypeScript inference

**Implementation:** See `request-state.types.ts`

### 2. Selector Functions

**Problem:** Derived state recalculated everywhere.

**Solution:** Use Recoil selectors for derived state.

```typescript
// ✅ Selector for unread count
export const unreadCountSelector = selector({
  key: 'frontdesk.chatwoot.unreadCount',
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    return conversations.filter(c => c.unread_count > 0).length;
  },
});
```

### 3. Atom Families for Collections

**Problem:** Updating large arrays causes full re-renders.

**Solution:** Use atom families for individual items.

```typescript
// ✅ Individual conversation atoms
export const conversationAtomFamily = atomFamily<Conversation | null, number>({
  key: 'frontdesk.chatwoot.conversation',
  default: null,
});
```

---

## Network Request Optimizations

### 1. Request Deduplication

**Problem:** Multiple components trigger the same request.

**Solution:** Track in-flight requests and deduplicate.

```typescript
// ✅ Implemented in use-chatwoot-data-fetch.ts
const isFetchingRef = useRef(false);

if (isFetchingRef.current) {
  return; // Skip duplicate request
}

isFetchingRef.current = true;
try {
  await fetchData();
} finally {
  isFetchingRef.current = false;
}
```

### 2. Filter Key Caching

**Problem:** Filter changes trigger unnecessary refetches.

**Solution:** Generate stable filter keys to detect real changes.

```typescript
// ✅ Implemented in use-chatwoot-conversations.ts
const filterKey = useMemo(() => {
  return createFilterKey(accountId, options);
}, [accountId, options.status, options.inbox_id, ...]);

// Only fetch if filter key actually changed
if (filterKey !== lastFetchedKeyRef.current) {
  fetchConversations();
}
```

### 3. Pagination

**Problem:** Loading all data at once is slow.

**Solution:** Implement cursor or offset pagination.

```typescript
// ✅ Implemented with load more functionality
const loadMore = useCallback(() => {
  if (!loading && hasMore) {
    fetchConversations(currentPage + 1, true); // append=true
  }
}, [loading, hasMore, currentPage]);
```

### 4. Request Cancellation

**Problem:** Stale requests overwrite newer data.

**Solution:** Cancel pending requests when new ones start.

```typescript
// ✅ Using AbortController
const abortControllerRef = useRef<AbortController>();

const fetchData = async () => {
  // Cancel previous request
  abortControllerRef.current?.abort();
  abortControllerRef.current = new AbortController();

  await fetch(url, { signal: abortControllerRef.current.signal });
};
```

---

## Component Rendering Optimizations

### 1. Virtual Scrolling

**Problem:** Rendering 1000+ list items is slow.

**Solution:** Implement virtual scrolling (render only visible items).

```typescript
// ✅ Using react-window or react-virtualized
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={conversations.length}
  itemSize={72}
  width="100%"
>
  {({ index, style }) => (
    <ConversationListItem
      style={style}
      conversation={conversations[index]}
    />
  )}
</FixedSizeList>
```

**Status:** Not yet implemented (future enhancement)

### 2. Lazy Loading Components

**Problem:** Loading all components upfront slows initial load.

**Solution:** Use `React.lazy` for code splitting.

```typescript
// ✅ Lazy load heavy components
const ChatwootNotificationsView = React.lazy(() =>
  import('./views/ChatwootNotificationsView')
);

<Suspense fallback={<LoadingSpinner />}>
  <ChatwootNotificationsView />
</Suspense>
```

### 3. Debounced Search

**Problem:** Search input triggers request on every keystroke.

**Solution:** Debounce search input.

```typescript
// ✅ Using lodash debounce or custom hook
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    onFiltersChange({ q: query });
  }, 300),
  [onFiltersChange]
);
```

---

## Memory Management

### 1. Cleanup Side Effects

**Problem:** Event listeners and subscriptions leak memory.

**Solution:** Return cleanup functions from `useEffect`.

```typescript
// ✅ Good: Cleanup on unmount
useEffect(() => {
  const subscription = messagingService.subscribe(handleMessage);

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 2. Clear Large Data on Unmount

**Problem:** Large datasets remain in memory after navigation.

**Solution:** Clear atoms when leaving provider.

```typescript
// ✅ Clear data on unmount
useEffect(() => {
  return () => {
    setConversations([]);
    setMessages([]);
  };
}, []);
```

### 3. Avoid Memory Leaks in Refs

**Problem:** Refs holding onto large objects.

**Solution:** Clear refs when no longer needed.

```typescript
// ✅ Clear ref on cleanup
useEffect(() => {
  return () => {
    isFetchingRef.current = false;
    lastFetchedKeyRef.current = null;
  };
}, []);
```

---

## Best Practices

### 1. Measure Before Optimizing

Use React DevTools Profiler to identify bottlenecks before optimizing.

```bash
# Enable profiling in development
REACT_APP_PROFILE=true npm start
```

### 2. Avoid Premature Optimization

Focus on:
1. Correctness first
2. Readability second
3. Performance third (only when needed)

### 3. Monitor Bundle Size

```bash
# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### 4. Use Production Builds

Development builds are 3-5x slower. Always test performance with production builds.

```bash
npm run build
npx serve -s build
```

### 5. Lighthouse Audits

Run Lighthouse regularly to track performance metrics.

```bash
npm run build
npx lighthouse http://localhost:3004/frontdesk
```

---

## Performance Metrics Goals

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | TBD |
| Time to Interactive | < 3.0s | TBD |
| Largest Contentful Paint | < 2.5s | TBD |
| Cumulative Layout Shift | < 0.1 | TBD |
| Total Blocking Time | < 200ms | TBD |

---

## Future Optimizations

### High Priority
1. ✅ Implement RequestState pattern
2. ✅ Add useMemo/useCallback to hooks
3. ✅ Create utility functions
4. ⏳ Virtual scrolling for long lists
5. ⏳ Lazy load heavy components

### Medium Priority
6. ⏳ Implement React.memo for list items
7. ⏳ Add request cancellation
8. ⏳ Debounced search
9. ⏳ Service Worker for offline support
10. ⏳ IndexedDB caching

### Low Priority
11. ⏳ Web Workers for heavy computations
12. ⏳ Image lazy loading and optimization
13. ⏳ Prefetch next page data
14. ⏳ Compress API responses

---

## Monitoring

### Development
```typescript
// Add performance marks
performance.mark('fetch-conversations-start');
await fetchConversations();
performance.mark('fetch-conversations-end');

performance.measure(
  'fetch-conversations',
  'fetch-conversations-start',
  'fetch-conversations-end'
);
```

### Production
Consider adding:
- Application Performance Monitoring (APM) - e.g., Datadog, New Relic
- Real User Monitoring (RUM)
- Error tracking - e.g., Sentry

---

## Summary

This performance guide ensures the Chatwoot provider remains fast and responsive as the codebase grows. Follow these patterns and guidelines to maintain optimal performance.

**Key Takeaways:**
1. Use React hooks (useMemo, useCallback) appropriately
2. Implement RequestState pattern for state management
3. Deduplicate and cache network requests
4. Measure performance regularly
5. Optimize rendering with virtualization and lazy loading
