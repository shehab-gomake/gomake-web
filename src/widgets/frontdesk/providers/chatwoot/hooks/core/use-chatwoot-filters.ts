/**
 * useChatwootFilters - Reusable hook for managing filter state
 *
 * Provides a generic pattern for managing filter state with:
 * - Type-safe filter state
 * - Filter update handlers
 * - Filter reset capability
 * - Filter validation
 */

import { useState, useCallback, useMemo } from "react";

export interface UseFiltersOptions<TFilters> {
  /**
   * Initial filter values
   */
  initialFilters: TFilters;

  /**
   * Callback when filters change (optional)
   */
  onFiltersChange?: (filters: TFilters) => void;

  /**
   * Validate filters before applying (optional)
   */
  validateFilters?: (filters: Partial<TFilters>) => boolean;
}

export interface UseFiltersReturn<TFilters> {
  filters: TFilters;
  updateFilters: (updates: Partial<TFilters>) => void;
  resetFilters: () => void;
  setFilters: (filters: TFilters) => void;
  getFilterKey: () => string;
}

export function useChatwootFilters<TFilters extends Record<string, any>>({
  initialFilters,
  onFiltersChange,
  validateFilters,
}: UseFiltersOptions<TFilters>): UseFiltersReturn<TFilters> {
  const [filters, setFiltersState] = useState<TFilters>(initialFilters);

  const updateFilters = useCallback(
    (updates: Partial<TFilters>) => {
      setFiltersState((prev) => {
        const newFilters = { ...prev, ...updates };

        // Validate if validator provided
        if (validateFilters && !validateFilters(newFilters)) {
          return prev; // Don't update if validation fails
        }

        // Call onChange callback if provided
        onFiltersChange?.(newFilters);

        return newFilters;
      });
    },
    [validateFilters, onFiltersChange]
  );

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  const setFilters = useCallback(
    (newFilters: TFilters) => {
      if (validateFilters && !validateFilters(newFilters)) {
        return; // Don't update if validation fails
      }
      setFiltersState(newFilters);
      onFiltersChange?.(newFilters);
    },
    [validateFilters, onFiltersChange]
  );

  // Create a stable key from filters for comparison/caching
  const getFilterKey = useCallback(() => {
    return JSON.stringify(filters);
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    setFilters,
    getFilterKey,
  };
}



