import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
import DirectMessagesProviderView from "@/widgets/frontdesk/providers/internal/direct-messages-provider-view";

// Ticket components
import { TicketListPanel } from './providers/tickets/components/ticket-list-panel';
import { TicketDetailView } from './providers/tickets/components/ticket-detail-view';

// For unified view placeholder
import { UnifiedProvider } from './providers/unified/UnifiedProvider';
import { unreadCountByProviderSelector, sidebarCollapsedAtom } from '@/store/frontdesk';

// Ticket state
import {
  selectedTicketViewAtom,
  filteredTicketsSelector,
  selectedTicketIdAtom,
  selectedTicketSelector,
  ticketSearchQueryAtom,
  ticketCountsSelector,
  openTicketTabsAtom,
  ticketsAtom,
  ticketsLoadingAtom,
  ticketsErrorAtom,
  activeFilterCountSelector
} from '@/store/frontdesk/atoms/tickets.atoms';

// Ticket provider hook
import { useTicketsProvider } from './providers/tickets/hooks/use-tickets-provider';

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
      // Check if provider is a ticket ID (format: TICKET-XXXXX or starts with number)
      if (provider.startsWith('TICKET-') || /^\d+$/.test(provider)) {
        return null; // Will show ticket detail directly
      }

      const viewMap: Record<string, TicketView> = {
        'my-tickets': 'my-tickets',
        'unassigned': 'unassigned',
        'all-tickets': 'all-tickets',
        'done': 'done'
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

  // UI state from Recoil (with automatic localStorage persistence)
  const [sidebarCollapsed, setSidebarCollapsed] = useRecoilState(sidebarCollapsedAtom);

  // Ticket state and provider hook
  const ticketsProvider = useTicketsProvider();
  const [selectedTicketView, setSelectedTicketView] = useRecoilState(selectedTicketViewAtom);
  const [selectedTicketId, setSelectedTicketId] = useRecoilState(selectedTicketIdAtom);
  const [openTicketTabs, setOpenTicketTabs] = useRecoilState(openTicketTabsAtom);
  const allTickets = useRecoilValue(ticketsAtom);
  const ticketsLoading = useRecoilValue(ticketsLoadingAtom);
  const ticketsError = useRecoilValue(ticketsErrorAtom);
  const activeFilterCount = useRecoilValue(activeFilterCountSelector);

  const channelBadges = useRecoilValue(unreadCountByProviderSelector);

  // Load popular tags when tickets view is shown
  useEffect(() => {
    if (frontdeskRoute === 'tickets' && ticketsProvider.popularTags.length === 0) {
      ticketsProvider.fetchPopularTags({ limit: 10 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontdeskRoute]);

  // Only sync with route on initial load
  useEffect(() => {
    if (!isInitialized) {
      setCurrentSection(getInitialSection());
      setCurrentChannel(getInitialChannel());

      // Initialize ticket view from route if present
      const initialTicketView = getInitialTicketView();
      if (initialTicketView) {
        setSelectedTicketView(initialTicketView);

        // Apply filters for the initial view
        const viewFilters: Record<TicketView, Partial<typeof ticketsProvider.filters>> = {
          'my-tickets': { assigneeId: 'me', status: undefined },
          'unassigned': { assigneeId: undefined, status: 'OPEN' }, // Omit assigneeId filter - will need client-side filtering for null
          'all-tickets': { assigneeId: undefined, status: undefined },
          'done': { assigneeId: undefined, status: 'RESOLVED' }
        };

        const newFilters = {
          ...ticketsProvider.filters,
          ...viewFilters[initialTicketView],
          page: 1
        };

        ticketsProvider.setFilters(newFilters);
      }

      // Initialize ticket ID from route if present (for direct ticket links)
      if (frontdeskRoute === 'tickets' && provider && (provider.startsWith('TICKET-') || /^\d+$/.test(provider))) {
        setSelectedTicketId(provider);
        // Set a default view so tickets show in the list
        setSelectedTicketView('all-tickets');
        // Add to open tabs
        setOpenTicketTabs([provider]);
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

    // Fetch tickets with appropriate filters based on view
    // Note: Backend supports assigneeId='me' as special keyword for current user
    const viewFilters: Record<TicketView, Partial<typeof ticketsProvider.filters>> = {
      'my-tickets': { assigneeId: 'me', status: undefined },
      'unassigned': { assigneeId: undefined, status: 'OPEN' }, // Omit assigneeId filter - will need client-side filtering for null
      'all-tickets': { assigneeId: undefined, status: undefined },
      'done': { assigneeId: undefined, status: 'RESOLVED' }
    };

    const newFilters = {
      ...ticketsProvider.filters,
      ...viewFilters[view],
      page: 1
    };

    ticketsProvider.setFilters(newFilters);
    ticketsProvider.fetchTickets(newFilters);

    // Update URL to reflect ticket view
    const viewMap = {
      'my-tickets': 'my-tickets',
      'unassigned': 'unassigned',
      'all-tickets': 'all-tickets',
      'done': 'done'
    };
    const url = `/frontdesk/tickets/${viewMap[view as keyof typeof viewMap]}`;

    // Use window.history API for smoother navigation
    window.history.pushState({}, '', url);
  };

  const handleTicketSelect = (ticketId: string, openInNewTab?: boolean) => {
    if (openInNewTab) {
      // Open ticket in new tab
      const url = `/frontdesk/tickets/${ticketId}`;
      window.open(url, '_blank');
    } else {
      setSelectedTicketId(ticketId);

      // Add to open tabs if not already there
      if (!openTicketTabs.includes(ticketId)) {
        setOpenTicketTabs([...openTicketTabs, ticketId]);
      }

      // Update URL to reflect selected ticket
      const url = `/frontdesk/tickets/${ticketId}`;
      window.history.pushState({}, '', url);
    }
  };

  const handleTicketTabChange = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    const url = `/frontdesk/tickets/${ticketId}`;
    window.history.pushState({}, '', url);
  };

  const handleTicketTabClose = (ticketId: string) => {
    const newTabs = openTicketTabs.filter(id => id !== ticketId);
    setOpenTicketTabs(newTabs);

    // If we're closing the currently selected ticket, switch to another tab or clear selection
    if (selectedTicketId === ticketId) {
      if (newTabs.length > 0) {
        // Switch to the last remaining tab
        handleTicketTabChange(newTabs[newTabs.length - 1]);
      } else {
        // No more tabs open, clear selection
        setSelectedTicketId(null);
        const url = `/frontdesk/tickets/${selectedTicketView || 'all-tickets'}`;
        window.history.pushState({}, '', url);
      }
    }
  };


  const handleTicketClose = () => {
    setSelectedTicketId(null);
  };

  const handleToggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // localStorage sync happens automatically via Recoil atom effects
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
      case 'unassigned':
        return 'Unassigned';
      case 'all-tickets':
        return 'All Tickets';
      case 'done':
        return 'Done';
      default:
        return 'Tickets';
    }
  };

  // Determine if we're in ticket view mode
  const isTicketView = selectedTicketView !== null && selectedTicketView !== undefined;

  return (
    <ThreeColumnLayout
      navigationWidth={sidebarCollapsed ? 64 : 220}
      navigationContent={
        <NavigationSidebar
          selectedChannel={currentChannel}
          selectedSection={currentSection}
          selectedTicketView={selectedTicketView as TicketView | undefined}
          onChannelSelect={handleChannelChange}
          onSectionSelect={handleSectionChange}
          onTicketViewSelect={handleTicketViewChange}
          channelBadges={channelBadges}
          ticketCounts={ticketsProvider.ticketCounts}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />
      }
      listContent={
        isTicketView ? (
          <TicketListPanel
            viewTitle={getTicketViewTitle(selectedTicketView as TicketView)}
            tickets={ticketsProvider.filteredTickets}
            selectedTicketId={ticketsProvider.selectedTicketId}
            searchQuery={ticketsProvider.searchQuery}
            onSearchChange={ticketsProvider.setSearchQuery}
            onTicketSelect={handleTicketSelect}
            onViewChange={(view) => handleTicketViewChange(view as TicketView)}
            isLoading={ticketsLoading}
            error={ticketsError}
            filters={ticketsProvider.filters}
            activeFilterCount={activeFilterCount}
            onApplyFilters={(newFilters) => {
              ticketsProvider.setFilters(newFilters);
              ticketsProvider.fetchTickets(newFilters);
            }}
            onClearFilters={() => {
              const defaultFilters = { page: 1, limit: 20, sortBy: 'createdAt' as const, sortOrder: 'desc' as const };
              ticketsProvider.setFilters(defaultFilters);
              ticketsProvider.fetchTickets(defaultFilters);
            }}
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
            <>
              {/* Ticket Tabs Navigation */}
              {openTicketTabs.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 1,
                    backgroundColor: 'white',
                    borderBottom: '1px solid #E5E7EB',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    minHeight: 48,
                    '&::-webkit-scrollbar': {
                      height: 6
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#CBD5E0',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: '#A0AEC0'
                      }
                    }
                  }}
                >
                  {openTicketTabs.map((tabTicketId) => {
                    const tabTicket = allTickets.find(t => t.id === tabTicketId);
                    if (!tabTicket) return null;

                    const isActive = selectedTicketId === tabTicketId;

                    return (
                      <Box
                        key={tabTicketId}
                        onClick={() => handleTicketTabChange(tabTicketId)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.75,
                          backgroundColor: isActive ? '#3B82F6' : '#F3F4F6',
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          minWidth: 140,
                          maxWidth: 220,
                          border: isActive ? 'none' : '1px solid #E5E7EB',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            backgroundColor: isActive ? '#2563EB' : '#E5E7EB',
                            '& .close-button': {
                              opacity: 1
                            }
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flex: 1,
                            minWidth: 0
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontWeight: isActive ? 600 : 500,
                              fontSize: '0.875rem',
                              color: isActive ? 'white' : '#374151'
                            }}
                          >
                            {tabTicket.ticketNumber}
                          </Typography>
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.5)' : '#9CA3AF',
                              flexShrink: 0
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontSize: '0.813rem',
                              color: isActive ? 'rgba(255, 255, 255, 0.9)' : '#6B7280',
                              flex: 1
                            }}
                          >
                            {tabTicket.conversation?.name || `Ticket #${tabTicket.ticketNumber}`}
                          </Typography>
                        </Box>
                        <IconButton
                          className="close-button"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTicketTabClose(tabTicketId);
                          }}
                          sx={{
                            width: 20,
                            height: 20,
                            p: 0,
                            ml: 0.5,
                            opacity: isActive ? 0.8 : 0,
                            transition: 'all 0.15s ease',
                            flexShrink: 0,
                            '&:hover': {
                              opacity: 1,
                              backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14, color: isActive ? 'white' : '#6B7280' }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Ticket Content */}
              {ticketsProvider.selectedTicket ? (
                <TicketDetailView
                  ticket={ticketsProvider.selectedTicket}
                  onClose={handleTicketClose}
                  onReply={async (content, conversationId) => {
                    if (ticketsProvider.selectedTicket && conversationId) {
                      await ticketsProvider.replyToTicket(ticketsProvider.selectedTicket.id, content, conversationId);
                    } else {
                      console.error('[FrontDeskWidget] Cannot send reply: missing ticket or conversationId');
                    }
                  }}
                  onStatusChange={async (status) => {
                    if (ticketsProvider.selectedTicket) {
                      await ticketsProvider.updateTicketStatus(ticketsProvider.selectedTicket.id, status as any);
                    }
                  }}
                  onPriorityChange={async (priority) => {
                    if (ticketsProvider.selectedTicket) {
                      await ticketsProvider.updateTicketPriority(ticketsProvider.selectedTicket.id, priority as any);
                    }
                  }}
                  onAddTags={async (tagNames) => {
                    if (ticketsProvider.selectedTicket) {
                      await ticketsProvider.addTagsToTicket(ticketsProvider.selectedTicket.id, tagNames);
                    }
                  }}
                  onRemoveTag={async (tagId) => {
                    if (ticketsProvider.selectedTicket) {
                      await ticketsProvider.removeTagFromTicket(ticketsProvider.selectedTicket.id, tagId);
                    }
                  }}
                  onSuggestTags={async (query) => {
                    await ticketsProvider.suggestTags(query, 10);
                    return ticketsProvider.tagSuggestions;
                  }}
                  popularTags={ticketsProvider.popularTags}
                  ticketHistory={ticketsProvider.ticketHistory}
                  relatedTickets={ticketsProvider.relatedTickets}
                  onSelectRelatedTicket={(ticketId) => {
                    ticketsProvider.setSelectedTicketId(ticketId);
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="h6" color="text.secondary">
                    Select a ticket to view details
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            renderMainContent()
          )}
        </ContentArea>
      }
      hideMiddleColumn={!isTicketView}
    />
  );
};

export default FrontdeskWidget;
