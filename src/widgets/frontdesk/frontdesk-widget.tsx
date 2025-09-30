import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import { useRouter } from "next/router";
import { useRecoilValue, useRecoilState } from 'recoil';
// Three-column layout components
import { ThreeColumnLayout } from './layouts/three-column';
import { NavigationSidebar, Channel, Section, TicketView } from './layouts/components/NavigationSidebar';
import { DynamicListPanel } from './layouts/components/DynamicListPanel';
import { ContentArea } from './layouts/components/ContentArea';

// Provider components
import { EmailProviderView } from "@/widgets/frontdesk/providers/email/email-provider-view";
import { WhatsAppProviderView } from "@/widgets/frontdesk/providers/whatsapp/whatsapp-provider-view";
import { DirectMessagesProviderView } from "@/widgets/frontdesk/providers/internal/direct-messages-provider-view";

// Ticket components
import { TicketListPanel } from './providers/tickets/components/TicketListPanel';
import { TicketDetailView } from './providers/tickets/components/TicketDetailView';

// For unified view placeholder
import { UnifiedProvider } from './providers/unified/UnifiedProvider';
import { unreadCountByProviderSelector } from '@/store/frontdesk';

// Ticket state
import {
  selectedTicketViewAtom,
  filteredTicketsSelector,
  selectedTicketIdAtom,
  selectedTicketSelector,
  ticketSearchQueryAtom,
  selectedTicketIdsAtom,
  ticketCountsSelector
} from '@/store/frontdesk/atoms/tickets.atoms';

