/**
 * Chatwoot Conversation Types
 *
 * Type definitions for conversation-related API requests and responses
 * @see Conversation.md
 */

/**
 * Conversation Status Enum
 * Filter conversations by status
 */
export enum ConversationStatus {
  ALL = "all",
  OPEN = "open",
  RESOLVED = "resolved",
  PENDING = "pending",
  SNOOZED = "snoozed",
}

/**
 * Conversation Assignee Type Enum
 * Filter by assignee
 */
export enum ConversationAssigneeType {
  ME = "me",
  UNASSIGNED = "unassigned",
  ALL = "all",
  ASSIGNED = "assigned",
}

/**
 * Conversation Sort By Options
 * Sort order for conversations
 */
export enum ConversationSortBy {
  LAST_ACTIVITY_AT_DESC = "last_activity_at_desc",
  LAST_ACTIVITY_AT_ASC = "last_activity_at_asc",
  CREATED_AT_DESC = "created_at_desc",
  CREATED_AT_ASC = "created_at_asc",
}

/**
 * Conversation List Query Parameters
 * Query parameters for GET /api/accounts/conversations
 */
export interface ConversationListParams {
  /** Filter conversations by status */
  status?: ConversationStatus | ConversationStatus[];

  /** Filter by assignee */
  assignee_type?: ConversationAssigneeType;

  /** Sort order */
  sort_by?: ConversationSortBy | string;

  /** Page number for pagination (starts at 1) */
  page?: number;

  /** Search query string to filter conversations */
  q?: string;

  /** Filter by specific inbox ID */
  inbox_id?: number;

  /** Filter by specific team ID */
  team_id?: number;

  /** Filter by conversation labels (multiple labels can be passed) */
  labels?: string | string[];

  /** Limit number of results per page */
  limit?: number;
}

/**
 * Chatwoot Conversation
 * Represents a conversation in Chatwoot
 */
export interface ChatwootConversation {
  id?: number;
  messages?: ChatwootMessage[];
  account_id?: number;
  uuid?: string;
  additional_attributes?: Record<string, any>;
  agent_last_seen_at?: number;
  assignee_last_seen_at?: number;
  can_reply?: boolean;
  contact_last_seen_at?: number;
  custom_attributes?: Record<string, any>;
  inbox_id?: number;
  labels?: string[];
  muted?: boolean;
  snoozed_until?: number;
  status?: string;
  created_at?: number;
  updated_at?: number;
  timestamp?: string;
  first_reply_created_at?: number;
  unread_count?: number;
  last_non_activity_message?: ChatwootMessage;
  last_activity_at?: number;
  priority?: string;
  waiting_since?: number;
  sla_policy_id?: number;
  applied_sla?: Record<string, any>;
  sla_events?: Array<Record<string, any>>;
  meta?: {
    sender?: {
      id?: number;
      name?: string;
      email?: string;
      avatar_url?: string;
    };
    channel?: string;
    assignee?: any;
    hmac_verified?: boolean;
  };
}

/**
 * Chatwoot Message (simplified)
 * Used within conversations
 */
export interface ChatwootMessage {
  id?: number;
  content?: string;
  account_id?: number;
  inbox_id?: number;
  conversation_id?: number;
  message_type?: number;
  created_at?: number;
  updated_at?: number;
  _private?: boolean;
  status?: string;
  source_id?: string;
  content_type?: string;
  content_attributes?: Record<string, any>;
  sender_type?: string;
  sender_id?: number;
  sender?: {
    id?: number;
    name?: string;
    email?: string;
    avatar_url?: string;
  };
}

/**
 * Conversation List Response
 * Response structure for list conversations endpoint
 */
export interface ConversationListResponse {
  data?: {
    payload?: ChatwootConversation[];
    meta?: {
      page?: number;
      total_pages?: number;
      total_count?: number;
      count?: number;
      per_page?: number;
      mine_count?: number;
      unassigned_count?: number;
      all_count?: number;
    };
  };
  payload?: ChatwootConversation[];
  meta?: {
    page?: number;
    total_pages?: number;
    total_count?: number;
    count?: number;
    per_page?: number;
    mine_count?: number;
    unassigned_count?: number;
    all_count?: number;
  };
}

/**
 * Conversation Detail Response
 * Response structure for get conversation details endpoint
 */
export interface ConversationDetailResponse {
  data?: ChatwootConversation;
  payload?: ChatwootConversation;
}
