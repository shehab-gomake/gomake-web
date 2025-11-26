/**
 * Chatwoot Team Types
 *
 * Type definitions for Chatwoot teams and team-related operations.
 */

// Team interface matching Chatwoot API response
export interface Team {
  id?: number;
  name?: string;
  description?: string;
  allow_auto_assign?: boolean;
  account_id?: number;
  is_member?: boolean;
  conversations_count?: number;
}

// Team-specific response wrappers
export interface TeamListResponse {
  data?: { payload?: Team[] };
  payload?: Team[];
}

export interface TeamDetailResponse {
  data?: { payload?: Team };
  payload?: Team;
}

// Type guard for Team
export function isTeam(value: unknown): value is Team {
  if (!value || typeof value !== 'object') return false;
  const team = value as Team;
  return (
    typeof team.id === 'number' &&
    typeof team.name === 'string' &&
    typeof team.account_id === 'number'
  );
}

// Helper type for team member operations
export interface TeamMemberPayload {
  user_ids: number[];
}
