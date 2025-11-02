/**
 * Request State Types
 *
 * Generic types for managing async request state (loading, error, data).
 * This pattern reduces the number of atoms needed and provides a consistent
 * way to handle async operations throughout the application.
 *
 * @example
 * ```typescript
 * // Before (3 atoms):
 * const conversationsAtom = atom<ChatwootConversation[]>([]);
 * const conversationsLoadingAtom = atom<boolean>(false);
 * const conversationsErrorAtom = atom<string | null>(null);
 *
 * // After (1 atom):
 * const conversationsRequestAtom = atom<RequestState<ChatwootConversation[]>>({
 *   data: [],
 *   loading: false,
 *   error: null,
 * });
 * ```
 */

/**
 * Request State
 *
 * Represents the state of an async request with data, loading, and error states.
 *
 * @template T - The type of data being loaded
 */
export interface RequestState<T> {
  /** The loaded data (or initial/default value) */
  data: T;
  /** Whether the request is currently loading */
  loading: boolean;
  /** Error message if the request failed, null otherwise */
  error: string | null;
}

/**
 * Creates an initial RequestState with default values
 *
 * @template T - The type of data
 * @param initialData - The initial data value
 * @returns A RequestState with loading=false and error=null
 *
 * @example
 * ```typescript
 * const initialState = createRequestState<ChatwootConversation[]>([]);
 * ```
 */
export function createRequestState<T>(initialData: T): RequestState<T> {
  return {
    data: initialData,
    loading: false,
    error: null,
  };
}

/**
 * Creates a loading RequestState
 *
 * @template T - The type of data
 * @param currentData - The current data to preserve during loading
 * @returns A RequestState with loading=true and error=null
 *
 * @example
 * ```typescript
 * setConversations(toLoadingState(conversations.data));
 * ```
 */
export function toLoadingState<T>(currentData: T): RequestState<T> {
  return {
    data: currentData,
    loading: true,
    error: null,
  };
}

/**
 * Creates a success RequestState with new data
 *
 * @template T - The type of data
 * @param data - The successfully loaded data
 * @returns A RequestState with the new data, loading=false, and error=null
 *
 * @example
 * ```typescript
 * setConversations(toSuccessState(newConversations));
 * ```
 */
export function toSuccessState<T>(data: T): RequestState<T> {
  return {
    data,
    loading: false,
    error: null,
  };
}

/**
 * Creates an error RequestState
 *
 * @template T - The type of data
 * @param currentData - The current data to preserve during error
 * @param error - The error message
 * @returns A RequestState with loading=false and the error message
 *
 * @example
 * ```typescript
 * setConversations(toErrorState(conversations.data, err.message));
 * ```
 */
export function toErrorState<T>(currentData: T, error: string): RequestState<T> {
  return {
    data: currentData,
    loading: false,
    error,
  };
}

/**
 * Type guard to check if a RequestState is loading
 *
 * @param state - The RequestState to check
 * @returns True if the state is loading
 *
 * @example
 * ```typescript
 * if (isLoading(conversationsState)) {
 *   return <Spinner />;
 * }
 * ```
 */
export function isLoading<T>(state: RequestState<T>): boolean {
  return state.loading;
}

/**
 * Type guard to check if a RequestState has an error
 *
 * @param state - The RequestState to check
 * @returns True if the state has an error
 *
 * @example
 * ```typescript
 * if (hasError(conversationsState)) {
 *   return <ErrorMessage error={conversationsState.error} />;
 * }
 * ```
 */
export function hasError<T>(state: RequestState<T>): boolean {
  return state.error !== null;
}

/**
 * Type guard to check if a RequestState has successfully loaded data
 *
 * @param state - The RequestState to check
 * @returns True if the state has data and is not loading/errored
 *
 * @example
 * ```typescript
 * if (hasData(conversationsState)) {
 *   return <ConversationList data={conversationsState.data} />;
 * }
 * ```
 */
export function hasData<T>(state: RequestState<T>): boolean {
  return !state.loading && state.error === null;
}
