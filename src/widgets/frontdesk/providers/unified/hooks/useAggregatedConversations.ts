import { useState, useEffect, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { messagingService } from '@/services/websocket/messaging-service';
import { ticketApiClient } from '../utils/ticket-api-client';
import {
  UnifiedConversation,
  UnifiedFilters,
  UnifiedSortOptions,
  AggregationResult,
  TicketActions,
  TicketStatus,
  TicketPriority
} from '../types/unified.types';
import { aggregateConversations } from '../utils/conversation-aggregator';
import {
  allInternalConversationsSelector,
  ticketAwareConversationsSelector,
  slaMetricsSelector
} from '@/store/frontdesk/selectors/aggregation.selectors';
import {
  unifiedFiltersAtom,
  unifiedSelectedConversationAtom,
  availableAgentsAtom,
  ticketCategoriesAtom,
  selectedTicketHistoryAtom,
  ticketActionsLoadingAtom
} from '@/store/frontdesk/atoms/unified.atoms';

// TODO: Replace with real email and whatsapp conversation atoms when available

export const useAggregatedConversations = (
  filters?: UnifiedFilters,
  sortOptions?: UnifiedSortOptions
) => {
  // Get conversations from each provider
  // Note: These will be replaced with actual provider atoms/hooks
  const emailConversations = []; // useRecoilValue(emailConversationsAtom);
  const whatsappConversations = []; // useRecoilValue(whatsappConversationsAtom);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOptions, setSortOptions] = useState<UnifiedSortOptions>({ by: 'recent', direction: 'desc' });
  
  // Use Recoil atoms for state management
  const filters = useRecoilValue(unifiedFiltersAtom);
  const selectedConversation = useRecoilValue(unifiedSelectedConversationAtom);
  const availableAgents = useRecoilValue(availableAgentsAtom);
  const ticketCategories = useRecoilValue(ticketCategoriesAtom);
  const ticketHistory = useRecoilValue(selectedTicketHistoryAtom);
  const loadingStates = useRecoilValue(ticketActionsLoadingAtom);
  
  // Recoil setters
  const setFilters = useSetRecoilState(unifiedFiltersAtom);
  const setSelectedConversation = useSetRecoilState(unifiedSelectedConversationAtom);
  const setAvailableAgents = useSetRecoilState(availableAgentsAtom);
  const setTicketCategories = useSetRecoilState(ticketCategoriesAtom);
  const setTicketHistory = useSetRecoilState(selectedTicketHistoryAtom);
  const setLoadingStates = useSetRecoilState(ticketActionsLoadingAtom);
  
  // Get ticket-aware conversations using the new selector
  const aggregationResult = useRecoilValue(ticketAwareConversationsSelector);
  const slaMetrics = useRecoilValue(slaMetricsSelector);

  // Demo data state
  const [demoConversations, setDemoConversations] = useState<UnifiedConversation[]>([]);

  // Sample ticket data for demonstration
  const createSampleTicket = () => {
    const ticketStatuses: ('OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED')[] = ['OPEN', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const categories = ['Technical Support', 'Billing', 'Feature Request', 'Bug Report'];
    const agents = ['Alice Johnson', 'Bob Smith', 'Carol Wilson', 'David Chen'];

    const sampleTicket: UnifiedConversation = {
      id: `ticket-${Date.now()}`,
      name: `Customer Issue #${Math.floor(Math.random() * 1000)}`,
      provider: 'internal',
      lastMessage: 'Customer is experiencing issues and needs assistance',
      lastMessageAt: new Date().toISOString(),
      unreadCount: Math.floor(Math.random() * 3) + 1,
      participants: ['customer@example.com', 'support@company.com'],

      // Ticket-specific fields
      isTicket: true,
      ticketId: `TKT-${Math.floor(Math.random() * 10000)}`,
      ticketNumber: Math.floor(Math.random() * 10000),
      ticketStatus: ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assigneeName: agents[Math.floor(Math.random() * agents.length)],
      assigneeId: `agent-${Math.floor(Math.random() * 100)}`,
      categoryName: categories[Math.floor(Math.random() * categories.length)],
      ticketTags: ['support', 'customer'],
      sla: {
        firstResponseDue: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        resolutionDue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        breached: Math.random() > 0.8, // 20% chance of SLA breach
        status: Math.random() > 0.7 ? 'at-risk' : 'normal' as const
      }
    };

    setDemoConversations(prev => [sampleTicket, ...prev]);
    console.log('Sample ticket created:', sampleTicket);
  };

  // Initialize with some demo data
  useEffect(() => {
    if (demoConversations.length === 0) {
      // Create a few sample tickets to start with
      const initialTickets: UnifiedConversation[] = [
        {
          id: 'ticket-1',
          name: 'Login Issues',
          provider: 'email',
          lastMessage: 'Unable to access my account',
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          unreadCount: 2,
          participants: ['john@example.com'],
          isTicket: true,
          ticketId: 'TKT-1001',
          ticketNumber: 1001,
          ticketStatus: 'OPEN',
          priority: 'high',
          assigneeName: 'Alice Johnson',
          assigneeId: 'agent-1',
          categoryName: 'Technical Support',
          ticketTags: ['login', 'urgent'],
          sla: {
            firstResponseDue: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 min from now
            resolutionDue: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
            breached: false,
            status: 'at-risk' as const
          }
        },
        {
          id: 'ticket-2',
          name: 'Billing Question',
          provider: 'whatsapp',
          lastMessage: 'I was charged twice this month',
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          unreadCount: 0,
          participants: ['mary@example.com'],
          isTicket: true,
          ticketId: 'TKT-1002',
          ticketNumber: 1002,
          ticketStatus: 'IN_PROGRESS',
          priority: 'medium',
          assigneeName: 'Bob Smith',
          assigneeId: 'agent-2',
          categoryName: 'Billing',
          ticketTags: ['billing', 'payment'],
          sla: {
            firstResponseDue: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago (breached)
            resolutionDue: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(), // 20 hours from now
            breached: true,
            status: 'breached' as const
          }
        },
        {
          id: 'conv-1',
          name: 'General Inquiry',
          provider: 'internal',
          lastMessage: 'Thanks for the quick response!',
          lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
          unreadCount: 0,
          participants: ['support@company.com'],
          isTicket: false
        }
      ];
      setDemoConversations(initialTickets);
    }
  }, []);

  // Override aggregation result with demo data
  const demoAggregationResult = useMemo(() => {
    let filteredConversations = [...demoConversations];

    // Apply filters
    if (filters.providers && filters.providers.length > 0) {
      filteredConversations = filteredConversations.filter(c =>
        filters.providers!.includes(c.provider)
      );
    }

    if (filters.unreadOnly) {
      filteredConversations = filteredConversations.filter(c => c.unreadCount > 0);
    }

    if (filters.ticketsOnly) {
      filteredConversations = filteredConversations.filter(c => c.isTicket);
    }

    if (filters.ticketStatus && filters.ticketStatus.length > 0) {
      filteredConversations = filteredConversations.filter(c =>
        c.isTicket && c.ticketStatus && filters.ticketStatus!.includes(c.ticketStatus)
      );
    }

    if (filters.priority) {
      filteredConversations = filteredConversations.filter(c => c.priority === filters.priority);
    }

    if (filters.assigned !== undefined) {
      filteredConversations = filteredConversations.filter(c =>
        filters.assigned ? c.assigneeId : !c.assigneeId
      );
    }

    if (filters.slaBreached) {
      filteredConversations = filteredConversations.filter(c =>
        c.isTicket && c.sla?.breached
      );
    }

    if (!filters.showClosed) {
      filteredConversations = filteredConversations.filter(c =>
        !c.isTicket || c.ticketStatus !== 'CLOSED'
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredConversations = filteredConversations.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.lastMessage?.toLowerCase().includes(query) ||
        c.ticketNumber?.toString().includes(query)
      );
    }

    // Apply sorting
    filteredConversations.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.by) {
        case 'recent':
          comparison = new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime();
          break;
        case 'unread':
          comparison = (b.unreadCount || 0) - (a.unreadCount || 0);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0);
          break;
        case 'ticketNumber':
          comparison = (b.ticketNumber || 0) - (a.ticketNumber || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOptions.direction === 'asc' ? -comparison : comparison;
    });

    const emailConversations = demoConversations.filter(c => c.provider === 'email');
    const whatsappConversations = demoConversations.filter(c => c.provider === 'whatsapp');
    const internalConversations = demoConversations.filter(c => c.provider === 'internal');

    return {
      conversations: filteredConversations,
      totalCount: filteredConversations.length,
      unreadCount: filteredConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0),
      byProvider: {
        email: emailConversations.length,
        whatsapp: whatsappConversations.length,
        internal: internalConversations.length
      }
    };
  }, [demoConversations, filters, searchQuery, sortOptions]);

  // Override SLA metrics with demo data
  const demoSlaMetrics = useMemo(() => {
    const tickets = demoConversations.filter(c => c.isTicket);
    const breachedCount = tickets.filter(t => t.sla?.breached).length;
    const atRiskCount = tickets.filter(t => t.sla?.status === 'at-risk').length;
    const totalActiveTickets = tickets.filter(t => t.ticketStatus !== 'CLOSED' && t.ticketStatus !== 'RESOLVED').length;

    return {
      breachedCount,
      atRiskCount,
      totalActiveTickets
    };
  }, [demoConversations]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation: UnifiedConversation) => {
    setSelectedConversation(conversation);
    
    // Load ticket history if it's a ticket
    if (conversation.isTicket && conversation.ticketId) {
      loadTicketHistory(conversation.ticketId);
    }
  };

  // Load ticket history
  const loadTicketHistory = async (ticketId: string) => {
    try {
      const result = await ticketApiClient.getTicketHistory(ticketId);
      if (result.success && result.data) {
        setTicketHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to load ticket history:', error);
    }
  };

  // Load available agents
  const loadAvailableAgents = async () => {
    try {
      const result = await ticketApiClient.getAvailableAgents();
      if (result.success && result.data) {
        setAvailableAgents(result.data);
      }
    } catch (error) {
      console.error('Failed to load available agents:', error);
    }
  };

  // Load ticket categories
  const loadTicketCategories = async () => {
    try {
      const result = await ticketApiClient.getTicketCategories();
      if (result.success && result.data) {
        setTicketCategories(result.data);
      }
    } catch (error) {
      console.error('Failed to load ticket categories:', error);
    }
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
    await Promise.all([
      loadAvailableAgents(),
      loadTicketCategories()
    ]);
  };
  
  // Ticket actions for demo mode
  const ticketActions: TicketActions = {
    assign: async (ticketId: string, assigneeId: string) => {
      setLoadingStates(prev => ({ ...prev, assigning: true }));
      try {
        // In demo mode, update the state directly
        const agent = availableAgents.find(a => a.id === assigneeId);
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? { ...conv, assigneeId, assigneeName: agent?.name || 'Unknown' }
              : conv
          )
        );

        // Update selected conversation if it matches
        if (selectedConversation?.ticketId === ticketId) {
          setSelectedConversation(prev => prev ? {
            ...prev,
            assigneeId,
            assigneeName: agent?.name || 'Unknown'
          } : null);
        }
      } catch (error) {
        console.error('Failed to assign ticket:', error);
        throw error;
      } finally {
        setLoadingStates(prev => ({ ...prev, assigning: false }));
      }
    },

    updateStatus: async (ticketId: string, status: TicketStatus) => {
      setLoadingStates(prev => ({ ...prev, updatingStatus: true }));
      try {
        // In demo mode, update the state directly
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? { ...conv, ticketStatus: status }
              : conv
          )
        );

        // Update selected conversation if it matches
        if (selectedConversation?.ticketId === ticketId) {
          setSelectedConversation(prev => prev ? {
            ...prev,
            ticketStatus: status
          } : null);
        }
      } catch (error) {
        console.error('Failed to update ticket status:', error);
        throw error;
      } finally {
        setLoadingStates(prev => ({ ...prev, updatingStatus: false }));
      }
    },

    updatePriority: async (ticketId: string, priority: TicketPriority) => {
      setLoadingStates(prev => ({ ...prev, updatingPriority: true }));
      try {
        // In demo mode, update the state directly
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? { ...conv, priority }
              : conv
          )
        );

        // Update selected conversation if it matches
        if (selectedConversation?.ticketId === ticketId) {
          setSelectedConversation(prev => prev ? {
            ...prev,
            priority
          } : null);
        }
      } catch (error) {
        console.error('Failed to update ticket priority:', error);
        throw error;
      } finally {
        setLoadingStates(prev => ({ ...prev, updatingPriority: false }));
      }
    },

    addNote: async (ticketId: string, note: string) => {
      setLoadingStates(prev => ({ ...prev, addingNote: true }));
      try {
        // In demo mode, just show a success message
        console.log(`Note added to ticket ${ticketId}: ${note}`);
        // Add to ticket history
        const historyItem: any = {
          id: `history-${Date.now()}`,
          ticketId,
          action: 'note_added',
          note,
          userId: 'current-user',
          userName: 'Current User',
          createdAt: new Date().toISOString()
        };
        setTicketHistory(prev => [...prev, historyItem]);
      } catch (error) {
        console.error('Failed to add ticket note:', error);
        throw error;
      } finally {
        setLoadingStates(prev => ({ ...prev, addingNote: false }));
      }
    },

    reply: async (ticketId: string, content: string) => {
      setLoadingStates(prev => ({ ...prev, replying: true }));
      try {
        // In demo mode, update the last message
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? { ...conv, lastMessage: content, lastMessageAt: new Date().toISOString() }
              : conv
          )
        );
        console.log(`Reply sent to ticket ${ticketId}: ${content}`);
      } catch (error) {
        console.error('Failed to reply to ticket:', error);
        throw error;
      } finally {
        setLoadingStates(prev => ({ ...prev, replying: false }));
      }
    },

    addTag: async (ticketId: string, tag: string) => {
      try {
        // In demo mode, add tag to the conversation
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? {
                  ...conv,
                  ticketTags: [...(conv.ticketTags || []), tag]
                }
              : conv
          )
        );
        console.log(`Tag "${tag}" added to ticket ${ticketId}`);
      } catch (error) {
        console.error('Failed to add ticket tag:', error);
        throw error;
      }
    },

    removeTag: async (ticketId: string, tag: string) => {
      try {
        // In demo mode, remove tag from the conversation
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? {
                  ...conv,
                  ticketTags: (conv.ticketTags || []).filter(t => t !== tag)
                }
              : conv
          )
        );
        console.log(`Tag "${tag}" removed from ticket ${ticketId}`);
      } catch (error) {
        console.error('Failed to remove ticket tag:', error);
        throw error;
      }
    },

    merge: async (sourceTicketId: string, targetTicketId: string) => {
      try {
        // In demo mode, remove the source ticket
        setDemoConversations(prev =>
          prev.filter(conv => conv.ticketId !== sourceTicketId)
        );
        console.log(`Ticket ${sourceTicketId} merged into ${targetTicketId}`);
      } catch (error) {
        console.error('Failed to merge tickets:', error);
        throw error;
      }
    },

    reopen: async (ticketId: string) => {
      try {
        // In demo mode, change status to REOPENED
        setDemoConversations(prev =>
          prev.map(conv =>
            conv.ticketId === ticketId
              ? { ...conv, ticketStatus: 'REOPENED' }
              : conv
          )
        );
        console.log(`Ticket ${ticketId} reopened`);
      } catch (error) {
        console.error('Failed to reopen ticket:', error);
        throw error;
      }
    }
  };

  // Load initial data and set up WebSocket listeners
  useEffect(() => {
    // Set up demo agents and categories for demonstration
    setAvailableAgents([
      { id: 'agent-1', name: 'Alice Johnson', email: 'alice@company.com', avatar: 'AJ' },
      { id: 'agent-2', name: 'Bob Smith', email: 'bob@company.com', avatar: 'BS' },
      { id: 'agent-3', name: 'Carol Wilson', email: 'carol@company.com', avatar: 'CW' },
      { id: 'agent-4', name: 'David Chen', email: 'david@company.com', avatar: 'DC' }
    ]);

    setTicketCategories([
      { id: 'cat-1', name: 'Technical Support', description: 'Technical issues and bugs' },
      { id: 'cat-2', name: 'Billing', description: 'Payment and billing questions' },
      { id: 'cat-3', name: 'Feature Request', description: 'New feature suggestions' },
      { id: 'cat-4', name: 'Bug Report', description: 'Software bugs and issues' }
    ]);

    loadAvailableAgents();
    loadTicketCategories();

    // WebSocket event handlers for real-time ticket updates
    const handleTicketCreated = (data: any) => {
      console.log('New ticket created:', data);
      // TODO: Add new ticket to conversation list
      // This would update the aggregated conversations
    };

    const handleTicketAssigned = (data: { ticketId: string; assigneeId: string; managerId: string }) => {
      console.log('Ticket assigned:', data);
      // TODO: Update ticket assignee in conversation list
      // Update selected conversation if it matches
      if (selectedConversation?.ticketId === data.ticketId) {
        setSelectedConversation(prev => prev ? {
          ...prev,
          assigneeId: data.assigneeId
        } : null);
      }
    };

    const handleTicketStatusChanged = (data: { ticketId: string; oldStatus: string; newStatus: string }) => {
      console.log('Ticket status changed:', data);
      // TODO: Update ticket status in conversation list
      // Update selected conversation if it matches
      if (selectedConversation?.ticketId === data.ticketId) {
        setSelectedConversation(prev => prev ? {
          ...prev,
          ticketStatus: data.newStatus as any
        } : null);
      }
    };

    const handleTicketReplySent = (data: { ticketId: string; userId: string; content: string; isFirstResponse: boolean }) => {
      console.log('Ticket reply sent:', data);
      // Refresh ticket history for the current ticket
      if (selectedConversation?.ticketId === data.ticketId) {
        loadTicketHistory(data.ticketId);
      }
    };

    const handleSLABreach = (data: { ticketId: string; type: 'first_response' | 'resolution'; breachedAt: string }) => {
      console.log('SLA breached:', data);
      // TODO: Update SLA status in conversation list
      // Update selected conversation if it matches
      if (selectedConversation?.ticketId === data.ticketId) {
        setSelectedConversation(prev => prev ? {
          ...prev,
          sla: prev.sla ? {
            ...prev.sla,
            breached: true,
            status: 'breached' as const
          } : undefined
        } : null);
      }
    };

    // Register WebSocket event listeners using getSocket()
    // Note: These event names should match the backend WebSocket event names
    if (typeof window !== 'undefined') {
      const socket = messagingService.getSocket();
      if (socket) {
        socket.on('ticket.created', handleTicketCreated);
        socket.on('ticket.assigned', handleTicketAssigned);
        socket.on('ticket.status.changed', handleTicketStatusChanged);
        socket.on('ticket.reply.sent', handleTicketReplySent);
        socket.on('sla.breached', handleSLABreach);
      }
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        const socket = messagingService.getSocket();
        if (socket) {
          socket.off('ticket.created', handleTicketCreated);
          socket.off('ticket.assigned', handleTicketAssigned);
          socket.off('ticket.status.changed', handleTicketStatusChanged);
          socket.off('ticket.reply.sent', handleTicketReplySent);
          socket.off('sla.breached', handleSLABreach);
        }
      }
    };
  }, [selectedConversation?.ticketId]);
  
  return {
    // State (using demo data for now)
    conversations: demoAggregationResult.conversations,
    totalCount: demoAggregationResult.totalCount,
    unreadCount: demoAggregationResult.unreadCount,
    byProvider: demoAggregationResult.byProvider,
    selectedConversation,
    filters,
    sortOptions,
    searchQuery,

    // Ticket-specific data
    availableAgents,
    ticketCategories,
    ticketHistory,
    slaMetrics: demoSlaMetrics,
    loadingStates,

    // Actions
    selectConversation: handleSelectConversation,
    updateFilters,
    updateSort,
    setSearchQuery,
    clearFilters,
    refreshAll,
    ticketActions,
    createSampleTicket
  };
};;;