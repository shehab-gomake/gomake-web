import { useRef, useCallback } from 'react';

/**
 * Creates a stable serialized key from an object by sorting keys
 * This ensures that objects with the same properties but different key orders
 * produce the same string representation
 */
function createStableKey<T = any>(params: T): string {
  if (params === null || params === undefined) {
    return String(params);
  }

  if (typeof params !== 'object') {
    return String(params);
  }

  // Sort keys recursively for nested objects
  const sortKeys = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortKeys);

    const sorted: Record<string, any> = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        sorted[key] = sortKeys(obj[key]);
      });
    return sorted;
  };

  return JSON.stringify(sortKeys(params));
}

/**
 * Initialization coordinator for Chatwoot provider
 *
 * Prevents cascading state updates and redundant API fetches during component mount
 * by coordinating the initialization sequence and providing guards for fetch operations.
 */
export function useChatwootInitialization() {
  const isInitializingRef = useRef(true);
  const initializationCompleteRef = useRef(false);
  const mountTimeRef = useRef(Date.now());

  /**
   * Mark initialization as complete
   * Call this after all initial state has been set and first fetches completed
   */
  const completeInitialization = useCallback(() => {
    isInitializingRef.current = false;
    initializationCompleteRef.current = true;
  }, []);

  /**
   * Check if we're still in the initialization phase
   * Use this to guard against cascading fetches
   */
  const isInitializing = useCallback(() => {
    return isInitializingRef.current;
  }, []);

  /**
   * Check if initialization is complete
   */
  const isInitialized = useCallback(() => {
    return initializationCompleteRef.current;
  }, []);

  /**
   * Get time elapsed since mount
   * Useful for debugging initialization timing issues
   */
  const getElapsedTime = useCallback(() => {
    return Date.now() - mountTimeRef.current;
  }, []);

  return {
    isInitializing,
    isInitialized,
    completeInitialization,
    getElapsedTime,
  };
}

/**
 * Hook for tracking and preventing duplicate fetch operations
 *
 * @example
 * const { shouldFetch, markFetchComplete } = useFetchDeduplication();
 *
 * const fetchData = async (params) => {
 *   if (!shouldFetch(params)) return;
 *
 *   try {
 *     const data = await api.fetchData(params);
 *     markFetchComplete(params);
 *     return data;
 *   } catch (error) {
 *     // Error - don't mark as complete so retry is possible
 *   }
 * };
 */
export function useFetchDeduplication<T = any>() {
  const lastFetchParamsRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  /**
   * Check if we should proceed with a fetch operation and atomically mark as started
   * Returns false if:
   * - Same params as last successful fetch
   * - A fetch is currently in progress
   * 
   * If returns true, the fetch is automatically marked as started to prevent race conditions
   */
  const shouldFetch = useCallback((params: T): boolean => {
    // Skip if already fetching - check this FIRST to prevent race conditions
    if (isFetchingRef.current) {
      return false;
    }

    const paramsKey = createStableKey(params);

    // Skip if same as last successful fetch
    if (paramsKey === lastFetchParamsRef.current) {
      return false;
    }

    // Atomically mark as fetching to prevent race conditions
    // This ensures that if React runs effects multiple times rapidly,
    // only the first one proceeds
    isFetchingRef.current = true;
    return true;
  }, []);

  /**
   * Mark the start of a fetch operation
   * Note: shouldFetch now handles this atomically, but this is kept for manual calls
   */
  const markFetchStart = useCallback(() => {
    isFetchingRef.current = true;
  }, []);

  /**
   * Mark fetch as complete and store params to prevent duplicates
   */
  const markFetchComplete = useCallback((params: T) => {
    const paramsKey = createStableKey(params);
    lastFetchParamsRef.current = paramsKey;
    isFetchingRef.current = false;
  }, []);

  /**
   * Mark fetch as failed (allows retry)
   */
  const markFetchFailed = useCallback(() => {
    isFetchingRef.current = false;
  }, []);

  /**
   * Reset the deduplication state
   */
  const reset = useCallback(() => {
    lastFetchParamsRef.current = null;
    isFetchingRef.current = false;
  }, []);

  return {
    shouldFetch,
    markFetchStart,
    markFetchComplete,
    markFetchFailed,
    reset,
  };
}
