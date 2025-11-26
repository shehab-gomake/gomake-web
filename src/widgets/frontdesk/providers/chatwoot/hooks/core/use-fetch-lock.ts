/**
 * Centralized Fetch Lock Hook
 *
 * Provides a clean interface for preventing duplicate API calls across all component instances.
 * Replaces scattered global flags with a Recoil-backed solution.
 *
 * Features:
 * - Automatic lock timeout (default 30s) to prevent deadlocks
 * - Lock statistics for debugging
 * - Automatic cleanup of expired locks
 *
 * @example
 * ```typescript
 * const { acquireLock, releaseLock, isLocked } = useFetchLock();
 *
 * const fetchData = async () => {
 *   if (!acquireLock('profile')) {
 *     console.log('Fetch already in progress');
 *     return;
 *   }
 *
 *   try {
 *     const data = await api.fetchProfile();
 *     return data;
 *   } finally {
 *     releaseLock('profile');
 *   }
 * };
 * ```
 */

import { useCallback, useMemo } from "react";
import { useRecoilCallback } from "recoil";
import {
  chatwootFetchLocksAtom,
  chatwootFetchLockStatsAtom,
  FETCH_LOCK_TIMEOUT,
  FetchLockEntry,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export interface UseFetchLockOptions {
  /** Custom timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Prefix for lock keys to namespace locks */
  prefix?: string;
}

export interface UseFetchLockReturn {
  /**
   * Acquire a lock for a resource
   * @param key - Unique identifier for the resource
   * @returns true if lock acquired, false if already locked
   */
  acquireLock: (key: string) => boolean;

  /**
   * Release a lock for a resource
   * @param key - Unique identifier for the resource
   */
  releaseLock: (key: string) => void;

  /**
   * Check if a resource is currently locked
   * @param key - Unique identifier for the resource
   * @returns true if locked, false otherwise
   */
  isLocked: (key: string) => boolean;

  /**
   * Get current lock statistics
   */
  getStats: () => { activeLocks: string[]; totalLocks: number };

  /**
   * Clean up expired locks
   * Called automatically but can be triggered manually
   */
  cleanupExpiredLocks: () => number;
}

/**
 * Hook for centralized fetch lock management
 *
 * @param options - Configuration options
 * @returns Lock management functions
 */
export const useFetchLock = (options: UseFetchLockOptions = {}): UseFetchLockReturn => {
  const { timeout = FETCH_LOCK_TIMEOUT, prefix = "" } = options;

  /**
   * Build the full key with optional prefix
   */
  const buildKey = useCallback(
    (key: string): string => {
      return prefix ? `${prefix}:${key}` : key;
    },
    [prefix]
  );

  /**
   * Check if a lock is expired
   */
  const isLockExpired = useCallback((entry: FetchLockEntry): boolean => {
    return Date.now() - entry.acquiredAt > entry.timeout;
  }, []);

  /**
   * Acquire a lock for a resource
   * Returns true if lock acquired, false if already locked (and not expired)
   */
  const acquireLock = useRecoilCallback(
    ({ set, snapshot }) =>
      (key: string): boolean => {
        const fullKey = buildKey(key);
        const currentLocks = snapshot.getLoadable(chatwootFetchLocksAtom).getValue();

        // Check if lock exists and is still valid
        const existingLock = currentLocks.get(fullKey);
        if (existingLock && !isLockExpired(existingLock)) {
          console.log(`[FetchLock] Lock "${fullKey}" already held, skipping duplicate`);
          return false;
        }

        // Acquire lock
        const newLocks = new Map(currentLocks);
        newLocks.set(fullKey, {
          acquiredAt: Date.now(),
          timeout,
        });
        set(chatwootFetchLocksAtom, newLocks);

        // Update stats
        set(chatwootFetchLockStatsAtom, (prev) => ({
          ...prev,
          totalLocks: prev.totalLocks + 1,
          activeLocks: Array.from(newLocks.keys()),
        }));

        console.log(`[FetchLock] Lock "${fullKey}" acquired`);
        return true;
      },
    [buildKey, timeout, isLockExpired]
  );

  /**
   * Release a lock for a resource
   */
  const releaseLock = useRecoilCallback(
    ({ set, snapshot }) =>
      (key: string): void => {
        const fullKey = buildKey(key);
        const currentLocks = snapshot.getLoadable(chatwootFetchLocksAtom).getValue();

        if (!currentLocks.has(fullKey)) {
          console.log(`[FetchLock] Lock "${fullKey}" not found, nothing to release`);
          return;
        }

        const newLocks = new Map(currentLocks);
        newLocks.delete(fullKey);
        set(chatwootFetchLocksAtom, newLocks);

        // Update stats
        set(chatwootFetchLockStatsAtom, (prev) => ({
          ...prev,
          activeLocks: Array.from(newLocks.keys()),
        }));

        console.log(`[FetchLock] Lock "${fullKey}" released`);
      },
    [buildKey]
  );

  /**
   * Check if a resource is currently locked (and not expired)
   *
   * Uses useRecoilCallback to read from snapshot, ensuring stable function reference.
   * This prevents unnecessary re-renders and useEffect re-executions when locks change.
   */
  const isLocked = useRecoilCallback(
    ({ snapshot }) =>
      (key: string): boolean => {
        const fullKey = buildKey(key);
        const locks = snapshot.getLoadable(chatwootFetchLocksAtom).getValue();
        const lock = locks.get(fullKey);
        if (!lock) return false;
        return !isLockExpired(lock);
      },
    [buildKey, isLockExpired]
  );

  /**
   * Clean up expired locks
   * @returns Number of locks cleaned up
   */
  const cleanupExpiredLocks = useRecoilCallback(
    ({ set, snapshot }) =>
      (): number => {
        const currentLocks = snapshot.getLoadable(chatwootFetchLocksAtom).getValue();
        const newLocks = new Map<string, FetchLockEntry>();
        let cleanedCount = 0;

        currentLocks.forEach((entry, key) => {
          if (isLockExpired(entry)) {
            cleanedCount++;
            console.log(`[FetchLock] Cleaning up expired lock: ${key}`);
          } else {
            newLocks.set(key, entry);
          }
        });

        if (cleanedCount > 0) {
          set(chatwootFetchLocksAtom, newLocks);
          set(chatwootFetchLockStatsAtom, (prev) => ({
            ...prev,
            activeLocks: Array.from(newLocks.keys()),
            expiredLocks: prev.expiredLocks + cleanedCount,
            lastCleanup: Date.now(),
          }));
        }

        return cleanedCount;
      },
    [isLockExpired]
  );

  /**
   * Get current lock statistics
   *
   * Uses useRecoilCallback to read from snapshot for stable reference.
   */
  const getStats = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const locks = snapshot.getLoadable(chatwootFetchLocksAtom).getValue();
        return {
          activeLocks: Array.from(locks.keys()),
          totalLocks: locks.size,
        };
      },
    []
  );

  /**
   * Memoize return object to ensure stable references across renders.
   * This prevents useEffect dependency arrays from triggering on every render
   * when consumers include functions like `isLocked` as dependencies.
   */
  return useMemo(
    () => ({
      acquireLock,
      releaseLock,
      isLocked,
      getStats,
      cleanupExpiredLocks,
    }),
    [acquireLock, releaseLock, isLocked, getStats, cleanupExpiredLocks]
  );
};

/**
 * Predefined lock keys for common resources
 * Use these to ensure consistency across the codebase
 */
export const FETCH_LOCK_KEYS = {
  PROFILE: "profile",
  LABELS: "labels",
  INBOXES: "inboxes",
  AGENTS: "agents",
  TEAMS: "teams",
  CONTACTS: "contacts",
  NOTIFICATIONS: "notifications",
  /** For conversations, append filter key: `conversations:${filterKey}` */
  CONVERSATIONS: "conversations",
} as const;

/**
 * Helper to create a conversations lock key with filter
 */
export const createConversationsLockKey = (filterKey: string): string => {
  return `${FETCH_LOCK_KEYS.CONVERSATIONS}:${filterKey}`;
};

export default useFetchLock;
