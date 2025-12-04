/**
 * Chatwoot Teams Service
 *
 * Handles all team-related endpoints for creating, fetching, and managing teams
 * in an account.
 *
 * @see Chatwoot API Guide - TeamsApi
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";
import { Agent } from "./chatwoot-agents.service";

/**
 * Team interface matching Chatwoot API response
 * 
 * Note: GoMake always disables auto-assignment for teams (allow_auto_assign is always false).
 */
export interface Team {
  id?: number;                    // Team ID
  name?: string;                  // Team name
  description?: string;           // Team description
  allow_auto_assign?: boolean;    // Auto-assign conversations (GoMake always sets this to false)
  account_id?: number;            // Account ID
  is_member?: boolean;            // Current user is member
}

/**
 * Request payload for creating or updating a team
 * 
 * Note: GoMake always disables auto-assignment for teams. The allow_auto_assign
 * field should always be set to false when creating or updating teams.
 */
export interface TeamCreateUpdatePayload {
  name: string;                   // Team name (required, unique per account)
  description?: string;           // Team description (optional)
  allow_auto_assign?: boolean;    // Auto-assign conversations to agents (GoMake always sets this to false)
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

  /**
   * Create a New Team
   * POST /api/accounts/teams
   *
   * Creates a new team in the account.
   * Note: Account context comes from JWT Bearer token, not URL path
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param payload - Team creation payload (name is required)
   * @returns Promise with created team details
   *
   * @example
   * ```typescript
   * // Note: GoMake always disables auto-assignment for teams
   * const newTeam = await teamsService.createTeam(123, {
   *   name: "Support Team",
   *   description: "Handles customer support inquiries",
   *   allow_auto_assign: false
   * });
   * console.log(newTeam); // { id: 789, name: 'support team', ... }
   * ```
   *
   * @throws Error if team name is missing or already exists in account
   */
  async createTeam(
    accountId: number,
    payload: TeamCreateUpdatePayload
  ): Promise<Team> {
    return await this.post<Team>("/api/accounts/teams", payload);
  }

  /**
   * Update a Team
   * PATCH /api/accounts/teams/{team_id}
   *
   * Updates an existing team's details.
   * Note: Account context comes from JWT Bearer token, not URL path
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param teamId - The numeric ID of the team to update
   * @param payload - Team update payload
   * @returns Promise with updated team details
   *
   * @example
   * ```typescript
   * const updated = await teamsService.updateTeam(123, 456, {
   *   name: "Updated Team Name",
   *   description: "New description"
   * });
   * ```
   */
  async updateTeam(
    accountId: number,
    teamId: number,
    payload: TeamCreateUpdatePayload
  ): Promise<Team> {
    return await this.patch<Team>(`/api/accounts/teams/${teamId}`, payload);
  }

  /**
   * Delete a Team
   * DELETE /api/accounts/teams/{team_id}
   *
   * Permanently deletes a team from the account.
   * Note: Account context comes from JWT Bearer token, not URL path
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param teamId - The numeric ID of the team to delete
   * @returns Promise with void
   *
   * @example
   * ```typescript
   * await teamsService.deleteTeam(123, 456);
   * ```
   */
  async deleteTeam(accountId: number, teamId: number): Promise<void> {
    return await this.delete<void>(`/api/accounts/teams/${teamId}`);
  }

  /**
   * Add Agents to Team
   * POST /api/accounts/teams/{team_id}/team_members
   *
   * Adds one or more agents to a team.
   * Note: Account context comes from JWT Bearer token, not URL path
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param teamId - The numeric ID of the team
   * @param agentIds - Array of agent IDs to add to the team
   * @returns Promise with updated team members list
   *
   * @example
   * ```typescript
   * await teamsService.addTeamMembers(123, 456, [10, 20, 30]);
   * ```
   */
  async addTeamMembers(
    accountId: number,
    teamId: number,
    agentIds: number[]
  ): Promise<Agent[]> {
    return await this.post<Agent[]>(
      `/api/accounts/teams/${teamId}/team_members`,
      { user_ids: agentIds }
    );
  }

  /**
   * Remove Agent from Team
   * DELETE /api/accounts/teams/{team_id}/team_members/{agent_id}
   *
   * Removes a specific agent from a team.
   * Note: Account context comes from JWT Bearer token, not URL path
   *
   * @param accountId - The numeric ID of the account (not used in URL, kept for compatibility)
   * @param teamId - The numeric ID of the team
   * @param agentId - The numeric ID of the agent to remove
   * @returns Promise with void
   *
   * @example
   * ```typescript
   * await teamsService.removeTeamMember(123, 456, 789);
   * ```
   */
  async removeTeamMember(
    accountId: number,
    teamId: number,
    agentId: number
  ): Promise<void> {
    return await this.delete<void>(
      `/api/accounts/teams/${teamId}/team_members/${agentId}`
    );
  }
}
