import { useCallback, useMemo, useEffect, useRef } from "react";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useChatwootConversations } from "./use-chatwoot-conversations";
import { useChatwootRouter } from "./use-chatwoot-router";
import { useChatwootProfile } from "./use-chatwoot-profile";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";
import {
  ConversationListParams,
  ConversationStatus,
  ConversationAssigneeType,
  ChatwootConversation,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { RouteType } from "@/widgets/frontdesk/routing/types";
import { chatwootService } from "@/services/frontdesk";
import { buildConversationFilters, matchesStatusFilter } from "../utils/filter-utils";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useChatwootProvider");
import {
  chatwootSelectedConversationAtom,
  chatwootSelectedAccountAtom,
  chatwootSelectedInboxIdAtom,
  chatwootConversationsAtom,
  chatwootConversationCountsAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

export const useChatwootProvider = () => {
  const [selectedAccountId, setSelectedAccountId] = useRecoilState(chatwootSelectedAccountAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const [conversationsList, setConversationsList] = useRecoilState(chatwootConversationsAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);

  // Use the custom hook to get profile state (prevents multiple API calls)
  const { profile, loading: profileLoading } = useChatwootProfile();

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

  // Initialize filters from URL if present, otherwise use defaults
  const initialStatusFilter = useMemo(() => {
    if (router.currentFilters?.status) {
      return router.currentFilters.status as ConversationStatus;
    }
    return ConversationStatus.OPEN;
  }, []); // Only run once on mount

  const initialAssigneeFilter = useMemo(() => {
    if (router.currentFilters?.assigneeType) {
      return router.currentFilters.assigneeType as ConversationAssigneeType;
    }
    return ConversationAssigneeType.ME;
  }, []); // Only run once on mount

  // Filter state - initialize from URL or use defaults
  const [statusFilter, setStatusFilter] = React.useState<ConversationStatus>(initialStatusFilter);
  const [assigneeFilter, setAssigneeFilter] = React.useState<ConversationAssigneeType>(initialAssigneeFilter);

  // Additional filter state for search, team, and sort
  const [searchQuery, setSearchQuery] = React.useState<string>(router.currentFilters?.search || "");
  const [teamId, setTeamId] = React.useState<number | undefined>(
    router.currentFilters?.teamId ? parseInt(router.currentFilters.teamId, 10) : undefined
  );
  const [sortBy, setSortBy] = React.useState<string | undefined>(router.currentFilters?.sortBy);

  // Debounce timer for filter changes to batch rapid updates
  const filterDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Build filters based on all filter states
  // Supports toggling between Mine/Unassigned/All via assignee filter
  const filters = useMemo<Partial<ConversationListParams>>(() => {
    const baseFilters = buildConversationFilters(selectedInboxId, statusFilter, assigneeFilter);
    return {
      ...baseFilters,
      ...(searchQuery && { q: searchQuery }),
      ...(teamId && { team_id: teamId }),
      ...(sortBy && { sort_by: sortBy }),
    };
  }, [selectedInboxId, statusFilter, assigneeFilter, searchQuery, teamId, sortBy]);

  // Use conversations hook with accountId and filters
  const conversations = useChatwootConversations(currentAccountId, filters);

  // Consolidated initialization effect
  // Handles only account auto-selection now - router handles conversation state
  useEffect(() => {
    // Auto-select account if needed
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, currentAccountId]);

  // Conversation loader: Sync conversationId from URL to actual conversation object
  // This loads the full conversation object when URL contains a conversationId
  // Supports deep linking by fetching conversation from API if not in current list
  useEffect(() => {
    const conversationIdFromUrl = router.currentRoute?.conversationId;

    if (!conversationIdFromUrl) {
      // No conversation in URL - clear selection (router already handles this)
      return;
    }

    // Check if we already have the right conversation loaded
    if (selectedConversation?.id.toString() === conversationIdFromUrl) {
      return;
    }

    // Try to find conversation in the current list first (fast path)
    const convInList = conversations.conversations.find(
      (c) => c.id.toString() === conversationIdFromUrl
    );

    if (convInList) {
      setSelectedConversation(convInList);
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
    router.currentRoute?.conversationId,
    selectedConversation,
    conversations.conversations,
    currentAccountId,
    setSelectedConversation,
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
      const inboxId = conversation.inbox_id?.toString();
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

  // Update conversation in the list after status changes
  // Similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS, { conversationId, status })
  const updateConversationInList = useCallback(
    (updatedConversation: ChatwootConversation) => {
      const newStatus = updatedConversation.status;
      const currentFilterStatus = statusFilter === ConversationStatus.ALL ? undefined : statusFilter;

      // Check if updated conversation matches current filter using utility function
      const matchesFilter = matchesStatusFilter(newStatus, currentFilterStatus);

      // Track the old conversation for count updates
      let oldConversation: ChatwootConversation | undefined;

      setConversationsList((prev) => {
        // Find the old conversation to track status change
        oldConversation = prev.find((conv) => conv.id === updatedConversation.id);

        if (!matchesFilter) {
          // Remove conversation from list if it doesn't match filter (similar to Vue filtering)
          return prev.filter((conv) => conv.id !== updatedConversation.id);
        } else {
          // Update conversation in list if it matches filter
          return prev.map((conv) => (conv.id === updatedConversation.id ? { ...conv, ...updatedConversation } : conv));
        }
      });

      // Update conversation counts based on status change
      if (oldConversation && oldConversation.status !== newStatus) {
        setCounts((prevCounts) => {
          const newCounts = { ...prevCounts };

          // Decrement old status count
          if (oldConversation.status === "open") {
            newCounts.mine = Math.max(0, newCounts.mine - 1);
          }

          // Increment new status count
          if (newStatus === "open") {
            newCounts.mine = newCounts.mine + 1;
          }

          // Handle unassigned count if applicable
          const wasUnassigned = !oldConversation.meta?.assignee?.id;
          const isUnassigned = !updatedConversation.meta?.assignee?.id;

          if (wasUnassigned && !isUnassigned) {
            newCounts.unassigned = Math.max(0, newCounts.unassigned - 1);
          } else if (!wasUnassigned && isUnassigned) {
            newCounts.unassigned = newCounts.unassigned + 1;
          }

          return newCounts;
        });
      }

      // Update selected conversation
      if (selectedConversation?.id === updatedConversation.id) {
        if (!matchesFilter) {
          // If conversation no longer matches filter, deselect it (similar to how it disappears from list)
          setSelectedConversation(null);
        } else {
          setSelectedConversation((prev) => (prev ? { ...prev, ...updatedConversation } : prev));
        }
      }
    },
    [setConversationsList, selectedConversation, setSelectedConversation, statusFilter, setCounts]
  );

  // Handle filter changes - support status, assignee_type, search, team, sort, etc.
  // Also syncs changes to URL for deep linking and browser history
  // Uses debouncing to batch rapid filter changes and prevent multiple API calls
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ConversationListParams>, immediate: boolean = false) => {
      // Clear any pending debounce timer
      if (filterDebounceTimerRef.current) {
        clearTimeout(filterDebounceTimerRef.current);
      }

      // Function to apply filter changes
      const applyFilters = () => {
        let statusToSet = statusFilter;
        let assigneeToSet = assigneeFilter;
        let searchToSet = searchQuery;
        let teamToSet = teamId;
        let sortToSet = sortBy;

        // Handle status filter - the component sends ConversationStatus.ALL when "All" is selected
        // Check if status property exists in the newFilters object (could be undefined or ConversationStatus.ALL)
        if ("status" in newFilters) {
          // Convert ConversationStatus.ALL or undefined to ConversationStatus.ALL for internal state
          statusToSet =
            newFilters.status === ConversationStatus.ALL || newFilters.status === undefined
              ? ConversationStatus.ALL
              : (newFilters.status as ConversationStatus);
          setStatusFilter(statusToSet);
        }
        if ("assignee_type" in newFilters) {
          assigneeToSet = newFilters.assignee_type;
          setAssigneeFilter(newFilters.assignee_type);
        }
        if ("q" in newFilters) {
          searchToSet = newFilters.q || "";
          setSearchQuery(searchToSet);
        }
        if ("team_id" in newFilters) {
          teamToSet = newFilters.team_id;
          setTeamId(teamToSet);
        }
        if ("sort_by" in newFilters) {
          sortToSet = newFilters.sort_by as string | undefined;
          setSortBy(sortToSet);
        }

        // Sync to URL (use shallow routing to avoid full page reload)
        const urlFilters: any = {};
        if (statusToSet !== ConversationStatus.OPEN) {
          urlFilters.status = statusToSet;
        }
        if (assigneeToSet !== ConversationAssigneeType.ME) {
          urlFilters.assigneeType = assigneeToSet;
        }
        if (selectedInboxId) {
          urlFilters.inboxId = selectedInboxId.toString();
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
    [statusFilter, assigneeFilter, searchQuery, teamId, sortBy, selectedInboxId, router]
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

    // Selected conversation
    selectedConversation,
    handleConversationSelect,
    handleBack,

    // Router
    router,
  };
};
