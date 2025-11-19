/**
 * Agent Helper Utilities
 *
 * Matches Chatwoot's agent helper functions for sorting and filtering agents.
 * Based on: app/javascript/dashboard/helper/agentHelper.js
 */

import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

/**
 * Filters and sorts agents by a specific availability status
 * @param agents - List of agents
 * @param availability - Availability status to filter by ('online', 'busy', 'offline')
 * @returns Filtered and alphabetically sorted list of agents
 */
export const getAgentsByAvailability = (
  agents: Agent[],
  availability: string
): Agent[] => {
  return agents
    .filter((agent) => agent.availability_status === availability)
    .sort((a, b) => {
      const nameA = a.name || a.available_name || '';
      const nameB = b.name || b.available_name || '';
      return nameA.localeCompare(nameB);
    });
};

/**
 * Sorts agents by availability status priority: online → busy → offline
 * Within each availability group, agents are sorted alphabetically by name.
 *
 * This ensures online agents appear first, making it easier to assign
 * active agents to conversations.
 *
 * @param agents - List of agents
 * @returns Sorted list of agents
 *
 * @example
 * ```typescript
 * const sorted = getSortedAgentsByAvailability(agents);
 * // Result: [online agents...], [busy agents...], [offline agents...]
 * ```
 */
export const getSortedAgentsByAvailability = (agents: Agent[]): Agent[] => {
  const onlineAgents = getAgentsByAvailability(agents, 'online');
  const busyAgents = getAgentsByAvailability(agents, 'busy');
  const offlineAgents = getAgentsByAvailability(agents, 'offline');

  return [...onlineAgents, ...busyAgents, ...offlineAgents];
};

/**
 * Updates the availability status of the current user dynamically
 *
 * In Chatwoot, an agent's availability can differ per account.
 * This function ensures the current user's status reflects their
 * availability in the active account context.
 *
 * @param agents - List of agents
 * @param currentUser - Current logged-in user with account-specific availability
 * @param currentAccountId - ID of the current account
 * @returns Updated list of agents with current user's correct availability
 *
 * @example
 * ```typescript
 * const updatedAgents = getAgentsByUpdatedPresence(
 *   agents,
 *   currentUser,
 *   accountId
 * );
 * // Current user's availability will match their account-specific status
 * ```
 */
export const getAgentsByUpdatedPresence = (
  agents: Agent[],
  currentUser: any, // Profile type with accounts array
  currentAccountId: number
): Agent[] => {
  if (!currentUser || !currentUser.accounts || !Array.isArray(currentUser.accounts)) {
    return agents;
  }

  const currentAccount = currentUser.accounts.find(
    (account: any) => account.id === currentAccountId
  );

  if (!currentAccount) {
    return agents;
  }

  return agents.map((agent) =>
    agent.id === currentUser.id
      ? {
          ...agent,
          availability_status: currentAccount.availability_status,
        }
      : agent
  );
};

/**
 * Creates a "None" agent option for unassigning conversations
 *
 * @param t - Translation function (optional)
 * @returns Agent object representing "no assignment"
 */
export const createNoneAgent = (t?: (key: string) => string): Agent => ({
  confirmed: true,
  name: t?.('AGENT_MGMT.MULTI_SELECTOR.LIST.NONE') || 'None',
  id: 0,
  role: 'agent',
  account_id: 0,
  email: 'None',
});

/**
 * Prepares agent list for assignment dropdown
 *
 * Applies all transformations:
 * 1. Updates current user's presence
 * 2. Sorts by availability (online → busy → offline)
 * 3. Optionally adds "None" option at the beginning
 *
 * @param agents - Raw agent list
 * @param currentUser - Current logged-in user
 * @param currentAccountId - Current account ID
 * @param includeNone - Whether to include "None" option (default: false)
 * @param t - Translation function (optional)
 * @returns Fully processed agent list ready for UI
 *
 * @example
 * ```typescript
 * const dropdownAgents = prepareAgentsForAssignment(
 *   rawAgents,
 *   currentUser,
 *   accountId,
 *   true // Include "None" option
 * );
 * // Result: [None, online agents..., busy agents..., offline agents...]
 * ```
 */
export const prepareAgentsForAssignment = (
  agents: Agent[],
  currentUser: any,
  currentAccountId: number,
  includeNone: boolean = false,
  t?: (key: string) => string
): Agent[] => {
  // Step 1: Update current user's presence
  const agentsWithUpdatedPresence = getAgentsByUpdatedPresence(
    agents,
    currentUser,
    currentAccountId
  );

  // Step 2: Sort by availability
  const sortedAgents = getSortedAgentsByAvailability(agentsWithUpdatedPresence);

  // Step 3: Add "None" option if requested
  if (includeNone) {
    return [createNoneAgent(t), ...sortedAgents];
  }

  return sortedAgents;
};
