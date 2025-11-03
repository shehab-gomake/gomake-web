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
import { chatwootService } from "@/services/frontdesk";
import { buildConversationFilters, matchesStatusFilter } from "../utils/filter-utils";
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

  // Track initialization to prevent cascading state updates
  const lastInboxIdRef = useRef<number | null>(selectedInboxId);

  // Consolidated initialization effect
  // Handles account selection, conversation clearing, and auto-selection in a coordinated manner
  useEffect(() => {
    // 1. Auto-select account if needed
    if (!selectedAccountId && currentAccountId) {
      setSelectedAccountId(currentAccountId);
    }

    // 2. Clear selected conversation when inbox changes (but not on initial mount)
    if (lastInboxIdRef.current !== selectedInboxId) {
      lastInboxIdRef.current = selectedInboxId;
      setSelectedConversation(null);
    }

    // 3. Auto-select first conversation when appropriate
    // Only do this if:
    // - We have an inbox selected
    // - Conversations have loaded
    // - No conversation is currently selected
    // - We have conversations to select from
    if (selectedInboxId && conversations.conversations.length > 0 && !selectedConversation && !conversations.loading) {
      const firstConversation = conversations.conversations[0];
      if (firstConversation) {
        setSelectedConversation(firstConversation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedAccountId,
    currentAccountId,
    selectedInboxId,
    conversations.conversations,
    selectedConversation,
    conversations.loading,
  ]);

  const handleConversationSelect = useCallback(
    async (conversation: ChatwootConversation) => {
      setSelectedConversation(conversation);

      // Mark conversation as read (updates agent_last_seen_at)
      if (conversation.id && currentAccountId) {
        try {
          await chatwootService.conversations.markConversationAsRead(currentAccountId, conversation.id);
        } catch (err) {
          // Don't block conversation selection on error
          console.error("Failed to mark conversation as read:", err);
        }
      }
    },
    [setSelectedConversation, currentAccountId]
  );

  const handleBack = useCallback(() => {
    setSelectedConversation(null);
  }, [setSelectedConversation]);

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
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ConversationListParams>) => {
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
    },
    [statusFilter, assigneeFilter, searchQuery, teamId, sortBy, selectedInboxId, router]
  );

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
