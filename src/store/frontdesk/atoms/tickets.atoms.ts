import { atom, selector } from 'recoil';
import { Ticket } from '@/widgets/frontdesk/providers/tickets/types/ticket.types';
import {
  TicketWithDetails,
  TicketFilters,
  PaginationMetadata,
  RelatedTicket,
  TicketHistoryEntry,
  ConversationNeedsReviewPayload,
  transformApiTicketToUi,
  Tag,
  TicketViewStatus,
} from '@/widgets/frontdesk/providers/tickets/types';
import { mockTickets, ticketViews } from '@/widgets/frontdesk/providers/tickets/mock-data/tickets.mock';

/**
 * All tickets data (backend format - TicketWithDetails[])
 */
export const ticketsAtom = atom<TicketWithDetails[]>({
  key: 'frontdesk.tickets.all',
  default: [],
});

/**
 * Tickets loading state
 */
export const ticketsLoadingAtom = atom<boolean>({
  key: 'frontdesk.tickets.loading',
  default: false,
});

/**
 * Tickets error state
 */
export const ticketsErrorAtom = atom<string | null>({
  key: 'frontdesk.tickets.error',
  default: null,
});

/**
 * WebSocket connection state
 */
export const ticketSocketConnectedAtom = atom<boolean>({
  key: 'frontdesk.tickets.socketConnected',
  default: false,
});

/**
 * WebSocket connection error
 */
export const ticketSocketErrorAtom = atom<string | null>({
  key: 'frontdesk.tickets.socketError',
  default: null,
});

/**
 * Review Queue - Conversations awaiting ticket creation
 */
export const reviewQueueConversationsAtom = atom<ConversationNeedsReviewPayload[]>({
  key: 'frontdesk.tickets.reviewQueue',
  default: [],
});

/**
 * Pagination metadata
 */
export const ticketsPaginationAtom = atom<PaginationMetadata | null>({
  key: 'frontdesk.tickets.pagination',
  default: null,
});

/**
 * Active filters for ticket list
 */
export const ticketFiltersAtom = atom<TicketFilters>({
  key: 'frontdesk.tickets.filters',
  default: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
});

/**
 * Related tickets for current ticket
 */
export const relatedTicketsAtom = atom<RelatedTicket[]>({
  key: 'frontdesk.tickets.related',
  default: [],
});

/**
 * Ticket history for current ticket
 */
export const ticketHistoryAtom = atom<TicketHistoryEntry[]>({
  key: 'frontdesk.tickets.history',
  default: [],
});

/**
 * All available tags
 */
export const tagsAtom = atom<Tag[]>({
  key: 'frontdesk.tickets.tags',
  default: [],
});

/**
 * Popular/frequently used tags
 */
export const popularTagsAtom = atom<Tag[]>({
  key: 'frontdesk.tickets.popularTags',
  default: [],
});

/**
 * Tag autocomplete suggestions
 */
export const tagSuggestionsAtom = atom<Tag[]>({
  key: 'frontdesk.tickets.tagSuggestions',
  default: [],
});

/**
 * Tag loading state
 */
export const tagsLoadingAtom = atom<boolean>({
  key: 'frontdesk.tickets.tagsLoading',
  default: false,
});

/**
 * Ticket View Status Map - Per-ticket read/unread tracking
 * Key: ticketId, Value: TicketViewStatus
 * Populated by GET /tickets/:id/view-status or included in ticket details
 */
export const ticketViewStatusMapAtom = atom<Record<string, TicketViewStatus>>({
  key: 'frontdesk.tickets.viewStatusMap',
  default: {},
});

/**
 * Unread tickets count for current user
 * Fetched from GET /tickets/unread-count
 */
export const unreadTicketsCountAtom = atom<number>({
  key: 'frontdesk.tickets.unreadCount',
  default: 0,
});

/**
 * Currently selected ticket ID
 */
export const selectedTicketIdAtom = atom<string | null>({
  key: 'frontdesk.tickets.selectedId',
  default: null,
});

/**
 * Active conversation ID for multi-conversation tickets
 * Tracks which tab/conversation is currently active for viewing and replying
 */
export const activeConversationIdAtom = atom<string | null>({
  key: 'frontdesk.tickets.activeConversationId',
  default: null,
});

/**
 * Currently selected ticket view (my-tickets, past-due, etc.)
 */
export const selectedTicketViewAtom = atom<string | null>({
  key: 'frontdesk.tickets.selectedView',
  default: null,
});

