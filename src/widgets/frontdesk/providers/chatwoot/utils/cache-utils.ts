/**
 * Cache Utilities for Chatwoot Conversations
 *
 * Provides utilities for managing view-scoped conversation caches,
 * including invalidation strategies and cache key management.
 */

import { SetterOrUpdater } from 'recoil';
import { ConversationCacheEntry } from '@/store/frontdesk/atoms/chatwoot.atoms';

/**
 * Clear all conversation caches
 * Used when:
 * - Account switches
 * - User explicitly requests refresh all
 * - Logout/session changes
 *
 * @param cacheKeys - Set of all active cache keys
 * @param setCacheKeys - Setter for cache keys atom
 * @param getCacheFamily - Function to get cache atom family value
 * @param resetCacheFamily - Function to reset cache atom family
 */
export function clearAllConversationCaches(
  cacheKeys: Set<string>,
  setCacheKeys: SetterOrUpdater<Set<string>>,
  resetCacheFamily: (key: string) => void
): void {
  console.log(`[Cache Utils] Clearing ${cacheKeys.size} conversation caches`);

  // Reset each cache entry
  cacheKeys.forEach(key => {
    resetCacheFamily(key);
  });

  // Clear the cache keys registry
  setCacheKeys(new Set());
}

/**
 * Invalidate caches matching a predicate
 * Used for selective cache invalidation (e.g., invalidate all caches for a specific inbox)
 *
 * @param cacheKeys - Set of all active cache keys
 * @param predicate - Function that returns true for keys to invalidate
 * @param resetCacheFamily - Function to reset cache atom family
 */
export function invalidateConversationCaches(
  cacheKeys: Set<string>,
  predicate: (key: string) => boolean,
  resetCacheFamily: (key: string) => void
): void {
  const keysToInvalidate = Array.from(cacheKeys).filter(predicate);

  console.log(`[Cache Utils] Invalidating ${keysToInvalidate.length} conversation caches`);

  keysToInvalidate.forEach(key => {
    resetCacheFamily(key);
  });
}

/**
 * Check if a cache entry is stale
 *
 * @param cache - Cache entry to check
 * @param staleTime - Time in milliseconds after which cache is considered stale
 * @returns True if cache is stale or empty
 */
export function isCacheStale(cache: ConversationCacheEntry, staleTime: number): boolean {
  // Empty cache is considered stale
  if (cache.conversations.length === 0 && cache.timestamp === 0) {
    return true;
  }

  // Check age
  const cacheAge = Date.now() - cache.timestamp;
  return cacheAge > staleTime;
}

/**
 * Parse a cache key to extract filter parameters
 * Useful for selective cache invalidation
 *
 * @param cacheKey - Stringified JSON cache key
 * @returns Parsed filter parameters or null if invalid
 */
export function parseCacheKey(cacheKey: string): Record<string, any> | null {
  try {
    return JSON.parse(cacheKey);
  } catch (err) {
    console.error('[Cache Utils] Failed to parse cache key:', cacheKey, err);
    return null;
  }
}

/**
 * Get cache statistics for monitoring
 *
 * @param cacheKeys - Set of all active cache keys
 * @param getCacheFamily - Function to get cache atom family value
 * @returns Cache statistics
 */
export interface CacheStats {
  totalCaches: number;
  totalConversations: number;
  cachesByAge: {
    fresh: number;    // < 30s
    stale: number;    // 30s - 5min
    veryStale: number; // > 5min
  };
  averageCacheSize: number;
  oldestCacheAge: number;
}

export function getCacheStats(
  cacheKeys: Set<string>,
  getCacheFamily: (key: string) => ConversationCacheEntry,
  staleTime: number
): CacheStats {
  const now = Date.now();
  let totalConversations = 0;
  let oldestCacheAge = 0;
  const cachesByAge = {
    fresh: 0,
    stale: 0,
    veryStale: 0,
  };

  cacheKeys.forEach(key => {
    const cache = getCacheFamily(key);
    totalConversations += cache.conversations.length;

    const age = now - cache.timestamp;
    oldestCacheAge = Math.max(oldestCacheAge, age);

    if (age < staleTime) {
      cachesByAge.fresh++;
    } else if (age < 300000) { // 5 minutes
      cachesByAge.stale++;
    } else {
      cachesByAge.veryStale++;
    }
  });

  return {
    totalCaches: cacheKeys.size,
    totalConversations,
    cachesByAge,
    averageCacheSize: cacheKeys.size > 0 ? totalConversations / cacheKeys.size : 0,
    oldestCacheAge,
  };
}
