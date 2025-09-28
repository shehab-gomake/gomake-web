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
/**
 * Ticket-specific state atoms
 */

/**
 * Available agents for ticket assignment
 */
export const availableAgentsAtom = atom<Array<{id: string, name: string, email: string, avatar?: string}>>({
  key: 'frontdesk.unified.availableAgents',
  default: []
});

/**
 * Ticket categories
 */
export const ticketCategoriesAtom = atom<Array<{id: string, name: string, priority: string}>>({
  key: 'frontdesk.unified.ticketCategories',
  default: []
});

/**
 * Ticket history for selected conversation
 */
export const selectedTicketHistoryAtom = atom<Array<{
  id: string;
  ticketId: string;
  action: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
  userId: string;
  userName: string;
  createdAt: string;
}>>({
  key: 'frontdesk.unified.selectedTicketHistory',
  default: []
});

/**
 * Ticket actions loading states
 */
export const ticketActionsLoadingAtom = atom<{
  assigning?: boolean;
  updatingStatus?: boolean;
  updatingPriority?: boolean;
  replying?: boolean;
  addingNote?: boolean;
}>({
  key: 'frontdesk.unified.ticketActionsLoading',
  default: {}
});

/**
 * SLA breach notifications
 */
export const slaBreachNotificationsAtom = atom<Array<{
  ticketId: string;
  ticketNumber: number;
  type: 'first_response' | 'resolution';
  breachedAt: string;
  customerName: string;
}>>({
  key: 'frontdesk.unified.slaBreachNotifications',
  default: []
});
