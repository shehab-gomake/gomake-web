/**
 * Chatwoot Shared Resource Atoms
 *
 * Centralized state management for shared resources that are fetched once
 * and used across multiple components (agents, teams, contacts, labels).
 *
 * Uses RequestState pattern for consistent loading/error handling.
 */

import { atom } from "recoil";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import type { Team } from "@/services/frontdesk/api/chatwoot/types/teams.types";
import type { ContactListItem } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import type { Label } from "@/services/frontdesk/api/chatwoot/types/labels.types";

/**
 * RequestState Pattern
 * Wraps data with loading/error states and cache metadata
 */
export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  lastFetch: number; // Timestamp of last successful fetch
  ttl: number; // Time-to-live in milliseconds
}

/**
 * Creates an initial RequestState with default values
 */
export function createInitialRequestState<T>(ttl: number = 5 * 60 * 1000): RequestState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    lastFetch: 0,
    ttl,
  };
}

/**
 * Check if cached data is still valid
 */
export function isCacheValid<T>(state: RequestState<T>): boolean {
  if (!state.data || state.lastFetch === 0) return false;
  const now = Date.now();
  return now - state.lastFetch < state.ttl;
}

// ============================================================================
// AGENTS STATE
// ============================================================================

/**
 * Agents Atom
 * Stores all agents for the selected account
 * TTL: 5 minutes (agents don't change frequently)
 */
export const chatwootAgentsAtom = atom<RequestState<Agent[]>>({
  key: "frontdesk.chatwoot.agents",
  default: createInitialRequestState<Agent[]>(5 * 60 * 1000),
});

/**
 * Inbox Agents Atom
 * Stores agents per inbox ID (inbox-specific assignments)
 * TTL: 5 minutes (inbox assignments don't change frequently)
 *
 * Pattern: { [inboxId: number]: RequestState<Agent[]> }
 */
export const chatwootInboxAgentsAtom = atom<Record<number, RequestState<Agent[]>>>({
  key: "frontdesk.chatwoot.inboxAgents",
  default: {},
});

// ============================================================================
// TEAMS STATE
// ============================================================================

/**
 * Teams Atom
 * Stores all teams for the selected account
 * TTL: 5 minutes (teams don't change frequently)
 */
export const chatwootTeamsAtom = atom<RequestState<Team[]>>({
  key: "frontdesk.chatwoot.teams",
  default: createInitialRequestState<Team[]>(5 * 60 * 1000),
});

// ============================================================================
// CONTACTS STATE
// ============================================================================

/**
 * Contacts Atom
 * Stores paginated contacts list
 * TTL: 2 minutes (contacts can change more frequently)
 */
export const chatwootContactsAtom = atom<RequestState<ContactListItem[]>>({
  key: "frontdesk.chatwoot.contacts",
  default: createInitialRequestState<ContactListItem[]>(2 * 60 * 1000),
});

/**
 * Contacts Pagination Metadata
 */
export interface ContactsPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export const chatwootContactsPaginationAtom = atom<ContactsPaginationMeta>({
  key: "frontdesk.chatwoot.contacts.pagination",
  default: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },
});

// ============================================================================
// LABELS STATE
// ============================================================================

/**
 * Labels Atom
 * Stores all available labels for the account
 * TTL: 10 minutes (labels rarely change)
 */
export const chatwootLabelsAtom = atom<RequestState<Label[]>>({
  key: "frontdesk.chatwoot.labels",
  default: createInitialRequestState<Label[]>(10 * 60 * 1000),
});

// ============================================================================
// ACCOUNT DATA STATE
// ============================================================================

/**
 * Account-level aggregated data
 * Used for dashboard stats and quick access to counts
 */
export interface AccountData {
  totalAgents: number;
  totalTeams: number;
  totalContacts: number;
  totalLabels: number;
  lastSync: number;
}

export const chatwootAccountDataAtom = atom<RequestState<AccountData>>({
  key: "frontdesk.chatwoot.accountData",
  default: createInitialRequestState<AccountData>(5 * 60 * 1000),
});

// ============================================================================
// RESOURCE LOADING STATE
// ============================================================================

/**
 * Track which resources are currently being fetched
 * Prevents duplicate concurrent requests
 */
export interface ResourceLoadingState {
  agents: boolean;
  inboxAgents?: Record<number, boolean>; // Per-inbox loading state
  teams: boolean;
  contacts: boolean;
  labels: boolean;
}

export const chatwootResourceLoadingAtom = atom<ResourceLoadingState>({
  key: "frontdesk.chatwoot.resourceLoading",
  default: {
    agents: false,
    inboxAgents: {},
    teams: false,
    contacts: false,
    labels: false,
  },
});

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Trigger for manual cache invalidation
 * Increment this value to force refetch of all resources
 */
export const chatwootCacheInvalidationTriggerAtom = atom<number>({
  key: "frontdesk.chatwoot.cacheInvalidationTrigger",
  default: 0,
});