const FrontdeskWidget: React.FC = () => {
  const router = useRouter();
  const { frontdeskRoute, provider } = router.query as {
    frontdeskRoute?: string;
    provider?: string;
  };


  // Initialize state from route only on mount
  const getInitialSection = (): Section => {
    if (!frontdeskRoute || frontdeskRoute === 'inbox') return 'inbox';
    if (frontdeskRoute === 'assigned') return 'assigned';
    if (frontdeskRoute === 'admin') return 'admin';
    if (frontdeskRoute === 'settings') return 'settings';
    if (frontdeskRoute === 'tickets') return 'inbox'; // Tickets are shown in inbox section
    return 'inbox';
  };

  const getInitialChannel = (): Channel => {
    // If we're in tickets route, don't set a channel
    if (frontdeskRoute === 'tickets') return 'all';
    if (frontdeskRoute !== 'inbox' && !provider) return 'all';
    if (provider === 'email') return 'email';
    if (provider === 'whatsapp') return 'whatsapp';
    if (provider === 'internal') return 'internal';
    if (provider === 'unified') return 'all';
    return 'all';
  };

  const getInitialTicketView = (): TicketView | null => {
    // If we're on a tickets route, parse the provider param as ticket view
    if (frontdeskRoute === 'tickets' && provider) {
      const viewMap: Record<string, TicketView> = {
        'my-tickets': 'my-tickets',
        'past-due': 'past-due',
        'high-priority': 'high-priority',
        'unassigned': 'unassigned',
        'all-tickets': 'all-tickets'
      };
      return viewMap[provider] || null;
    }
    return null;
  };

  // Use state for navigation - this prevents hard refreshes
  const [currentSection, setCurrentSection] = useState<Section>(getInitialSection());
  const [currentChannel, setCurrentChannel] = useState<Channel>(getInitialChannel());
  const [searchValue, setSearchValue] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ticket state
  const [selectedTicketView, setSelectedTicketView] = useRecoilState(selectedTicketViewAtom);
  const filteredTickets = useRecoilValue(filteredTicketsSelector);
  const [selectedTicketId, setSelectedTicketId] = useRecoilState(selectedTicketIdAtom);
  const selectedTicket = useRecoilValue(selectedTicketSelector);
  const [ticketSearchQuery, setTicketSearchQuery] = useRecoilState(ticketSearchQueryAtom);
  const [selectedTicketIds, setSelectedTicketIds] = useRecoilState(selectedTicketIdsAtom);
  const ticketCounts = useRecoilValue(ticketCountsSelector);

  const channelBadges = useRecoilValue(unreadCountByProviderSelector);

  // Only sync with route on initial load
  useEffect(() => {
    if (!isInitialized) {
      setCurrentSection(getInitialSection());
      setCurrentChannel(getInitialChannel());

      // Initialize ticket view from route if present
      const initialTicketView = getInitialTicketView();
      if (initialTicketView) {
        setSelectedTicketView(initialTicketView);
      }

      setIsInitialized(true);
    }
  }, [frontdeskRoute, provider, isInitialized]);

  // Navigation handlers - update state immediately, then update URL
  const handleSectionChange = (section: Section) => {
    // Update state immediately for instant UI response
    setCurrentSection(section);

    // Update URL without causing a re-render
    const url = section === 'inbox'
      ? '/frontdesk/inbox'
      : `/frontdesk/${section}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  const handleChannelChange = (channel: Channel) => {
    // Update state immediately for instant UI response
    setCurrentChannel(channel);

    // Clear ticket view when switching to chat channels
    setSelectedTicketView(null as any);
    setSelectedTicketId(null);

    // Update URL without causing a re-render
    const channelMap = { 'all': 'unified', 'email': 'email', 'whatsapp': 'whatsapp', 'internal': 'internal' };
    const url = `/frontdesk/inbox/${channelMap[channel]}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  const handleTicketViewChange = (view: TicketView) => {
    setSelectedTicketView(view);
    setSelectedTicketId(null); // Clear ticket selection when changing view

    // Also update section to inbox when selecting a ticket view
    setCurrentSection('inbox');

    // Update URL to reflect ticket view
    const viewMap = {
      'my-tickets': 'my-tickets',
      'past-due': 'past-due',
      'high-priority': 'high-priority',
      'unassigned': 'unassigned',
      'all-tickets': 'all-tickets'
    };
    const url = `/frontdesk/tickets/${viewMap[view as keyof typeof viewMap]}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
  };

  const handleTicketCheck = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTicketIds([...selectedTicketIds, ticketId]);
    } else {
      setSelectedTicketIds(selectedTicketIds.filter(id => id !== ticketId));
    }
  };

  const handleTicketClose = () => {
    setSelectedTicketId(null);
  };

  // Render list content based on selection (kept for compatibility but not displayed)
  const renderListContent = () => {
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Assigned conversations will appear here
              </Typography>
            </Box>
          );
        case 'admin':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Admin options
              </Typography>
            </Box>
          );
        case 'settings':
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Settings options
              </Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // For inbox, show conversation lists
    switch (currentChannel) {
      case 'all':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              All conversations
            </Typography>
          </Box>
        );
      case 'email':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Email conversations
            </Typography>
          </Box>
        );
      case 'whatsapp':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              WhatsApp conversations
            </Typography>
          </Box>
        );
      case 'internal':
        return (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Direct Messages
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  // Render main content based on selection
  const renderMainContent = () => {
    if (currentSection !== 'inbox') {
      switch (currentSection) {
        case 'assigned':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Assigned to Me</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Work board coming soon</Typography>
            </Box>
          );
        case 'admin':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Admin</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>Provider accounts management</Typography>
            </Box>
          );
        case 'settings':
          return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">Settings</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>User settings</Typography>
            </Box>
          );
        default:
          return null;
      }
    }

    // For inbox, show provider content
    switch (currentChannel) {
      case 'all':
        return <UnifiedProvider />;
      case 'email':
        return <EmailProviderView />;
      case 'whatsapp':
        return <WhatsAppProviderView />;
      case 'internal':
        return <DirectMessagesProviderView />;
      default:
        return null;
    }
  };

  // Helper to get ticket view title
  const getTicketViewTitle = (view: TicketView): string => {
    switch (view) {
      case 'my-tickets':
        return 'My Tickets';
      case 'past-due':
        return 'Past Due';
      case 'high-priority':
        return 'High Priority';
      case 'unassigned':
        return 'Unassigned';
      case 'all-tickets':
        return 'All Tickets';
      default:
        return 'Tickets';
    }
  };

  // Determine if we're in ticket view mode
  const isTicketView = selectedTicketView !== null && selectedTicketView !== undefined;

  return (
    <ThreeColumnLayout
      navigationContent={
        <NavigationSidebar
          selectedChannel={currentChannel}
          selectedSection={currentSection}
          selectedTicketView={selectedTicketView as TicketView | undefined}
          onChannelSelect={handleChannelChange}
          onSectionSelect={handleSectionChange}
          onTicketViewSelect={handleTicketViewChange}
          channelBadges={channelBadges}
          ticketCounts={ticketCounts}
        />
      }
      listContent={
        isTicketView ? (
          <TicketListPanel
            viewTitle={getTicketViewTitle(selectedTicketView as TicketView)}
            tickets={filteredTickets}
            selectedTicketId={selectedTicketId}
            selectedTicketIds={selectedTicketIds}
            searchQuery={ticketSearchQuery}
            onSearchChange={setTicketSearchQuery}
            onTicketSelect={handleTicketSelect}
            onTicketCheck={handleTicketCheck}
            onViewChange={(view) => handleTicketViewChange(view as TicketView)}
          />
        ) : currentSection === 'inbox' ? (
          <DynamicListPanel
            channel={currentChannel}
            content={renderListContent()}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        ) : undefined
      }
      mainContent={
        <ContentArea>
          {isTicketView ? (
            selectedTicket ? (
              <TicketDetailView ticket={selectedTicket} onClose={handleTicketClose} />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a ticket to view details
                </Typography>
              </Box>
            )
          ) : (
            renderMainContent()
          )}
        </ContentArea>
      }
      hideMiddleColumn={!isTicketView && currentSection !== 'inbox'}
    />
  );
};

export default FrontdeskWidget;