/**
 * Search query for filtering tickets
 */
export const ticketSearchQueryAtom = atom<string>({
  key: 'frontdesk.tickets.searchQuery',
  default: '',
});

/**
 * Sort configuration (aligned with backend DTO)
 */
export const ticketSortAtom = atom<{
  by: 'createdAt' | 'lastMessageAt' | 'priority' | 'ticketNumber' | 'status';
  order: 'asc' | 'desc'
}>({
  key: 'frontdesk.tickets.sort',
  default: { by: 'createdAt', order: 'desc' },
});

/**
 * Selected ticket IDs for bulk actions
 */
export const selectedTicketIdsAtom = atom<string[]>({
  key: 'frontdesk.tickets.selectedIds',
  default: [],
});

/**
 * Current user ID (mock for now)
 */
export const currentUserIdAtom = atom<string>({
  key: 'frontdesk.tickets.currentUserId',
  default: '1', // Allie Harmon's ID
});

/**
 * Open ticket tabs (for tab navigation)
 */
export const openTicketTabsAtom = atom<string[]>({
  key: 'frontdesk.tickets.openTabs',
  default: [],
});

/**
 * Selector: Get currently selected ticket (backend format)
 */
export const selectedTicketSelector = selector<TicketWithDetails | null>({
  key: 'frontdesk.tickets.selectedTicket',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const selectedId = get(selectedTicketIdAtom);
    return tickets.find(t => t.id === selectedId) || null;
  },
});

/**
 * Selector: Get currently selected ticket (UI format)
 */
export const selectedTicketUiSelector = selector<Ticket | null>({
  key: 'frontdesk.tickets.selectedTicketUi',
  get: ({ get }) => {
    const ticket = get(selectedTicketSelector);
    return ticket ? transformApiTicketToUi(ticket) : null;
  },
});

/**
 * Selector: Get filtered tickets (backend format)
 * Backend handles most filtering via API params.
 * Special case: "unassigned" view needs client-side filtering since backend
 * doesn't support assigneeId=null in the query params.
 */
export const filteredTicketsSelector = selector<TicketWithDetails[]>({
  key: 'frontdesk.tickets.filtered',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const selectedView = get(selectedTicketViewAtom);

    // Special handling for unassigned view: filter out tickets with assigneeId
    if (selectedView === 'unassigned') {
      return tickets.filter(t => !t.assigneeId);
    }

    return tickets; // Return all tickets from backend for other views
  },
});

/**
 * Selector: Get filtered tickets (UI format) for compatibility
 */
export const filteredTicketsUiSelector = selector<Ticket[]>({
  key: 'frontdesk.tickets.filteredUi',
  get: ({ get }) => {
    const tickets = get(filteredTicketsSelector);
    return tickets.map(transformApiTicketToUi);
  },
});

/**
 * Selector: Get ticket counts for each view (backend-aware)
 */
export const ticketCountsSelector = selector<Record<string, number>>({
  key: 'frontdesk.tickets.counts',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const currentUserId = get(currentUserIdAtom);

    return {
      'my-tickets': tickets.filter(t => t.assigneeId === currentUserId).length,
      'past-due': tickets.filter(t => t.sla?.breached).length,
      'high-priority': tickets.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length,
      'unassigned': tickets.filter(t => !t.assigneeId).length,
      'all-tickets': tickets.length,
    };
  },
});

/**
 * Selector: Get tickets created by current user
 */
export const myCreatedTicketsSelector = selector<TicketWithDetails[]>({
  key: 'frontdesk.tickets.myCreated',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const currentUserId = get(currentUserIdAtom);
    return tickets.filter(t => t.createdBy === currentUserId);
  },
});

/**
 * Selector: Get self-assigned tickets (where assignee is the creator)
 */
export const selfAssignedTicketsSelector = selector<TicketWithDetails[]>({
  key: 'frontdesk.tickets.selfAssigned',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    return tickets.filter(t => t.assigneeId && t.assigneeId === t.createdBy);
  },
});

/**
 * Selector: Count active filters (only visible filters: status, priority, tags)
 */
export const activeFilterCountSelector = selector<number>({
  key: 'frontdesk.tickets.activeFilterCount',
  get: ({ get }) => {
    const filters = get(ticketFiltersAtom);
    let count = 0;

    // Only count the 3 visible filters in the modal
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    // Don't count sortBy/sortOrder/page/limit or other hidden filters

    return count;
  },
});