/**
 * Kanban Board Types for FrontDesk Chatwoot Conversations
 * 
 * Defines types for the Kanban board visualization of Chatwoot conversations.
 * Supports both status-based and assignee-based views.
 * 
 * Uses existing Chatwoot conversation types and design system tokens.
 */

import { 
  ChatwootConversation, 
  ConversationStatus, 
  ConversationPriority 
} from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';

// ============================================
// View Mode Types
// ============================================

/**
 * Kanban view mode - determines how columns are organized
 * - 'status': Columns represent conversation statuses (open, pending, resolved)
 * - 'assignee': Columns represent agents/team members
 */
export type KanbanViewMode = 'status' | 'assignee';

// ============================================
// Column Types
// ============================================

/**
 * Status column configuration
 */
export interface StatusColumnConfig {
  status: ConversationStatus;
  title: string;
  order: number;
}

/**
 * Generic kanban column for conversations
 */
export interface KanbanConversationColumn {
  id: string;
  title: string;
  conversations: ChatwootConversation[];
  count: number;
  // For status view
  status?: ConversationStatus;
  // For assignee view
  assignee?: {
    id: number | null;
    name: string;
    email?: string;
    thumbnail?: string;
  } | null;
  // Workload info (for assignee columns)
  workload?: {
    openCount: number;
    totalCount: number;
    loadLevel: 'low' | 'medium' | 'high';
  };
}

// ============================================
// Filter Types
// ============================================

/**
 * Kanban board filters
 */
export interface KanbanConversationFilters {
  priority?: ConversationPriority;
  inboxId?: number;
  labels?: string[];
  search?: string;
  teamId?: number;
  /** Filter by assignee - use 'unassigned' for unassigned conversations, or agent ID */
  assigneeId?: number | 'unassigned';
  /** Filter by specific statuses (e.g., show only open and pending) */
  statuses?: ConversationStatus[];
}

// ============================================
// Board State Types
// ============================================

/**
 * Kanban board state
 */
export interface KanbanBoardState {
  viewMode: KanbanViewMode;
  columns: KanbanConversationColumn[];
  filters: KanbanConversationFilters;
  isLoading: boolean;
  error: string | null;
  agents: Agent[];
  agentsLoading: boolean;
}

// ============================================
// Status Column Configuration
// ============================================

/**
 * Conversation status column configurations
 * Matches Chatwoot ConversationStatus enum (excluding snoozed)
 */
export const CONVERSATION_STATUS_COLUMNS: StatusColumnConfig[] = [
  { status: ConversationStatus.OPEN, title: 'Open', order: 0 },
  { status: ConversationStatus.PENDING, title: 'Pending', order: 1 },
  { status: ConversationStatus.RESOLVED, title: 'Resolved', order: 2 },
];

/**
 * Status to display name mapping (for workboard - excludes snoozed)
 */
export const STATUS_DISPLAY_NAMES: Partial<Record<ConversationStatus, string>> = {
  [ConversationStatus.ALL]: 'All',
  [ConversationStatus.OPEN]: 'Open',
  [ConversationStatus.PENDING]: 'Pending',
  [ConversationStatus.RESOLVED]: 'Resolved',
};

// ============================================
// Workload Thresholds
// ============================================

/**
 * Workload level thresholds for agents
 */
export const WORKLOAD_THRESHOLDS = {
  low: 5,    // 0-5 open conversations = low load
  medium: 10, // 6-10 open conversations = medium load
  // > 10 = high load
} as const;

/**
 * Get workload level from open conversation count
 */
export const getWorkloadLevel = (openCount: number): 'low' | 'medium' | 'high' => {
  if (openCount <= WORKLOAD_THRESHOLDS.low) return 'low';
  if (openCount <= WORKLOAD_THRESHOLDS.medium) return 'medium';
  return 'high';
};

// ============================================
// Drag Result Types
// ============================================

/**
 * Drag result for status view
 */
export interface StatusDragResult {
  conversationId: number;
  sourceStatus: ConversationStatus;
  destinationStatus: ConversationStatus;
}

/**
 * Drag result for assignee view
 */
export interface AssigneeDragResult {
  conversationId: number;
  sourceAssigneeId: number | null;
  destinationAssigneeId: number | null;
}
