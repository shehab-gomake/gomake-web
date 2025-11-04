/**
 * useChatwootInboxes Hook
 *
 * Manages inboxes (channels) fetching and state for Chatwoot provider.
 * Inboxes represent different communication channels like Email, WhatsApp, Facebook, etc.
 *
 * Production-ready: Prevents duplicate concurrent requests with global flag
 */

import { useEffect, useMemo, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatwootService } from "@/services/frontdesk";
import {
  chatwootInboxesAtom,
  chatwootSelectedInboxIdAtom,
  chatwootInboxesLoadingAtom,
  chatwootInboxesErrorAtom,
  chatwootSelectedAccountAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { useChatwootDataFetch } from "./core/use-chatwoot-data-fetch";
import { extractPayload } from "../utils/api-response-utils";

// Global fetch guard to prevent duplicate concurrent requests across all hook instances
let globalInboxesFetchInProgress = false;

export const useChatwootInboxes = () => {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [inboxes, setInboxes] = useRecoilState(chatwootInboxesAtom);
  const [selectedInboxId, setSelectedInboxId] = useRecoilState(chatwootSelectedInboxIdAtom);
  const [loading, setLoading] = useRecoilState(chatwootInboxesLoadingAtom);
  const [error, setError] = useRecoilState(chatwootInboxesErrorAtom);

  // Wrap fetch function with global deduplication
  const fetchInboxesWithDeduplication = useCallback(async () => {
    if (!selectedAccountId) {
      return [];
    }

    // Global deduplication guard
    if (globalInboxesFetchInProgress) {
      console.log("[useChatwootInboxes] ⏭️ Global fetch already in progress, returning empty (will use cached data)");
      return inboxes; // Return current data to avoid breaking the hook
    }

    globalInboxesFetchInProgress = true;
    console.log("[useChatwootInboxes] 🚀 Fetching inboxes");

    try {
      const result = await chatwootService.inboxes.listAllInboxes();
      const inboxesArray = result.payload || result.data?.payload || [];
      console.log(`[useChatwootInboxes] ✅ Fetched ${inboxesArray.length} inboxes`);
      return result;
    } finally {
      globalInboxesFetchInProgress = false;
    }
  }, [selectedAccountId, inboxes]);

  // Use base data fetch hook with Recoil state synchronization
  const { data: fetchedInboxes, loading: fetchLoading, error: fetchError, refresh } = useChatwootDataFetch<ChatwootInbox[]>({
    fetchFn: fetchInboxesWithDeduplication,
    extractData: extractPayload,
    autoFetch: !!selectedAccountId,
    createFilterKey: () => `inboxes-${selectedAccountId}`,
  });

  // Sync fetched data to Recoil state (only when data actually changes)
  useEffect(() => {
    if (fetchedInboxes && fetchedInboxes.length > 0) {
      setInboxes(fetchedInboxes);
    }
  }, [fetchedInboxes, setInboxes]);

  // Sync loading state from base hook to Recoil
  useEffect(() => {
    setLoading(fetchLoading);
  }, [fetchLoading, setLoading]);

  // Sync error state from base hook to Recoil
  useEffect(() => {
    setError(fetchError);
  }, [fetchError, setError]);

  /**
   * Select an inbox by ID
   */
  const selectInbox = useCallback(
    (inboxId: number | null) => {
      setSelectedInboxId(inboxId);
    },
    [setSelectedInboxId]
  );

  /**
   * Get selected inbox details
   */
  const selectedInbox = useMemo(() => {
    return inboxes.find((inbox: ChatwootInbox) => inbox.id === selectedInboxId) || null;
  }, [inboxes, selectedInboxId]);

  return {
    inboxes,
    selectedInboxId,
    selectedInbox,
    loading,
    error,
    selectInbox,
    refresh,
  };
};

