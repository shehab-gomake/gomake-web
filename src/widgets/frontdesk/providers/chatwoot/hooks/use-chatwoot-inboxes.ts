/**
 * useChatwootInboxes Hook
 *
 * Manages inboxes (channels) fetching and state for Chatwoot provider.
 * Inboxes represent different communication channels like Email, WhatsApp, Facebook, etc.
 */

import { useEffect, useCallback } from "react";
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

export const useChatwootInboxes = () => {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const [inboxes, setInboxes] = useRecoilState(chatwootInboxesAtom);
  const [selectedInboxId, setSelectedInboxId] = useRecoilState(chatwootSelectedInboxIdAtom);
  const [loading, setLoading] = useRecoilState(chatwootInboxesLoadingAtom);
  const [error, setError] = useRecoilState(chatwootInboxesErrorAtom);

  /**
   * Fetch inboxes for the selected account
   */
  const fetchInboxes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await chatwootService.inboxes.listAllInboxes();
      const inboxesList = response.payload || response.data?.payload || [];
      setInboxes(inboxesList);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to fetch inboxes";
      setError(errorMessage);
      console.error("Error fetching inboxes:", err);
      setInboxes([]);
    } finally {
      setLoading(false);
    }
  }, [setInboxes, setLoading, setError]);

  /**
   * Fetch inboxes on mount
   */
  useEffect(() => {
    fetchInboxes();
  }, [fetchInboxes]);

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
  const selectedInbox = inboxes.find((inbox: ChatwootInbox) => inbox.id === selectedInboxId) || null;

  /**
   * Refresh inboxes
   */
  const refresh = useCallback(() => {
    fetchInboxes();
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

