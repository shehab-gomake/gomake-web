/**
 * RequestState Types and Utilities
 *
 * Provides a unified pattern for managing async resource state in Recoil.
 * Combines data, loading, error, and cache metadata into a single atom.
 *
 * Benefits:
 * - Reduces atom count (3 atoms → 1)
 * - Atomic state updates
 * - Consistent error handling
 * - Built-in cache validation
 * - Type-safe state transitions
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Enhanced RequestState interface
 * Combines data, loading, error, and cache metadata
 */
export interface RequestState<T> {
  /** The data payload */
  data: T | null;
  /** Whether a fetch is in progress */
  loading: boolean;
  /** Error from the last failed operation */
  error: string | null;
  /** Timestamp of last successful fetch (ms) */
  lastFetch: number;
  /** Time-to-live for cache (ms) */
  ttl: number;
  /** Whether initial fetch has been attempted */
  hasAttempted: boolean;
}

/**
 * Extended RequestState with pagination support
 */
export interface PaginatedRequestState<T> extends RequestState<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
    loadingMore: boolean;
  };
}

/**
 * RequestState with granular loading states
 */
export interface GranularLoadingRequestState<T> extends RequestState<T> {
  loadingState: {
    initial: boolean;
    filtering: boolean;
    loadingMore: boolean;
    refreshing: boolean;
  };
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Default TTL values for different resource types
 */
export const DEFAULT_TTL = {
  SHORT: 30 * 1000, // 30 seconds - frequently changing data
  MEDIUM: 2 * 60 * 1000, // 2 minutes - moderately changing data
  STANDARD: 5 * 60 * 1000, // 5 minutes - infrequently changing data
  LONG: 10 * 60 * 1000, // 10 minutes - rarely changing data
  VERY_LONG: 30 * 60 * 1000, // 30 minutes - very stable data
} as const;

/**
 * Creates an initial RequestState with default values
 *
 * @param ttl - Time-to-live in milliseconds (default: 5 minutes)
 * @returns Initial RequestState
 *
 * @example
 * ```typescript
 * const profileAtom = atom<RequestState<Profile>>({
 *   key: 'profile',
 *   default: createRequestState<Profile>(DEFAULT_TTL.STANDARD),
 * });
 * ```
 */
export function createRequestState<T>(ttl: number = DEFAULT_TTL.STANDARD): RequestState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastFetch: 0,
    ttl,
    hasAttempted: false,
  };
}

/**
 * Creates an initial PaginatedRequestState
 *
 * @param ttl - Time-to-live in milliseconds
 * @returns Initial PaginatedRequestState
 */
export function createPaginatedRequestState<T>(ttl: number = DEFAULT_TTL.SHORT): PaginatedRequestState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastFetch: 0,
    ttl,
    hasAttempted: false,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasMore: true,
      loadingMore: false,
    },
  };
}

/**
 * Creates a RequestState with granular loading states
 *
 * @param ttl - Time-to-live in milliseconds
 * @returns Initial GranularLoadingRequestState
 */
export function createGranularLoadingRequestState<T>(ttl: number = DEFAULT_TTL.SHORT): GranularLoadingRequestState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastFetch: 0,
    ttl,
    hasAttempted: false,
    loadingState: {
      initial: false,
      filtering: false,
      loadingMore: false,
      refreshing: false,
    },
  };
}

// ============================================================================
// STATE TRANSITION HELPERS
// ============================================================================

/**
 * Start loading - sets loading to true and clears error
 */
export function startLoading<T>(state: RequestState<T>): RequestState<T> {
  return {
    ...state,
    loading: true,
    error: null,
  };
}

/**
 * Set success - stores data and updates cache timestamp
 */
export function setSuccess<T>(state: RequestState<T>, data: T): RequestState<T> {
  return {
    ...state,
    data,
    loading: false,
    error: null,
    lastFetch: Date.now(),
    hasAttempted: true,
  };
}

/**
 * Set error - stores error message and stops loading
 */
export function setError<T>(state: RequestState<T>, error: string | Error): RequestState<T> {
  return {
    ...state,
    loading: false,
    error: typeof error === "string" ? error : error.message,
    hasAttempted: true,
  };
}

/**
 * Reset state to initial values (keeps TTL)
 */
export function resetState<T>(state: RequestState<T>): RequestState<T> {
  return {
    ...state,
    data: null,
    loading: false,
    error: null,
    lastFetch: 0,
    hasAttempted: false,
  };
}

// ============================================================================
// CACHE VALIDATION
// ============================================================================

/**
 * Check if cached data is still valid
 *
 * @param state - The RequestState to check
 * @returns true if cache is valid, false if stale or empty
 */
export function isCacheValid<T>(state: RequestState<T>): boolean {
  if (!state.data || state.lastFetch === 0) return false;
  return Date.now() - state.lastFetch < state.ttl;
}

