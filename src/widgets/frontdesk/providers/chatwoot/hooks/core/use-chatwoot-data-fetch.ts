/**
 * useChatwootDataFetch - Base hook for data fetching with loading/error state management
 *
 * This hook provides a reusable pattern for fetching data with:
 * - Loading state management
 * - Error handling
 * - Refresh capability
 * - Optional auto-fetch on mount
 */

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootDataFetch");

export interface UseDataFetchOptions<TFilters> {
  /**
   * Function to fetch data
   */
  fetchFn: (filters?: TFilters) => Promise<any>;
  
  /**
   * Filters/parameters for the fetch function
   */
  filters?: TFilters;
  
  /**
   * Whether to automatically fetch on mount and when filters change
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Whether to fetch immediately when filters change
   * @default true
   */
  refetchOnFilterChange?: boolean;
  
  /**
   * Extract data from API response
   * @default (response) => response.payload || response.data?.payload || response.data || response
   */
  extractData?: (response: any) => any;
  
  /**
   * Create a stable key from filters to prevent unnecessary refetches
   */
  createFilterKey?: (filters?: TFilters) => string;
}

export interface UseDataFetchReturn<TData, TFilters = any> {
  data: TData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchData: (filters?: TFilters) => Promise<void>;
}

export function useChatwootDataFetch<TData = any, TFilters = any>({
  fetchFn,
  filters,
  autoFetch = true,
  refetchOnFilterChange = true,
  extractData = (response: any) => {
    return response.payload || response.data?.payload || response.data || response;
  },
  createFilterKey = (filters?: TFilters) => {
    return JSON.stringify(filters || {});
  },
}: UseDataFetchOptions<TFilters>): UseDataFetchReturn<TData, TFilters> {
  const [data, setData] = useState<TData>([] as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track the last fetched filter key to prevent duplicate requests
  const lastFetchedKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);
  const hasAttemptedRef = useRef(false);

  // Create a stable filter key
  const filterKey = useMemo(() => createFilterKey(filters), [filters, createFilterKey]);

  const fetchData = useCallback(
    async (overrideFilters?: TFilters) => {
      // Prevent duplicate concurrent requests
      if (isFetchingRef.current) {
        logger.debug("Already fetching, skipping duplicate request");
        return;
      }

      const filtersToUse = overrideFilters || filters;
      const currentFilterKey = createFilterKey(filtersToUse);

      // Skip if we're already fetching the same filters
      if (currentFilterKey === lastFetchedKeyRef.current && !overrideFilters) {
        logger.debug("Same filters already fetched, skipping");
        return;
      }

      isFetchingRef.current = true;
      hasAttemptedRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFn(filtersToUse);
        const extractedData = extractData(response);
        setData(extractedData);
        lastFetchedKeyRef.current = currentFilterKey;
      } catch (err: any) {
        const errorMessage = err?.message || "Failed to fetch data";
        setError(errorMessage);
        logger.error("Failed to fetch data", err);
        setData([] as any);
        // Mark as attempted even on error to prevent infinite retry loops
        lastFetchedKeyRef.current = currentFilterKey;
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [fetchFn, filters, extractData, createFilterKey]
  );

  const refresh = useCallback(() => {
    lastFetchedKeyRef.current = null; // Reset to force fetch
    return fetchData();
  }, [fetchData]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch && refetchOnFilterChange) {
      // Only fetch if filter key changed AND we haven't attempted this key yet
      if (filterKey !== lastFetchedKeyRef.current && !isFetchingRef.current) {
        fetchData();
      }
    }
  }, [autoFetch, refetchOnFilterChange, filterKey, fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    fetchData,
  };
}

