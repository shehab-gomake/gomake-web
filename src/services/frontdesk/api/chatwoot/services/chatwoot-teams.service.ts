/**
 * Chatwoot Teams Service
 *
 * Handles all team-related endpoints for fetching available teams
 * in an account.
 *
 * @see Chatwoot API Guide - TeamsApi
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import { Agent } from "./chatwoot-agents.service";

/**
 * Team interface matching Chatwoot API response
 */
export interface Team {
  id?: number;                    // Team ID
  name?: string;                  // Team name
  description?: string;           // Team description
  allow_auto_assign?: boolean;    // Auto-assign conversations to agents
  account_id?: number;            // Account ID
  is_member?: boolean;            // Current user is member
}

/**
 * ChatwootTeamsService
 * Handles team-related API operations
 *
 * @example
 * ```typescript
 * const teamsService = new ChatwootTeamsService();
 *
 * // List all teams in account
 * const teams = await teamsService.listTeams(accountId);
 *
 * // Get team details
 * const team = await teamsService.getTeam(accountId, teamId);
 *
 * // Get team members
 * const members = await teamsService.getTeamMembers(accountId, teamId);
 * ```
 */
export class ChatwootTeamsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * List All Teams in Account
   * GET /api/accounts/teams
   *
   * Fetches all teams in the account.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @returns Promise with array of teams
   *
   * @example
   * ```typescript
   * const teams = await teamsService.listTeams(123);
   * console.log(teams); // [{ id: 1, name: 'Support Team', ... }]
   * ```
   */
  async listTeams(accountId: number): Promise<Team[]> {
    return await this.get<Team[]>("/api/accounts/teams");
  }

  /**
   * Get Single Team Details
   * GET /api/accounts/teams/{team_id}
   *
   * Fetches details for a specific team.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param teamId - The numeric ID of the team
   * @returns Promise with team details
   *
   * @example
   * ```typescript
   * const team = await teamsService.getTeam(123, 456);
   * console.log(team); // { id: 456, name: 'Support Team', ... }
   * ```
   */
  async getTeam(accountId: number, teamId: number): Promise<Team> {
    return await this.get<Team>(`/api/accounts/teams/${teamId}`);
  }

  /**
   * Get Team Members (Agents in Team)
   * GET /api/accounts/teams/{team_id}/team_members
   *
   * Fetches all agents that are members of the specified team.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param teamId - The numeric ID of the team
   * @returns Promise with array of agents
   *
   * @example
   * ```typescript
   * const members = await teamsService.getTeamMembers(123, 456);
   * console.log(members); // [{ id: 1, name: 'John Doe', ... }]
   * ```
   */
  async getTeamMembers(accountId: number, teamId: number): Promise<Agent[]> {
    return await this.get<Agent[]>(`/api/accounts/teams/${teamId}/team_members`);
  }
}
