/**
 * Chatwoot Inbox Agents Hook
 *
 * Fetches agents specific to an inbox with verified filter and caching.
 * This is used for assignment operations to show only relevant agents.
 *
 * Pattern from Chatwoot reference: Uses assignable_agents endpoint filtered by inbox.
 * Our implementation uses inbox_members endpoint which returns similar data.
 *
 * Production-ready: Prevents duplicate concurrent requests with per-inbox guards.
 *
 * Usage:
 * ```typescript
 * const { agents, loading, error, refresh } = useChatwootInboxAgents(accountId, inboxId);
 * // agents will only contain verified agents assigned to this inbox
 * ```
 */

import { useCallback, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatwootInboxAgentsAtom,
  chatwootResourceLoadingAtom,
  isCacheValid,
} from "@/store/frontdesk/atoms/chatwoot-shared.atoms";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { chatwootService } from "@/services/frontdesk";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

// Per-inbox fetch guards to prevent duplicate concurrent requests
const inboxFetchGuards = new Map<number, boolean>();

export interface UseChatwootInboxAgentsResult {
  agents: Agent[];
  verifiedAgents: Agent[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook to fetch and manage inbox-specific agents with caching and deduplication
 *
 * @param accountId - Account ID to fetch agents for (optional, uses selected account if not provided)
 * @param inboxId - Inbox ID to fetch agents for (required)
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns Inbox agents data, loading state, error, and refresh function
 */
export function useChatwootInboxAgents(
  accountId?: number | null,
  inboxId?: number | null,
  autoFetch: boolean = true
): UseChatwootInboxAgentsResult {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const effectiveAccountId = accountId ?? selectedAccountId;

  const [inboxAgentsState, setInboxAgentsState] = useRecoilState(chatwootInboxAgentsAtom);
  const [resourceLoading, setResourceLoading] = useRecoilState(chatwootResourceLoadingAtom);

  // Get agents for this specific inbox
  const inboxAgents = inboxId ? inboxAgentsState[inboxId] : undefined;

  // Check if cache is valid for this inbox
  const isStale = !inboxAgents || !isCacheValid(inboxAgents);

  /**
   * Fetch inbox agents from API with per-inbox deduplication
   */
  const fetchInboxAgents = useCallback(
    async (force: boolean = false) => {
      if (!effectiveAccountId || !inboxId) {
        console.warn("[useChatwootInboxAgents] Missing account ID or inbox ID");
        return;
      }

      // Per-inbox deduplication guard
      if (inboxFetchGuards.get(inboxId)) {
        console.log(`[useChatwootInboxAgents] ⏭️ Fetch for inbox ${inboxId} already in progress, skipping duplicate`);
        return;
      }

      // Skip if already loading for this inbox
      if (resourceLoading.inboxAgents?.[inboxId]) {
        console.log(`[useChatwootInboxAgents] ⏭️ Already fetching for inbox ${inboxId}, skipping duplicate request`);
        return;
      }

      // Skip if cache is valid and not forced
      if (!force && inboxAgents && isCacheValid(inboxAgents)) {
        console.log(`[useChatwootInboxAgents] Using cached agents for inbox ${inboxId}`);
        return;
      }

      // Mark as loading (both guard and Recoil)
      inboxFetchGuards.set(inboxId, true);
      setResourceLoading((prev) => ({
        ...prev,
        inboxAgents: {
          ...prev.inboxAgents,
          [inboxId]: true,
        },
      }));

      setInboxAgentsState((prev) => ({
        ...prev,
        [inboxId]: {
          ...prev[inboxId],
          loading: true,
          error: null,
        },
      }));

      try {
        console.log(`[useChatwootInboxAgents] 🚀 Fetching agents for inbox ${inboxId} in account ${effectiveAccountId}`);
        const agents = await chatwootService.agents.listInboxAgents(effectiveAccountId, inboxId);

        setInboxAgentsState((prev) => ({
          ...prev,
          [inboxId]: {
            data: agents,
            loading: false,
            error: null,
            lastFetch: Date.now(),
            ttl: 5 * 60 * 1000, // 5 minutes
          },
        }));

        console.log(`[useChatwootInboxAgents] Fetched ${agents.length} agents for inbox ${inboxId}`);
      } catch (error) {
        console.error(`[useChatwootInboxAgents] Failed to fetch agents for inbox ${inboxId}:`, error);
        setInboxAgentsState((prev) => ({
          ...prev,
          [inboxId]: {
            ...prev[inboxId],
            loading: false,
            error: error instanceof Error ? error : new Error("Failed to fetch inbox agents"),
          },
        }));
      } finally {
        inboxFetchGuards.delete(inboxId);
        setResourceLoading((prev) => ({
          ...prev,
          inboxAgents: {
            ...prev.inboxAgents,
            [inboxId]: false,
          },
        }));
      }
    },
    [effectiveAccountId, inboxId, resourceLoading.inboxAgents, inboxAgents, setInboxAgentsState, setResourceLoading]
  );

  /**
   * Refresh inbox agents (force refetch)
   */
  const refresh = useCallback(async () => {
    await fetchInboxAgents(true);
  }, [fetchInboxAgents]);

  // Auto-fetch on mount or when account/inbox changes
  useEffect(() => {
    if (autoFetch && effectiveAccountId && inboxId) {
      fetchInboxAgents();
    }
  }, [effectiveAccountId, inboxId, autoFetch]); // Only depend on IDs and autoFetch

  /**
   * Filter to only verified agents (confirmed: true)
   * This matches Chatwoot's pattern of showing only confirmed agents in assignment UI
   */
  const verifiedAgents = useMemo(() => {
    const agents = inboxAgents?.data || [];
    return agents.filter((agent) => agent.confirmed === true);
  }, [inboxAgents?.data]);

  return {
    agents: inboxAgents?.data || [],
    verifiedAgents,
    loading: inboxAgents?.loading || false,
    error: inboxAgents?.error || null,
    refresh,
    isStale,
  };
}
