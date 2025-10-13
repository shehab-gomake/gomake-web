import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRecoilValue, useRecoilState } from 'recoil';

// Three-column layout components
import { ThreeColumnLayout } from './layouts/three-column';
import { NavigationSidebar, Channel, Section, TicketView as LegacyTicketView } from './layouts/components/NavigationSidebar';
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
  selectedTicketIdAtom,
  openTicketTabsAtom,
  ticketsAtom,
  ticketsLoadingAtom,
  ticketsErrorAtom,
  activeFilterCountSelector
} from '@/store/frontdesk/atoms/tickets.atoms';

// Ticket provider hook
import { useTicketsProvider } from './providers/tickets/hooks/use-tickets-provider';

// Direct messages state (for conversation navigation)
import { dmActiveConversationIdState } from '@/store/direct-messages';

// NEW: Centralized routing system
import { useFrontDeskRouter, RouteType, TicketView } from './routing';

const FrontdeskWidget: React.FC = () => {
  // NEW: Use centralized routing system
  const {
    currentRoute,
    currentSection,
    currentChannel,
    currentTicketView,
    isInTicketMode,
    isInitialized,
    queryParams,
    handleSectionChange,
    handleChannelChange,
    handleTicketViewChange,
    goToTicket,
  } = useFrontDeskRouter();

  // UI state
  const [searchValue, setSearchValue] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

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

  // Direct messages state (for conversation navigation)
  const [activeConversationId, setActiveConversationId] = useRecoilState(dmActiveConversationIdState);

  const channelBadges = useRecoilValue(unreadCountByProviderSelector);

  // Load popular tags when in ticket mode
  useEffect(() => {
    if (isInTicketMode && ticketsProvider.popularTags.length === 0) {
      ticketsProvider.fetchPopularTags({ limit: 10 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInTicketMode]);

  // Initialize ticket view and filters when route changes
  useEffect(() => {
    if (!isInitialized) return;

    if (currentTicketView) {
      // Convert TicketView enum to legacy string
      const legacyViewMap: Record<TicketView, LegacyTicketView> = {
        [TicketView.MY_TICKETS]: 'my-tickets',
        [TicketView.UNASSIGNED]: 'unassigned',
        [TicketView.ALL_TICKETS]: 'all-tickets',
        [TicketView.DONE]: 'done',
        [TicketView.ARCHIVED]: 'archived'
      };

      const legacyView = legacyViewMap[currentTicketView];
      setSelectedTicketView(legacyView as any);

      // Apply filters for the view
      const viewFilters: Record<LegacyTicketView, Partial<typeof ticketsProvider.filters>> = {
        'my-tickets': { assigneeId: 'me', status: undefined },
        'unassigned': { assigneeId: undefined, status: 'OPEN' },
        'all-tickets': { assigneeId: undefined, status: undefined },
        'done': { assigneeId: undefined, status: 'RESOLVED' },
        'archived': { assigneeId: undefined, status: 'CLOSED' }
      };

      const newFilters = {
        ...ticketsProvider.filters,
        ...viewFilters[legacyView],
        page: 1
      };

      ticketsProvider.setFilters(newFilters);
    }
  }, [currentTicketView, isInitialized]);

  // Initialize ticket ID from route
  useEffect(() => {
    if (!isInitialized) return;

    if (currentRoute.type === RouteType.TICKET_DETAIL) {
      const ticketId = currentRoute.ticketId;
      setSelectedTicketId(ticketId);

      // Add to open tabs if not already there
      if (!openTicketTabs.includes(ticketId)) {
        setOpenTicketTabs([...openTicketTabs, ticketId]);
      }

      // Set default view if not set
      if (!currentTicketView) {
        setSelectedTicketView('all-tickets' as any);
      }
    }
  }, [currentRoute, isInitialized]);

  // Initialize conversation ID from query params (from notifications)
  useEffect(() => {
    if (!isInitialized) return;

    if (queryParams.conversation) {
      setActiveConversationId(queryParams.conversation);
    }
  }, [queryParams.conversation, isInitialized]);

  // Synchronize selectedTicketView with routing state
  // This ensures navigation sidebar highlights correctly for LIVE CHATS items
  useEffect(() => {
    if (!isInitialized) return;

    // Clear ticket view when navigating to non-ticket routes
    // Prevents stale ticket view from interfering with channel selection highlighting
    if (!isInTicketMode && selectedTicketView !== null) {
      setSelectedTicketView(null);
    }
  }, [isInTicketMode, isInitialized, selectedTicketView]);

  // Ticket-specific handlers
  const handleTicketViewChangeWithFetch = (view: LegacyTicketView) => {
    // Clear ticket selection when changing view
    setSelectedTicketId(null);

    // Fetch tickets with appropriate filters
    const viewFilters: Record<LegacyTicketView, Partial<typeof ticketsProvider.filters>> = {
      'my-tickets': { assigneeId: 'me', status: undefined },
      'unassigned': { assigneeId: undefined, status: 'OPEN' },
      'all-tickets': { assigneeId: undefined, status: undefined },
      'done': { assigneeId: undefined, status: 'RESOLVED' },
      'archived': { assigneeId: undefined, status: 'CLOSED' }
    };

    const newFilters = {
      ...ticketsProvider.filters,
      ...viewFilters[view],
      page: 1
    };

    ticketsProvider.setFilters(newFilters);
    ticketsProvider.fetchTickets(newFilters);

    // Navigate using routing system (convert to TicketView enum)
    const viewMap: Record<LegacyTicketView, TicketView> = {
      'my-tickets': TicketView.MY_TICKETS,
      'unassigned': TicketView.UNASSIGNED,
      'all-tickets': TicketView.ALL_TICKETS,
      'done': TicketView.DONE,
      'archived': TicketView.ARCHIVED
    };
    handleTicketViewChange(viewMap[view]);
  };

  const handleTicketSelect = (ticketId: string, openInNewTab?: boolean) => {
    if (openInNewTab) {
      goToTicket(ticketId, currentTicketView as any, { newTab: true });
    } else {
      setSelectedTicketId(ticketId);

      // Add to open tabs if not already there
      if (!openTicketTabs.includes(ticketId)) {
        setOpenTicketTabs([...openTicketTabs, ticketId]);
      }

      // Navigate using routing system
      goToTicket(ticketId, currentTicketView as any);
    }
  };

  const handleTicketTabChange = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    goToTicket(ticketId, currentTicketView as any);
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
        // No more tabs open, clear selection and go back to list
        setSelectedTicketId(null);
        handleTicketViewChange(currentTicketView || ('all-tickets' as any));
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
  const getTicketViewTitle = (view: TicketView | LegacyTicketView): string => {
    // Handle both enum and string formats
    const viewStr = typeof view === 'string' ? view : {
      [TicketView.MY_TICKETS]: 'my-tickets',
      [TicketView.UNASSIGNED]: 'unassigned',
      [TicketView.ALL_TICKETS]: 'all-tickets',
      [TicketView.DONE]: 'done',
      [TicketView.ARCHIVED]: 'archived'
    }[view];

    switch (viewStr) {
      case 'my-tickets':
        return 'My Tickets';
      case 'unassigned':
        return 'Unassigned';
      case 'all-tickets':
        return 'All Tickets';
      case 'done':
        return 'Done';
      case 'archived':
        return 'Archived';
      default:
        return 'Tickets';
    }
  };

  return (
    <ThreeColumnLayout
      navigationWidth={sidebarCollapsed ? 64 : 220}
      navigationContent={
        <NavigationSidebar
          selectedChannel={currentChannel}
          selectedSection={currentSection}
          selectedTicketView={selectedTicketView as LegacyTicketView | undefined}
          onChannelSelect={handleChannelChange}
          onSectionSelect={handleSectionChange}
          onTicketViewSelect={(view) => {
            // Convert legacy string to enum
            const viewMap: Record<LegacyTicketView, TicketView> = {
              'my-tickets': TicketView.MY_TICKETS,
              'unassigned': TicketView.UNASSIGNED,
              'all-tickets': TicketView.ALL_TICKETS,
              'done': TicketView.DONE,
              'archived': TicketView.ARCHIVED
            };
            handleTicketViewChange(viewMap[view]);
          }}
          channelBadges={channelBadges}
          ticketCounts={ticketsProvider.ticketCounts}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />
      }
      listContent={
        isInTicketMode ? (
          <TicketListPanel
            viewTitle={getTicketViewTitle(currentTicketView as TicketView)}
            tickets={ticketsProvider.filteredTickets}
            selectedTicketId={ticketsProvider.selectedTicketId}
            searchQuery={ticketsProvider.searchQuery}
            onSearchChange={ticketsProvider.setSearchQuery}
            onTicketSelect={handleTicketSelect}
            onViewChange={(view) => handleTicketViewChangeWithFetch(view as LegacyTicketView)}
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
            onTagClick={(tag) => {
              // Filter tickets by clicked tag
              const newFilters = {
                ...ticketsProvider.filters,
                tags: [tag.name],
                page: 1,
              };
              ticketsProvider.setFilters(newFilters);
              ticketsProvider.fetchTickets(newFilters);
            }}
            popularTags={ticketsProvider.popularTags}
            onFetchPopularTags={() => ticketsProvider.fetchPopularTags({ limit: 10 })}
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
          {isInTicketMode ? (
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
                  onTicketUpdate={async (updatedTicket) => {
                    // Refresh tickets to get the latest data
                    await ticketsProvider.refreshTickets();
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
      hideMiddleColumn={!isInTicketMode}
    />
  );
};

export default FrontdeskWidget;
