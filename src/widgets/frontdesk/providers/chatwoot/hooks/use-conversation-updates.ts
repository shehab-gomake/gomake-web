import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  ChatwootConversation,
  ConversationStatus,
  ConversationAssigneeType,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  chatwootConversationsAtom,
  chatwootConversationCountsAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootConversationUpdater } from "./use-chatwoot-conversation-updater";
import { matchesStatusFilter } from "../utils/filter-utils";
import { useChatwootProfile } from "./use-chatwoot-profile";

/**
 * Hook for handling real-time conversation updates
 *
 * Manages local state updates when conversations change via WebSocket or user action.
 * Updates conversation list, counts, and selected conversation state.
 *
 * @param statusFilter - Current status filter
 * @param assigneeFilter - Current assignee filter
 */
export const useConversationUpdates = (statusFilter: ConversationStatus, assigneeFilter: ConversationAssigneeType) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const setConversationsList = useSetRecoilState(chatwootConversationsAtom);
  const setCounts = useSetRecoilState(chatwootConversationCountsAtom);
  const { updateConversation: updateConversationCache } = useChatwootConversationUpdater();
  const { profile } = useChatwootProfile();

  /**
   * Update conversation in list and adjust counts
   *
   * Handles moving conversations between tabs/lists based on status/assignee changes
   * and updates counts accordingly.
   *
   * @param updatedConversation - The updated conversation object
   */
  const updateConversationInList = useCallback(
    (updatedConversation: ChatwootConversation) => {
      const currentUserId = profile?.id;
      const newStatus = updatedConversation.status;
      const currentFilterStatus = statusFilter === ConversationStatus.ALL ? undefined : statusFilter;

      const statusMatches = matchesStatusFilter(newStatus, currentFilterStatus);
      let oldConversation: ChatwootConversation | undefined;

      updateConversationCache(updatedConversation.id, updatedConversation);

      setConversationsList((prev) => {
        oldConversation = prev.find((conv) => conv.id === updatedConversation.id);
        const newAssigneeId = updatedConversation.meta?.assignee?.id;

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
              if (oldConversation!.status === "open") {
                newCounts.mine = Math.max(0, newCounts.mine - 1);
              }
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
                newCounts.mine = newCounts.mine + 1;
              } else if (wasAssignedToMe && !isAssignedToMe && oldConversation!.status === "open") {
                newCounts.mine = Math.max(0, newCounts.mine - 1);
              }
            }

            return newCounts;
          });
        }
      }

      // Update selected conversation
      if (selectedConversation?.id === updatedConversation.id) {
        const matchesAllFilters =
          statusMatches &&
          (() => {
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
          setSelectedConversation(null);
        } else {
          setSelectedConversation((prev) => (prev ? { ...prev, ...updatedConversation } : prev));
        }
      }
    },
    [
      updateConversationCache,
      setConversationsList,
      selectedConversation,
      setSelectedConversation,
      statusFilter,
      assigneeFilter,
      profile,
      setCounts,
    ]
  );

  return { updateConversationInList };
};
