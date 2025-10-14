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
}

// Sort options
export type UnifiedSortBy = 'recent' | 'unread' | 'priority' | 'provider';

export interface UnifiedSortOptions {
  by: UnifiedSortBy;
  direction: 'asc' | 'desc';
}