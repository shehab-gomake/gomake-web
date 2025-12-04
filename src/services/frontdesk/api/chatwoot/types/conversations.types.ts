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
 * Conversation Priority Enum
 * Priority levels for conversations
 */
export enum ConversationPriority {
  URGENT = "urgent",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  NONE = "none",
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
 * Conversation Type Enum
 * Pre-defined filter types that translate to specific backend queries
 */
export enum ConversationType {
  /** Shows conversations that require attention (never replied to OR waiting for contact response) */
  UNATTENDED = "unattended",
  /** Shows conversations where the current user has been mentioned */
  MENTION = "mention",
  /** Shows conversations the user is actively involved in (participating) */
  PARTICIPATING = "participating",
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

  /** Pre-defined conversation type filter (unattended, mention, participating) */
  conversation_type?: ConversationType;

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
  starred?: boolean;
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
      phone_number?: string;
      identifier?: string;
      availability_status?: string;
      blocked?: boolean;
      additional_attributes?: Record<string, any>;
      custom_attributes?: Record<string, any>;
      last_activity_at?: number;
      created_at?: number;
    };
    channel?: string;
    assignee?: {
      id?: number;
      name?: string;
      email?: string;
      thumbnail?: string;
      availability_status?: string;
      account_id?: number;
    } | null;
    team?: {
      id?: number;
      name?: string;
      description?: string;
    } | null;
    hmac_verified?: boolean;
  };
}

/**
 * Chatwoot Email Content Structure
 * How Chatwoot stores email HTML and plain text versions
 * Note: Chatwoot API returns snake_case properties
 */
export interface ChatwootEmailContent {
  /** Email subject line */
  subject?: string;
  /** HTML version of the email */
  html_content?: {
    full?: string;
  };
  /** Plain text version of the email */
  text_content?: {
    full?: string;
  };
}

/**
 * Chatwoot Message Content Attributes
 * Structured data for different message types
 */
export interface ChatwootContentAttributes {
  /** Email-specific content (for Channel::Email messages) */
  email?: ChatwootEmailContent;
  /** Generic HTML content (for backward compatibility) */
  html?: string;
  /** Other dynamic attributes */
  [key: string]: any;
}

/**
 * Chatwoot Attachment
 * Represents a file attachment on a message
 */
export interface ChatwootAttachment {
  id: number;
  message_id: number;
  file_type: "image" | "audio" | "video" | "file" | "location" | "contact" | "fallback";
  account_id: number;
  extension?: string | null;
  data_url: string;
  thumb_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
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
  message_type?: 0 | 1 | 2; // 0: incoming, 1: outgoing, 2: activity
  created_at?: number;
  updated_at?: number;
  /** Private flag - API may return as _private or private */
  _private?: boolean;
  /** Private flag - API may return as _private or private */
  private?: boolean;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  source_id?: string;
  content_type?: string;
  content_attributes?: ChatwootContentAttributes;
  sender_type?: string;
  sender_id?: number;
  sender?: {
    id?: number;
    name?: string;
    email?: string;
    avatar_url?: string;
  };
  /** Message attachments (images, files, etc.) */
  attachments?: ChatwootAttachment[];
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
 * 
 * Note: Chatwoot returns the conversation directly (not wrapped),
 * but we support both formats for compatibility
 */
export interface ConversationDetailResponse extends Partial<ChatwootConversation> {
  data?: ChatwootConversation;
  payload?: ChatwootConversation;
}

/**
 * Response from toggle_status endpoint
 * POST /api/accounts/conversations/{conversation_id}/toggle_status
 */
export interface ConversationStatusToggleResponse {
  meta: Record<string, any>;
  payload: {
    success: boolean;
    current_status: string;
    conversation_id: number;
  };
}
