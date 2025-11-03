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
   * List Agents for Specific Inbox
   * GET /api/accounts/inbox_members/{inbox_id}
   *
   * Fetches only the agents assigned to a specific inbox.
   * This is useful for showing inbox-specific agent assignments.
   * Note: Does NOT use account ID in URL path (authenticated user's account is used)
   *
   * @param accountId - The numeric ID of the account (kept for compatibility but not used in URL)
   * @param inboxId - The numeric ID of the inbox
   * @returns Promise with array of agents assigned to the inbox
   *
   * @example
   * ```typescript
   * const inboxAgents = await agentsService.listInboxAgents(123, 456);
   * console.log(inboxAgents); // [{ id: 1, name: 'John Doe', ... }]
   * ```
   */
  async listInboxAgents(accountId: number, inboxId: number): Promise<Agent[]> {
    const response = await this.get<GetInboxMembersResponse>(
      `/api/accounts/inbox_members/${inboxId}`
    );

    // The response is wrapped in a `payload` property
    return response.payload || [];
  }
}
