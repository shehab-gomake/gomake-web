/**
 * Chatwoot Settings Types
 *
 * Type definitions specific to the Chatwoot settings pages.
 * These types extend or complement the main Chatwoot API types.
 */

/**
 * Settings subpage identifier
 * Corresponds to the ChatwootSettingsSubpage enum in routing/types.ts
 */
export enum SettingsSubpage {
  GENERAL = "general",
  AGENTS = "agents",
  INBOXES = "inboxes",
  TEAMS = "teams",
  LABELS = "labels",
  PROFILE = "profile",
}

/**
 * Base interface for settings sections
 */
export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  enabled: boolean;
}

/**
 * Agent settings specific types
 * Extends the Agent type from agents.types.ts
 */
export interface AgentWithStats {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  availability_status?: string;
  assigned_conversations_count?: number;
  resolved_conversations_count?: number;
  teams?: Array<{ id: number; name: string }>;
}

/**
 * Inbox settings specific types
 * Extends the Inbox type from inboxes.types.ts
 */
export interface InboxWithDetails {
  id: number;
  name: string;
  channel_type: string;
  enabled: boolean;
  agent_count?: number;
  conversation_count?: number;
  configuration?: Record<string, any>;
}

/**
 * Team settings specific types
 * Extends the Team type from teams.types.ts
 */
export interface TeamWithMembers {
  id: number;
  name: string;
  description?: string;
  member_count?: number;
  members?: Array<{ id: number; name: string; email: string }>;
  assigned_conversations_count?: number;
}

/**
 * Label settings specific types
 * Note: Labels API is not yet implemented
 */
export interface LabelSettings {
  id: number;
  title: string;
  description?: string;
  color: string;
  show_on_sidebar?: boolean;
  usage_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * General settings (account-level) types
 */
export interface GeneralSettings {
  account_id: number;
  account_name: string;
  language?: string;
  timezone?: string;
  business_hours?: {
    enabled: boolean;
    schedule?: Record<string, any>;
  };
  auto_assignment?: {
    enabled: boolean;
    rules?: Array<any>;
  };
  features?: {
    csat_enabled?: boolean;
    labels_enabled?: boolean;
    teams_enabled?: boolean;
  };
}

/**
 * Profile settings types
 * Extends the ChatwootUser type from profile.types.ts
 */
export interface ProfileSettings {
  user_id: number;
  name: string;
  email: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  notifications?: {
    email_enabled?: boolean;
    push_enabled?: boolean;
    sound_enabled?: boolean;
  };
  preferences?: {
    language?: string;
    timezone?: string;
    theme?: "light" | "dark" | "auto";
  };
}

/**
 * Settings form state types
 */
export interface SettingsFormState<T = any> {
  data: T;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

/**
 * Settings action result
 */
export interface SettingsActionResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}
