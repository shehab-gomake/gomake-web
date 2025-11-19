import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number; // Distance from bottom in pixels (default: 200px)
  enabled?: boolean; // Allow disabling the hook (default: true)
}

/**
 * Custom hook for infinite scroll functionality using IntersectionObserver
 *
 * @param options - Configuration options
 * @returns ref - Reference to attach to the sentinel element at the bottom of the list
 *
 * @example
 * const sentinelRef = useInfiniteScroll({
 *   onLoadMore: loadMoreItems,
 *   hasMore: hasMoreData,
 *   loading: isLoading,
 *   threshold: 200, // Trigger 200px before reaching the element
 * });
 *
 * // In JSX:
 * <div ref={sentinelRef} style={{ height: 1, width: '100%' }} />
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  loading,
  threshold = 200,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize the callback to prevent unnecessary observer recreation
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Trigger load when:
      // 1. Sentinel is intersecting (visible)
      // 2. There's more data to load
      // 3. Not currently loading
      // 4. Feature is enabled
      if (entry.isIntersecting && hasMore && !loading && enabled) {
        console.log("[useInfiniteScroll] Triggering load more");
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, loading, enabled]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;

    // Don't set up observer if sentinel element doesn't exist or feature is disabled
    if (!sentinel || !enabled || !hasMore) {
      return;
    }

    // Create IntersectionObserver with rootMargin to trigger before reaching the element
    // Use POSITIVE rootMargin to expand the intersection area downward
    // This triggers the callback when the sentinel is threshold pixels away from viewport
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null, // Use viewport as root
      rootMargin: `0px 0px ${threshold}px 0px`, // Bottom margin only
      threshold: 0, // Trigger as soon as any part is visible
    });

    // Start observing the sentinel element
    observerRef.current.observe(sentinel);

    console.log("[useInfiniteScroll] Observer initialized with threshold:", threshold);

    // Cleanup: disconnect observer when component unmounts or dependencies change
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        console.log("[useInfiniteScroll] Observer disconnected");
      }
    };
  }, [handleIntersection, threshold, enabled, hasMore]);

  return sentinelRef;
};
