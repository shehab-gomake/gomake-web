import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';

interface InfiniteScrollObserverProps {
  /**
   * Callback function to load more data when user scrolls to bottom
   */
  onLoadMore: () => void;

  /**
   * Whether there is more data to load
   */
  hasMore: boolean;

  /**
   * Whether data is currently being loaded
   */
  isLoading: boolean;

  /**
   * Optional threshold (0.0 to 1.0) for triggering load more
   * Default: 1.0 (trigger when fully visible)
   */
  threshold?: number;

  /**
   * Optional root margin for intersection observer
   * Default: '0px' (trigger exactly at bottom)
   */
  rootMargin?: string;
}

/**
 * InfiniteScrollObserver Component
 *
 * Uses IntersectionObserver API to detect when user scrolls near the bottom
 * and triggers a callback to load more data.
 *
 * @example
 * ```tsx
 * <Stack>
 *   {notifications.map(n => <NotificationItem key={n.id} {...n} />)}
 *   <InfiniteScrollObserver
 *     onLoadMore={loadMore}
 *     hasMore={hasMore}
 *     isLoading={isLoadingMore}
 *   />
 * </Stack>
 * ```
 */
const InfiniteScrollObserver: React.FC<InfiniteScrollObserverProps> = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 1.0,
  rootMargin = '0px',
}) => {
  const { primaryColor } = useGomakeTheme();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't set up observer if there's no more data or currently loading
    if (!hasMore || isLoading) {
      return;
    }

    const target = observerTarget.current;
    if (!target) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        // When the target element becomes visible
        if (entries[0].isIntersecting) {
          console.log('[InfiniteScrollObserver] Bottom reached, loading more...');
          onLoadMore();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin, // Margin around root
        threshold, // Percentage of target visibility to trigger
      }
    );

    // Start observing
    observer.observe(target);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  // Don't render anything if there's no more data
  if (!hasMore) {
    return null;
  }

  return (
    <Box
      ref={observerTarget}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        minHeight: '60px',
      }}
    >
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{ color: primaryColor?.(500) || '#2e3092' }}
        />
      )}
    </Box>
  );
};

export { InfiniteScrollObserver };
