/**
 * Chatwoot Agents Hook
 *
 * Unified hook for fetching and managing agents across the application.
 * Implements singleton pattern with cache and deduplication.
 *
 * Usage:
 * ```typescript
 * const { agents, loading, error, refresh } = useChatwootAgents(accountId);
 * ```
 */

import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatwootAgentsAtom,
  chatwootResourceLoadingAtom,
  isCacheValid,
  type RequestState,
} from "@/store/frontdesk/atoms/chatwoot-shared.atoms";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { chatwootService } from "@/services/frontdesk";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

export interface UseChatwootAgentsResult {
  agents: Agent[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook to fetch and manage agents with caching and deduplication
 *
 * @param accountId - Account ID to fetch agents for (optional, uses selected account if not provided)
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns Agents data, loading state, error, and refresh function
 */
export function useChatwootAgents(
  accountId?: number | null,
  autoFetch: boolean = true
): UseChatwootAgentsResult {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const effectiveAccountId = accountId ?? selectedAccountId;

  const [agentsState, setAgentsState] = useRecoilState(chatwootAgentsAtom);
  const [resourceLoading, setResourceLoading] = useRecoilState(chatwootResourceLoadingAtom);

  // Check if cache is valid
  const isStale = !isCacheValid(agentsState);

  /**
   * Fetch agents from API
   */
  const fetchAgents = useCallback(
    async (force: boolean = false) => {
      if (!effectiveAccountId) {
        console.warn("[useChatwootAgents] No account ID provided");
        return;
      }

      // Skip if already loading (deduplication)
      if (resourceLoading.agents) {
        console.log("[useChatwootAgents] Already fetching, skipping duplicate request");
        return;
      }

      // Skip if cache is valid and not forced
      if (!force && isCacheValid(agentsState)) {
        console.log("[useChatwootAgents] Using cached agents");
        return;
      }

      // Mark as loading
      setResourceLoading((prev) => ({ ...prev, agents: true }));
      setAgentsState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        console.log(`[useChatwootAgents] Fetching agents for account ${effectiveAccountId}`);
        const agents = await chatwootService.agents.listAgents(effectiveAccountId);

        setAgentsState({
          data: agents,
          loading: false,
          error: null,
          lastFetch: Date.now(),
          ttl: 5 * 60 * 1000, // 5 minutes
        });

        console.log(`[useChatwootAgents] Fetched ${agents.length} agents`);
      } catch (error) {
        console.error("[useChatwootAgents] Failed to fetch agents:", error);
        setAgentsState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error("Failed to fetch agents"),
        }));
      } finally {
        setResourceLoading((prev) => ({ ...prev, agents: false }));
      }
    },
    [effectiveAccountId, resourceLoading.agents, agentsState, setAgentsState, setResourceLoading]
  );

  /**
   * Refresh agents (force refetch)
   */
  const refresh = useCallback(async () => {
    await fetchAgents(true);
  }, [fetchAgents]);

  // Auto-fetch on mount or account change
  useEffect(() => {
    if (autoFetch && effectiveAccountId) {
      fetchAgents();
    }
  }, [effectiveAccountId, autoFetch]); // Only depend on accountId and autoFetch, not fetchAgents

  return {
    agents: agentsState.data || [],
    loading: agentsState.loading,
    error: agentsState.error,
    refresh,
    isStale,
  };
}
