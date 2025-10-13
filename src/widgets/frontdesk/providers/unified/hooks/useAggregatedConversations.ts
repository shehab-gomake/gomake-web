import { useState, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  UnifiedConversation,
  UnifiedFilters,
  UnifiedSortOptions,
  AggregationResult
} from '../types/unified.types';
import { aggregateConversations } from '../utils/conversation-aggregator';
import {
  currentEmailConversationsSelector,
  currentWhatsAppConversationsSelector,
  allInternalConversationsSelector
} from '@/store/frontdesk/selectors/aggregation.selectors';

export const useAggregatedConversations = (
  filters?: UnifiedFilters,
  sortOptions?: UnifiedSortOptions
) => {
  // Get conversations from each provider using real selectors
  const emailConversations = useRecoilValue(currentEmailConversationsSelector);
  const whatsappConversations = useRecoilValue(currentWhatsAppConversationsSelector);
  const internalConversations = useRecoilValue(allInternalConversationsSelector);

  // Aggregate conversations
  const aggregationResult = useMemo(() => {
    return aggregateConversations(
      emailConversations,
      whatsappConversations,
      internalConversations,
      filters,
      sortOptions
    );
  }, [
    emailConversations,
    whatsappConversations,
    internalConversations,
    filters,
    sortOptions
  ]);

  return aggregationResult;
};

// Hook for managing unified provider state
export const useUnifiedProvider = () => {
  const [selectedConversation, setSelectedConversation] = useState<UnifiedConversation | null>(null);
  const [filters, setFilters] = useState<UnifiedFilters>({});
  const [sortOptions, setSortOptions] = useState<UnifiedSortOptions>({
    by: 'recent',
    direction: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get aggregated conversations
  const aggregationResult = useAggregatedConversations(
    { ...filters, searchQuery: searchQuery || undefined },
    sortOptions
  );
  
  // Handle conversation selection
  const handleSelectConversation = (conversation: UnifiedConversation) => {
    setSelectedConversation(conversation);
    // Navigate to the appropriate provider view
    // This will trigger navigation to the specific provider's message viewer
  };
  
  // Handle filter changes
  const updateFilters = (newFilters: Partial<UnifiedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle sort changes
  const updateSort = (newSort: Partial<UnifiedSortOptions>) => {
    setSortOptions(prev => ({ ...prev, ...newSort }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  // Refresh all providers
  const refreshAll = async () => {
    // Trigger refresh for each provider
    // This will be implemented when provider refresh methods are available
    // TODO: Implement provider refresh
  };
  
  return {
    // State
    conversations: aggregationResult.conversations,
    totalCount: aggregationResult.totalCount,
    unreadCount: aggregationResult.unreadCount,
    byProvider: aggregationResult.byProvider,
    selectedConversation,
    filters,
    sortOptions,
    searchQuery,
    
    // Actions
    selectConversation: handleSelectConversation,
    updateFilters,
    updateSort,
    setSearchQuery,
    clearFilters,
    refreshAll
  };
};