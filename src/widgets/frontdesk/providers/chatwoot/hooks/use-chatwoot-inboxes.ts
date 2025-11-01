/**
 * useChatwootInboxes Hook
 *
 * Manages inboxes (channels) fetching and state for Chatwoot provider.
 * Inboxes represent different communication channels like Email, WhatsApp, Facebook, etc.
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

export const useChatwootInboxes = () => {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [inboxes, setInboxes] = useRecoilState(chatwootInboxesAtom);
  const [selectedInboxId, setSelectedInboxId] = useRecoilState(chatwootSelectedInboxIdAtom);
  const [loading, setLoading] = useRecoilState(chatwootInboxesLoadingAtom);
  const [error, setError] = useRecoilState(chatwootInboxesErrorAtom);

  // Use base data fetch hook with Recoil state synchronization
  const { data: fetchedInboxes, loading: fetchLoading, error: fetchError, refresh } = useChatwootDataFetch<ChatwootInbox[]>({
    fetchFn: async () => {
      return await chatwootService.inboxes.listAllInboxes();
    },
    extractData: extractPayload,
    autoFetch: true,
    createFilterKey: () => `inboxes-${selectedAccountId}`,
  });

  // Sync fetched data to Recoil state
  useEffect(() => {
    if (fetchedInboxes.length > 0 || inboxes.length === 0) {
      setInboxes(fetchedInboxes);
    }
  }, [fetchedInboxes, setInboxes, inboxes.length]);

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

