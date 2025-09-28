import { selector } from 'recoil';
import { 
  emailConversationsAtom,
  emailSelectedAccountAtom 
} from '../atoms/email.atoms';
import { 
  whatsappConversationsAtom,
  whatsappSelectedAccountAtom 
} from '../atoms/whatsapp.atoms';
import { 
  internalChannelsAtom,
  internalDirectMessagesAtom 
} from '../atoms/internal.atoms';
import { BaseConversation } from '@/widgets/frontdesk/providers/base/provider.interface';
import { Conversation } from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';
import { 
  unifiedFiltersAtom,
  unifiedSortOptionsAtom,
  unifiedSearchQueryAtom 
} from '../atoms/unified.atoms';
import { aggregateConversations } from '@/widgets/frontdesk/providers/unified/utils/conversation-aggregator';

/**
 * Convert Conversation to Channel format for aggregation
 */
const convertConversationToBaseConversation = (conversation: Conversation): BaseConversation => {
  return {
    id: conversation.id,
    name: conversation.name || (conversation.type === 'DM' ? 'Direct Message' : 'Group Chat'),
    type: conversation.type === 'DM' ? 'dm' : 'group',
    unreadCount: conversation.unreadCount,
    lastMessageAt: conversation.lastMessageAt,
    members: conversation.members?.map(member => member.userId)
  };
};

/**
 * Get email conversations for selected account
 */
export const currentEmailConversationsSelector = selector({
  key: 'frontdesk.selectors.currentEmailConversations',
  get: ({ get }) => {
    const allConversations = get(emailConversationsAtom);
    const selectedAccount = get(emailSelectedAccountAtom);
    
    if (!selectedAccount) return [];
    return allConversations[selectedAccount.id] || [];
  }
});

/**
 * Get WhatsApp conversations for selected account
 */
export const currentWhatsAppConversationsSelector = selector({
  key: 'frontdesk.selectors.currentWhatsAppConversations',
  get: ({ get }) => {
    const allConversations = get(whatsappConversationsAtom);
    const selectedAccount = get(whatsappSelectedAccountAtom);
    
    if (!selectedAccount) return [];
    return allConversations[selectedAccount.id] || [];
  }
});

/**
 * Get all internal conversations (channels + DMs)
 */
export const allInternalConversationsSelector = selector({
  key: 'frontdesk.selectors.allInternalConversations',
  get: ({ get }) => {
    const channels = get(internalChannelsAtom);
    const dms = get(internalDirectMessagesAtom);
    const convertedChannels = channels.map(convertConversationToBaseConversation);
    const convertedDms = dms.map(convertConversationToBaseConversation);
    return [...convertedChannels, ...convertedDms];
  }
});

/**
 * Aggregated conversations from all providers
 */
export const aggregatedConversationsSelector = selector({
  key: 'frontdesk.selectors.aggregatedConversations',
  get: ({ get }) => {
    const emailConversations = get(currentEmailConversationsSelector);
    const whatsappConversations = get(currentWhatsAppConversationsSelector);
    const internalConversations = get(allInternalConversationsSelector);
    const filters = get(unifiedFiltersAtom);
    const sortOptions = get(unifiedSortOptionsAtom);
    const searchQuery = get(unifiedSearchQueryAtom);
    
    const filtersWithSearch = {
      ...filters,
      searchQuery: searchQuery || undefined
    };
    
    return aggregateConversations(
      emailConversations,
      whatsappConversations,
      internalConversations,
      filtersWithSearch,
      sortOptions
    );
  }
});

/**
 * Total unread count across all providers
 */
export const totalUnreadCountSelector = selector({
  key: 'frontdesk.selectors.totalUnreadCount',
  get: ({ get }) => {
    const aggregated = get(aggregatedConversationsSelector);
    return aggregated.unreadCount;
  }
});

/**
 * Unread count by provider
 */
export const unreadCountByProviderSelector = selector({
  key: 'frontdesk.selectors.unreadCountByProvider',
  get: ({ get }) => {
    const aggregated = get(aggregatedConversationsSelector);
    const conversations = aggregated.conversations;
    
    const counts = {
      all: 0,
      email: 0,
      whatsapp: 0,
      internal: 0
    };
    
    conversations.forEach(conv => {
      const unread = conv.unreadCount || 0;
      counts.all += unread;
      counts[conv.provider] += unread;
    });
    
    return counts;
  }
});
/**
 * Selector that filters conversations based on ticket filters
 * Excludes closed tickets by default unless explicitly requested
 */
