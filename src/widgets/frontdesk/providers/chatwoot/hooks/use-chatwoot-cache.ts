/**
 * Chatwoot Cache Management Hook
 *
 * Provides cache invalidation and management utilities for conversation caches.
 * Implements LRU (Least Recently Used) eviction to prevent unbounded cache growth.
 * Handles cache clearing on account switches and provides manual invalidation methods.
 */

import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import {
  chatwootCacheKeysAtom,
  chatwootConversationsCacheFamily,
  chatwootCacheConfigAtom,
  chatwootCacheStatsAtom,
  CONVERSATION_CACHE_STALE_TIME,
  ConversationCacheEntry,
  CacheStatistics,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootCache");

export interface CacheStats {
  totalEntries: number;
  freshEntries: number;
  staleEntries: number;
  totalConversations: number;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
  cacheKeys: string[];
}

export const useChatwootCache = (accountId: number | null) => {
  const [cacheKeys, setCacheKeys] = useRecoilState(chatwootCacheKeysAtom);
  const [cacheStats, setCacheStats] = useRecoilState(chatwootCacheStatsAtom);
  const cacheConfig = useRecoilValue(chatwootCacheConfigAtom);

  /**
   * Update cache access time (LRU tracking)
   */
  const touchCache = useRecoilCallback(
    ({ set, snapshot }) =>
      (filterKey: string) => {
        const cacheLoadable = snapshot.getLoadable(chatwootConversationsCacheFamily(filterKey));
        if (cacheLoadable.state !== "hasValue") return;

        const cache = cacheLoadable.getValue();
        set(chatwootConversationsCacheFamily(filterKey), {
          ...cache,
          lastAccessed: Date.now(),
        });

        // Update hit count
        setCacheStats((prev) => ({
          ...prev,
          hitCount: prev.hitCount + 1,
        }));
      },
    [setCacheStats]
  );

  /**
   * Record cache miss
   */
  const recordCacheMiss = useCallback(() => {
    setCacheStats((prev) => ({
      ...prev,
      missCount: prev.missCount + 1,
    }));
  }, [setCacheStats]);

  /**
   * Get all cache entries with their metadata for LRU sorting
   *
   * IMPORTANT: Reads cacheKeys from Recoil snapshot (not closure) to ensure
   * fresh data when called from other useRecoilCallback functions like
   * evictLRU, evictStale, and getStats.
   */
  const getCacheEntriesWithMetadata = useRecoilCallback(
    ({ snapshot }) =>
      (): Array<{ key: string; entry: ConversationCacheEntry }> => {
        const entries: Array<{ key: string; entry: ConversationCacheEntry }> = [];

        // Read cacheKeys from snapshot to get fresh value, not stale closure
        const currentCacheKeys = snapshot.getLoadable(chatwootCacheKeysAtom).getValue();

        currentCacheKeys.forEach((key) => {
          const loadable = snapshot.getLoadable(chatwootConversationsCacheFamily(key));
          if (loadable.state === "hasValue") {
            entries.push({ key, entry: loadable.getValue() });
          }
        });

        return entries;
      },
    [] // No dependencies needed - reads directly from snapshot
  );

  /**
   * Evict least recently used cache entries
   * Called automatically when cache size exceeds threshold
   *
   * @param count - Number of entries to evict (default: evict down to threshold)
   * @returns Number of entries evicted
   */
  const evictLRU = useRecoilCallback(
    ({ reset, snapshot }) =>
      (count?: number): number => {
        if (!cacheConfig.enableLRU) {
          logger.debug("LRU eviction disabled");
          return 0;
        }

        const entries = getCacheEntriesWithMetadata();

        // Calculate how many to evict
        // Use !== undefined to distinguish "not provided" from "explicitly zero"
        // This allows evictLRU(0) to correctly return 0 instead of using threshold
        const currentSize = entries.length;
        const targetSize = count !== undefined ? currentSize - count : cacheConfig.evictionThreshold;
        const entriesToEvict = currentSize - targetSize;

        if (entriesToEvict <= 0) {
          logger.debug("No eviction needed", { currentSize, targetSize });
          return 0;
        }

        // Sort by lastAccessed (oldest first) - LRU eviction
        // Note: Use explicit > 0 check instead of || operator since 0 is a valid timestamp
        // and would incorrectly be treated as falsy by || operator
        const sortedEntries = [...entries].sort((a, b) => {
          const aTime = a.entry.lastAccessed > 0 ? a.entry.lastAccessed : a.entry.timestamp > 0 ? a.entry.timestamp : 0;
          const bTime = b.entry.lastAccessed > 0 ? b.entry.lastAccessed : b.entry.timestamp > 0 ? b.entry.timestamp : 0;
          return aTime - bTime;
        });

        // Evict the oldest entries
        const keysToEvict = sortedEntries.slice(0, entriesToEvict).map((e) => e.key);

        logger.info(`Evicting ${keysToEvict.length} LRU cache entries`, {
          currentSize,
          targetSize,
          evicting: keysToEvict.length,
        });

        // Reset the cache entries
        keysToEvict.forEach((key) => {
          reset(chatwootConversationsCacheFamily(key));
        });

        // Update cache keys registry
        setCacheKeys((prev) => {
          const updated = new Set(prev);
          keysToEvict.forEach((key) => updated.delete(key));
          return updated;
        });

        // Update stats
        setCacheStats((prev) => ({
          ...prev,
          evictionCount: prev.evictionCount + keysToEvict.length,
          lastEviction: Date.now(),
          totalEntries: prev.totalEntries - keysToEvict.length,
        }));

        return keysToEvict.length;
      },
    [cacheConfig, getCacheEntriesWithMetadata, setCacheKeys, setCacheStats]
  );

  /**
   * Evict stale cache entries (older than staleTime)
   *
   * @returns Number of entries evicted
   */
  const evictStale = useRecoilCallback(
    ({ reset }) =>
      (): number => {
        const now = Date.now();
        const staleThreshold = now - cacheConfig.staleTime;
        const entries = getCacheEntriesWithMetadata();

        const staleKeys = entries.filter((e) => e.entry.timestamp > 0 && e.entry.timestamp < staleThreshold).map((e) => e.key);

        if (staleKeys.length === 0) {
          return 0;
        }

        logger.info(`Evicting ${staleKeys.length} stale cache entries`);

        staleKeys.forEach((key) => {
          reset(chatwootConversationsCacheFamily(key));
        });

        setCacheKeys((prev) => {
          const updated = new Set(prev);
          staleKeys.forEach((key) => updated.delete(key));
          return updated;
        });

        setCacheStats((prev) => ({
          ...prev,
          evictionCount: prev.evictionCount + staleKeys.length,
          lastEviction: Date.now(),
        }));

        return staleKeys.length;
      },
    [cacheConfig.staleTime, getCacheEntriesWithMetadata, setCacheKeys, setCacheStats]
  );

  /**
   * Clear all conversation caches
   * Used when switching accounts or on manual refresh all
   */
  const clearAllCaches = useRecoilCallback(
    ({ reset }) =>
      () => {
        logger.info(`Clearing all ${cacheKeys.size} conversation caches`);

        // Reset each cache entry
        cacheKeys.forEach((key) => {
          reset(chatwootConversationsCacheFamily(key));
        });

        // Clear the cache keys registry
        setCacheKeys(new Set());

        // Reset stats
        setCacheStats((prev) => ({
          ...prev,
          totalEntries: 0,
          totalConversations: 0,
          oldestEntry: null,
          newestEntry: null,
        }));
      },
    [cacheKeys, setCacheKeys, setCacheStats]
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
        setCacheKeys((prev) => {
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

        keysToInvalidate.forEach((key) => {
          reset(chatwootConversationsCacheFamily(key));
        });

        // Remove invalidated keys from registry
        setCacheKeys((prev) => {
          const updated = new Set(prev);
          keysToInvalidate.forEach((key) => updated.delete(key));
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
        const now = Date.now();
        const entries = getCacheEntriesWithMetadata();

        let freshEntries = 0;
        let staleEntries = 0;
        let totalConversations = 0;
        let oldestTimestamp: number | null = null;
        let newestTimestamp: number | null = null;

        entries.forEach((e) => {
          const age = now - e.entry.timestamp;
          if (age < cacheConfig.staleTime) {
            freshEntries++;
          } else {
            staleEntries++;
          }

          totalConversations += e.entry.conversations.length;

          if (e.entry.timestamp > 0) {
            if (oldestTimestamp === null || e.entry.timestamp < oldestTimestamp) {
              oldestTimestamp = e.entry.timestamp;
            }
            if (newestTimestamp === null || e.entry.timestamp > newestTimestamp) {
              newestTimestamp = e.entry.timestamp;
            }
          }
        });

        return {
          totalEntries: entries.length,
          freshEntries,
          staleEntries,
          totalConversations,
          oldestTimestamp,
          newestTimestamp,
          cacheKeys: Array.from(cacheKeys),
        };
      },
    [cacheKeys, cacheConfig.staleTime, getCacheEntriesWithMetadata]
  );

  /**
   * Check if eviction is needed and run if necessary
   */
  const checkAndEvict = useCallback(() => {
    if (!cacheConfig.enableLRU) return 0;

    const currentSize = cacheKeys.size;
    if (currentSize > cacheConfig.maxSize) {
      logger.info(`Cache size ${currentSize} exceeds max ${cacheConfig.maxSize}, triggering LRU eviction`);
      return evictLRU();
    }
    return 0;
  }, [cacheKeys.size, cacheConfig, evictLRU]);

  /**
   * Clear all caches when account changes
   * This prevents showing conversations from previous account
   */
  useEffect(() => {
    if (accountId !== null && cacheKeys.size > 0) {
      // Check if any cache keys include a different account ID
      const needsClear = Array.from(cacheKeys).some((key) => {
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

  /**
   * Auto-evict when cache grows beyond threshold
   */
  useEffect(() => {
    if (cacheConfig.enableLRU && cacheKeys.size > cacheConfig.evictionThreshold) {
      checkAndEvict();
    }
  }, [cacheKeys.size, cacheConfig.enableLRU, cacheConfig.evictionThreshold, checkAndEvict]);

  return {
    // Core operations
    clearAllCaches,
    clearCache,
    invalidateCaches,

    // LRU operations
    evictLRU,
    evictStale,
    touchCache,
    recordCacheMiss,
    checkAndEvict,

    // Statistics
    getStats,
    cacheCount: cacheKeys.size,
    cacheStats,

    // Configuration (read-only)
    config: cacheConfig,
  };
};
