/**
 * Kanban Board Hook for Chatwoot Conversations
 *
 * Manages kanban board state, drag-and-drop operations, and API calls
 * for the FrontDesk workboard view (Control Station).
 *
 * Features:
 * - View mode switching (status/assignee)
 * - Drag and drop for status/assignment changes
 * - Quick actions (resolve, assign, priority)
 * - Filtering and search (excludes snoozed conversations)
 * - Real-time updates via WebSocket
 *
 * Uses existing Chatwoot services and follows FrontDesk patterns.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { DropResult } from "react-beautiful-dnd";

// Atoms
import {
  chatwootKanbanViewModeAtom,
  chatwootKanbanFiltersAtom,
  chatwootKanbanOperationLoadingAtom,
  chatwootKanbanConversationsAtom,
  chatwootKanbanLoadingAtom,
  chatwootKanbanErrorAtom,
  chatwootSelectedAccountAtom,
  chatwootInboxesAtom,
  chatwootInboxesLoadingAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";

// Types
import {
  KanbanViewMode,
  KanbanConversationFilters,
  KanbanConversationColumn,
  CONVERSATION_STATUS_COLUMNS,
  getWorkloadLevel,
} from "../types/kanban.types";
import {
  ChatwootConversation,
  ConversationStatus,
  ConversationPriority,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";

// Services
import { chatwootService } from "@/services/frontdesk";

// Hooks
import { useChatwootAgents } from "./resources/use-chatwoot-agents";
import { useChatwootInboxes } from "./use-chatwoot-inboxes";
import { useKanbanWebSocket } from "./use-kanban-websocket";

// Utilities
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useKanbanBoard");

// ============================================
// Hook Return Type
// ============================================

export interface UseKanbanBoardResult {
  // View mode
  viewMode: KanbanViewMode;
  setViewMode: (mode: KanbanViewMode) => void;

  // Columns
  columns: KanbanConversationColumn[];

  // Raw conversations (for statistics)
  conversations: ChatwootConversation[];

  // Filters
  filters: KanbanConversationFilters;
  setFilters: (filters: Partial<KanbanConversationFilters>) => void;
  clearFilters: () => void;
  activeFilterCount: number;

  // Loading states
  isLoading: boolean;
  isOperationLoading: boolean;
  error: string | null;

  // Resources
  agents: Agent[];
  agentsLoading: boolean;
  inboxes: ChatwootInbox[];
  inboxesLoading: boolean;

  // Actions
  refreshBoard: () => Promise<void>;
  handleDragEnd: (result: DropResult) => Promise<void>;

  // Quick Actions
  resolveConversation: (conversation: ChatwootConversation) => Promise<void>;
  reopenConversation: (conversation: ChatwootConversation) => Promise<void>;
  assignConversation: (
    conversation: ChatwootConversation,
    agentId: number | null
  ) => Promise<void>;
  setPriority: (
    conversation: ChatwootConversation,
    priority: ConversationPriority
  ) => Promise<void>;
}

// ============================================
// Hook Implementation
// ============================================

export function useKanbanBoard(): UseKanbanBoardResult {
  // Account context
  const accountId = useRecoilValue(chatwootSelectedAccountAtom);

  // View mode state
  const [viewMode, setViewMode] = useRecoilState(chatwootKanbanViewModeAtom);

  // Filters state
  const [filters, setFiltersState] = useRecoilState(chatwootKanbanFiltersAtom);

  // Conversations state
  const [conversations, setConversations] = useRecoilState(
    chatwootKanbanConversationsAtom
  );
  const [isLoading, setIsLoading] = useRecoilState(chatwootKanbanLoadingAtom);
  const [error, setError] = useRecoilState(chatwootKanbanErrorAtom);
  const [isOperationLoading, setIsOperationLoading] = useRecoilState(
    chatwootKanbanOperationLoadingAtom
  );

  // Resources state - use existing hooks
  const {
    agents,
    loading: agentsLoading,
    refresh: refreshAgents,
  } = useChatwootAgents(accountId);
  const { inboxes, loading: inboxesLoading } = useChatwootInboxes();

  // WebSocket integration (always enabled)
  useKanbanWebSocket(true);

  // Refs to prevent duplicate fetches
  const isFetchingRef = useRef(false);

  // ============================================
  // Apply Filters
  // ============================================

  const filteredConversations = useMemo(() => {
    // First, exclude snoozed conversations from the board
    let result = conversations.filter((c) => c.status !== "snoozed");

    if (filters.priority) {
      result = result.filter((c) => c.priority === filters.priority);
    }
    if (filters.inboxId) {
      result = result.filter((c) => c.inbox_id === filters.inboxId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.meta?.sender?.name?.toLowerCase().includes(search) ||
          c.meta?.sender?.email?.toLowerCase().includes(search) ||
          c.id?.toString().includes(search) ||
          c.last_non_activity_message?.content?.toLowerCase().includes(search)
      );
    }
    if (filters.labels && filters.labels.length > 0) {
      result = result.filter((c) =>
        c.labels?.some((label) => filters.labels!.includes(label))
      );
    }
    if (filters.teamId) {
      result = result.filter((c) => c.meta?.team?.id === filters.teamId);
    }

    return result;
  }, [conversations, filters]);

  // ============================================
  // Group Conversations by Status
  // ============================================

  const conversationsByStatus = useMemo(() => {
    const grouped: Record<string, ChatwootConversation[]> = {
      [ConversationStatus.OPEN]: [],
      [ConversationStatus.PENDING]: [],
      [ConversationStatus.RESOLVED]: [],
    };

    filteredConversations.forEach((conv) => {
      const status = conv.status as ConversationStatus;
      if (grouped[status]) {
        grouped[status].push(conv);
      }
    });

    return grouped;
  }, [filteredConversations]);

  // ============================================
  // Group Conversations by Assignee
  // ============================================

  const conversationsByAssignee = useMemo(() => {
    const grouped: Record<string, ChatwootConversation[]> = {
      unassigned: [],
    };

    // Initialize agent columns
    agents.forEach((agent) => {
      grouped[agent.id.toString()] = [];
    });

    // Group by assignee
    filteredConversations.forEach((conv) => {
      const assigneeId = conv.meta?.assignee?.id;
      if (assigneeId) {
        const key = assigneeId.toString();
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(conv);
      } else {
        grouped["unassigned"].push(conv);
      }
    });

    return grouped;
  }, [filteredConversations, agents]);

  // ============================================
  // Generate Columns
  // ============================================

  const columns = useMemo<KanbanConversationColumn[]>(() => {
    if (viewMode === "status") {
      // Generate status-based columns
      return CONVERSATION_STATUS_COLUMNS.map((config) => ({
        id: config.status,
        title: config.title,
        status: config.status,
        conversations: conversationsByStatus[config.status] || [],
        count: (conversationsByStatus[config.status] || []).length,
      }));
    } else {
      // Generate assignee-based columns
      const assigneeColumns: KanbanConversationColumn[] = [];

      // Unassigned column first
      const unassignedConvs = conversationsByAssignee["unassigned"] || [];
      assigneeColumns.push({
        id: "unassigned",
        title: "Unassigned",
        assignee: null,
        conversations: unassignedConvs,
        count: unassignedConvs.length,
        workload: {
          openCount: unassignedConvs.filter((c) => c.status === "open").length,
          totalCount: unassignedConvs.length,
          loadLevel: "low",
        },
      });

      // Agent columns
      agents.forEach((agent) => {
        const agentConvs = conversationsByAssignee[agent.id.toString()] || [];
        const openCount = agentConvs.filter((c) => c.status === "open").length;

        assigneeColumns.push({
          id: agent.id.toString(),
          title: agent.name,
          assignee: {
            id: agent.id,
            name: agent.name,
            email: agent.email,
            thumbnail: agent.thumbnail,
          },
          conversations: agentConvs,
          count: agentConvs.length,
          workload: {
            openCount,
            totalCount: agentConvs.length,
            loadLevel: getWorkloadLevel(openCount),
          },
        });
      });

      return assigneeColumns;
    }
  }, [viewMode, conversationsByStatus, conversationsByAssignee, agents]);

  // ============================================
  // Filter Management
  // ============================================

  const setFilters = useCallback(
    (newFilters: Partial<KanbanConversationFilters>) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
    },
    [setFiltersState]
  );

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, [setFiltersState]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priority) count++;
    if (filters.inboxId) count++;
    if (filters.search) count++;
    if (filters.labels && filters.labels.length > 0) count++;
    if (filters.teamId) count++;
    return count;
  }, [filters]);

  // ============================================
  // Data Fetching
  // ============================================

  const refreshBoard = useCallback(async () => {
    if (!accountId) {
      logger.warn("No account ID, skipping fetch");
      return;
    }

    // Prevent duplicate fetches
    if (isFetchingRef.current) {
      logger.debug("Skipping duplicate fetch");
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      logger.info("Fetching conversations for kanban board");

      // Fetch all conversations (all statuses) for kanban view
      const response = await chatwootService.conversations.listConversations(
        accountId,
        {
          status: ConversationStatus.ALL,
          limit: 100, // Get more for kanban view
        }
      );

      const convs = response.payload || response.data?.payload || [];
      logger.info(`Loaded ${convs.length} conversations for kanban`);

      setConversations(convs);
    } catch (err: any) {
      logger.error("Failed to refresh kanban board:", err);
      setError(err.message || "Failed to load conversations");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [accountId, setConversations, setIsLoading, setError]);

  // ============================================
  // Quick Actions
  // ============================================

  const resolveConversation = useCallback(
    async (conversation: ChatwootConversation) => {
      if (!accountId || !conversation.id) return;

      setIsOperationLoading(true);

      try {
        // Optimistic update
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, status: "resolved" } : c
          )
        );

        await chatwootService.conversations.updateConversationStatus(
          accountId,
          conversation.id,
          {
            status: "resolved",
          }
        );

        logger.info(`Conversation ${conversation.id} resolved`);
      } catch (err: any) {
        logger.error("Failed to resolve conversation:", err);
        refreshBoard(); // Revert on error
      } finally {
        setIsOperationLoading(false);
      }
    },
    [accountId, setConversations, setIsOperationLoading, refreshBoard]
  );

  const reopenConversation = useCallback(
    async (conversation: ChatwootConversation) => {
      if (!accountId || !conversation.id) return;

      setIsOperationLoading(true);

      try {
        // Optimistic update
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, status: "open" } : c
          )
        );

        await chatwootService.conversations.updateConversationStatus(
          accountId,
          conversation.id,
          {
            status: "open",
          }
        );

        logger.info(`Conversation ${conversation.id} reopened`);
      } catch (err: any) {
        logger.error("Failed to reopen conversation:", err);
        refreshBoard(); // Revert on error
      } finally {
        setIsOperationLoading(false);
      }
    },
    [accountId, setConversations, setIsOperationLoading, refreshBoard]
  );

  const assignConversation = useCallback(
    async (conversation: ChatwootConversation, agentId: number | null) => {
      if (!accountId || !conversation.id) return;

      setIsOperationLoading(true);

      try {
        // Find agent info
        const agent = agentId ? agents.find((a) => a.id === agentId) : null;

        // Optimistic update
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id
              ? {
                  ...c,
                  meta: {
                    ...c.meta,
                    assignee: agent
                      ? {
                          id: agent.id,
                          name: agent.name,
                          email: agent.email,
                          thumbnail: agent.thumbnail,
                        }
                      : null,
                  },
                }
              : c
          )
        );

        await chatwootService.conversations.assignAgent(
          accountId,
          conversation.id,
          agentId
        );

        logger.info(
          `Conversation ${conversation.id} assigned to ${agentId || "nobody"}`
        );
      } catch (err: any) {
        logger.error("Failed to assign conversation:", err);
        refreshBoard(); // Revert on error
      } finally {
        setIsOperationLoading(false);
      }
    },
    [accountId, agents, setConversations, setIsOperationLoading, refreshBoard]
  );

  const setPriority = useCallback(
    async (
      conversation: ChatwootConversation,
      priority: ConversationPriority
    ) => {
      if (!accountId || !conversation.id) return;

      setIsOperationLoading(true);

      try {
        // Optimistic update
        setConversations((prev) =>
          prev.map((c) => (c.id === conversation.id ? { ...c, priority } : c))
        );

        await chatwootService.conversations.updateConversationPriority(
          accountId,
          conversation.id,
          {
            priority: priority === ConversationPriority.NONE ? null : priority,
          }
        );

        logger.info(
          `Conversation ${conversation.id} priority set to ${priority}`
        );
      } catch (err: any) {
        logger.error("Failed to set priority:", err);
        refreshBoard(); // Revert on error
      } finally {
        setIsOperationLoading(false);
      }
    },
    [accountId, setConversations, setIsOperationLoading, refreshBoard]
  );

  // ============================================
  // Drag and Drop Handler
  // ============================================

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!accountId) return;

      const { destination, source, draggableId } = result;

      // Dropped outside a droppable area
      if (!destination) {
        logger.debug("Dropped outside droppable area");
        return;
      }

      // Dropped in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        logger.debug("Dropped in same position");
        return;
      }

      const conversationId = parseInt(draggableId, 10);
      const sourceColumnId = source.droppableId;
      const destColumnId = destination.droppableId;

      // Find the conversation
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) {
        logger.warn("Conversation not found:", conversationId);
        return;
      }

      logger.info("Moving conversation", {
        conversationId,
        from: sourceColumnId,
        to: destColumnId,
      });
      setIsOperationLoading(true);

      try {
        if (viewMode === "status") {
          // Moving between status columns (snoozed not allowed)
          const newStatus = destColumnId as "open" | "resolved" | "pending";

          if (newStatus !== conversation.status) {
            // Optimistic update
            setConversations((prev) =>
              prev.map((c) =>
                c.id === conversationId ? { ...c, status: newStatus } : c
              )
            );

            // API call to change status
            await chatwootService.conversations.updateConversationStatus(
              accountId,
              conversationId,
              {
                status: newStatus,
              }
            );

            logger.info("Conversation status updated successfully");
          }
        } else {
          // Moving between assignee columns
          const newAssigneeId =
            destColumnId === "unassigned" ? null : parseInt(destColumnId, 10);
          const currentAssigneeId = conversation.meta?.assignee?.id || null;

          if (newAssigneeId !== currentAssigneeId) {
            // Find assignee info
            const newAssignee = newAssigneeId
              ? agents.find((a) => a.id === newAssigneeId)
              : null;

            // Optimistic update
            setConversations((prev) =>
              prev.map((c) =>
                c.id === conversationId
                  ? {
                      ...c,
                      meta: {
                        ...c.meta,
                        assignee: newAssignee
                          ? {
                              id: newAssignee.id,
                              name: newAssignee.name,
                              email: newAssignee.email,
                              thumbnail: newAssignee.thumbnail,
                            }
                          : null,
                      },
                    }
                  : c
              )
            );

            // API call to assign/unassign
            await chatwootService.conversations.assignAgent(
              accountId,
              conversationId,
              newAssigneeId
            );

            logger.info("Conversation assignment updated successfully");
          }
        }
      } catch (err: any) {
        logger.error("Drag operation failed:", err);
        // Revert optimistic update by refreshing
        refreshBoard();
      } finally {
        setIsOperationLoading(false);
      }
    },
    [
      accountId,
      viewMode,
      conversations,
      agents,
      setConversations,
      setIsOperationLoading,
      refreshBoard,
    ]
  );

  // ============================================
  // Initial Data Load
  // ============================================

  useEffect(() => {
    if (accountId) {
      refreshBoard();
      refreshAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  // Refresh agents when switching to assignee view
  useEffect(() => {
    if (viewMode === "assignee" && accountId) {
      refreshAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, accountId]);

  return {
    // View mode
    viewMode,
    setViewMode,

    // Columns
    columns,

    // Raw conversations
    conversations,

    // Filters
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,

    // Loading states
    isLoading,
    isOperationLoading,
    error,

    // Resources
    agents,
    agentsLoading,
    inboxes,
    inboxesLoading,

    // Actions
    refreshBoard,
    handleDragEnd,

    // Quick Actions
    resolveConversation,
    reopenConversation,
    assignConversation,
    setPriority,
  };
}
