import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";
import { buildConversationFilters, createStableKey } from "../utils/filter-utils";
import { useChatwootRouter } from "./use-chatwoot-router";
import { CHATWOOT_CONSTANTS } from "../config/constants";

/**
 * Hook for managing conversation list filters
 *
 * Handles parsing filters from URL, debounced updates, and filter validation.
 * The URL is treated as the single source of truth for filter state.
 *
 * @returns {Object} filters - Current parsed filters from URL
 * @returns {Function} handleFiltersChange - Function to update filters with optional debounce
 */
export const useConversationFilters = () => {
  const router = useChatwootRouter();
  const filterDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear any pending debounce timer
   * Safe to call multiple times - only clears if timer exists
   */
  const clearDebounceTimer = useCallback(() => {
    if (filterDebounceTimerRef.current !== null) {
      clearTimeout(filterDebounceTimerRef.current);
      filterDebounceTimerRef.current = null;
    }
  }, []);

  // Stable key for current filter state (used for caching)
  const filterKey = useMemo(() => {
    const route = router.currentRoute;
    if (!route) return "";

    return createStableKey({
      view: route.view,
      inboxId: route.channelId,
      conversationId: route.conversationId,
      status: route.filters?.status,
      assigneeType: route.filters?.assigneeType,
      search: route.filters?.search,
      teamId: route.filters?.teamId,
      sortBy: route.filters?.sortBy,
      labels: route.filters?.labels,
    });
  }, [router.currentRoute]);

  // Parse filters from URL with validation and defaults
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    const route = router.currentRoute;
    if (!route) return {};

    const urlStatus = route.filters?.status as ConversationStatus | undefined;
    const validStatuses = Object.values(ConversationStatus);
    const statusFilter = urlStatus && validStatuses.includes(urlStatus) ? urlStatus : ConversationStatus.OPEN;

    const urlAssignee = route.filters?.assigneeType as ConversationAssigneeType | undefined;
    const validTypes = Object.values(ConversationAssigneeType);
    const assigneeFilter = urlAssignee && validTypes.includes(urlAssignee) ? urlAssignee : ConversationAssigneeType.ME;

    const inboxId = route.channelId ? parseInt(route.channelId, 10) : null;
    const selectedInboxId = !isNaN(inboxId as number) ? inboxId : null;

    const baseFilters = buildConversationFilters(selectedInboxId, statusFilter, assigneeFilter);
    const searchQuery = route.filters?.search || "";

    const teamIdStr = route.filters?.teamId;
    const teamId = teamIdStr ? parseInt(teamIdStr, 10) : undefined;
    const parsedTeamId = teamId && !isNaN(teamId) ? teamId : undefined;

    const sortBy = route.filters?.sortBy;

    const labelsString = route.filters?.labels;
    let labels: string[] | undefined = undefined;
    if (typeof labelsString === "string" && labelsString.trim()) {
      labels = labelsString
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    }

    let conversationType: ConversationType | undefined = undefined;
    if (route.view === ChatwootView.MENTIONS) {
      conversationType = ConversationType.MENTION;
    } else if (route.view === ChatwootView.UNATTENDED) {
      conversationType = ConversationType.UNATTENDED;
    }

    return {
      ...baseFilters,
      ...(conversationType && { conversation_type: conversationType }),
      ...(searchQuery && { q: searchQuery }),
      ...(parsedTeamId && { team_id: parsedTeamId }),
      ...(sortBy && { sort_by: sortBy }),
      ...(labels && labels.length > 0 && { labels }),
    };
  }, [filterKey]);

  /**
   * Update filters in URL
   *
   * Uses debouncing for search queries to prevent excessive URL updates.
   * Other filter changes (status, assignee, etc.) are applied immediately.
   *
   * @param newFilters - Partial filter updates to apply
   * @param immediate - When true, skip debounce even for search queries
   */
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ConversationListParams>, immediate: boolean = false) => {
      // Always clear any pending debounce timer before proceeding
      // This prevents race conditions when rapid filter changes occur
      clearDebounceTimer();

      const applyFilters = () => {
        // Clear the ref after execution (timer has completed)
        filterDebounceTimerRef.current = null;

        let statusToSet = (filters.status as ConversationStatus) || ConversationStatus.OPEN;
        let assigneeToSet = (filters.assignee_type as ConversationAssigneeType) || ConversationAssigneeType.ME;
        let searchToSet = filters.q || "";
        let teamToSet = filters.team_id;
        let sortToSet = filters.sort_by;
        let labelsToSet = filters.labels as string[] | undefined;

        const isTabSwitch = "assignee_type" in newFilters && Object.keys(newFilters).length <= 3;

        if ("status" in newFilters) {
          statusToSet =
            newFilters.status === ConversationStatus.ALL || newFilters.status === undefined
              ? ConversationStatus.ALL
              : (newFilters.status as ConversationStatus);
        }
        if ("assignee_type" in newFilters) {
          assigneeToSet = newFilters.assignee_type;
          if (isTabSwitch) {
            searchToSet = "";
            teamToSet = undefined;
            sortToSet = undefined;
            labelsToSet = undefined;
          }
        }
        if ("q" in newFilters) searchToSet = newFilters.q || "";
        if ("team_id" in newFilters) teamToSet = newFilters.team_id;
        if ("sort_by" in newFilters) sortToSet = newFilters.sort_by as string | undefined;
        if ("labels" in newFilters) labelsToSet = newFilters.labels as string[] | undefined;

        const currentInboxId = router.currentRoute?.channelId ? parseInt(router.currentRoute.channelId, 10) : null;

        const urlFilters: Record<string, string | undefined> = {};
        if (statusToSet !== ConversationStatus.OPEN) urlFilters.status = statusToSet;
        if (assigneeToSet !== ConversationAssigneeType.ME) urlFilters.assigneeType = assigneeToSet;
        if (currentInboxId) urlFilters.inboxId = currentInboxId.toString();
        if (searchToSet) urlFilters.search = searchToSet;
        if (teamToSet) urlFilters.teamId = teamToSet.toString();
        if (sortToSet) urlFilters.sortBy = sortToSet;
        if (labelsToSet && labelsToSet.length > 0) urlFilters.labels = labelsToSet.join(",");

        router.updateFilters(urlFilters);
      };

      // Only debounce search queries (user is typing)
      const shouldDebounce = "q" in newFilters && !immediate;

      if (shouldDebounce) {
        filterDebounceTimerRef.current = setTimeout(applyFilters, CHATWOOT_CONSTANTS.SEARCH_DEBOUNCE_MS);
      } else {
        applyFilters();
      }
    },
    [filters, router, clearDebounceTimer]
  );

  // Cleanup effect: Clear any pending timer when component unmounts
  // This prevents memory leaks and ensures no stale callbacks execute
  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  return {
    filters,
    handleFiltersChange,
  };
};
