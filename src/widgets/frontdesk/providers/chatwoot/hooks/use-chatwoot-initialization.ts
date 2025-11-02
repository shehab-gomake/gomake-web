import { useRef, useCallback } from 'react';

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
   * Check if we should proceed with a fetch operation
   * Returns false if:
   * - Same params as last successful fetch
   * - A fetch is currently in progress
   */
  const shouldFetch = useCallback((params: T): boolean => {
    const paramsKey = JSON.stringify(params);

    // Skip if already fetching
    if (isFetchingRef.current) {
      console.log('[FetchDeduplication] Skipping - fetch in progress');
      return false;
    }

    // Skip if same as last successful fetch
    if (paramsKey === lastFetchParamsRef.current) {
      console.log('[FetchDeduplication] Skipping - duplicate params');
      return false;
    }

    return true;
  }, []);

  /**
   * Mark the start of a fetch operation
   */
  const markFetchStart = useCallback(() => {
    isFetchingRef.current = true;
  }, []);

  /**
   * Mark fetch as complete and store params to prevent duplicates
   */
  const markFetchComplete = useCallback((params: T) => {
    const paramsKey = JSON.stringify(params);
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
