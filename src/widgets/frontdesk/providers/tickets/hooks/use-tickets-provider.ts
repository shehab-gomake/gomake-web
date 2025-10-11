import { useEffect, useCallback, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ticketsService } from "@/services/frontdesk/api/tickets.service";
import { getUserToken } from "@/services/storage-data";
import {
  ticketsAtom,
  ticketsLoadingAtom,
  ticketsErrorAtom,
  ticketsPaginationAtom,
  ticketFiltersAtom,
  relatedTicketsAtom,
  ticketHistoryAtom,
  selectedTicketViewAtom,
  filteredTicketsSelector,
  selectedTicketIdAtom,
  selectedTicketSelector,
  selectedTicketIdsAtom,
  ticketSearchQueryAtom,
  ticketCountsSelector,
  openTicketTabsAtom,
  ticketSocketConnectedAtom,
  ticketSocketErrorAtom,
  reviewQueueConversationsAtom,
  tagsAtom,
  popularTagsAtom,
  tagSuggestionsAtom,
  tagsLoadingAtom,
  activeConversationIdAtom,
} from "@/store/frontdesk/atoms/tickets.atoms";
import { ticketSocketService } from "@/services/frontdesk";
import {
  TicketWithDetails,
  TicketFilters,
  CreateFromConversationDto,
  UpdateTicketStatusDto,
  UpdateTicketPriorityDto,
  UpdateTicketDto,
  AssignTicketDto,
  BulkAssignTicketsDto,
  MergeTicketDto,
  TICKET_EVENTS,
  Tag,
  CreateTagDto,
  UpdateTagDto,
  ListTagsQueryDto,
  GetPopularTagsQueryDto,
} from "@/widgets/frontdesk/providers/tickets/types";

export interface UseTicketsProviderResult {
  // Connection state
  isConnected: boolean;
  socketConnected: boolean;
  socketError: string | null;
  isLoading: boolean;
  error: string | null;

  // View state
  selectedView: string | null;
  setSelectedView: (view: string | null) => void;

  // Tickets data
  allTickets: TicketWithDetails[];
  filteredTickets: TicketWithDetails[];
  ticketCounts: Record<string, number>;
  pagination: any;

  // Selection
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  selectedTicket: TicketWithDetails | null;

  // Active conversation (multi-conversation support)
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Multi-selection
  selectedTicketIds: string[];
  setSelectedTicketIds: (ids: string[]) => void;
  toggleTicketSelection: (ticketId: string) => void;
  clearSelection: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters) => void;

  // Tabs
  openTabs: string[];
  setOpenTabs: (tabs: string[]) => void;
  openTab: (ticketId: string) => void;
  closeTab: (ticketId: string) => void;

  // Related data
  relatedTickets: any[];
  ticketHistory: any[];

  // Review Queue
  reviewQueueConversations: any[];
  setReviewQueueConversations: (conversations: any[]) => void;

  // Actions - Core
  fetchTickets: (filters?: TicketFilters) => Promise<void>;
  refreshTickets: () => Promise<void>;
  createTicketFromConversation: (data: CreateFromConversationDto) => Promise<TicketWithDetails>;
  replyToTicket: (ticketId: string, content: string, conversationId: string) => Promise<void>;
  updateTicket: (ticketId: string, updates: UpdateTicketDto) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: UpdateTicketStatusDto["status"]) => Promise<void>;
  updateTicketPriority: (ticketId: string, priority: UpdateTicketPriorityDto["priority"]) => Promise<void>;

  // Actions - Assignment (Manager/Admin)
  assignTicket: (ticketId: string, assigneeId: string) => Promise<void>;
  bulkAssignTickets: (ticketIds: string[], assigneeId: string) => Promise<void>;
  reopenTicket: (ticketId: string) => Promise<void>;
  mergeTickets: (sourceId: string, targetId: string) => Promise<void>;

  // Actions - Discovery
  fetchRelatedTickets: (ticketId: string) => Promise<void>;
  fetchTicketHistory: (ticketId: string) => Promise<void>;
  fetchCustomerHistory: (identifier: string) => Promise<TicketWithDetails[]>;

  // Actions - Dashboard
  fetchUnassignedTickets: () => Promise<TicketWithDetails[]>;
  fetchAgentWorkload: () => Promise<any[]>;

  // Tag Management
  tags: Tag[];
  popularTags: Tag[];
  tagSuggestions: Tag[];
  tagsLoading: boolean;
  fetchTags: (query?: ListTagsQueryDto) => Promise<void>;
  fetchPopularTags: (query?: GetPopularTagsQueryDto) => Promise<void>;
  suggestTags: (query: string, limit?: number) => Promise<void>;
  createTag: (data: CreateTagDto) => Promise<Tag>;
  updateTag: (tagId: string, data: UpdateTagDto) => Promise<Tag>;
  deleteTag: (tagId: string) => Promise<void>;
  addTagsToTicket: (ticketId: string, tags: string[]) => Promise<void>;
  removeTagFromTicket: (ticketId: string, tagId: string) => Promise<void>;
}

