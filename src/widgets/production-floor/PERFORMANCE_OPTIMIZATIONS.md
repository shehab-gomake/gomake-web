# Production Floor Performance Optimizations

## Overview

This document outlines the performance optimizations implemented to handle large datasets in the production floor component without causing the frontend to hang.

## Problem Statement

The original production floor component would hang when dealing with large numbers of printing jobs because:

1. **No Virtualization**: All jobs were rendered at once in the DOM
2. **Inefficient Re-renders**: Components re-rendered unnecessarily
3. **Memory Leaks**: No proper cleanup of event listeners and observers
4. **Blocking Operations**: Heavy computations on the main thread

## Optimizations Implemented

### 1. Virtualization

**Implementation**: `src/widgets/production-floor/table-view/status-table/status-table-component.tsx`

- **Threshold-based virtualization**: Automatically enables when more than 50 items per status
- **Batch rendering**: Renders 20 items at a time with infinite scrolling
- **Intersection Observer**: Detects when user scrolls near the end to load more items

```typescript
const VIRTUALIZATION_THRESHOLD = 50;
const VIRTUAL_BATCH_SIZE = 20;
```

### 2. Memoization and Caching

**Implementation**: Multiple components

- **useMemo**: Prevents unnecessary recalculations of filtered data
- **useCallback**: Prevents unnecessary re-renders of event handlers
- **Memoized components**: Status table components are memoized

```typescript
const filteredBoards = useMemo(() => {
  const boards = getBoards();
  const sortedBoards = [...boards].sort((a, b) => a.priority - b.priority);
  
  if (sortedBoards.length > VIRTUALIZATION_THRESHOLD) {
    setIsVirtualizingLocal(true);
    return sortedBoards.slice(virtualStart, virtualEnd);
  } else {
    setIsVirtualizingLocal(false);
    return sortedBoards;
  }
}, [getBoards, virtualStart, virtualEnd]);
```

### 3. Debounced Operations

**Implementation**: `src/widgets/production-floor/table-view/production-floor-table-view.tsx`

- **Search debouncing**: 300ms delay to prevent excessive API calls
- **Filter debouncing**: Prevents rapid filter changes from causing re-renders

```typescript
const DEBOUNCE_DELAY = 300;

searchTimeoutRef.current = setTimeout(() => {
  setFilteredMissionsBySearch(allFilteredMissions);
  if (!!search) {
    getAllBoardMissionsFromSearch().then();
  }
}, DEBOUNCE_DELAY);
```

### 4. Performance Monitoring

**Implementation**: `src/widgets/production-floor/utils/performance-monitor.ts`

- **Real-time monitoring**: Tracks render times and memory usage
- **Adaptive optimization**: Adjusts batch sizes based on performance
- **Memory management**: Detects high memory usage and triggers cleanup

```typescript
const { startTimer, recordMetric, getStats } = usePerformanceMonitor();
```

### 5. Optimized Data Flow

**Implementation**: `src/widgets/production-floor/views/boards-view/production-floor-board-missions-views.tsx`

- **Efficient state updates**: Only updates necessary parts of the state
- **Lazy loading**: Loads data only when needed
- **Error boundaries**: Prevents crashes from affecting the entire component

## Performance Constants

```typescript
// Virtualization thresholds
const VIRTUALIZATION_THRESHOLD = 100; // Global threshold
const VIRTUAL_BATCH_SIZE = 50; // Global batch size
const DEBOUNCE_DELAY = 300; // Search debounce

// Local virtualization (per status)
const VIRTUALIZATION_THRESHOLD = 50; // Per-status threshold
const VIRTUAL_BATCH_SIZE = 20; // Per-status batch size
```

## Memory Management

### Automatic Cleanup
- **Intersection Observers**: Properly disconnected when components unmount
- **Event Listeners**: Cleaned up to prevent memory leaks
- **Timeout References**: Cleared to prevent memory accumulation

### Memory Monitoring
```typescript
const memoryUsage = memoryOptimizer.getMemoryUsage();
if (memoryOptimizer.isMemoryUsageHigh()) {
  // Trigger cleanup or show warning
}
```

## Usage Guidelines

### For Developers

1. **Monitor Performance**: Use the performance monitor in development
2. **Adjust Thresholds**: Modify constants based on your data size
3. **Test with Large Datasets**: Always test with realistic data volumes

### For Users

1. **Search Efficiently**: Use specific search terms to reduce filtering overhead
2. **Collapse Unused Statuses**: Collapse status sections you're not actively working with
3. **Use Pagination**: For very large datasets, use the paginated view

## Monitoring and Debugging

### Development Mode
In development mode, the performance monitor automatically tracks:
- Render times
- Memory usage
- Virtualization usage
- Slow operations (warnings for operations > 100ms)

### Performance Stats
```typescript
const stats = performanceMonitor.getStats();
console.log('Average render time:', stats.averageRenderTime);
console.log('Virtualization usage:', stats.virtualizationUsage);
```

## Troubleshooting

### Common Issues

1. **Still Hanging with Large Data**
   - Check if virtualization is enabled (console logs)
   - Verify data size is above threshold
   - Check for memory leaks in browser dev tools

2. **Slow Scrolling**
   - Reduce `VIRTUAL_BATCH_SIZE`
   - Increase `DEBOUNCE_DELAY`
   - Check for expensive operations in render functions

3. **Memory Issues**
   - Enable memory monitoring
   - Check for proper cleanup in useEffect
   - Consider reducing batch sizes

### Debug Commands
```typescript
// Enable performance monitoring
performanceMonitor.setEnabled(true);

// Get current stats
console.log(performanceMonitor.getStats());

// Clear metrics
performanceMonitor.clear();

// Force garbage collection (if available)
memoryOptimizer.forceGC();
```

## Future Optimizations

1. **Web Workers**: Move heavy computations to background threads
2. **IndexedDB**: Cache data locally for faster access
3. **Service Workers**: Implement offline capabilities
4. **React Concurrent Features**: Use React 18+ features for better performance
5. **GraphQL**: Implement more efficient data fetching with GraphQL

## Testing

### Performance Testing
```bash
# Test with large datasets
npm run test:performance

# Memory leak testing
npm run test:memory

# Load testing
npm run test:load
```

### Manual Testing Checklist
- [ ] Load 1000+ jobs
- [ ] Test search functionality
- [ ] Test drag and drop
- [ ] Test status changes
- [ ] Monitor memory usage
- [ ] Test on mobile devices
- [ ] Test with slow network

## Conclusion

These optimizations should significantly improve the performance of the production floor component when handling large datasets. The virtualization ensures smooth scrolling, while memoization and debouncing prevent unnecessary re-renders and API calls.

For optimal performance, monitor the metrics in development and adjust the constants based on your specific use case and data patterns. 