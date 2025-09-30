import { atom, selector } from 'recoil';
import { Ticket } from '@/widgets/frontdesk/providers/tickets/types/ticket.types';
import { mockTickets, ticketViews } from '@/widgets/frontdesk/providers/tickets/mock-data/tickets.mock';

/**
 * All tickets data
 */
export const ticketsAtom = atom<Ticket[]>({
  key: 'frontdesk.tickets.all',
  default: mockTickets,
});

/**
 * Currently selected ticket ID
 */
export const selectedTicketIdAtom = atom<string | null>({
  key: 'frontdesk.tickets.selectedId',
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
 * Sort configuration
 */
export const ticketSortAtom = atom<{ by: 'date' | 'priority' | 'status' | 'title'; order: 'asc' | 'desc' }>({
  key: 'frontdesk.tickets.sort',
  default: { by: 'date', order: 'desc' },
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
 * Selector: Get currently selected ticket
 */
export const selectedTicketSelector = selector<Ticket | null>({
  key: 'frontdesk.tickets.selectedTicket',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const selectedId = get(selectedTicketIdAtom);
    return tickets.find(t => t.id === selectedId) || null;
  },
});

/**
 * Selector: Get filtered tickets based on current view
 */
export const filteredTicketsSelector = selector<Ticket[]>({
  key: 'frontdesk.tickets.filtered',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const selectedView = get(selectedTicketViewAtom);
    const searchQuery = get(ticketSearchQueryAtom).toLowerCase();
    const currentUserId = get(currentUserIdAtom);
    const sort = get(ticketSortAtom);

    // Apply view filter
    let filtered = tickets;

    // If no view is selected, return empty array
    if (!selectedView) {
      return [];
    }

    switch (selectedView) {
      case 'my-tickets':
        filtered = tickets.filter(t => ticketViews.myTickets(t, currentUserId));
        break;
      case 'past-due':
        filtered = tickets.filter(ticketViews.pastDue);
        break;
      case 'high-priority':
        filtered = tickets.filter(ticketViews.highPriority);
        break;
      case 'unassigned':
        filtered = tickets.filter(ticketViews.unassigned);
        break;
      case 'all-tickets':
        filtered = tickets;
        break;
      default:
        filtered = tickets;
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(searchQuery) ||
          t.ticketNumber.toLowerCase().includes(searchQuery) ||
          t.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'date':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sort.order === 'asc' ? -comparison : comparison;
    });

    return sorted;
  },
});

/**
 * Selector: Get ticket counts for each view
 */
export const ticketCountsSelector = selector<Record<string, number>>({
  key: 'frontdesk.tickets.counts',
  get: ({ get }) => {
    const tickets = get(ticketsAtom);
    const currentUserId = get(currentUserIdAtom);

    return {
      'my-tickets': tickets.filter(t => ticketViews.myTickets(t, currentUserId)).length,
      'past-due': tickets.filter(ticketViews.pastDue).length,
      'high-priority': tickets.filter(ticketViews.highPriority).length,
      'unassigned': tickets.filter(ticketViews.unassigned).length,
      'all-tickets': tickets.length,
    };
  },
});