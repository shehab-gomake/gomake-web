/**
 * Chatwoot Agent Types
 *
 * Type definitions for Chatwoot agents and agent-related operations.
 */

// Agent interface matching Chatwoot API response
export interface Agent {
  id?: number;
  account_id?: number;
  availability_status?: string;
  auto_offline?: boolean;
  confirmed?: boolean;
  email?: string;
  available_name?: string;
  name?: string;
  role?: string;
  thumbnail?: string;
  custom_role_id?: number;
}

// Agent Bot interface
export interface AgentBot {
  id?: number;
  name?: string;
  description?: string;
  thumbnail?: string;
  outgoing_url?: string;
  bot_type?: string;
}

// Agent-specific response wrappers
export interface AgentListResponse {
  data?: { payload?: Agent[] };
  payload?: Agent[];
}

export interface AgentDetailResponse {
  data?: { payload?: Agent };
  payload?: Agent;
}

export interface InboxAgentsResponse {
  payload: Agent[];
}

// Agent availability status type
export type AgentAvailabilityStatus = 'available' | 'busy' | 'offline';

// Agent role type
export type AgentRole = 'agent' | 'administrator';

// Type guard for Agent
export function isAgent(value: unknown): value is Agent {
  if (!value || typeof value !== 'object') return false;
  const agent = value as Agent;
  return (
    typeof agent.id === 'number' ||
    typeof agent.email === 'string' ||
    typeof agent.name === 'string'
  );
}

// Type guard for AgentBot
export function isAgentBot(value: unknown): value is AgentBot {
  if (!value || typeof value !== 'object') return false;
  const bot = value as AgentBot;
  return (
    typeof bot.id === 'number' &&
    typeof bot.name === 'string' &&
    typeof bot.bot_type === 'string'
  );
}