/**
 * Check if data should be fetched
 * Returns true if: no data, cache is stale, or there was an error
 *
 * @param state - The RequestState to check
 * @returns true if fetch should proceed
 */
export function shouldFetch<T>(state: RequestState<T>): boolean {
  // Don't fetch if already loading
  if (state.loading) return false;

  // Fetch if no data and haven't attempted
  if (!state.data && !state.hasAttempted) return true;

  // Fetch if cache is stale
  if (!isCacheValid(state)) return true;

  return false;
}

/**
 * Get cache age in milliseconds
 */
export function getCacheAge<T>(state: RequestState<T>): number {
  if (state.lastFetch === 0) return Infinity;
  return Date.now() - state.lastFetch;
}

/**
 * Check if cache will expire soon (within threshold)
 */
export function isCacheExpiringSoon<T>(state: RequestState<T>, threshold: number = 10000): boolean {
  if (!state.data || state.lastFetch === 0) return false;
  const remainingTime = state.ttl - getCacheAge(state);
  return remainingTime > 0 && remainingTime < threshold;
}

// ============================================================================
// PAGINATION HELPERS
// ============================================================================

/**
 * Start loading more items in paginated state
 */
export function startLoadingMore<T>(state: PaginatedRequestState<T>): PaginatedRequestState<T> {
  return {
    ...state,
    pagination: {
      ...state.pagination,
      loadingMore: true,
    },
  };
}

/**
 * Append more items to paginated state
 *
 * Properly clears loading and error states after successful pagination,
 * consistent with setFirstPage behavior.
 *
 * Note: When state.data is null (initial state before first fetch), this
 * initializes data with the items array. After this call, data will always
 * be an array (never null). Consumers should use this function only after
 * confirming a successful API response.
 */
export function appendItems<T>(
  state: PaginatedRequestState<T>,
  items: T[],
  hasMore: boolean,
  totalPages?: number,
  totalCount?: number
): PaginatedRequestState<T> {
  // Ensure we always produce an array, explicitly handling null -> array transition
  const existingData = state.data ?? [];
  return {
    ...state,
    data: [...existingData, ...items],
    loading: false, // Clear loading state after successful append
    error: null, // Clear any previous error after successful append
    lastFetch: Date.now(),
    hasAttempted: true,
    pagination: {
      ...state.pagination,
      currentPage: state.pagination.currentPage + 1,
      hasMore,
      loadingMore: false,
      ...(totalPages !== undefined && { totalPages }),
      ...(totalCount !== undefined && { totalCount }),
    },
  };
}

/**
 * Set first page of paginated data
 */
export function setFirstPage<T>(
  state: PaginatedRequestState<T>,
  items: T[],
  hasMore: boolean,
  totalPages?: number,
  totalCount?: number
): PaginatedRequestState<T> {
  return {
    ...state,
    data: items,
    loading: false,
    error: null,
    lastFetch: Date.now(),
    hasAttempted: true,
    pagination: {
      currentPage: 1,
      hasMore,
      loadingMore: false,
      totalPages: totalPages ?? state.pagination.totalPages,
      totalCount: totalCount ?? state.pagination.totalCount,
    },
  };
}

// ============================================================================
// SELECTOR HELPERS
// ============================================================================

/**
 * Extract just the data from RequestState
 * Useful for components that only need the data
 */
export function selectData<T>(state: RequestState<T>): T | null {
  return state.data;
}

/**
 * Extract loading state
 */
export function selectLoading<T>(state: RequestState<T>): boolean {
  return state.loading;
}

/**
 * Extract error state
 */
export function selectError<T>(state: RequestState<T>): string | null {
  return state.error;
}

/**
 * Check if state has valid data (not loading, no error)
 */
export function hasValidData<T>(state: RequestState<T>): state is RequestState<T> & { data: T } {
  return state.data !== null && !state.loading && !state.error;
}

/**
 * Check if state is in error state
 */
export function isErrorState<T>(state: RequestState<T>): boolean {
  return state.error !== null && !state.loading;
}

/**
 * Check if state is empty (no data, not loading, no error)
 */
export function isEmptyState<T>(state: RequestState<T>): boolean {
  return state.data === null && !state.loading && !state.error && state.hasAttempted;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if state is RequestState
 */
export function isRequestState<T>(state: unknown): state is RequestState<T> {
  return (
    typeof state === "object" &&
    state !== null &&
    "data" in state &&
    "loading" in state &&
    "error" in state &&
    "lastFetch" in state &&
    "ttl" in state
  );
}

/**
 * Type guard to check if state is PaginatedRequestState
 */
export function isPaginatedRequestState<T>(state: unknown): state is PaginatedRequestState<T> {
  return isRequestState<T[]>(state) && "pagination" in state;
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { RequestState as default };
