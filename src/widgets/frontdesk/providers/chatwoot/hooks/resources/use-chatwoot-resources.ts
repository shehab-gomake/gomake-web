/**
 * Chatwoot Resources Hook
 *
 * Combined hook for managing all shared resources (agents, teams, contacts, labels).
 * Provides a single interface to prefetch and refresh all resources.
 *
 * Usage:
 * ```typescript
 * const { agents, teams, loading, refreshAll } = useChatwootResources(accountId);
 * ```
 */

import { useCallback } from "react";
import { useChatwootAgents } from "./use-chatwoot-agents";
import { useChatwootTeams } from "./use-chatwoot-teams";

export interface UseChatwootResourcesResult {
  // Agents
  agents: ReturnType<typeof useChatwootAgents>["agents"];
  agentsLoading: boolean;
  agentsError: Error | null;
  refreshAgents: () => Promise<void>;

  // Teams
  teams: ReturnType<typeof useChatwootTeams>["teams"];
  teamsLoading: boolean;
  teamsError: Error | null;
  refreshTeams: () => Promise<void>;

  // Combined states
  loading: boolean;
  hasError: boolean;
  refreshAll: () => Promise<void>;
}

/**
 * Combined hook for all Chatwoot resources
 *
 * Prefetches agents and teams on account selection for optimal performance.
 * Use this hook at the provider level to ensure resources are available
 * throughout the application.
 *
 * @param accountId - Account ID to fetch resources for
 * @param autoFetch - Whether to automatically fetch on mount (default: true)
 * @returns All resources with loading states and refresh functions
 */
export function useChatwootResources(
  accountId?: number | null,
  autoFetch: boolean = true
): UseChatwootResourcesResult {
  // Fetch agents
  const {
    agents,
    loading: agentsLoading,
    error: agentsError,
    refresh: refreshAgents,
  } = useChatwootAgents(accountId, autoFetch);

  // Fetch teams
  const {
    teams,
    loading: teamsLoading,
    error: teamsError,
    refresh: refreshTeams,
  } = useChatwootTeams(accountId, autoFetch);

  // Combined loading state
  const loading = agentsLoading || teamsLoading;
  const hasError = Boolean(agentsError || teamsError);

  /**
   * Refresh all resources
   */
  const refreshAll = useCallback(async () => {
    await Promise.all([refreshAgents(), refreshTeams()]);
  }, [refreshAgents, refreshTeams]);

  return {
    // Agents
    agents,
    agentsLoading,
    agentsError,
    refreshAgents,

    // Teams
    teams,
    teamsLoading,
    teamsError,
    refreshTeams,

    // Combined
    loading,
    hasError,
    refreshAll,
  };
}
