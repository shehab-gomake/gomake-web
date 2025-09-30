import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedTicketViewAtom,
  filteredTicketsSelector,
  selectedTicketIdAtom,
  selectedTicketSelector,
  ticketSearchQueryAtom,
  selectedTicketIdsAtom,
  ticketCountsSelector,
  openTicketTabsAtom,
  ticketsAtom,
} from '@/store/frontdesk/atoms/tickets.atoms';
import type { Ticket } from '../types/ticket.types';

export interface UseTicketsProviderResult {
  // View state
  selectedView: string | null;
  setSelectedView: (view: string | null) => void;

  // Tickets
  allTickets: Ticket[];
  filteredTickets: Ticket[];
  ticketCounts: Record<string, number>;

  // Selection
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  selectedTicket: Ticket | null;

  // Multi-selection
  selectedTicketIds: string[];
  setSelectedTicketIds: (ids: string[]) => void;
  toggleTicketSelection: (ticketId: string) => void;
  clearSelection: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Tabs
  openTabs: string[];
  setOpenTabs: (tabs: string[]) => void;
  openTab: (ticketId: string) => void;
  closeTab: (ticketId: string) => void;
}

/**
 * Main hook for Tickets provider
 * Manages ticket list, filtering, selection, and navigation
 */
export function useTicketsProvider(): UseTicketsProviderResult {
  // View state
  const [selectedView, setSelectedView] = useRecoilState(selectedTicketViewAtom);

  // Tickets
  const allTickets = useRecoilValue(ticketsAtom);
  const filteredTickets = useRecoilValue(filteredTicketsSelector);
  const ticketCounts = useRecoilValue(ticketCountsSelector);

  // Selection
  const [selectedTicketId, setSelectedTicketId] = useRecoilState(selectedTicketIdAtom);
  const selectedTicket = useRecoilValue(selectedTicketSelector);

  // Multi-selection
  const [selectedTicketIds, setSelectedTicketIds] = useRecoilState(selectedTicketIdsAtom);

  // Search
  const [searchQuery, setSearchQuery] = useRecoilState(ticketSearchQueryAtom);

  // Tabs
  const [openTabs, setOpenTabs] = useRecoilState(openTicketTabsAtom);

  // Actions
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTicketIds((prev) =>
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };

  const clearSelection = () => {
    setSelectedTicketIds([]);
  };

  const openTab = (ticketId: string) => {
    setOpenTabs((prev) => (prev.includes(ticketId) ? prev : [...prev, ticketId]));
  };

  const closeTab = (ticketId: string) => {
    setOpenTabs((prev) => prev.filter((id) => id !== ticketId));
    if (selectedTicketId === ticketId) {
      setSelectedTicketId(null);
    }
  };

  return {
    // View
    selectedView,
    setSelectedView,

    // Tickets
    allTickets,
    filteredTickets,
    ticketCounts,

    // Selection
    selectedTicketId,
    setSelectedTicketId,
    selectedTicket,

    // Multi-selection
    selectedTicketIds,
    setSelectedTicketIds,
    toggleTicketSelection,
    clearSelection,

    // Search
    searchQuery,
    setSearchQuery,

    // Tabs
    openTabs,
    setOpenTabs,
    openTab,
    closeTab,
  };
}