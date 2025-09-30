import { useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { directMessagesWebSocketService } from '@/services/websocket/direct-messages-websocket.service';
import { directMessagesService } from '@/services/api-service/frontdesk/providers/internal/direct-messages.service';
import { parsePresenceResponse, isValidUserId } from '@/widgets/frontdesk/providers/internal/utils/presence-helpers';
import {
  dmConversationsState,
  dmActiveConversationIdState,
  dmConversationsFilterState,
  dmUnreadCountsState,
  dmOnlineUsersState,
  dmUserPresenceState,
  dmErrorState,
  dmIsLoadingConversationsState,
  dmActiveConversationSelector,
  dmSortedConversationsSelector,
  dmTotalUnreadCountSelector,
} from '@/store/direct-messages';
import {
  Conversation,
  CreateConversationRequest,
  DMPresenceData,
} from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';
import { internalDirectMessagesAtom } from '@/store/frontdesk';

/**
 * Hook for managing conversations
 *
 * Extracted from monolithic use-direct-messages.ts as part of Phase 5 Part 2
 *
 * Responsibilities:
 * - Conversation list management (load, create, select)
 * - Conversation CRUD operations (archive, favorite, add members)
 * - Conversation filtering (all, archived, favorites)
 * - Unread count tracking
 * - Conversation room subscriptions (WebSocket)
 * - Presence data fetching for conversation participants
 */
export function useConversations(deps: {
  connected: boolean;
  currentUser: any;
  joinedConversationsRef: React.MutableRefObject<Set<string>>;
  messages: Record<string, any[]>;
  loadMessageHistory: (conversationId: string) => Promise<void>;
  selectConversation: (conversation: Conversation) => Promise<void>;
}) {
  const debug = process.env.NEXT_PUBLIC_DM_DEBUG === 'true';

  // State
  const [conversations, setConversations] = useRecoilState(dmConversationsState);
  const [conversationsFilter, setConversationsFilter] = useRecoilState(dmConversationsFilterState);
  const [activeConversationId, setActiveConversationId] = useRecoilState(dmActiveConversationIdState);
  const [unreadCounts, setUnreadCounts] = useRecoilState(dmUnreadCountsState);
  const [isLoadingConversations, setIsLoadingConversations] = useRecoilState(dmIsLoadingConversationsState);
  const setError = useSetRecoilState(dmErrorState);
  const setUserPresence = useSetRecoilState(dmUserPresenceState);
  const setOnlineUsers = useSetRecoilState(dmOnlineUsersState);
  const setFrontdeskDirectMessages = useSetRecoilState(internalDirectMessagesAtom);
  const [userPresence] = useRecoilState(dmUserPresenceState);

  // Selectors
  const activeConversation = useRecoilValue(dmActiveConversationSelector);
  const sortedConversations = useRecoilValue(dmSortedConversationsSelector);
  const totalUnreadCount = useRecoilValue(dmTotalUnreadCountSelector);

  // Sync sorted conversations to frontdesk atom
  useEffect(() => {
    setFrontdeskDirectMessages(sortedConversations);
  }, [sortedConversations, setFrontdeskDirectMessages]);

  // Ensure we are subscribed to all known conversations whenever the list changes
  useEffect(() => {
    const joinAllConversations = async () => {
      if (!directMessagesWebSocketService.isConnected()) {
        return;
      }

      for (const conversation of conversations) {
        if (!conversation?.id) continue;
        if (deps.joinedConversationsRef.current.has(conversation.id)) continue;

        try {
          await directMessagesWebSocketService.joinConversation({ conversationId: conversation.id });
          deps.joinedConversationsRef.current.add(conversation.id);
        } catch (error) {
          console.error('[DM] Failed to join conversation room during sync:', conversation.id, error);
        }
      }
    };

    joinAllConversations();
  }, [conversations, deps.joinedConversationsRef]);

  /**
   * Load conversations from backend
   */
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setError(null);

      const response = await directMessagesService.listConversations({
        limit: 50,
        offset: 0,
        includeArchived: conversationsFilter === 'archived',
      });

      // Filter out any invalid conversations before setting
      const validConversations = response.conversations.filter(conv => conv && conv.id);
      console.log('Loaded conversations:', validConversations);
      setConversations(validConversations);

      // Update unread counts
      const unreadMap: Record<string, number> = {};
      validConversations.forEach(conv => {
        unreadMap[conv.id] = conv.unreadCount || 0;
      });
      setUnreadCounts(unreadMap);

      // Join rooms for all loaded conversations to receive live updates
      if (directMessagesWebSocketService.isConnected()) {
        await Promise.all(validConversations.map(async (conv) => {
          if (!conv.id) return;
          if (deps.joinedConversationsRef.current.has(conv.id)) return;
          try {
            await directMessagesWebSocketService.joinConversation({ conversationId: conv.id });
            deps.joinedConversationsRef.current.add(conv.id);
          } catch (joinError) {
            console.error('[DM] Failed to join conversation room:', conv.id, joinError);
          }
        }));

        // Fetch presence data for all conversation participants
        const uniqueUserIds = new Set<string>();
        validConversations.forEach(conv => {
          if (conv.members) {
            conv.members.forEach(member => {
              if (member.userId) {
                uniqueUserIds.add(member.userId);
              }
            });
          }
        });

        if (uniqueUserIds.size > 0) {
          try {
            const userIdArray = Array.from(uniqueUserIds);
            console.log('[DM] Fetching presence for users:', userIdArray);
            const presenceResponse = await directMessagesWebSocketService.getPresence(userIdArray);

            if (presenceResponse) {
              if (debug) console.log('[DM] Presence data received for conversations:', presenceResponse);
              const { presenceData, onlineUserIds: newOnlineUserIds } = parsePresenceResponse(presenceResponse);
              if (debug) {
                console.log('[DM] Processed conversation presence:', presenceData);
                console.log('[DM] Online users from conversation presence:', newOnlineUserIds);
              }

              // Merge with existing presence data
              setUserPresence(prev => ({
                ...prev,
                ...presenceData
              }));

              // Update online users list - properly merge with existing
              setOnlineUsers(prev => {
                // Start with a Set to avoid duplicates
                const combined = new Set<string>(prev.filter(id => isValidUserId(id)));

                // Add new online users
                newOnlineUserIds.forEach(id => {
                  if (isValidUserId(id)) {
                    combined.add(id);
                  }
                });

                // Remove offline users
                Object.entries(presenceData).forEach(([userId, data]) => {
                  if (data.status === 'offline') {
                    combined.delete(userId);
                  }
                });

                const result = Array.from(combined);
                if (debug) console.log('[DM] Updated online users list:', result);
                return result;
              });
            }
          } catch (presenceError) {
            console.error('[DM] Failed to fetch presence data:', presenceError);
            // Non-critical error, don't throw
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to load conversations:", error);
      setError(error.message || "Failed to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [setIsLoadingConversations, setError, setConversations, setUnreadCounts, setUserPresence, setOnlineUsers, conversationsFilter, deps.joinedConversationsRef, debug]);

  /**
   * Load conversations when filter changes or connection is established
   */
  useEffect(() => {
    if (deps.connected) {
      loadConversations();
    }
  }, [conversationsFilter, deps.connected, loadConversations]);

  /**
   * Select a conversation and mark it as read
   */
  const selectConversation = useCallback(
    async (conversation: Conversation) => {
      try {
        setError(null);
        setActiveConversationId(conversation.id);

        // Populate user presence from conversation members
        if (conversation.members && conversation.members.length > 0) {
          const presenceUpdate: Record<string, DMPresenceData> = {};
          conversation.members.forEach(member => {
            if (!userPresence[member.userId]) {
              presenceUpdate[member.userId] = {
                userId: member.userId,
                email: member.email,
                firstName: member.firstName,
                lastName: member.lastName,
                name: member.name || `${member.firstName} ${member.lastName}`.trim() || member.email,
                status: 'offline', // Default status, will be updated by WebSocket
                lastSeen: new Date().toISOString(),
                timestamp: new Date().toISOString(),
              };
            }
          });

          if (Object.keys(presenceUpdate).length > 0) {
            setUserPresence(prev => ({ ...prev, ...presenceUpdate }));
          }
        }

        // Join conversation room for real-time updates
        const isSocketConnected = directMessagesWebSocketService.isConnected();
        if (isSocketConnected && !deps.joinedConversationsRef.current.has(conversation.id)) {
          await directMessagesWebSocketService.joinConversation({
            conversationId: conversation.id,
          });
          deps.joinedConversationsRef.current.add(conversation.id);
        }

        // Clear unread count for this conversation
        setUnreadCounts((prev) => ({ ...prev, [conversation.id]: 0 }));

        setConversations((prev) => prev.map((conv) => (
          conv.id === conversation.id
            ? { ...conv, unreadCount: 0 }
            : conv
        )));

        // Mark as read
        await directMessagesService.markAsRead(conversation.id, {
          lastReadAt: new Date().toISOString(),
        });

        // Load message history if we don't have messages yet
        const currentMessages = deps.messages[conversation.id] || [];
        if (currentMessages.length === 0) {
          await deps.loadMessageHistory(conversation.id);
        }
      } catch (error: any) {
        console.error("Failed to select conversation:", error);
        setError(error.message || "Failed to select conversation");
      }
    },
    [setError, setActiveConversationId, setUnreadCounts, setUserPresence, userPresence, deps.messages, deps.loadMessageHistory, deps.joinedConversationsRef, setConversations]
  );

  /**
   * Create new conversation
   */
  const createConversation = useCallback(
    async (data: CreateConversationRequest): Promise<Conversation | null> => {
      try {
        console.log('[DM] Creating conversation with data:', data);
        setError(null);
        const response = await directMessagesService.createConversation(data);
        console.log('[DM] Create conversation response:', response);

        // Add to conversations list (ensure the conversation is valid)
        if (response.conversation && response.conversation.id) {
          console.log('[DM] Adding conversation to list:', response.conversation.id);
          setConversations((prev) => [response.conversation, ...prev]);

          if (directMessagesWebSocketService.isConnected() && !deps.joinedConversationsRef.current.has(response.conversation.id)) {
            try {
              await directMessagesWebSocketService.joinConversation({ conversationId: response.conversation.id });
              deps.joinedConversationsRef.current.add(response.conversation.id);
            } catch (joinError) {
              console.error('[DM] Failed to join room for new conversation:', response.conversation.id, joinError);
            }
          }
        }

        // Select the new conversation
        console.log('[DM] Selecting new conversation:', response.conversation.id);
        await selectConversation(response.conversation);

        return response.conversation;
      } catch (error: any) {
        console.error("[DM] Failed to create conversation:", error);
        setError(error.message || "Failed to create conversation");
        return null;
      }
    },
    [setError, setConversations, selectConversation, deps.joinedConversationsRef]
  );

  /**
   * Start direct message with a user
   */
  const startDirectMessage = useCallback(
    async (userId: string): Promise<Conversation | null> => {
      console.log('[DM] Starting direct message with user:', userId);
      console.log('[DM] Current user:', deps.currentUser);

      if (!deps.currentUser || deps.currentUser.userId === userId) {
        console.warn('[DM] Cannot start DM - invalid current user or same user');
        return null;
      }

      // Check if conversation already exists
      const existingConversation = conversations.find(
        conv => conv && conv.id && conv.type === 'DM' &&
        conv.members?.some(member => member && member.userId === userId) &&
        conv.members?.some(member => member && member.userId === deps.currentUser.userId)
      );

      if (existingConversation) {
        console.log('[DM] Found existing conversation:', existingConversation.id);
        await selectConversation(existingConversation);
        return existingConversation;
      }

      // Create new conversation
      console.log('[DM] Creating new conversation with participant:', userId);
      return await createConversation({
        participantIds: [userId],
      });
    },
    [deps.currentUser, conversations, selectConversation, createConversation]
  );

  /**
   * Favorite/unfavorite conversation
   */
  const favoriteConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      try {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation || !deps.currentUser) {
          console.warn('[DM] Cannot favorite - conversation not found or no current user');
          return;
        }

        const currentMember = conversation.members?.find(m => m.userId === deps.currentUser.userId);
        const isFavorited = currentMember?.isFavorite || false;

        // Toggle favorite status
        if (isFavorited) {
          await directMessagesService.unfavoriteConversation(conversationId);
        } else {
          await directMessagesService.favoriteConversation(conversationId);
        }

        // Reload conversations to get updated state
        await loadConversations();

      } catch (error: any) {
        console.error('Failed to update favorite status:', error);
        setError(error.message || 'Failed to update favorite status');
      }
    },
    [conversations, deps.currentUser, loadConversations, setError]
  );

  /**
   * Archive/unarchive conversation
   */
  const archiveConversation = useCallback(
    async (conversationId: string, shouldArchive?: boolean): Promise<void> => {
      try {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation || !deps.currentUser) {
          console.warn('[DM] Cannot archive - conversation not found or no current user');
          return;
        }

        const currentMember = conversation.members?.find(m => m.userId === deps.currentUser.userId);
        const isArchived = currentMember?.isArchived || false;

        // Use shouldArchive parameter if provided, otherwise toggle
        const archive = shouldArchive !== undefined ? shouldArchive : !isArchived;

        if (archive && !isArchived) {
          await directMessagesService.archiveConversation(conversationId);

          // Clear selected conversation if archiving the active one
          if (conversationId === activeConversationId) {
            setActiveConversationId(null);
          }
        } else if (!archive && isArchived) {
          await directMessagesService.unarchiveConversation(conversationId);
        }

        // Optimistically update the local state
        setConversations(prev => prev.filter(c => c.id !== conversationId));

      } catch (error: any) {
        console.error('Failed to archive/unarchive conversation:', error);
        setError(error.message || 'Failed to archive conversation');
      }
    },
    [conversations, deps.currentUser, activeConversationId, setActiveConversationId, setConversations, setError]
  );

  /**
   * Add members to conversation (for group chats)
   */
  const addMembersToConversation = useCallback(
    async (conversationId: string, userIds: string[]): Promise<void> => {
      try {
        await directMessagesService.addMembers(conversationId, {
          participantIds: userIds,
        });

        // Reload conversations to get updated state
        await loadConversations();

        // Reload the active conversation if it's the one we're adding members to
        if (conversationId === activeConversationId) {
          const updatedConversation = conversations.find(c => c.id === conversationId);
          if (updatedConversation) {
            await selectConversation(updatedConversation);
          }
        }

      } catch (error: any) {
        console.error('Failed to add members to conversation:', error);
        setError(error.message || 'Failed to add members');
        throw error; // Re-throw so the UI can handle it
      }
    },
    [activeConversationId, conversations, loadConversations, selectConversation, setError]
  );

  return {
    // State
    conversations,
    conversationsFilter,
    activeConversationId,
    activeConversation,
    unreadCounts,
    totalUnreadCount,
    isLoadingConversations,
    sortedConversations,

    // Actions
    loadConversations,
    selectConversation,
    createConversation,
    startDirectMessage,
    favoriteConversation,
    archiveConversation,
    addMembersToConversation,
    setConversationFilter: setConversationsFilter,
    setActiveConversationId,
  };
}

export type UseConversationsResult = ReturnType<typeof useConversations>;