export const ticketAwareConversationsSelector = selector({
  key: 'frontdesk.selectors.ticketAwareConversations',
  get: ({ get }) => {
    const aggregated = get(aggregatedConversationsSelector);
    const filters = get(unifiedFiltersAtom);
    
    let filteredConversations = aggregated.conversations;
    
    // Filter out closed tickets by default unless showClosed is true
    if (!filters.showClosed) {
      filteredConversations = filteredConversations.filter(conv => 
        !conv.ticketStatus || conv.ticketStatus !== 'CLOSED'
      );
    }
    
    // Apply ticket-specific filters
    if (filters.ticketStatus && filters.ticketStatus.length > 0) {
      filteredConversations = filteredConversations.filter(conv =>
        conv.ticketStatus && filters.ticketStatus!.includes(conv.ticketStatus)
      );
    }
    
    if (filters.unassigned) {
      filteredConversations = filteredConversations.filter(conv =>
        !conv.assigneeId || conv.assigneeId === ''
      );
    }
    
    if (filters.assigneeId) {
      filteredConversations = filteredConversations.filter(conv =>
        conv.assigneeId === filters.assigneeId
      );
    }
    
    if (filters.slaBreached) {
      filteredConversations = filteredConversations.filter(conv =>
        conv.sla?.breached === true
      );
    }
    
    if (filters.ticketsOnly) {
      filteredConversations = filteredConversations.filter(conv =>
        conv.isTicket === true
      );
    }
    
    // Recalculate counts
    const totalCount = filteredConversations.length;
    const unreadCount = filteredConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    
    const byProvider = {
      email: filteredConversations.filter(c => c.provider === 'email').length,
      whatsapp: filteredConversations.filter(c => c.provider === 'whatsapp').length,
      internal: filteredConversations.filter(c => c.provider === 'internal').length
    };
    
    return {
      conversations: filteredConversations,
      totalCount,
      unreadCount,
      byProvider
    };
  }
});

/**
 * Selector for SLA breach counts and urgent tickets
 */
export const slaMetricsSelector = selector({
  key: 'frontdesk.selectors.slaMetrics',
  get: ({ get }) => {
    const { conversations } = get(ticketAwareConversationsSelector);
    
    let breachedCount = 0;
    let atRiskCount = 0;
    let urgentCount = 0;
    
    conversations.forEach(conv => {
      if (conv.sla?.breached) breachedCount++;
      if (conv.sla?.status === 'at-risk') atRiskCount++;
      if (conv.priority === 'high' || conv.ticketStatus === 'OPEN') urgentCount++;
    });
    
    return {
      breachedCount,
      atRiskCount,
      urgentCount,
      totalActiveTickets: conversations.filter(c => c.isTicket).length
    };
  }
});

/**
 * Recent conversations (last 24 hours)
 */
export const recentConversationsSelector = selector({
  key: 'frontdesk.selectors.recentConversations',
  get: ({ get }) => {
    const aggregated = get(aggregatedConversationsSelector);
    const conversations = aggregated.conversations;
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return conversations.filter(conv => {
      if (!conv.lastMessageAt) return false;
      const messageDate = new Date(conv.lastMessageAt);
      return messageDate > oneDayAgo;
    });
  }
});

/**
 * High priority conversations
 */
export const highPriorityConversationsSelector = selector({
  key: 'frontdesk.selectors.highPriorityConversations',
  get: ({ get }) => {
    const aggregated = get(aggregatedConversationsSelector);
    return aggregated.conversations.filter(conv => conv.priority === 'high');
  }
});

/**
 * Provider connection status
 */
export const providerConnectionStatusSelector = selector({
  key: 'frontdesk.selectors.providerConnectionStatus',
  get: ({ get }) => {
    const emailState = get(emailConversationsAtom);
    const whatsappState = get(whatsappConversationsAtom);
    const internalChannels = get(internalChannelsAtom);
    
    return {
      email: Object.keys(emailState).length > 0,
      whatsapp: Object.keys(whatsappState).length > 0,
      internal: internalChannels.length > 0
    };
  }
});