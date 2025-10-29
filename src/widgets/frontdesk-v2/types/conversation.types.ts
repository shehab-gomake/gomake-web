/**
 * FrontDesk V2 - Conversation Types
 * Based on Chatwoot Swagger DTOs
 */

import { ConversationStatus, ConversationPriority } from './enums';
import { Message } from './message.types';
import { Contact } from './contact.types';
import { Agent } from './agent.types';
import { Team } from './team.types';

export interface Conversation {
  id: number;
  uuid: string;
  account_id: number;
  inbox_id: number;
  
  // Status and Priority
  status: ConversationStatus;
  priority: ConversationPriority | null;
  
  // Timestamps
  created_at: number;
  updated_at: number;
  timestamp: string;
  last_activity_at: number;
  agent_last_seen_at: number;
  assignee_last_seen_at: number;
  contact_last_seen_at: number;
  first_reply_created_at: number | null;
  waiting_since: number | null;
  snoozed_until: number | null;
  
  // Conversation Data
  messages: Message[];
  last_non_activity_message: Message | null;
  unread_count: number;
  labels: string[];
  
  // Attributes
  custom_attributes: Record<string, any>;
  additional_attributes: Record<string, any>;
  
  // State Flags
  can_reply: boolean;
  muted: boolean;
  
  // SLA
  sla_policy_id: number | null;
  applied_sla: Record<string, any> | null;
  sla_events: Array<Record<string, any>>;
  
  // Meta (populated on frontend)
  meta?: {
    sender: Contact;
    assignee: Agent | null;
    team: Team | null;
  };
}

export interface ConversationListItem {
  id: number;
  uuid: string;
  status: ConversationStatus;
  priority: ConversationPriority | null;
  inbox_id: number;
  unread_count: number;
  last_activity_at: number;
  timestamp: string;
  labels: string[];
  muted: boolean;
  last_non_activity_message: Message | null;
  meta: {
    sender: Contact;
    assignee: Agent | null;
    team: Team | null;
  };
}

export interface ConversationFilters {
  status: ConversationStatus | 'all';
  assigneeType: 'me' | 'unassigned' | 'all';
  inboxId: number | null;
  teamId: number | null;
  labels: string[];
  sortBy: string;
}

export interface ConversationMeta {
  mine_count: number;
  unassigned_count: number;
  all_count: number;
  assignee_id?: number;
}

export interface ConversationPayload {
  inbox_id: number;
  contact_id?: number;
  additional_attributes?: Record<string, any>;
  custom_attributes?: Record<string, any>;
  status?: ConversationStatus;
  assignee_id?: number;
  team_id?: number;
  message?: {
    content: string;
    private: boolean;
  };
}

export interface ConversationUpdatePayload {
  status?: ConversationStatus;
  assignee_id?: number | null;
  team_id?: number | null;
  priority?: ConversationPriority | null;
  snoozed_until?: number | null;
  custom_attributes?: Record<string, any>;
}