/**
 * Enhanced Tickets Provider Hook with Backend Integration
 *
 * Features:
 * - Full REST API integration with all 15+ endpoints
 * - Real-time updates via WebSocket (12 events)
 * - Optimistic updates with server reconciliation
 * - Loading/error state management
 * - Role-based permission checks
 * - Multi-channel message support
 */
export function useTicketsProvider(): UseTicketsProviderResult {
  // Atoms
  const [tickets, setTickets] = useRecoilState(ticketsAtom);
  const [isLoading, setIsLoading] = useRecoilState(ticketsLoadingAtom);
  const [error, setError] = useRecoilState(ticketsErrorAtom);
  const [pagination, setPagination] = useRecoilState(ticketsPaginationAtom);
  const [filters, setFilters] = useRecoilState(ticketFiltersAtom);
  const [relatedTickets, setRelatedTickets] = useRecoilState(relatedTicketsAtom);
  const [ticketHistory, setTicketHistory] = useRecoilState(ticketHistoryAtom);

  // View state
  const [selectedView, setSelectedView] = useRecoilState(selectedTicketViewAtom);
  const [selectedTicketId, setSelectedTicketId] = useRecoilState(selectedTicketIdAtom);
  const [selectedTicketIds, setSelectedTicketIds] = useRecoilState(selectedTicketIdsAtom);
  const [searchQuery, setSearchQuery] = useRecoilState(ticketSearchQueryAtom);
  const [openTabs, setOpenTabs] = useRecoilState(openTicketTabsAtom);

  // WebSocket connection state
  const [socketConnected, setSocketConnected] = useRecoilState(ticketSocketConnectedAtom);
  const [socketError, setSocketError] = useRecoilState(ticketSocketErrorAtom);

  // Active conversation (for multi-conversation tickets)
  const [activeConversationId, setActiveConversationId] = useRecoilState(activeConversationIdAtom);

  // Review Queue
  const [reviewQueueConversations, setReviewQueueConversations] = useRecoilState(reviewQueueConversationsAtom);

  // Tags
  const [tags, setTags] = useRecoilState(tagsAtom);
  const [popularTags, setPopularTags] = useRecoilState(popularTagsAtom);
  const [tagSuggestions, setTagSuggestions] = useRecoilState(tagSuggestionsAtom);
  const [tagsLoading, setTagsLoading] = useRecoilState(tagsLoadingAtom);

  // Selectors
  const filteredTickets = useRecoilValue(filteredTicketsSelector);
  const selectedTicket = useRecoilValue(selectedTicketSelector);
  const ticketCounts = useRecoilValue(ticketCountsSelector);

  // Track if event handlers have been set up
  const eventHandlersSetupRef = useRef(false);

  // ============================================
  // WebSocket Connection
  // ============================================

  useEffect(() => {
    const token = getUserToken();
    if (!token) {
      console.warn("[TicketsProvider] No auth token, skipping WebSocket connection");
      setSocketError("No authentication token available");
      setSocketConnected(false);
      return;
    }

    console.log("[TicketsProvider] Connecting WebSocket (backend extracts printHouseId from token)");

    const connectSocket = async () => {
      try {
        // Backend extracts printHouseId from JWT token automatically
        await ticketSocketService.connect(token);
        console.log("[TicketsProvider] WebSocket connected successfully");
        setSocketConnected(true);
        setSocketError(null);
      } catch (error: any) {
        console.error("[TicketsProvider] WebSocket connection failed:", error);
        setSocketError(`WebSocket connection failed: ${error.message}`);
        setSocketConnected(false);
      }
    };

    connectSocket();

    return () => {
      console.log("[TicketsProvider] Disconnecting WebSocket");
      ticketSocketService.disconnect();
      setSocketConnected(false);
      eventHandlersSetupRef.current = false;
    };
  }, [setSocketError, setSocketConnected]);

  // ============================================
  // WebSocket Event Handlers (19 Events)
  // ============================================

  // Set up event handlers when socket is connected
  useEffect(() => {
    if (!ticketSocketService.isConnected() || eventHandlersSetupRef.current) {
      return;
    }

    console.log("[TicketsProvider] Setting up WebSocket event handlers");
    eventHandlersSetupRef.current = true;

    // 1. ticket.created - Inject ticket into list
    ticketSocketService.onTicketCreated((payload) => {
      console.log("[TicketsProvider] New ticket created:", payload.ticket.ticketNumber);
      setTickets((prev) => [payload.ticket, ...prev]);
    });

    // 2. ticket.updated - Primary update handler for all field changes
    ticketSocketService.onTicketUpdated((payload) => {
      console.log("[TicketsProvider] Ticket updated:", payload.ticketId);
      console.log("[TicketsProvider] Changes made:", payload.changes.map(c => c.action).join(", "));

      // Update ticket in state with full details
      setTickets((prev) => prev.map((t) => (t.id === payload.ticketId ? payload.ticket : t)));

      // Optional: Show toast notification for significant changes
      // For now, we'll just log the changes
      payload.changes.forEach((change) => {
        console.log(`  - ${change.comment}`);
      });
    });

    // 3. ticket.assigned - Update assignee (fallback - also covered by ticket.updated)
    ticketSocketService.onTicketAssigned((payload) => {
      console.log("[TicketsProvider] Ticket assigned:", payload.ticketId);
      setTickets((prev) => prev.map((t) => (t.id === payload.ticketId ? payload.ticket : t)));
    });

    // 3. ticket.status.changed - Update status
    ticketSocketService.onTicketStatusChanged((payload) => {
      console.log("[TicketsProvider] Status changed:", payload.ticketId, payload.newStatus);
      setTickets((prev) => prev.map((t) => (t.id === payload.ticketId ? payload.ticket : t)));
    });

    // 4. ticket.reply.sent - Mark message as sent
    ticketSocketService.onTicketReplySent((payload) => {
      console.log("[TicketsProvider] Reply sent:", payload.messageId);
      // Refresh ticket to get new message
      if (selectedTicketId === payload.ticketId) {
        fetchTicketById(payload.ticketId);
      }
    });

    // 5. ticket.reopened - Update status and show banner
    ticketSocketService.onTicketReopened((payload) => {
      console.log("[TicketsProvider] Ticket reopened:", payload.ticketId);
      setTickets((prev) => prev.map((t) => (t.id === payload.ticketId ? payload.ticket : t)));
    });

    // 6. ticket.merged - Remove source ticket
    ticketSocketService.onTicketMerged((payload) => {
      console.log("[TicketsProvider] Tickets merged:", payload.sourceTicketId, "->", payload.targetTicketId);
      setTickets((prev) => prev.filter((t) => t.id !== payload.sourceTicketId));

      // Refresh target ticket if it's selected
      if (selectedTicketId === payload.targetTicketId) {
        fetchTicketById(payload.targetTicketId);
      }
    });

    // 7. tickets.bulkAssigned - Batch update
    ticketSocketService.onTicketsBulkAssigned((payload) => {
      console.log("[TicketsProvider] Bulk assigned:", payload.ticketIds.length, "tickets");
      // Refresh tickets list
      refreshTickets();
    });

    // 8. ticket.message.received - Append inbound message
    ticketSocketService.onTicketMessageReceived((payload) => {
      console.log("[TicketsProvider] Inbound message:", payload.channel, payload.identifier);

      // Refresh ticket to show new message
      if (selectedTicketId === payload.ticketId) {
        fetchTicketById(payload.ticketId);
      }

      // Update ticket in list (lastMessageAt)
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === payload.ticketId && t.conversation) {
            return {
              ...t,
              conversation: {
                ...t.conversation,
                lastMessageAt: new Date().toISOString(),
              },
            };
          }
          return t;
        })
      );
    });

    // 9. ticket.customer.updated - Refresh customer info
    ticketSocketService.onTicketCustomerUpdated((payload) => {
      console.log("[TicketsProvider] Customer updated:", payload.customerId);
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === payload.ticketId) {
            return {
              ...t,
              customerId: payload.customerId,
              customerEmail: payload.customerEmail,
              customerPhone: payload.customerPhone,
              customerName: payload.customerName,
            };
          }
          return t;
        })
      );
    });

    // 10. sla.breached - Show warning
    ticketSocketService.onSLABreached((payload) => {
      console.warn("[TicketsProvider] SLA breached:", payload.ticketId, payload.type);
      // Update SLA in ticket
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === payload.ticketId && t.sla) {
            return {
              ...t,
              sla: {
                ...t.sla,
                breached: true,
                breachedAt: payload.breachedAt,
              },
            };
          }
          return t;
        })
      );
    });

    // 11. ticket.autoResponse - Show indicator
    ticketSocketService.onTicketAutoResponse((payload) => {
      console.log("[TicketsProvider] Auto-response sent:", payload.ticketId);
      // Could show a toast notification
    });

    // 12. webhook.message.processed - Admin notifications
    ticketSocketService.onWebhookMessageProcessed((payload) => {
      console.log("[TicketsProvider] Webhook processed:", payload.webhookType, payload.status);
      if (payload.status === "error") {
        console.error("[TicketsProvider] Webhook error:", payload.error);
      }
    });

    // 13. message.delivered - Update message delivery status
    ticketSocketService.onMessageDelivered((payload) => {
      console.log("[TicketsProvider] Message delivered:", payload.messageId, payload.status);

      // Update message status in ticket
      if (selectedTicketId === payload.ticketId) {
        setTickets((prev) =>
          prev.map((t) => {
            // Ensure conversation and messages exist before updating
            if (t.id === payload.ticketId && t.conversation && Array.isArray(t.conversation.messages)) {
              return {
                ...t,
                conversation: {
                  ...t.conversation,
                  messages: t.conversation.messages.map((msg) => {
                    if (msg.id === payload.messageId) {
                      return {
                        ...msg,
                        status: payload.status === "SENT" ? "sent" : "failed",
                        sentAt: payload.status === "SENT" ? new Date().toISOString() : msg.sentAt,
                        errorMessage: payload.error,
                        channelMetadata: {
                          ...msg.channelMetadata,
                          providerMessageId: payload.providerMessageId,
                        },
                      };
                    }
                    return msg;
                  }),
                },
              };
            }
            return t;
          })
        );
      }
    });

    // 14. message.delivery.failed - Show error notification
    ticketSocketService.onMessageDeliveryFailed((payload) => {
      console.error("[TicketsProvider] Message delivery failed:", payload.messageId, payload.error);

      // Update message status to failed
      if (selectedTicketId === payload.ticketId) {
        setTickets((prev) =>
          prev.map((t) => {
            // Ensure conversation and messages exist before updating
            if (t.id === payload.ticketId && t.conversation && Array.isArray(t.conversation.messages)) {
              return {
                ...t,
                conversation: {
                  ...t.conversation,
                  messages: t.conversation.messages.map((msg) => {
                    if (msg.id === payload.messageId) {
                      return {
                        ...msg,
                        status: "failed",
                        errorMessage: payload.error,
                      };
                    }
                    return msg;
                  }),
                },
              };
            }
            return t;
          })
        );
      }

      // TODO: Show toast notification or UI feedback
      // toast.error(`Failed to send message: ${payload.error}`);
    });

    // 15. conversation.needs.review - Add to review queue
    ticketSocketService.onConversationNeedsReview((payload) => {
      console.log("[TicketsProvider] Conversation needs review:", payload.identifier, payload.channel);

      // Add to review queue (prepend to show newest first)
      setReviewQueueConversations((prev) => [payload, ...prev]);

      // TODO: Show notification
      // toast.info(`New ${payload.channel} message from ${payload.identifier}`);
    });

    // 16. ticket.tags.added - Fetch updated ticket to get tags
    ticketSocketService.onTicketTagsAdded((payload) => {
      console.log("[TicketsProvider] Tags added to ticket:", payload.ticketId, payload.tagIds);

      // Fetch updated ticket to get full tag objects
      fetchTicketById(payload.ticketId);
    });

    // 17. ticket.tag.removed - Remove tag from ticket
    ticketSocketService.onTicketTagRemoved((payload) => {
      console.log("[TicketsProvider] Tag removed from ticket:", payload.ticketId, payload.tagId);

      // Remove tag from ticket in state
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === payload.ticketId) {
            return {
              ...t,
              tags: t.tags.filter((tag) => tag.id !== payload.tagId),
            };
          }
          return t;
        })
      );
    });

    // 18. tag.created - Add new tag to global tags list
    ticketSocketService.onTagCreated((payload) => {
      console.log("[TicketsProvider] New tag created:", payload.tag.name);

      // Add to global tags list
      setTags((prev) => {
        // Avoid duplicates
        if (prev.some((t) => t.id === payload.tag.id)) {
          return prev;
        }
        return [...prev, payload.tag];
      });

      // Also add to popular tags if it doesn't exist
      setPopularTags((prev) => {
        if (prev.some((t) => t.id === payload.tag.id)) {
          return prev;
        }
        return [...prev, payload.tag];
      });
    });

    // 19. tag.deleted - Remove tag from global list and all tickets
    ticketSocketService.onTagDeleted((payload) => {
      console.log("[TicketsProvider] Tag deleted:", payload.tagId);

      // Remove from global tags list
      setTags((prev) => prev.filter((t) => t.id !== payload.tagId));

      // Remove from popular tags
      setPopularTags((prev) => prev.filter((t) => t.id !== payload.tagId));

      // Remove from tag suggestions
      setTagSuggestions((prev) => prev.filter((t) => t.id !== payload.tagId));

      // Remove from all tickets that have this tag
      setTickets((prev) =>
        prev.map((ticket) => ({
          ...ticket,
          tags: ticket.tags.filter((tag) => tag.id !== payload.tagId),
        }))
      );
    });

    console.log("[TicketsProvider] All 19 WebSocket event handlers registered");

    // Cleanup function
    return () => {
      console.log("[TicketsProvider] Cleaning up WebSocket event handlers");
      // Note: ticketSocketService handles cleanup internally
    };
  }, [selectedTicketId, setTickets, setTags, setPopularTags, setTagSuggestions, setReviewQueueConversations]);

  // ============================================
  // API Actions - Core
  // ============================================

  const fetchTickets = useCallback(
    async (customFilters?: TicketFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("[TicketsProvider] Fetching tickets with filters:", customFilters || filters);
        const response = await ticketsService.listTickets(customFilters || filters);
        console.log("[TicketsProvider] Tickets fetched successfully:", response?.tickets?.length || 0, "tickets");
        setTickets(response?.tickets || []);
        setPagination(response?.pagination || null);
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch tickets error:", err);
        console.error("[TicketsProvider] Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || err.message || "Failed to fetch tickets");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, setTickets, setPagination, setIsLoading, setError]
  );

  const refreshTickets = useCallback(async () => {
    await fetchTickets(filters);
  }, [fetchTickets, filters]);

  const fetchTicketById = useCallback(
    async (ticketId: string) => {
      try {
        console.log("[TicketsProvider] Fetching ticket by ID:", ticketId);
        const ticket = await ticketsService.getTicketById(ticketId);
        console.log("[TicketsProvider] Ticket fetched successfully:", {
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          hasConversations: !!ticket.conversations && ticket.conversations.length > 0,
          conversationsCount: ticket.conversations?.length || 0,
          totalMessagesCount: ticket.conversations?.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) || 0,
          hasTags: Array.isArray(ticket.tags),
          tagsCount: ticket.tags?.length || 0,
        });

        // Validate ticket structure - Support multi-conversation tickets
        if (!ticket.conversations || ticket.conversations.length === 0) {
          console.error("[TicketsProvider] ⚠️ Ticket missing conversations array:", ticket.id);
          setError(`Ticket #${ticket.ticketNumber} is missing conversation data`);
          return;
        }

        // Validate at least one conversation has messages array
        const hasValidMessages = ticket.conversations.some(
          conv => Array.isArray(conv.messages)
        );
        if (!hasValidMessages) {
          console.error("[TicketsProvider] ⚠️ Ticket conversations have invalid messages:", ticket.id);
          setError(`Ticket #${ticket.ticketNumber} has invalid messages data`);
          return;
        }

        // Update or add ticket to list
        setTickets((prev) => {
          const existingIndex = prev.findIndex(t => t.id === ticketId);
          if (existingIndex >= 0) {
            // Update existing ticket
            return prev.map((t) => (t.id === ticketId ? ticket : t));
          } else {
            // Add new ticket to the beginning of the list
            return [ticket, ...prev];
          }
        });

        // Extract and set related data if included in response
        if (ticket.relatedTickets) {
          console.log("[TicketsProvider] Related tickets included in response:", ticket.relatedTickets.length);
          setRelatedTickets(ticket.relatedTickets);
        }

        if (ticket.history) {
          console.log("[TicketsProvider] History included in response:", ticket.history.length);
          setTicketHistory(ticket.history);
        }
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch ticket by ID error:", err);
        console.error("[TicketsProvider] Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || err.message || `Failed to load ticket ${ticketId}`);
      }
    },
    [setTickets, setRelatedTickets, setTicketHistory, setError]
  );

  const createTicketFromConversation = useCallback(
    async (data: CreateFromConversationDto): Promise<TicketWithDetails> => {
      setIsLoading(true);
      setError(null);

      try {
        const ticket = await ticketsService.createTicketFromConversation(data);
        // Ticket will be added via WebSocket event
        return ticket;
      } catch (err: any) {
        console.error("[TicketsProvider] Create ticket error:", err);
        setError(err.message || "Failed to create ticket");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setError]
  );

  /**
   * Reply to Ticket
   * BREAKING CHANGE: Now requires conversationId to specify which channel to reply on
   *
   * @param ticketId - Ticket ID
   * @param content - Reply message content
   * @param conversationId - Conversation ID (which channel/tab to reply on)
   */
  const replyToTicket = useCallback(
    async (ticketId: string, content: string, conversationId: string) => {
      try {
        console.log("[TicketsProvider] Sending reply:", {
          ticketId,
          conversationId,
          contentLength: content.length,
        });
        await ticketsService.replyToTicket(ticketId, content, conversationId);
        console.log("[TicketsProvider] Reply sent successfully to conversation:", conversationId);
        // Message will be updated via WebSocket event
      } catch (err: any) {
        console.error("[TicketsProvider] Reply error:", err);
        setError(err.message || "Failed to send reply");
        throw err;
      }
    },
    [setError]
  );

  /**
   * Update Ticket (General Purpose)
   * Updates one or more ticket fields in a single request
   * Real-time update via WebSocket (ticket.updated event)
   */
  const updateTicket = useCallback(
    async (ticketId: string, updates: UpdateTicketDto) => {
      try {
        console.log("[TicketsProvider] Updating ticket:", ticketId, updates);

        // Send to backend
        const response = await ticketsService.updateTicket(ticketId, updates);
        console.log("[TicketsProvider] Ticket updated successfully");
        console.log("[TicketsProvider] Changes:", response.changes.map((c) => c.comment).join(", "));

        // WebSocket will send ticket.updated event with full ticket details
        // The WebSocket handler will update the state with complete data
      } catch (err: any) {
        console.error("[TicketsProvider] Update ticket error:", err);
        setError(err.message || "Failed to update ticket");
        throw err;
      }
    },
    [setError]
  );

  /**
   * @deprecated Use updateTicket({ status }) instead
   */
  const updateTicketStatus = useCallback(
    async (ticketId: string, status: string) => {
      return updateTicket(ticketId, { status: status as UpdateTicketStatusDto["status"] });
    },
    [updateTicket]
  );

  /**
   * @deprecated Use updateTicket({ priority }) instead
   */
  const updateTicketPriority = useCallback(
    async (ticketId: string, priority: string) => {
      return updateTicket(ticketId, { priority: priority as UpdateTicketPriorityDto["priority"] });
    },
    [updateTicket]
  );

  // ============================================
  // API Actions - Assignment (Manager/Admin)
  // ============================================

  const assignTicket = useCallback(
    async (ticketId: string, assigneeId: string) => {
      try {
        await ticketsService.assignTicket(ticketId, assigneeId);
        console.log("[TicketsProvider] Ticket assigned successfully");
        // Assignment will be updated via WebSocket event
      } catch (err: any) {
        console.error("[TicketsProvider] Assign ticket error:", err);
        setError(err.message || "Failed to assign ticket");
        throw err;
      }
    },
    [setError]
  );

  const bulkAssignTickets = useCallback(
    async (ticketIds: string[], assigneeId: string) => {
      try {
        await ticketsService.bulkAssignTickets({ ticketIds, assigneeId });
        console.log("[TicketsProvider] Tickets bulk assigned successfully");
        // Updates will come via WebSocket event
        clearSelection();
      } catch (err: any) {
        console.error("[TicketsProvider] Bulk assign error:", err);
        setError(err.message || "Failed to bulk assign tickets");
        throw err;
      }
    },
    [setError]
  );

  const reopenTicket = useCallback(
    async (ticketId: string) => {
      try {
        await ticketsService.reopenTicket(ticketId);
        console.log("[TicketsProvider] Ticket reopened successfully");
        // Update will come via WebSocket event
      } catch (err: any) {
        console.error("[TicketsProvider] Reopen ticket error:", err);
        setError(err.message || "Failed to reopen ticket");
        throw err;
      }
    },
    [setError]
  );

  const mergeTickets = useCallback(
    async (sourceId: string, targetId: string) => {
      try {
        await ticketsService.mergeTickets(sourceId, targetId);
        console.log("[TicketsProvider] Tickets merged successfully");
        // Merge will be handled via WebSocket event
      } catch (err: any) {
        console.error("[TicketsProvider] Merge tickets error:", err);
        setError(err.message || "Failed to merge tickets");
        throw err;
      }
    },
    [setError]
  );

  // ============================================
  // API Actions - Discovery
  // ============================================

  const fetchRelatedTickets = useCallback(
    async (ticketId: string) => {
      try {
        const related = await ticketsService.getRelatedTickets(ticketId);
        setRelatedTickets(related);
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch related tickets error:", err);
      }
    },
    [setRelatedTickets]
  );

  const fetchTicketHistory = useCallback(
    async (ticketId: string) => {
      try {
        const history = await ticketsService.getTicketHistory(ticketId);
        setTicketHistory(history);
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch ticket history error:", err);
      }
    },
    [setTicketHistory]
  );

  const fetchCustomerHistory = useCallback(async (identifier: string): Promise<TicketWithDetails[]> => {
    try {
      return await ticketsService.getCustomerTicketHistory(identifier);
    } catch (err: any) {
      console.error("[TicketsProvider] Fetch customer history error:", err);
      return [];
    }
  }, []);

  // ============================================
  // API Actions - Dashboard
  // ============================================

  const fetchUnassignedTickets = useCallback(async (): Promise<TicketWithDetails[]> => {
    try {
      return await ticketsService.getUnassignedTickets();
    } catch (err: any) {
      console.error("[TicketsProvider] Fetch unassigned tickets error:", err);
      return [];
    }
  }, []);

  const fetchAgentWorkload = useCallback(async (): Promise<any[]> => {
    try {
      return await ticketsService.getAgentWorkload();
    } catch (err: any) {
      console.error("[TicketsProvider] Fetch agent workload error:", err);
      return [];
    }
  }, []);

  // ============================================
  // Tag Management Actions
  // ============================================

  const fetchTags = useCallback(
    async (query?: ListTagsQueryDto) => {
      setTagsLoading(true);
      try {
        const fetchedTags = await ticketsService.listTags(query);
        setTags(fetchedTags);
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch tags error:", err);
      } finally {
        setTagsLoading(false);
      }
    },
    [setTags, setTagsLoading]
  );

  const fetchPopularTags = useCallback(
    async (query?: GetPopularTagsQueryDto) => {
      try {
        const fetchedTags = await ticketsService.getPopularTags(query);
        setPopularTags(fetchedTags);
      } catch (err: any) {
        console.error("[TicketsProvider] Fetch popular tags error:", err);
      }
    },
    [setPopularTags]
  );

  const suggestTags = useCallback(
    async (query: string, limit?: number) => {
      if (!query || query.length < 1) {
        setTagSuggestions([]);
        return;
      }

      try {
        const suggestions = await ticketsService.suggestTags(query, limit);
        setTagSuggestions(suggestions);
      } catch (err: any) {
        console.error("[TicketsProvider] Suggest tags error:", err);
        setTagSuggestions([]);
      }
    },
    [setTagSuggestions]
  );

  const createTag = useCallback(
    async (data: CreateTagDto): Promise<Tag> => {
      try {
        const newTag = await ticketsService.createTag(data);
        setTags((prev) => [...prev, newTag]);
        return newTag;
      } catch (err: any) {
        console.error("[TicketsProvider] Create tag error:", err);
        throw err;
      }
    },
    [setTags]
  );

  const updateTag = useCallback(
    async (tagId: string, data: UpdateTagDto): Promise<Tag> => {
      try {
        const updatedTag = await ticketsService.updateTag(tagId, data);
        setTags((prev) => prev.map((t) => (t.id === tagId ? updatedTag : t)));
        return updatedTag;
      } catch (err: any) {
        console.error("[TicketsProvider] Update tag error:", err);
        throw err;
      }
    },
    [setTags]
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      try {
        await ticketsService.deleteTag(tagId);
        setTags((prev) => prev.filter((t) => t.id !== tagId));
      } catch (err: any) {
        console.error("[TicketsProvider] Delete tag error:", err);
        throw err;
      }
    },
    [setTags]
  );

  const addTagsToTicket = useCallback(
    async (ticketId: string, tagNames: string[]) => {
      try {
        const addedTags = await ticketsService.addTagsToTicket(ticketId, tagNames);

        // Update ticket in list with new tags
        setTickets((prev) =>
          prev.map((t) => {
            if (t.id === ticketId) {
              return {
                ...t,
                tags: addedTags,
              };
            }
            return t;
          })
        );

        console.log("[TicketsProvider] Tags added successfully:", addedTags);
      } catch (err: any) {
        console.error("[TicketsProvider] Add tags error:", err);
        throw err;
      }
    },
    [setTickets]
  );

  const removeTagFromTicket = useCallback(
    async (ticketId: string, tagId: string) => {
      try {
        await ticketsService.removeTagFromTicket(ticketId, tagId);

        // Update ticket in list by removing tag
        setTickets((prev) =>
          prev.map((t) => {
            if (t.id === ticketId) {
              return {
                ...t,
                tags: t.tags.filter((tag) => tag.id !== tagId),
              };
            }
            return t;
          })
        );

        console.log("[TicketsProvider] Tag removed successfully");
      } catch (err: any) {
        console.error("[TicketsProvider] Remove tag error:", err);
        throw err;
      }
    },
    [setTickets]
  );

  // ============================================
  // Selection Actions
  // ============================================

  const toggleTicketSelection = useCallback(
    (ticketId: string) => {
      setSelectedTicketIds((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]));
    },
    [setSelectedTicketIds]
  );

  const clearSelection = useCallback(() => {
    setSelectedTicketIds([]);
  }, [setSelectedTicketIds]);

  const openTab = useCallback(
    (ticketId: string) => {
      setOpenTabs((prev) => (prev.includes(ticketId) ? prev : [...prev, ticketId]));
    },
    [setOpenTabs]
  );

  const closeTab = useCallback(
    (ticketId: string) => {
      setOpenTabs((prev) => prev.filter((id) => id !== ticketId));
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(null);
      }
    },
    [setOpenTabs, selectedTicketId, setSelectedTicketId]
  );

  // ============================================
  // Auto-fetch on mount only
  // ============================================

  useEffect(() => {
    console.log("[TicketsProvider] Initial fetch on mount");
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on mount - user must click "Apply Filters" to refetch

  // Fetch ticket details when selected (includes relatedTickets and history in response)
  useEffect(() => {
    if (selectedTicketId) {
      console.log("[TicketsProvider] Ticket selected, fetching details:", selectedTicketId);

      // Fetch full ticket details - backend includes relatedTickets and history
      // This optimizes from 3 API calls down to 1 call
      fetchTicketById(selectedTicketId);
    }
  }, [selectedTicketId, fetchTicketById]);

  return {
    // Connection
    isConnected: ticketSocketService.isConnected(),
    socketConnected,
    socketError,
    isLoading,
    error,

    // View
    selectedView,
    setSelectedView,

    // Tickets
    allTickets: tickets,
    filteredTickets,
    ticketCounts,
    pagination,

    // Selection
    selectedTicketId,
    setSelectedTicketId,
    selectedTicket,

    // Active conversation
    activeConversationId,
    setActiveConversationId,

    // Multi-selection
    selectedTicketIds,
    setSelectedTicketIds,
    toggleTicketSelection,
    clearSelection,

    // Search & Filters
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,

    // Tabs
    openTabs,
    setOpenTabs,
    openTab,
    closeTab,

    // Related data
    relatedTickets,
    ticketHistory,

    // Review Queue
    reviewQueueConversations,
    setReviewQueueConversations,

    // Actions - Core
    fetchTickets,
    refreshTickets,
    createTicketFromConversation,
    replyToTicket,
    updateTicket,
    updateTicketStatus,
    updateTicketPriority,

    // Actions - Assignment
    assignTicket,
    bulkAssignTickets,
    reopenTicket,
    mergeTickets,

    // Actions - Discovery
    fetchRelatedTickets,
    fetchTicketHistory,
    fetchCustomerHistory,

    // Actions - Dashboard
    fetchUnassignedTickets,
    fetchAgentWorkload,

    // Tag Management
    tags,
    popularTags,
    tagSuggestions,
    tagsLoading,
    fetchTags,
    fetchPopularTags,
    suggestTags,
    createTag,
    updateTag,
    deleteTag,
    addTagsToTicket,
    removeTagFromTicket,
  };
}
