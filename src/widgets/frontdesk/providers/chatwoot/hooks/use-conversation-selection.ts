import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilCallback, useRecoilValue } from "recoil";
import { ChatwootConversation, ConversationListParams } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { RouteType } from "@/widgets/frontdesk/routing/types";
import { chatwootService } from "@/services/frontdesk";
import { createLogger } from "@/services/frontdesk/utils/logger";
import {
  chatwootSelectedConversationAtom,
  chatwootConversationsCacheFamily,
  chatwootSelectedInboxIdAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { createFilterKey } from "../utils/filter-utils";
import { useChatwootRouter } from "./use-chatwoot-router";

const logger = createLogger("useConversationSelection");

// Global deduplication for conversation detail fetches
// Stores the conversation ID currently being fetched (null if none)
let globalConversationDetailFetchInProgress: string | null = null;

/**
 * Hook for managing conversation selection and navigation
 *
 * Handles deep linking from URL, selecting conversations from the list,
 * and navigating back to the list view.
 *
 * @param currentAccountId - The currently selected account ID
 * @param filters - Current conversation list filters (for cache lookup)
 */
export const useConversationSelection = (currentAccountId: number | null, filters: Partial<ConversationListParams>) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(chatwootSelectedConversationAtom);
  const selectedInboxId = useRecoilValue(chatwootSelectedInboxIdAtom);
  const router = useChatwootRouter();

  // Helper to read latest conversations from cache directly (bypasses stale ref)
  const getLatestConversations = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const cacheKey = createFilterKey(currentAccountId, filters);
        const cache = snapshot.getLoadable(chatwootConversationsCacheFamily(cacheKey));
        return cache.state === "hasValue" ? cache.getValue().conversations : [];
      },
    [currentAccountId, filters]
  );

  // Sync conversationId from URL to actual conversation object
  useEffect(() => {
    const conversationIdFromUrl = router.currentRoute?.conversationId;

    if (!conversationIdFromUrl) {
      if (selectedConversation !== null) {
        setSelectedConversation(null);
      }
      return;
    }

    if (selectedConversation?.id.toString() === conversationIdFromUrl) {
      return;
    }

    // Try to find conversation in the current list first (fast path)
    const latestConversations = getLatestConversations();
    const convInList = latestConversations.find((c) => c.id.toString() === conversationIdFromUrl);

    if (convInList) {
      setSelectedConversation(convInList);
      logger.debug(`Using conversation ${conversationIdFromUrl} from list (instant)`);
      return;
    }

    // If not in list, fetch from API (deep linking support)
    const fetchConversationFromApi = async () => {
      if (!currentAccountId) return;

      // Global deduplication check - prevent duplicate fetches of the same conversation
      if (globalConversationDetailFetchInProgress === conversationIdFromUrl) {
        logger.debug(`⏭️ Conversation ${conversationIdFromUrl} fetch already in progress, skipping duplicate`);
        return;
      }

      globalConversationDetailFetchInProgress = conversationIdFromUrl;

      try {
        logger.debug(`Fetching conversation ${conversationIdFromUrl} from API (deep link)`);
        const response = await chatwootService.conversations.getConversationDetails(
          currentAccountId,
          parseInt(conversationIdFromUrl, 10)
        );

        if (response) {
          setSelectedConversation(response as any);
          logger.debug(`Loaded conversation ${conversationIdFromUrl} from API`);
        }
      } catch (error) {
        logger.error(`Failed to fetch conversation ${conversationIdFromUrl}:`, error);
      } finally {
        // Reset global flag only if this fetch's conversation ID is still in progress
        if (globalConversationDetailFetchInProgress === conversationIdFromUrl) {
          globalConversationDetailFetchInProgress = null;
        }
      }
    };

    fetchConversationFromApi();
  }, [router.currentRoute?.conversationId, currentAccountId, setSelectedConversation, getLatestConversations]);

  /**
   * Handle selection of a conversation
   * Navigates to the conversation URL and marks it as read
   */
  const handleConversationSelect = useCallback(
    async (conversation: ChatwootConversation) => {
      const inboxId = router.isChannelsView ? conversation.inbox_id?.toString() : undefined;
      router.navigateToConversation(conversation.id.toString(), inboxId);

      if (conversation.id && currentAccountId) {
        try {
          await chatwootService.conversations.markConversationAsRead(currentAccountId, conversation.id);
        } catch (err) {
          logger.error("Failed to mark conversation as read:", err);
        }
      }
    },
    [currentAccountId, router]
  );

  /**
   * Handle back navigation to list
   * Clears the conversation selection in URL
   */
  const handleBack = useCallback(() => {
    router.navigate({
      type: RouteType.CHATWOOT,
      view: router.currentView,
      channelId: selectedInboxId?.toString(),
      filters: router.currentFilters,
    });
  }, [router, selectedInboxId]);

  return {
    selectedConversation,
    handleConversationSelect,
    handleBack,
  };
};
