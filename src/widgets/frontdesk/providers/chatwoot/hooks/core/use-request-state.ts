/**
 * useRequestState Hook
 *
 * Provides a clean interface for working with RequestState atoms.
 * Handles loading, error, and cache validation automatically.
 *
 * @example
 * ```typescript
 * const { data, loading, error, fetch, reset } = useRequestState(
 *   chatwootProfileRequestAtom,
 *   async () => chatwootService.profile.getProfile()
 * );
 * ```
 */

import { useCallback, useEffect } from "react";
import { useRecoilState, RecoilState } from "recoil";
import {
  RequestState,
  startLoading,
  setSuccess,
  setError,
  resetState,
  isCacheValid,
  shouldFetch as shouldFetchCheck,
} from "@/store/frontdesk/types/request-state.types";
import { useFetchLock } from "./use-fetch-lock";

export interface UseRequestStateOptions {
  /** Unique key for fetch lock (prevents duplicate requests) */
  lockKey: string;
  /** Auto-fetch on mount if no valid cache */
  autoFetch?: boolean;
  /** Dependencies that trigger refetch when changed */
  deps?: readonly unknown[];
  /** Callback when fetch succeeds */
  onSuccess?: (data: unknown) => void;
  /** Callback when fetch fails */
  onError?: (error: Error) => void;
}

export interface UseRequestStateReturn<T> {
  /** The data (or null if not loaded) */
  data: T | null;
  /** Whether a fetch is in progress */
  loading: boolean;
  /** Error message (or null if no error) */
  error: string | null;
  /** Whether data is available and valid */
  hasData: boolean;
  /** Whether cache is still valid */
  isCacheValid: boolean;
  /** Fetch/refresh data */
  fetch: (force?: boolean) => Promise<T | null>;
  /** Reset state to initial */
  reset: () => void;
  /** Whether initial fetch has been attempted */
  hasAttempted: boolean;
}

/**
 * Hook for managing RequestState atoms
 *
 * @param atom - The RequestState atom to manage
 * @param fetchFn - Async function to fetch data
 * @param options - Configuration options
 * @returns State and actions for the resource
 */
export function useRequestState<T>(
  atom: RecoilState<RequestState<T>>,
  fetchFn: () => Promise<T>,
  options: UseRequestStateOptions
): UseRequestStateReturn<T> {
  const { lockKey, autoFetch = true, deps = [], onSuccess, onError } = options;

  const [state, setState] = useRecoilState(atom);
  const { acquireLock, releaseLock, isLocked } = useFetchLock();

  /**
   * Fetch data with automatic state management
   */
  const fetch = useCallback(
    async (force: boolean = false): Promise<T | null> => {
      // Check if we should fetch
      if (!force && !shouldFetchCheck(state)) {
        return state.data;
      }

      // Try to acquire lock
      if (!acquireLock(lockKey)) {
        console.log(`[useRequestState] Lock "${lockKey}" already held, skipping fetch`);
        return state.data;
      }

      // Set loading state
      setState(startLoading);

      try {
        const data = await fetchFn();
        setState((prev) => setSuccess(prev, data));
        onSuccess?.(data);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState((prev) => setError(prev, error));
        onError?.(error);
        return null;
      } finally {
        releaseLock(lockKey);
      }
    },
    [state, fetchFn, lockKey, acquireLock, releaseLock, setState, onSuccess, onError]
  );

  /**
   * Reset state to initial values
   */
  const reset = useCallback(() => {
    setState(resetState);
  }, [setState]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && shouldFetchCheck(state) && !isLocked(lockKey)) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, ...deps]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    hasData: state.data !== null,
    isCacheValid: isCacheValid(state),
    fetch,
    reset,
    hasAttempted: state.hasAttempted,
  };
}

/**
 * Simplified hook for read-only RequestState access
 * Use when you don't need to fetch, just read
 */
export function useRequestStateValue<T>(atom: RecoilState<RequestState<T>>) {
  const [state] = useRecoilState(atom);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    hasData: state.data !== null,
    isCacheValid: isCacheValid(state),
    hasAttempted: state.hasAttempted,
  };
}

export default useRequestState;

