# FrontDesk Chatwoot - Quick Decision Tree

Fast decision-making guide for common development tasks.

## 🎯 "I want to..."

### Add a new API endpoint
```
1. Check if endpoint exists in chatwootService
   ├─ YES → Use existing service method
   └─ NO → Continue to step 2

2. Add method to service
   → src/services/frontdesk/api/chatwoot/services/chatwoot-{service}.service.ts
   → Follow existing pattern with accountScopedUrl()

3. Add types if needed
   → src/services/frontdesk/api/chatwoot/types/{service}.types.ts

4. Export from service index
   → src/services/frontdesk/api/chatwoot/services/index.ts

5. Use in hook/component
   → Import chatwootService from @/services/frontdesk
```

### Add a new UI component
```
1. Check Chatwoot reference first
   → /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components/widgets/

2. Create component
   → src/widgets/frontdesk/providers/chatwoot/components/my-component.tsx

3. Create hook if needed
   → src/widgets/frontdesk/providers/chatwoot/hooks/use-my-component.ts
   → Use chatwootService for API calls
   → Use Recoil atoms for state

4. Add to view
   → src/widgets/frontdesk/providers/chatwoot/views/{view}.tsx
```

### Fetch data from API
```
1. Check accountId exists
   → Use chatwootSelectedAccountAtom
   → if (!accountId) return;

2. Choose service method
   → chatwootService.{service}.{method}(accountId, ...)

3. Handle response
   → Use extractPayload() for data array
   → Use extractMetadata() for pagination

4. Update state
   → Use Recoil atoms (not local state)
   → Use useRecoilState() or useSetRecoilState()
```

### Add a filter
```
1. Update filter types
   → src/services/frontdesk/api/chatwoot/types/conversations.types.ts
   → Add to ConversationListParams

2. Update filter utils
   → src/widgets/frontdesk/providers/chatwoot/utils/filter-utils.ts
   → Add to buildConversationFilters()

3. Update filter component
   → src/widgets/frontdesk/providers/chatwoot/components/filters/

4. Update hook
   → src/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-conversations.ts
   → Use createFilterKey() for caching
```

### Handle real-time updates
```
1. Check if WebSocket exists
   ├─ NO → Use REST polling or manual refresh
   └─ YES → Continue

2. WebSocket not implemented yet
   → Use REST polling with useEffect
   → Or manual refresh button
   → Future: Implement WebSocket service
```

### Debug an API call
```
1. Check accountId
   → console.log(accountId)
   → Must exist for all endpoints except profile

2. Check service method
   → Look in src/services/frontdesk/api/chatwoot/services/
   → Verify endpoint URL construction

3. Check network tab
   → Verify request URL format
   → Check Authorization header (JWT token)
   → Check response structure

4. Check response extraction
   → Use extractPayload() for data
   → Use extractMetadata() for meta
```

### Optimize performance
```
1. Use memoization
   → useMemo() for derived state
   → useCallback() for handlers

2. Use filter keys
   → createFilterKey() for stable caching
   → Prevent unnecessary refetches

3. Use Recoil selectors
   → For computed/derived state
   → Avoid recalculation

4. Check Chatwoot patterns
   → See performance guide
   → src/widgets/frontdesk/providers/chatwoot/PERFORMANCE.md
```

## 🔍 "Where do I find..."

### API service code
→ `src/services/frontdesk/api/chatwoot/services/`

### UI components
→ `src/widgets/frontdesk/providers/chatwoot/components/`

### Hooks
→ `src/widgets/frontdesk/providers/chatwoot/hooks/`

### State atoms
→ `src/store/frontdesk/atoms/chatwoot.atoms.ts`

### Types
→ `src/services/frontdesk/api/chatwoot/types/`

### Utilities
→ `src/widgets/frontdesk/providers/chatwoot/utils/`

### Chatwoot reference
→ `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/`

## ⚡ Common Patterns

### Pattern: Fetch on mount
```typescript
useEffect(() => {
  if (!accountId) return;
  fetchData();
}, [accountId]);
```

### Pattern: Filtered fetch
```typescript
const filterKey = useMemo(() => createFilterKey(filters), [filters]);
useEffect(() => {
  if (!accountId) return;
  fetchData();
}, [accountId, filterKey]);
```

### Pattern: Optimistic update
```typescript
// 1. Update UI immediately
setData(prev => [...prev, newItem]);
// 2. Make API call
try {
  const result = await api.create(newItem);
  // 3. Reconcile with server
  setData(prev => prev.map(item => item.id === newItem.id ? result : item));
} catch (error) {
  // 4. Revert on error
  setData(prev => prev.filter(item => item.id !== newItem.id));
}
```

## 🚨 Common Mistakes to Avoid

1. ❌ Calling API without accountId check
2. ❌ Using local state instead of Recoil for shared data
3. ❌ Not using createFilterKey() for filters
4. ❌ Not checking Chatwoot reference before building UI
5. ❌ Forgetting to use extractPayload() for API responses
6. ❌ Not memoizing callbacks/derived state
7. ❌ Ignoring error states in components
8. ❌ Creating new objects/arrays in render (causes infinite loops)
9. ❌ Not preventing duplicate API calls with refs
10. ❌ Missing dependencies in useEffect

## 🔧 Quick Fixes

### Fix: Infinite Loop
```
1. Check useEffect dependencies
2. Memoize filter objects with useMemo
3. Use createFilterKey() for stable keys
4. Add ref to prevent duplicate calls
```

### Fix: Multiple API Calls
```
1. Use useChatwootDataFetch base hook
2. Add isFetchingRef check
3. Check filter key hasn't changed
4. Use shared hook at provider level
```

### Fix: Component Not Updating
```
1. Check Recoil hooks are used (not useState)
2. Verify atom key is correct
3. Check state updates are happening
4. Use Recoil DevTools to inspect
```

See `troubleshooting.md` for detailed solutions.

