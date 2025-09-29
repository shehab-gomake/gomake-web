import { atom } from 'recoil';
import { UnifiedConversation, UnifiedFilters, UnifiedSortOptions } from '@/widgets/frontdesk/providers/unified/types/unified.types';

/**
 * All conversations from the unified view
 */
export const unifiedConversationsAtom = atom<UnifiedConversation[]>({
  key: 'frontdesk.unified.conversations',
  default: []
});

/**
 * Selected conversation in unified view
 */
export const unifiedSelectedConversationAtom = atom<UnifiedConversation | null>({
  key: 'frontdesk.unified.selectedConversation',
  default: null
});

/**
 * Active filters for unified view
 */
export const unifiedFiltersAtom = atom<UnifiedFilters>({
  key: 'frontdesk.unified.filters',
  default: {}
});

/**
 * Sort options for unified view
 */
export const unifiedSortOptionsAtom = atom<UnifiedSortOptions>({
  key: 'frontdesk.unified.sortOptions',
  default: {
    by: 'recent',
    direction: 'desc'
  }
});

/**
 * Search query for unified view
 */
export const unifiedSearchQueryAtom = atom<string>({
  key: 'frontdesk.unified.searchQuery',
  default: ''
});

/**
 * Loading state for unified view
 */
export const unifiedLoadingAtom = atom<boolean>({
  key: 'frontdesk.unified.loading',
  default: false
});

/**
 * Error state for unified view
 */
export const unifiedErrorAtom = atom<string | null>({
  key: 'frontdesk.unified.error',
  default: null
});

/**
 * Last refresh timestamp for unified view
 */
export const unifiedLastRefreshAtom = atom<string | null>({
  key: 'frontdesk.unified.lastRefresh',
  default: null
});