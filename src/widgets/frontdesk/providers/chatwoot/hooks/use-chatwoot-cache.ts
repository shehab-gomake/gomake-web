/**
 * Chatwoot Cache Management Hook
 *
 * Provides cache invalidation and management utilities for conversation caches.
 * Handles cache clearing on account switches and provides manual invalidation methods.
 */

import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilCallback } from 'recoil';
import {
  chatwootCacheKeysAtom,
  chatwootConversationsCacheFamily,
  CONVERSATION_CACHE_STALE_TIME,
} from '@/store/frontdesk/atoms/chatwoot.atoms';
import { clearAllConversationCaches, getCacheStats, type CacheStats } from '../utils/cache-utils';
import { createLogger } from '@/services/frontdesk/utils/logger';

const logger = createLogger('useChatwootCache');

export const useChatwootCache = (accountId: number | null) => {
  const [cacheKeys, setCacheKeys] = useRecoilState(chatwootCacheKeysAtom);

  /**
   * Clear all conversation caches
   * Used when switching accounts or on manual refresh all
   */
  const clearAllCaches = useRecoilCallback(
    ({ reset }) =>
      () => {
        logger.info(`Clearing all ${cacheKeys.size} conversation caches`);

        // Reset each cache entry
        cacheKeys.forEach(key => {
          reset(chatwootConversationsCacheFamily(key));
        });

        // Clear the cache keys registry
        setCacheKeys(new Set());
      },
    [cacheKeys, setCacheKeys]
  );

  /**
   * Clear cache for a specific filter key
   */
  const clearCache = useRecoilCallback(
    ({ reset }) =>
      (filterKey: string) => {
        logger.info(`Clearing cache for key: ${filterKey}`);
        reset(chatwootConversationsCacheFamily(filterKey));

        // Remove from cache keys
        setCacheKeys(prev => {
          const updated = new Set(prev);
          updated.delete(filterKey);
          return updated;
        });
      },
    [setCacheKeys]
  );

  /**
   * Invalidate caches matching a predicate
   * Example: Invalidate all caches for inbox_id=5
   */
  const invalidateCaches = useRecoilCallback(
    ({ reset }) =>
      (predicate: (key: string) => boolean) => {
        const keysToInvalidate = Array.from(cacheKeys).filter(predicate);
        logger.info(`Invalidating ${keysToInvalidate.length} caches`);

        keysToInvalidate.forEach(key => {
          reset(chatwootConversationsCacheFamily(key));
        });

        // Remove invalidated keys from registry
        setCacheKeys(prev => {
          const updated = new Set(prev);
          keysToInvalidate.forEach(key => updated.delete(key));
          return updated;
        });
      },
    [cacheKeys, setCacheKeys]
  );

  /**
   * Get cache statistics for monitoring
   */
  const getStats = useRecoilCallback(
    ({ snapshot }) =>
      (): CacheStats => {
        const getCacheFamily = (key: string) => {
          return snapshot.getLoadable(chatwootConversationsCacheFamily(key)).getValue();
        };

        return getCacheStats(cacheKeys, getCacheFamily, CONVERSATION_CACHE_STALE_TIME);
      },
    [cacheKeys]
  );

  /**
   * Clear all caches when account changes
   * This prevents showing conversations from previous account
   */
  useEffect(() => {
    if (accountId !== null && cacheKeys.size > 0) {
      // Check if any cache keys include a different account ID
      const needsClear = Array.from(cacheKeys).some(key => {
        try {
          const parsed = JSON.parse(key);
          return parsed.accountId && parsed.accountId !== accountId;
        } catch {
          return false;
        }
      });

      if (needsClear) {
        logger.info(`Account changed to ${accountId}, clearing all caches`);
        clearAllCaches();
      }
    }
  }, [accountId]); // Only depend on accountId, not clearAllCaches to avoid loops

  return {
    clearAllCaches,
    clearCache,
    invalidateCaches,
    getStats,
    cacheCount: cacheKeys.size,
  };
};
