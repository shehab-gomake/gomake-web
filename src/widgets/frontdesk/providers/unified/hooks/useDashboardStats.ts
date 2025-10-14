import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  unreadCountByProviderSelector,
} from '@/store/frontdesk';
import {
  ticketCountsSelector,
  unreadTicketsCountAtom,
  ticketsAtom,
} from '@/store/frontdesk/atoms/tickets.atoms';
import {
  currentEmailConversationsSelector,
  currentWhatsAppConversationsSelector,
  allInternalConversationsSelector,
} from '@/store/frontdesk/selectors/aggregation.selectors';

export interface DashboardStats {
  // Total unread across all channels
  totalUnreadMessages: number;

  // Breakdown by provider
  unreadByProvider: {
    email: number;
    whatsapp: number;
    internal: number;
  };

  // Total conversations
  totalConversations: number;

  // Tickets
  openTickets: number;
  unassignedTickets: number;
  myTickets: number;
  unreadTickets: number;

  // Activity
  activeToday: number;
  needsResponse: number;

  // Trends (could be calculated based on historical data)
  trends: {
    messagesVsYesterday?: number;
    ticketsVsLastWeek?: number;
  };
}

export const useDashboardStats = (): DashboardStats => {
  // Get unread counts from all providers
  const unreadByProvider = useRecoilValue(unreadCountByProviderSelector);

  // Get ticket counts
  const ticketCounts = useRecoilValue(ticketCountsSelector);
  const unreadTicketsCount = useRecoilValue(unreadTicketsCountAtom);
  const allTickets = useRecoilValue(ticketsAtom);

  // Get conversations
  const emailConversations = useRecoilValue(currentEmailConversationsSelector);
  const whatsappConversations = useRecoilValue(currentWhatsAppConversationsSelector);
  const internalConversations = useRecoilValue(allInternalConversationsSelector);

  return useMemo(() => {
    // Calculate total unread messages
    const totalUnreadMessages =
      (unreadByProvider.email || 0) +
      (unreadByProvider.whatsapp || 0) +
      (unreadByProvider.internal || 0);

    // Calculate total conversations
    const totalConversations =
      emailConversations.length +
      whatsappConversations.length +
      internalConversations.length;

    // Calculate open tickets (OPEN + IN_PROGRESS + PENDING)
    const openTickets = allTickets.filter(
      (ticket) =>
        ticket.status === 'OPEN' ||
        ticket.status === 'IN_PROGRESS' ||
        ticket.status === 'PENDING'
    ).length;

    // Calculate unassigned tickets (status OPEN and no assignee)
    const unassignedTickets = allTickets.filter(
      (ticket) => ticket.status === 'OPEN' && !ticket.assignee
    ).length;

    // Get my tickets count from selector
    const myTickets = ticketCounts['my-tickets'] || 0;

    // Calculate activity today (messages/tickets updated in last 24h)
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const activeToday = allTickets.filter((ticket) => {
      const updatedAt = new Date(ticket.updatedAt);
      return updatedAt >= yesterday;
    }).length;

    // Calculate items needing response (unread + unassigned)
    const needsResponse = totalUnreadMessages + unassignedTickets + unreadTicketsCount;

    return {
      totalUnreadMessages,
      unreadByProvider: {
        email: unreadByProvider.email || 0,
        whatsapp: unreadByProvider.whatsapp || 0,
        internal: unreadByProvider.internal || 0,
      },
      totalConversations,
      openTickets,
      unassignedTickets,
      myTickets,
      unreadTickets: unreadTicketsCount,
      activeToday,
      needsResponse,
      trends: {
        // These would be calculated from historical data
        // For now, we return undefined
        messagesVsYesterday: undefined,
        ticketsVsLastWeek: undefined,
      },
    };
  }, [
    unreadByProvider,
    emailConversations,
    whatsappConversations,
    internalConversations,
    allTickets,
    ticketCounts,
    unreadTicketsCount,
  ]);
};
