import { UnifiedConversation, UnifiedFilters, UnifiedSortOptions, AggregationResult } from '../types/unified.types';
import { BaseConversation } from '../../base/provider.interface';

// Provider icons (these would be actual icon components in production)
const PROVIDER_ICONS = {
  email: '📧',
  whatsapp: '💬',
  internal: '🏢'
};

/**
 * Tag conversations with provider information
 */
export const tagConversations = (
  conversations: BaseConversation[],
  provider: 'email' | 'whatsapp' | 'internal',
  accountId?: string,
  accountName?: string
): UnifiedConversation[] => {
  return conversations.map(conv => ({
    ...conv,
    provider,
    providerIcon: PROVIDER_ICONS[provider],
    originalId: conv.id,
    id: `${provider}-${accountId || 'default'}-${conv.id}`, // Create unique ID
    accountId,
    accountName,
    // Map provider-specific fields
    priority: determinePriority(conv),
    tags: extractTags(conv),
    assignee: extractAssignee(conv)
  }));
};

/**
 * Determine priority based on conversation properties
 */
const determinePriority = (conversation: BaseConversation): 'high' | 'medium' | 'low' => {
  // High priority if unread count is high or has specific keywords
  if ((conversation.unreadCount || 0) > 5) return 'high';
  if ((conversation.unreadCount || 0) > 0) return 'medium';
  return 'low';
};

/**
 * Extract tags from conversation (placeholder implementation)
 */
const extractTags = (conversation: BaseConversation): string[] => {
  const tags: string[] = [];
  
  if (conversation.unreadCount && conversation.unreadCount > 0) {
    tags.push('unread');
  }
  
  if (conversation.type === 'dm') {
    tags.push('dm');
  } else if (conversation.type === 'group') {
    tags.push('group');
  }
  
  return tags;
};

/**
 * Extract assignee information (placeholder implementation)
 */
const extractAssignee = (conversation: BaseConversation): string | undefined => {
  // This would be extracted from conversation metadata in real implementation
  return undefined;
};

/**
 * Apply filters to conversations
 */
export const applyFilters = (
  conversations: UnifiedConversation[],
  filters: UnifiedFilters
): UnifiedConversation[] => {
  let filtered = [...conversations];
  
  // Filter by providers
  if (filters.providers && filters.providers.length > 0) {
    filtered = filtered.filter(conv => 
      filters.providers!.includes(conv.provider)
    );
  }
  
  // Filter by unread
  if (filters.unreadOnly) {
    filtered = filtered.filter(conv => 
      (conv.unreadCount || 0) > 0
    );
  }
  
  // Filter by assigned
  if (filters.assigned !== undefined) {
    filtered = filtered.filter(conv => 
      filters.assigned ? conv.assignee !== undefined : conv.assignee === undefined
    );
  }
  
  // Filter by priority
  if (filters.priority) {
    filtered = filtered.filter(conv => 
      conv.priority === filters.priority
    );
  }
  
  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(conv => 
      conv.name.toLowerCase().includes(query) ||
      conv.lastMessage?.toLowerCase().includes(query) ||
      conv.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Filter by date range
  if (filters.dateRange) {
    filtered = filtered.filter(conv => {
      if (!conv.lastMessageAt) return false;
      const messageDate = new Date(conv.lastMessageAt);
      return messageDate >= filters.dateRange!.start && 
             messageDate <= filters.dateRange!.end;
    });
  }
  
  return filtered;
};

/**
 * Sort conversations based on options
 */
export const sortConversations = (
  conversations: UnifiedConversation[],
  options: UnifiedSortOptions
): UnifiedConversation[] => {
  const sorted = [...conversations];
  const direction = options.direction === 'asc' ? 1 : -1;
  
  sorted.sort((a, b) => {
    switch (options.by) {
      case 'recent':
        const aDate = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const bDate = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return (bDate - aDate) * direction;
        
      case 'unread':
        return ((b.unreadCount || 0) - (a.unreadCount || 0)) * direction;
        
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const aPriority = priorityOrder[a.priority || 'low'];
        const bPriority = priorityOrder[b.priority || 'low'];
        return (bPriority - aPriority) * direction;
        
      case 'provider':
        return a.provider.localeCompare(b.provider) * direction;
        
      default:
        return 0;
    }
  });
  
  return sorted;
};

/**
 * Main aggregation function
 */
export const aggregateConversations = (
  emailConversations: BaseConversation[],
  whatsappConversations: BaseConversation[],
  internalConversations: BaseConversation[],
  filters?: UnifiedFilters,
  sortOptions?: UnifiedSortOptions
): AggregationResult => {
  // Tag conversations with provider info
  const taggedEmail = tagConversations(emailConversations, 'email');
  const taggedWhatsApp = tagConversations(whatsappConversations, 'whatsapp');
  const taggedInternal = tagConversations(internalConversations, 'internal');
  
  // Combine all conversations
  let allConversations = [
    ...taggedEmail,
    ...taggedWhatsApp,
    ...taggedInternal
  ];
  
  // Apply filters if provided
  if (filters) {
    allConversations = applyFilters(allConversations, filters);
  }
  
  // Sort conversations
  const finalSortOptions: UnifiedSortOptions = sortOptions || {
    by: 'recent',
    direction: 'desc'
  };
  allConversations = sortConversations(allConversations, finalSortOptions);
  
  // Calculate statistics
  const totalUnread = allConversations.reduce((sum, conv) => 
    sum + (conv.unreadCount || 0), 0
  );
  
  return {
    conversations: allConversations,
    totalCount: allConversations.length,
    unreadCount: totalUnread,
    byProvider: {
      email: taggedEmail.length,
      whatsapp: taggedWhatsApp.length,
      internal: taggedInternal.length
    }
  };
};

/**
 * Group conversations by date
 */
export const groupConversationsByDate = (
  conversations: UnifiedConversation[]
): Map<string, UnifiedConversation[]> => {
  const groups = new Map<string, UnifiedConversation[]>();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  conversations.forEach(conv => {
    if (!conv.lastMessageAt) {
      // No message date, put in "Other" group
      const other = groups.get('Other') || [];
      other.push(conv);
      groups.set('Other', other);
      return;
    }
    
    const messageDate = new Date(conv.lastMessageAt);
    let groupKey: string;
    
    if (isSameDay(messageDate, today)) {
      groupKey = 'Today';
    } else if (isSameDay(messageDate, yesterday)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(messageDate)) {
      groupKey = 'This Week';
    } else if (isThisMonth(messageDate)) {
      groupKey = 'This Month';
    } else {
      groupKey = 'Older';
    }
    
    const group = groups.get(groupKey) || [];
    group.push(conv);
    groups.set(groupKey, group);
  });
  
  return groups;
};

// Date helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

const isThisWeek = (date: Date): boolean => {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date > weekAgo;
};

const isThisMonth = (date: Date): boolean => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && 
         date.getFullYear() === now.getFullYear();
};