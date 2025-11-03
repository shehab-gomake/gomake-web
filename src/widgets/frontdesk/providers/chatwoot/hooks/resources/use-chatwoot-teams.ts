/**
 * Chatwoot Teams Hook
 *
 * Unified hook for fetching and managing teams across the application.
 * Implements singleton pattern with cache and deduplication.
 *
 * Usage:
 * ```typescript
 * const { teams, loading, error, refresh } = useChatwootTeams(accountId);
 * ```
 */

import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatwootTeamsAtom,
  chatwootResourceLoadingAtom,
  isCacheValid,
} from "@/store/frontdesk/atoms/chatwoot-shared.atoms";
import { chatwootSelectedAccountAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { chatwootService } from "@/services/frontdesk";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";

export interface UseChatwootTeamsResult {
  teams: Team[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isStale: boolean;
}

/**
 * Hook to fetch and manage teams with caching and deduplication
 *
 * @param accountId - Account ID to fetch teams for (optional, uses selected account if not provided)
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns Teams data, loading state, error, and refresh function
 */
export function useChatwootTeams(
  accountId?: number | null,
  autoFetch: boolean = true
): UseChatwootTeamsResult {
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const effectiveAccountId = accountId ?? selectedAccountId;

  const [teamsState, setTeamsState] = useRecoilState(chatwootTeamsAtom);
  const [resourceLoading, setResourceLoading] = useRecoilState(chatwootResourceLoadingAtom);

  // Check if cache is valid
  const isStale = !isCacheValid(teamsState);

  /**
   * Fetch teams from API
   */
  const fetchTeams = useCallback(
    async (force: boolean = false) => {
      if (!effectiveAccountId) {
        console.warn("[useChatwootTeams] No account ID provided");
        return;
      }

      // Skip if already loading (deduplication)
      if (resourceLoading.teams) {
        console.log("[useChatwootTeams] Already fetching, skipping duplicate request");
        return;
      }

      // Skip if cache is valid and not forced
      if (!force && isCacheValid(teamsState)) {
        console.log("[useChatwootTeams] Using cached teams");
        return;
      }

      // Mark as loading
      setResourceLoading((prev) => ({ ...prev, teams: true }));
      setTeamsState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        console.log(`[useChatwootTeams] Fetching teams for account ${effectiveAccountId}`);
        const teams = await chatwootService.teams.listTeams(effectiveAccountId);

        setTeamsState({
          data: teams,
          loading: false,
          error: null,
          lastFetch: Date.now(),
          ttl: 5 * 60 * 1000, // 5 minutes
        });

        console.log(`[useChatwootTeams] Fetched ${teams.length} teams`);
      } catch (error) {
        console.error("[useChatwootTeams] Failed to fetch teams:", error);
        setTeamsState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error("Failed to fetch teams"),
        }));
      } finally {
        setResourceLoading((prev) => ({ ...prev, teams: false }));
      }
    },
    [effectiveAccountId, resourceLoading.teams, teamsState, setTeamsState, setResourceLoading]
  );

  /**
   * Refresh teams (force refetch)
   */
  const refresh = useCallback(async () => {
    await fetchTeams(true);
  }, [fetchTeams]);

  // Auto-fetch on mount or account change
  useEffect(() => {
    if (autoFetch && effectiveAccountId) {
      fetchTeams();
    }
  }, [effectiveAccountId, autoFetch]); // Only depend on accountId and autoFetch

  return {
    teams: teamsState.data || [],
    loading: teamsState.loading,
    error: teamsState.error,
    refresh,
    isStale,
  };
}
