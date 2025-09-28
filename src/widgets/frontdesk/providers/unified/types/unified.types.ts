import { Message, BaseConversation } from '../../base/provider.interface';

// Unified conversation type that aggregates from all providers
export interface UnifiedConversation extends BaseConversation {
  provider: 'email' | 'whatsapp' | 'internal';
  providerIcon?: React.ReactNode;
  originalId: string; // Original ID from the provider
  accountId?: string; // For multi-account providers
  accountName?: string;
  // Additional unified fields
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  assignee?: string;
  
  // Ticket-specific fields
  ticketId?: string;
  ticketNumber?: number;
  ticketStatus?: 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
  assigneeName?: string;
  assigneeId?: string;
  managerId?: string;
  categoryId?: string;
  categoryName?: string;
  sla?: {
    firstResponseDue?: string;
    resolutionDue?: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    breached: boolean;
    status: 'normal' | 'at-risk' | 'breached';
  };
  ticketTags?: string[];
  reopenCount?: number;
  isTicket?: boolean; // Flag to identify ticket conversations
}

// Unified message type with provider information
export interface UnifiedMessage extends Message {
  provider: 'email' | 'whatsapp' | 'internal';
  providerSpecificData?: any; // Provider-specific metadata
}

// Aggregation result
export interface AggregationResult {
  conversations: UnifiedConversation[];
  totalCount: number;
  unreadCount: number;
  byProvider: {
    email: number;
    whatsapp: number;
    internal: number;
  };
}

// Filter options for unified view
export interface UnifiedFilters {
  providers?: Array<'email' | 'whatsapp' | 'internal'>;
  unreadOnly?: boolean;
  assigned?: boolean;
  priority?: 'high' | 'medium' | 'low';
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  
  // Ticket-specific filters
  ticketStatus?: Array<'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED'>;
  unassigned?: boolean; // Quick filter for unassigned tickets
  assigneeId?: string;
  showClosed?: boolean; // Whether to include closed tickets
  slaBreached?: boolean; // Filter for SLA breached tickets
  ticketsOnly?: boolean; // Show only ticket conversations
}

// Sort options
export type UnifiedSortBy = 'recent' | 'unread' | 'priority' | 'provider' | 'sla' | 'status' | 'ticketNumber';

export interface UnifiedSortOptions {
  by: UnifiedSortBy;
  direction: 'asc' | 'desc';
}

// Ticket-specific types
export type TicketStatus = 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SLAStatus = 'normal' | 'at-risk' | 'breached';

export interface TicketSLA {
  firstResponseDue?: string;
  resolutionDue?: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  breached: boolean;
  status: SLAStatus;
}

export interface TicketAssignee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  priority?: TicketPriority;
  description?: string;
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  action: 'created' | 'assigned' | 'status_changed' | 'priority_changed' | 'note_added' | 'replied';
  oldValue?: string;
  newValue?: string;
  note?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

// Ticket action types for hooks
export interface TicketActions {
  assign: (ticketId: string, assigneeId: string) => Promise<void>;
  updateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  updatePriority: (ticketId: string, priority: TicketPriority) => Promise<void>;
  addNote: (ticketId: string, note: string) => Promise<void>;
  reply: (ticketId: string, content: string) => Promise<void>;
  addTag: (ticketId: string, tag: string) => Promise<void>;
  removeTag: (ticketId: string, tag: string) => Promise<void>;
  merge: (sourceTicketId: string, targetTicketId: string) => Promise<void>;
  reopen: (ticketId: string) => Promise<void>;
}
