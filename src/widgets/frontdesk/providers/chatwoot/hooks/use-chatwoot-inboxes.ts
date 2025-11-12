/**
 * useChatwootInboxes Hook
 *
 * Manages inboxes (channels) fetching and state for Chatwoot provider.
 * Inboxes represent different communication channels like Email, WhatsApp, Facebook, etc.
 *
 * Simple approach: Fetch once on mount if not already loaded, store in Recoil, never refetch.
 * Inboxes are relatively static data and don't change frequently during a session.
 */

import { useEffect, useMemo, useCallback, useRef } from "react";
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

// Global fetch guard to prevent duplicate concurrent requests across all hook instances
let globalInboxesFetchInProgress = false;
let globalInboxesFetched = false; // Track if we've ever fetched inboxes successfully

export const useChatwootInboxes = () => {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [inboxes, setInboxes] = useRecoilState(chatwootInboxesAtom);
  const [selectedInboxId, setSelectedInboxId] = useRecoilState(chatwootSelectedInboxIdAtom);
  const [loading, setLoading] = useRecoilState(chatwootInboxesLoadingAtom);
  const [error, setError] = useRecoilState(chatwootInboxesErrorAtom);

  // Fetch inboxes once on mount if not already loaded
  const fetchInboxes = useCallback(async (force: boolean = false) => {
    if (!selectedAccountId) {
      return;
    }

    // Skip if already fetched successfully and not forcing
    if (globalInboxesFetched && inboxes.length > 0 && !force) {
      console.log("[useChatwootInboxes] ✅ Using cached inboxes from Recoil");
      return;
    }

    // Global deduplication guard
    if (globalInboxesFetchInProgress) {
      console.log("[useChatwootInboxes] ⏭️ Global fetch already in progress, skipping duplicate");
      return;
    }

    globalInboxesFetchInProgress = true;
    setLoading(true);
    setError(null);
    console.log("[useChatwootInboxes] 🚀 Fetching inboxes");

    try {
      const result = await chatwootService.inboxes.listAllInboxes();
      const inboxesArray = result.payload || result.data?.payload || [];
      console.log(`[useChatwootInboxes] ✅ Fetched ${inboxesArray.length} inboxes`);
      
      setInboxes(inboxesArray);
      globalInboxesFetched = true; // Mark as fetched
    } catch (err: any) {
      console.error("[useChatwootInboxes] ❌ Failed to fetch inboxes:", err);
      setError(err?.message || "Failed to fetch inboxes");
    } finally {
      globalInboxesFetchInProgress = false;
      setLoading(false);
    }
  }, [selectedAccountId, inboxes.length, setInboxes, setLoading, setError]);

  // Fetch once on mount if we have an account and no inboxes yet
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current && selectedAccountId && inboxes.length === 0) {
      hasMountedRef.current = true;
      fetchInboxes();
    }
  }, [selectedAccountId, inboxes.length, fetchInboxes]);

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

  /**
   * Refresh inboxes (force refetch) - only use when inboxes actually change (rare)
   */
  const refresh = useCallback(() => {
    console.log("[useChatwootInboxes] 🔄 Manual refresh requested");
    return fetchInboxes(true);
  }, [fetchInboxes]);

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

