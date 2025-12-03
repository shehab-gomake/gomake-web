# Quick Decision Tree - FrontDesk Chatwoot

## 🎯 "I want to..."

### Add API endpoint

```
1. Check chatwootService → exists? Use it
2. Add method: src/services/frontdesk/api/chatwoot/services/chatwoot-{service}.service.ts
3. Add types: src/services/frontdesk/api/chatwoot/types/{service}.types.ts
4. Use in hook with accountId check
```

### Add UI component

```
1. Check Chatwoot ref: /Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/components/
2. Create: src/widgets/frontdesk/providers/chatwoot/components/my-component.tsx
3. Create hook if needed: hooks/use-my-component.ts
4. Add to view: views/{view}.tsx
```

### Fetch data

```
1. Check accountId: if (!accountId) return;
2. Call service: chatwootService.{service}.{method}(accountId, ...)
3. Extract: const data = extractPayload(response);
4. Update Recoil atom (not local state)
```

### Add filter

```
1. Add to types: ConversationListParams
2. Update: utils/filter-utils.ts → buildConversationFilters()
3. Update component: components/filters/
4. Use createFilterKey() for caching
```

## 🔍 "Where is..."

| What          | Location                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| API services  | `src/services/frontdesk/api/chatwoot/services/`                          |
| UI components | `src/widgets/frontdesk/providers/chatwoot/components/`                   |
| Hooks         | `src/widgets/frontdesk/providers/chatwoot/hooks/`                        |
| State atoms   | `src/store/frontdesk/atoms/chatwoot.atoms.ts`                            |
| Types         | `src/services/frontdesk/api/chatwoot/types/`                             |
| Utilities     | `src/widgets/frontdesk/providers/chatwoot/utils/`                        |
| Chatwoot ref  | `/Users/omarsabbah/Desktop/messaging/chatwoot/app/javascript/dashboard/` |

## ⚡ Patterns

### Fetch on mount

```typescript
useEffect(() => {
  if (!accountId) return;
  fetchData();
}, [accountId]);
```

### Filtered fetch (with caching)

```typescript
const filterKey = useMemo(() => createFilterKey(filters), [filters]);
useEffect(() => {
  if (!accountId) return;
  fetchData();
}, [accountId, filterKey]);
```

### Optimistic update

```typescript
setData((prev) => [...prev, newItem]); // Optimistic
try {
  const result = await api.create(newItem);
  setData((prev) => prev.map((x) => (x.id === newItem.id ? result : x)));
} catch {
  setData((prev) => prev.filter((x) => x.id !== newItem.id));
} // Rollback
```

## 🚨 Common Mistakes

1. ❌ API call without `accountId` check
2. ❌ Local state for shared data (use Recoil)
3. ❌ No `createFilterKey()` for filters
4. ❌ No `extractPayload()` for responses
5. ❌ No Chatwoot reference check before UI
6. ❌ Missing `useMemo`/`useCallback`
7. ❌ New objects in render (infinite loops)

## 🔧 Quick Fixes

### Infinite Loop

```
→ Memoize filter objects with useMemo
→ Use createFilterKey() for stable keys
→ Check useEffect dependencies
```

### Multiple API Calls

```
→ Use useFetchLock() hook
→ Add isFetchingRef check
→ Verify filter key stability
```

### Component Not Updating

```
→ Verify using Recoil hooks (not useState)
→ Check atom key is correct
→ Verify state updates happening
```
