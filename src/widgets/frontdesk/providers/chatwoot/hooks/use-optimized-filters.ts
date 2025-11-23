/**
 * Optimized Filters Hook
 *
 * Provides memoized filter functions and values to prevent unnecessary re-renders.
 * Uses useMemo and useCallback to optimize performance.
 */

import { useMemo, useCallback } from "react";
import { ConversationListParams, ConversationStatus, ConversationAssigneeType } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

/**
 * Hook for optimized filter management
 *
 * @param filters - Current filter parameters
 * @param onFiltersChange - Callback when filters change
 * @returns Memoized filter values and handlers
 *
 * @example
 * ```typescript
 * const { isFiltered, clearFilters, toggleStatus } = useOptimizedFilters(
 *   filters,
 *   setFilters
 * );
 * ```
 */
export function useOptimizedFilters(
  filters: Partial<ConversationListParams>,
  onFiltersChange: (filters: Partial<ConversationListParams>) => void
) {
  /**
   * Check if any filters are active
   * Memoized to prevent unnecessary recalculations
   */
  const isFiltered = useMemo(() => {
    return Boolean(
      filters.status ||
      filters.assignee_type ||
      filters.inbox_id ||
      filters.labels ||
      filters.q
    );
  }, [filters.status, filters.assignee_type, filters.inbox_id, filters.labels, filters.q]);

  /**
   * Get active filter count
   * Memoized to prevent unnecessary recalculations
   */
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== ConversationStatus.ALL) count++;
    if (filters.assignee_type && filters.assignee_type !== ConversationAssigneeType.ALL) count++;
    if (filters.inbox_id) count++;
    if (filters.labels && filters.labels.length > 0) count++;
    if (filters.q) count++;
    return count;
  }, [filters.status, filters.assignee_type, filters.inbox_id, filters.labels, filters.q]);

  /**
   * Clear all filters
   * useCallback to maintain referential equality
   */
  const clearFilters = useCallback(() => {
    onFiltersChange({
      status: undefined,
      assignee_type: undefined,
      inbox_id: undefined,
      labels: undefined,
      q: undefined,
      page: 1,
    });
  }, [onFiltersChange]);

  /**
   * Toggle status filter
   * useCallback to maintain referential equality
   */
  const toggleStatus = useCallback((status: ConversationStatus) => {
    onFiltersChange({
      ...filters,
      status: filters.status === status ? undefined : status,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  /**
   * Set assignee type filter
   * useCallback to maintain referential equality
   */
  const setAssigneeType = useCallback((assigneeType: ConversationAssigneeType) => {
    onFiltersChange({
      ...filters,
      assignee_type: assigneeType,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  /**
   * Set inbox filter
   * useCallback to maintain referential equality
   */
  const setInbox = useCallback((inboxId: number | null) => {
    onFiltersChange({
      ...filters,
      inbox_id: inboxId || undefined,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  /**
   * Set search query
   * useCallback to maintain referential equality
   */
  const setSearchQuery = useCallback((query: string) => {
    onFiltersChange({
      ...filters,
      q: query || undefined,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  return {
    isFiltered,
    activeFilterCount,
    clearFilters,
    toggleStatus,
    setAssigneeType,
    setInbox,
    setSearchQuery,
  };
}
