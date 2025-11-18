/**
 * Chatwoot Agents Service
 *
 * Handles all agent-related endpoints for fetching available agents
 * in an account or inbox.
 *
 * @see Chatwoot API Guide - AgentsApi, InboxesApi
 */

import { BaseChatwootService } from "../core/base-chatwoot-service";

/**
 * Agent interface matching Chatwoot API response
 */
export interface Agent {
  id?: number;
  account_id?: number;
  availability_status?: string;  // Computed by Chatwoot
  auto_offline?: boolean;        // Auto-offline when away
  confirmed?: boolean;           // Email confirmed
  email?: string;
  available_name?: string;
  name?: string;
  role?: string;
  thumbnail?: string;
  custom_role_id?: number;
}

/**
 * Response structure for inbox members endpoint
 */
export interface GetInboxMembersResponse {
  payload: Agent[];
}

/**
 * Agent update payload for PATCH operations
 */
export interface AgentUpdatePayload {
  name?: string;                   // Optional: agent's display name
  role: string;                    // Required: "administrator" or "agent"
  availability_status?: string;    // Optional: "available", "busy", or "offline"
  auto_offline?: boolean;          // Optional: auto-offline when away
}

/**
 * ChatwootAgentsService
 * Handles agent-related API operations
 *
 * @example
 * ```typescript
 * const agentsService = new ChatwootAgentsService();
 *
 * // List all agents in account
 * const agents = await agentsService.listAgents(accountId);
 *
 * // List agents for specific inbox
 * const inboxAgents = await agentsService.listInboxAgents(accountId, inboxId);
 * ```
 */
export class ChatwootAgentsService extends BaseChatwootService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }

  /**
   * List All Agents in Account
   * GET /api/accounts/agents
   *
   * Fetches all agents in the account regardless of inbox assignments.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @returns Promise with array of agents
   *
   * @example
   * ```typescript
   * const agents = await agentsService.listAgents(123);
   * console.log(agents); // [{ id: 1, name: 'John Doe', email: 'john@example.com', ... }]
   * ```
   */
  async listAgents(accountId: number): Promise<Agent[]> {
    return await this.get<Agent[]>("/api/accounts/agents");
  }

  /**
   * List Assignable Agents for Inbox
   * GET /api/accounts/assignable_agents?inbox_ids[]={inbox_id}
   *
   * Fetches agents who can be assigned to conversations in a specific inbox.
   * This includes inbox members PLUS all account administrators.
   * This matches Chatwoot's frontend behavior for assignment dropdowns.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with array of agents who can be assigned (inbox members + admins)
   *
   * @example
   * ```typescript
   * const assignableAgents = await agentsService.listInboxAgents(123, 456);
   * console.log(assignableAgents); // [{ id: 1, name: 'Agent', ... }, { id: 2, name: 'Admin', ... }]
   * ```
   */
  async listInboxAgents(accountId: number, inboxId: number): Promise<Agent[]> {
    // Use assignable_agents endpoint which includes inbox members + administrators
    // This matches Chatwoot's frontend behavior
    const response = await this.get<GetInboxMembersResponse>(
      `/api/accounts/assignable_agents?inbox_ids[]=${inboxId}`
    );

    // The response is wrapped in a `payload` property
    return response.payload || [];
  }

  /**
   * Update Agent
   * PATCH /api/accounts/agents/{id}
   *
   * Updates an agent's role, availability status, and auto-offline settings.
   * Only administrators can update agent information.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param agentId - The numeric ID of the agent to update
   * @param payload - Agent update data (role, availability_status, auto_offline)
   * @returns Promise with updated agent data
   *
   * @example
   * ```typescript
   * const updatedAgent = await agentsService.updateAgent(123, 456, {
   *   role: 'administrator',
   *   availability_status: 'available',
   *   auto_offline: true
   * });
   * ```
   */
  async updateAgent(
    accountId: number,
    agentId: number,
    payload: AgentUpdatePayload
  ): Promise<Agent> {
    return await this.patch<Agent>(
      `/api/accounts/agents/${agentId}`,
      payload
    );
  }

  /**
   * Delete Agent
   * DELETE /api/accounts/agents/{id}
   *
   * Removes an agent from the account.
   * Only administrators can delete agents.
   * The agent's assigned conversations will be unassigned.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param agentId - The numeric ID of the agent to delete
   * @returns Promise that resolves when deletion is complete
   *
   * @example
   * ```typescript
   * await agentsService.deleteAgent(123, 456);
   * console.log('Agent deleted successfully');
   * ```
   */
  async deleteAgent(accountId: number, agentId: number): Promise<void> {
    return await this.delete(`/api/accounts/agents/${agentId}`);
  }

  /**
   * Add Agents to Inbox
   * POST /api/accounts/inbox_members
   *
   * Assigns multiple agents to an inbox.
   * This is required for newly created inboxes to become operational.
   * At least one agent must be assigned for the inbox to handle messages.
   *
   * @param inboxId - The numeric ID of the inbox
   * @param agentIds - Array of agent IDs to assign to the inbox
   * @returns Promise that resolves when agents are assigned
   *
   * @example
   * ```typescript
   * // Assign agents to inbox after OAuth
   * await agentsService.addAgentsToInbox(7, [1, 2, 3]);
   * console.log('Agents assigned to inbox successfully');
   * ```
   */
  async addAgentsToInbox(inboxId: number, agentIds: number[]): Promise<void> {
    return await this.post<void>("/api/accounts/inbox_members", {
      inbox_id: inboxId,
      user_ids: agentIds,
    });
  }
}
