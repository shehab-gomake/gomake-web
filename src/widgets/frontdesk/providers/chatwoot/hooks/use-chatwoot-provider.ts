import { useCallback, useMemo, useEffect, useRef } from "react";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilCallback } from "recoil";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";
import { useChatwootCache } from "./use-chatwoot-cache";
import { useChatwootConversationUpdater } from "./use-chatwoot-conversation-updater";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ConversationType,
  ChatwootConversation,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { RouteType, ChatwootView } from "@/widgets/frontdesk/routing/types";
import { chatwootService } from "@/services/frontdesk";
import { buildConversationFilters, matchesStatusFilter, createFilterKey } from "../utils/filter-utils";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootProvider");

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

import {
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
  chatwootSelectedInboxIdAtom,
  chatwootConversationsAtom,
  chatwootConversationCountsAtom,
  chatwootConversationsCacheFamily,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const [conversationsList, setConversationsList] = useRecoilState(chatwootConversationsAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);

  // Use the custom hook to get profile state (prevents multiple API calls)
  const { profile, loading: profileLoading, error: profileError, fetchProfile } = useChatwootProfile();

  // Use the custom hook to get inboxes state (prevents multiple API calls from child components)
  const { inboxes, loading: inboxesLoading, selectedInbox, selectInbox } = useChatwootInboxes();

  // Initialize router
  const router = useChatwootRouter();

  // Get account from user profile
  const availableAccounts = useMemo(() => {
    return profile?.accounts || [];
  }, [profile]);

  // Auto-select first account if available
  const currentAccountId = useMemo(() => {
    if (selectedAccountId) return selectedAccountId;
    if (availableAccounts.length > 0) {
      return availableAccounts[0].id;
    }
    return null;
  }, [selectedAccountId, availableAccounts]);

  // Cache management for conversations (must come after currentAccountId is defined)
  const cache = useChatwootCache(currentAccountId);

  // Cache-aware conversation updater (updates all caches, not just legacy atom)
  const { updateConversation: updateConversationCache } = useChatwootConversationUpdater();

  // Debounce timer for filter changes to batch rapid updates
  const filterDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // OPTIMIZED: Create stable filter key from URL (prevents unnecessary filter object recreation)
  // This is the single source of truth for filter state
  const filterKey = useMemo(() => {
    const route = router.currentRoute;
    if (!route) return '';

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
  }, [router.currentRoute]); // Single dependency on route object

  // OPTIMIZED: Build filters from stable key only
  // Only recreates when filterKey actually changes (content-based, not reference-based)
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    const route = router.currentRoute;
    if (!route) return {};

    // Parse status with validation and defaults
    const urlStatus = route.filters?.status as ConversationStatus | undefined;
    const validStatuses = Object.values(ConversationStatus);
    const statusFilter = urlStatus && validStatuses.includes(urlStatus)
      ? urlStatus
      : ConversationStatus.OPEN;

    // Parse assignee type with validation and defaults
    const urlAssignee = route.filters?.assigneeType as ConversationAssigneeType | undefined;
    const validTypes = Object.values(ConversationAssigneeType);
    const assigneeFilter = urlAssignee && validTypes.includes(urlAssignee)
      ? urlAssignee
      : ConversationAssigneeType.ME;

    // Parse inbox ID from channelId
    const inboxId = route.channelId ? parseInt(route.channelId, 10) : null;
    const selectedInboxId = !isNaN(inboxId as number) ? inboxId : null;

    // Build base filters
    const baseFilters = buildConversationFilters(selectedInboxId, statusFilter, assigneeFilter);

    // Parse search query
    const searchQuery = route.filters?.search || "";

    // Parse team ID
    const teamIdStr = route.filters?.teamId;
    const teamId = teamIdStr ? parseInt(teamIdStr, 10) : undefined;
    const parsedTeamId = teamId && !isNaN(teamId) ? teamId : undefined;

    // Parse sort by
    const sortBy = route.filters?.sortBy;

    // Parse labels (comma-separated string to array)
    const labelsString = route.filters?.labels;
    let labels: string[] | undefined = undefined;
    if (typeof labelsString === 'string' && labelsString.trim()) {
      labels = labelsString.split(',').map(l => l.trim()).filter(l => l.length > 0);
    }

    // Set conversation_type based on view
    // This translates to specific backend queries as documented
    let conversationType: ConversationType | undefined = undefined;
    if (route.view === ChatwootView.MENTIONS) {
      conversationType = ConversationType.MENTION;
    } else if (route.view === ChatwootView.UNATTENDED) {
      conversationType = ConversationType.UNATTENDED;
    }
    // Note: PARTICIPATING is not currently used in our views, but can be added if needed

    return {
      ...baseFilters,
      ...(conversationType && { conversation_type: conversationType }),
      ...(searchQuery && { q: searchQuery }),
      ...(parsedTeamId && { team_id: parsedTeamId }),
      ...(sortBy && { sort_by: sortBy }),
      ...(labels && labels.length > 0 && { labels }),
    };
  }, [filterKey]); // Only recreate when stable key changes

  // Extract individual filter values for use in other functions (derived from filters object)
  const statusFilter = useMemo(() => {
    const status = filters.status as ConversationStatus | undefined;
    return status || ConversationStatus.OPEN;
  }, [filters.status]);

  const assigneeFilter = useMemo(() => {
    const assignee = filters.assignee_type as ConversationAssigneeType | undefined;
    return assignee || ConversationAssigneeType.ME;
  }, [filters.assignee_type]);

  // Use conversations hook with accountId and filters
  const conversations = useChatwootConversations(currentAccountId, filters);

  // Consolidated initialization effect
  // Handles only account auto-selection
  useEffect(() => {
    // Auto-select account if needed
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, currentAccountId]);

  // OPTIMIZED: Conversation loader - Sync conversationId from URL to actual conversation object
  // This loads the full conversation object when URL contains a conversationId
  // Supports deep linking by fetching conversation from API if not in current list
  // Optimized to use list data when available for instant transitions

  // Track conversations in a ref for instant access (no effect needed - refs update synchronously)
  const conversationsRef = useRef(conversations.conversations);
  conversationsRef.current = conversations.conversations; // Direct assignment - instant, no effect

  // Helper to read latest conversations from cache directly (bypasses stale ref)
  const getLatestConversations = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        // Generate the same cache key that useChatwootConversations uses
        const cacheKey = createFilterKey(currentAccountId, filters);
        const cache = snapshot.getLoadable(chatwootConversationsCacheFamily(cacheKey));
        return cache.state === 'hasValue' ? cache.getValue().conversations : [];
      },
    [currentAccountId, filters]
  );

  useEffect(() => {
    const conversationIdFromUrl = router.currentRoute?.conversationId;

    // Early return: No conversation in URL
    if (!conversationIdFromUrl) {
      // Clear selection only if currently selected (avoid unnecessary setState)
      if (selectedConversation !== null) {
        setSelectedConversation(null);
      }
      return;
    }

    // Early return: Already have the right conversation loaded
    // Compare only by ID to avoid refetch when conversation object updates
    if (selectedConversation?.id.toString() === conversationIdFromUrl) {
      return;
    }

    // Try to find conversation in the current list first (fast path - instant transition)
    // Get latest conversations from cache (bypasses stale ref, always fresh)
    const latestConversations = getLatestConversations();
    const convInList = latestConversations.find(
      (c) => c.id.toString() === conversationIdFromUrl
    );

    if (convInList) {
      // Use conversation from list immediately for smooth transition
      setSelectedConversation(convInList);
      logger.debug(`Using conversation ${conversationIdFromUrl} from list (instant)`);
      return;
    }

    // If not in list, fetch from API (for direct URL access / deep linking)
    // This enables sharing conversation links that work even if conversation isn't loaded
    const fetchConversationFromApi = async () => {
      if (!currentAccountId) {
        logger.warn("Cannot fetch conversation - no account selected");
        return;
      }

      try {
        logger.debug(`Fetching conversation ${conversationIdFromUrl} from API (deep link)`);
        const response = await chatwootService.conversations.getConversationDetails(
          currentAccountId,
          parseInt(conversationIdFromUrl, 10)
        );

        // API returns the conversation object directly
        const conversation = response as any;
        if (conversation) {
          setSelectedConversation(conversation);
          logger.debug(`Loaded conversation ${conversationIdFromUrl} from API`);
        } else {
          logger.error("Conversation not found:", conversationIdFromUrl);
        }
      } catch (error) {
        logger.error(`Failed to fetch conversation ${conversationIdFromUrl}:`, error);
        // TODO: Show user-friendly error message (conversation not found or unauthorized)
      }
    };

    fetchConversationFromApi();
  }, [
    router.currentRoute?.conversationId, // URL source of truth
    currentAccountId,                     // Account context
    setSelectedConversation,              // Setter (stable)
    // REMOVED: selectedConversation - breaks circular dependency, prevents unnecessary re-runs
    // REMOVED: conversations.conversations - ref handles this, prevents duplicate fetches
  ]);

  /**
   * Handle conversation selection
   *
   * This now triggers navigation via router instead of directly setting Recoil state.
   * The router will update the URL, which will trigger useEffect to update Recoil.
   * Also marks conversation as read (business logic).
   */
  const handleConversationSelect = useCallback(
    async (conversation: ChatwootConversation) => {
      // Navigate to conversation - URL will become source of truth
      // Only pass inbox_id when in CHANNELS view
      // For ALL_CONVERSATIONS, MY_INBOX, MENTIONS, UNATTENDED - don't pass it
      const inboxId = router.isChannelsView
        ? conversation.inbox_id?.toString()
        : undefined;
      router.navigateToConversation(conversation.id.toString(), inboxId);

      // Mark conversation as read (business logic - independent of navigation state)
      if (conversation.id && currentAccountId) {
        try {
          await chatwootService.conversations.markConversationAsRead(currentAccountId, conversation.id);
        } catch (err) {
          // Don't block conversation selection on error
          logger.error("Failed to mark conversation as read:", err);
        }
      }
    },
    [currentAccountId, router]
  );

  /**
   * Handle back navigation (return to conversation list)
   *
   * Now triggers router navigation to clear conversationId from URL
   */
  const handleBack = useCallback(() => {
    // Navigate to current view without conversationId
    router.navigate({
      type: RouteType.CHATWOOT,
      view: router.currentView,
      channelId: selectedInboxId?.toString(),
      filters: router.currentFilters,
    });
  }, [router, selectedInboxId]);

  const selectAccount = useCallback(
    (accountId: number | null) => {
      setSelectedAccountId(accountId);
      setSelectedConversation(null); // Clear selected conversation when switching accounts
    },
    [setSelectedAccountId, setSelectedConversation]
  );

  // Use the utility function for status matching (already imported from utils)

  // Update conversation in the list after status or assignee changes
  // Similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS, { conversationId, status })
  // Now also handles assignee changes and filters conversations accordingly
  const updateConversationInList = useCallback(
    (updatedConversation: ChatwootConversation) => {
      const currentUserId = profile?.id;
      const newStatus = updatedConversation.status;
      const currentFilterStatus = statusFilter === ConversationStatus.ALL ? undefined : statusFilter;

      // Check if updated conversation matches current status filter
      const statusMatches = matchesStatusFilter(newStatus, currentFilterStatus);

      // Track the old conversation for count updates
      let oldConversation: ChatwootConversation | undefined;

      // First, update all caches with the cache-aware updater
      updateConversationCache(updatedConversation.id, updatedConversation);

      // Then update legacy atom with filtering logic (for backward compatibility)
      setConversationsList((prev) => {
        // Find the old conversation to track changes
        oldConversation = prev.find((conv) => conv.id === updatedConversation.id);

        // Check if conversation matches assignee filter
        const newAssigneeId = updatedConversation.meta?.assignee?.id;
        const oldAssigneeId = oldConversation?.meta?.assignee?.id;

        let matchesAssigneeFilter = true;
        if (assigneeFilter === ConversationAssigneeType.ME) {
          matchesAssigneeFilter = newAssigneeId === currentUserId;
        } else if (assigneeFilter === ConversationAssigneeType.UNASSIGNED) {
          matchesAssigneeFilter = !newAssigneeId;
        } else if (assigneeFilter === ConversationAssigneeType.ASSIGNED) {
          matchesAssigneeFilter = !!newAssigneeId;
        }
        // ConversationAssigneeType.ALL always matches

        const matchesAllFilters = statusMatches && matchesAssigneeFilter;

        if (!matchesAllFilters) {
          // Remove conversation from list if it doesn't match filters
          return prev.filter((conv) => conv.id !== updatedConversation.id);
        } else {
          // Update conversation in list if it matches filters
          return prev.map((conv) => (conv.id === updatedConversation.id ? { ...conv, ...updatedConversation } : conv));
        }
      });

      // Update conversation counts based on status and assignee changes
      if (oldConversation) {
        const statusChanged = oldConversation.status !== newStatus;
        const oldAssigneeId = oldConversation.meta?.assignee?.id;
        const newAssigneeId = updatedConversation.meta?.assignee?.id;
        const assigneeChanged = oldAssigneeId !== newAssigneeId;

        if (statusChanged || assigneeChanged) {
          setCounts((prevCounts) => {
            const newCounts = { ...prevCounts };

            // Handle status count changes
            if (statusChanged) {
              // Decrement old status count
              if (oldConversation.status === "open") {
                newCounts.mine = Math.max(0, newCounts.mine - 1);
              }

              // Increment new status count
              if (newStatus === "open") {
                newCounts.mine = newCounts.mine + 1;
              }
            }

            // Handle unassigned count changes
            const wasUnassigned = !oldAssigneeId;
            const isUnassigned = !newAssigneeId;

            if (wasUnassigned && !isUnassigned) {
              newCounts.unassigned = Math.max(0, newCounts.unassigned - 1);
            } else if (!wasUnassigned && isUnassigned) {
              newCounts.unassigned = newCounts.unassigned + 1;
            }

            // Handle "mine" count changes based on assignee
            if (currentUserId) {
              const wasAssignedToMe = oldAssigneeId === currentUserId;
              const isAssignedToMe = newAssigneeId === currentUserId;

              if (!wasAssignedToMe && isAssignedToMe && newStatus === "open") {
                // Conversation was assigned to me
                newCounts.mine = newCounts.mine + 1;
              } else if (wasAssignedToMe && !isAssignedToMe && oldConversation.status === "open") {
                // Conversation was unassigned from me
                newCounts.mine = Math.max(0, newCounts.mine - 1);
              }
            }

            return newCounts;
          });
        }
      }

      // Update selected conversation
      if (selectedConversation?.id === updatedConversation.id) {
        const matchesAllFilters = statusMatches && (() => {
          const newAssigneeId = updatedConversation.meta?.assignee?.id;
          if (assigneeFilter === ConversationAssigneeType.ME) {
            return newAssigneeId === currentUserId;
          } else if (assigneeFilter === ConversationAssigneeType.UNASSIGNED) {
            return !newAssigneeId;
          } else if (assigneeFilter === ConversationAssigneeType.ASSIGNED) {
            return !!newAssigneeId;
          }
          return true; // ALL
        })();

        if (!matchesAllFilters) {
          // If conversation no longer matches filter, deselect it
          setSelectedConversation(null);
        } else {
          setSelectedConversation((prev) => (prev ? { ...prev, ...updatedConversation } : prev));
        }
      }
    },
    [updateConversationCache, setConversationsList, selectedConversation, setSelectedConversation, statusFilter, assigneeFilter, profile, setCounts]
  );

  // OPTIMIZED: Handle filter changes with simplified dependencies
  // Updates URL only - URL is single source of truth, parsed values will update automatically
  // Uses debouncing to batch rapid filter changes and prevent multiple API calls
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ConversationListParams>, immediate: boolean = false) => {
      // Clear any pending debounce timer
      if (filterDebounceTimerRef.current) {
        clearTimeout(filterDebounceTimerRef.current);
      }

      // Function to apply filter changes to URL
      const applyFilters = () => {
        // Start with current URL values (read from route)
        let statusToSet = filters.status as ConversationStatus || ConversationStatus.OPEN;
        let assigneeToSet = filters.assignee_type as ConversationAssigneeType || ConversationAssigneeType.ME;
        let searchToSet = filters.q || "";
        let teamToSet = filters.team_id;
        let sortToSet = filters.sort_by;
        let labelsToSet = filters.labels as string[] | undefined;

        // Detect if this is a tab switch (assignee_type change without other filters)
        const isTabSwitch = "assignee_type" in newFilters && Object.keys(newFilters).length <= 3; // assignee_type, page, and maybe status/inbox_id

        // Handle status filter - the component sends ConversationStatus.ALL when "All" is selected
        if ("status" in newFilters) {
          statusToSet =
            newFilters.status === ConversationStatus.ALL || newFilters.status === undefined
              ? ConversationStatus.ALL
              : (newFilters.status as ConversationStatus);
        }
        if ("assignee_type" in newFilters) {
          assigneeToSet = newFilters.assignee_type;

          // On tab switch, clear contextual filters (search, team, sort, labels)
          if (isTabSwitch) {
            searchToSet = "";
            teamToSet = undefined;
            sortToSet = undefined;
            labelsToSet = undefined;
          }
        }
        if ("q" in newFilters) {
          searchToSet = newFilters.q || "";
        }
        if ("team_id" in newFilters) {
          teamToSet = newFilters.team_id;
        }
        if ("sort_by" in newFilters) {
          sortToSet = newFilters.sort_by as string | undefined;
        }
        if ("labels" in newFilters) {
          labelsToSet = newFilters.labels as string[] | undefined;
        }

        // Get inbox ID from current route
        const currentInboxId = router.currentRoute?.channelId
          ? parseInt(router.currentRoute.channelId, 10)
          : null;

        // Build URL filters object (omit defaults to keep URL clean)
        const urlFilters: any = {};
        if (statusToSet !== ConversationStatus.OPEN) {
          urlFilters.status = statusToSet;
        }
        if (assigneeToSet !== ConversationAssigneeType.ME) {
          urlFilters.assigneeType = assigneeToSet;
        }
        if (currentInboxId) {
          urlFilters.inboxId = currentInboxId.toString();
        }
        if (searchToSet) {
          urlFilters.search = searchToSet;
        }
        if (teamToSet) {
          urlFilters.teamId = teamToSet.toString();
        }
        if (sortToSet) {
          urlFilters.sortBy = sortToSet;
        }
        if (labelsToSet && labelsToSet.length > 0) {
          urlFilters.labels = labelsToSet.join(",");
        }

        // Update URL - this will trigger re-parse of filter values automatically
        router.updateFilters(urlFilters);
      };

      // Apply immediately for important filters (status, assignee), debounce for search
      const shouldDebounce = "q" in newFilters && !immediate;

      if (shouldDebounce) {
        // Debounce search queries to avoid excessive API calls while typing
        filterDebounceTimerRef.current = setTimeout(applyFilters, 300);
      } else {
        // Apply status/assignee/team/sort changes immediately
        applyFilters();
      }
    },
    [filters, router] // SIMPLIFIED: Only depend on filters object and router
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (filterDebounceTimerRef.current) {
        clearTimeout(filterDebounceTimerRef.current);
      }
    };
  }, []);

  return {
    // Account management
    accounts: availableAccounts,
    selectedAccountId: currentAccountId,
    selectAccount,

    // Profile
    profile,
    profileLoading,
    profileError,
    fetchProfile, // Expose fetchProfile for retry functionality

    // Inboxes
    inboxes,
    inboxesLoading,
    selectedInbox,
    selectInbox,

    // Conversations
    conversations: conversations.conversations,
    conversationsLoading: conversations.loading,
    conversationsError: conversations.error,
    hasMore: conversations.hasMore,
    loadMore: conversations.loadMore,
    refresh: conversations.refresh,

    // Filters
    filters,
    handleFiltersChange,

    // Conversation updates
    updateConversationInList,
    updateConversationStatus: conversations.updateConversationStatus, // Optimistic status updates

    // Selected conversation
    selectedConversation,
    handleConversationSelect,
    handleBack,

    // Router
    router,

    // Cache management
    cache: {
      clearAll: cache.clearAllCaches,
      clear: cache.clearCache,
      invalidate: cache.invalidateCaches,
      getStats: cache.getStats,
      count: cache.cacheCount,
    },
  };
};
