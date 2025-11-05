/**
 * Filter Utilities
 *
 * Common utilities for working with Chatwoot filters
 */

import {
  ConversationStatus,
  ConversationAssigneeType,
  ConversationSortBy,
  ConversationListParams,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";

/**
 * Get human-readable label for conversation status
 */
export const getConversationStatusLabel = (status: ConversationStatus): string => {
  const labels: Record<ConversationStatus, string> = {
    [ConversationStatus.ALL]: "All",
    [ConversationStatus.OPEN]: "Open",
    [ConversationStatus.RESOLVED]: "Closed",
    [ConversationStatus.PENDING]: "Pending",
    [ConversationStatus.SNOOZED]: "Snoozed",
  };
  return labels[status] || status;
};

/**
 * Get human-readable label for assignee type
 */
export const getAssigneeTypeLabel = (type: ConversationAssigneeType): string => {
  const labels: Record<ConversationAssigneeType, string> = {
    [ConversationAssigneeType.ME]: "Assigned to Me",
    [ConversationAssigneeType.UNASSIGNED]: "Unassigned",
    [ConversationAssigneeType.ALL]: "All",
    [ConversationAssigneeType.ASSIGNED]: "Assigned",
  };
  return labels[type] || type;
};

/**
 * Get human-readable label for sort by option
 */
export const getSortByLabel = (sortBy: ConversationSortBy | string): string => {
  const labels: Record<ConversationSortBy | string, string> = {
    [ConversationSortBy.LAST_ACTIVITY_AT_DESC]: "Last Activity (Newest)",
    [ConversationSortBy.LAST_ACTIVITY_AT_ASC]: "Last Activity (Oldest)",
    [ConversationSortBy.CREATED_AT_DESC]: "Created (Newest)",
    [ConversationSortBy.CREATED_AT_ASC]: "Created (Oldest)",
  };
  return labels[sortBy] || sortBy;
};

/**
 * Check if a conversation matches the status filter
 */
export const matchesStatusFilter = (
  conversationStatus: string,
  filterStatus?: ConversationStatus
): boolean => {
  if (!filterStatus || filterStatus === ConversationStatus.ALL) return true;
  return conversationStatus === filterStatus;
};

/**
 * Create default conversation filters
 */
export const createDefaultConversationFilters = (
  overrides?: Partial<ConversationListParams>
): Partial<ConversationListParams> => {
  return {
    status: ConversationStatus.OPEN,
    assignee_type: ConversationAssigneeType.ME,
    sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
    page: 1,
    limit: 20,
    ...overrides,
  };
};

/**
 * Build conversation filters with inbox_id support
 */
export const buildConversationFilters = (
  selectedInboxId: number | null,
  statusFilter: ConversationStatus,
  assigneeFilter: ConversationAssigneeType,
  overrides?: Partial<ConversationListParams>
): Partial<ConversationListParams> => {
  const baseFilters: Partial<ConversationListParams> = {
    status: statusFilter === ConversationStatus.ALL ? undefined : statusFilter,
    assignee_type: assigneeFilter,
    sort_by: ConversationSortBy.LAST_ACTIVITY_AT_DESC,
    page: 1,
    ...overrides,
  };

  // If an inbox is selected, add inbox_id filter
  if (selectedInboxId) {
    return {
      ...baseFilters,
      inbox_id: selectedInboxId,
    };
  }

  // For "All Conversations" - return base filters without inbox_id
  return baseFilters;
};

/**
 * Create a stable filter key for caching/comparison
 * 
 * Note: When status is undefined (meaning "All"), we explicitly set it to "ALL"
 * to ensure the filter key changes when switching to/from "All" status.
 */
export const createFilterKey = (
  accountId: number | null,
  filters: Partial<ConversationListParams>
): string => {
  return JSON.stringify({
    accountId,
    // Explicitly handle undefined status as "ALL" to ensure filter key changes
    status: filters.status === undefined ? "ALL" : filters.status,
    inbox_id: filters.inbox_id,
    assignee_type: filters.assignee_type,
    sort_by: filters.sort_by,
    q: filters.q,
    team_id: filters.team_id,
    labels: filters.labels,
    limit: filters.limit || 20,
  });
};

