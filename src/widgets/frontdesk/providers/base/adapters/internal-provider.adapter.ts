import type { UnifiedProvider, ProviderCapabilities, ProviderAdapter } from '../unified-provider.interface';
import type { UseInternalProviderResult } from '../../internal/hooks/use-internal-provider';

/**
 * Adapter for Internal (Direct Messages) Provider
 * Wraps the existing useInternalProvider hook to conform to UnifiedProvider interface
 */

const INTERNAL_CAPABILITIES: ProviderCapabilities = {
  // Account Management
  multiAccount: false,
  authentication: false,

  // Conversation Features
  createConversation: true,
  groupConversations: true,
  archiveConversation: true,
  deleteConversation: false,
  favoriteConversation: true,
  muteConversation: false,

  // Message Features
  sendMessage: true,
  editMessage: false,
  deleteMessage: false,
  replyToMessage: true,
  forwardMessage: false,
  reactions: false,

  // Rich Content
  attachments: false,
  images: false,
  videos: false,
  richText: false,

  // Real-time Features
  typing: true,
  presence: true,
  readReceipts: true,

  // Organization Features
  labels: false,
  folders: false,
  filters: true,

  // Search Features
  globalSearch: true,
  conversationSearch: true,
  fullTextSearch: true,

  // Pagination
  infiniteScroll: true,
  pagination: true,
};

export class InternalProviderAdapter implements ProviderAdapter<UseInternalProviderResult> {
  adapt(hook: UseInternalProviderResult): UnifiedProvider {
    return {
      // Identity
      id: 'internal',
      name: 'internal',
      displayName: 'Direct Messages',
      icon: null, // TODO: Add icon
      capabilities: INTERNAL_CAPABILITIES,

      // Connection State
      connection: {
        status: hook.connectionStatus as any,
        connected: hook.connected,
        connecting: hook.connectionStatus === 'connecting',
        error: hook.error || null,
      },

      // Current User
      currentUser: hook.currentUser ? {
        id: hook.currentUser.userId,
        email: hook.currentUser.email,
        name: hook.currentUser.name,
        presence: 'online',
      } : null,

      // Conversations
      conversations: {
        items: hook.conversations.map(conv => ({
          id: conv.id,
          type: conv.type === 'DM' ? 'dm' : 'group',
          name: conv.name || 'Unnamed',
          avatar: undefined,
          snippet: undefined, // TODO: Add lastMessage to conversation type
          participants: (conv.members || []).map(member => ({
            id: member.userId,
            email: member.email,
            name: member.name,
            avatar: undefined,
            role: member.role as any,
          })),
          participantCount: conv.members?.length || 0,
          unreadCount: hook.unreadCounts[conv.id] || 0,
          isFavorite: conv.members?.[0]?.isFavorite,
          isArchived: conv.members?.[0]?.isArchived,
          lastMessageAt: conv.lastMessageAt ? new Date(conv.lastMessageAt) : undefined,
          createdAt: new Date(), // TODO: Add createdAt to conversation type
          updatedAt: undefined,
          providerId: 'internal',
        })),
        loading: hook.isLoadingConversations,
        error: hook.error || null,
        hasMore: false,
        unread: hook.conversations.filter(c => (hook.unreadCounts[c.id] || 0) > 0).map(conv => ({
          id: conv.id,
          type: conv.type === 'DM' ? 'dm' : 'group',
          name: conv.name || 'Unnamed',
          participants: [],
          unreadCount: hook.unreadCounts[conv.id] || 0,
          createdAt: new Date(),
          providerId: 'internal',
        })),
        favorites: [],
        archived: [],
      },

      selectedConversation: hook.activeConversation ? {
        id: hook.activeConversation.id,
        type: hook.activeConversation.type === 'DM' ? 'dm' : 'group',
        name: hook.activeConversation.name || 'Unnamed',
        participants: (hook.activeConversation.members || []).map(member => ({
          id: member.userId,
          email: member.email,
          name: member.name,
          avatar: undefined,
          isTyping: hook.typingUsers[hook.activeConversation!.id]?.includes(member.userId),
        })),
        unreadCount: 0,
        createdAt: new Date(),
        providerId: 'internal',
      } : null,

      // Messages
      messages: hook.activeConversationId ? {
        items: (hook.messages[hook.activeConversationId] || []).map(msg => ({
          id: msg.id,
          conversationId: msg.conversationId,
          type: 'text' as const,
          content: msg.content,
          userId: msg.userId,
          user: {
            id: msg.userId,
            email: msg.userEmail,
            name: msg.userName,
          },
          createdAt: new Date(msg.createdAt),
          providerId: 'internal',
          tempId: msg.tempId,
          pending: !!msg.tempId,
        })),
        loading: hook.isLoadingHistory,
        error: hook.error || null,
        hasMore: false,
        sending: hook.isSending,
      } : undefined,

      // Search
      search: {
        query: hook.conversationSearchQuery || '',
        loading: false,
        error: null,
        conversationResults: [],
        messageResults: [], // TODO: Map conversation search results correctly
      },

      // Typing Users
      typingUsers: (hook.typingUsers as unknown as Record<string, string[]>) || {},

      // Online Users
      onlineUsers: (hook.onlineUsersWithPresence || []).map((u: any) => u.userId),

      // Actions
      actions: {
        connect: async () => await hook.connect(),
        disconnect: async () => await hook.disconnect(),
        fetchConversations: async () => {
          // Conversations are loaded automatically on connect
          return Promise.resolve();
        },
        selectConversation: (id) => hook.setActiveConversationId(id),
        deselectConversation: () => hook.setActiveConversationId(null),
        refreshConversations: async () => {
          // Refresh is automatic with WebSocket
        },
        createConversation: async (participants) => {
          const result = await hook.createConversation({ participantIds: participants });
          return result?.id || '';
        },
        archiveConversation: hook.archiveConversation,
        favoriteConversation: hook.favoriteConversation,
        markAsRead: async (conversationId) => {
          const conversation = hook.conversations.find(c => c.id === conversationId);
          if (conversation) {
            await hook.selectConversation(conversation);
          }
        },
        fetchMessages: async (conversationId) => {
          await hook.loadMessageHistory(conversationId);
        },
        loadMoreMessages: async (conversationId) => {
          await hook.loadMoreMessages(conversationId);
        },
        sendMessage: async (conversationId, content) => {
          if (hook.activeConversationId === conversationId) {
            await hook.sendMessage(content);
          }
        },
        startTyping: (conversationId) => {
          if (hook.activeConversationId === conversationId && hook.startTyping) {
            hook.startTyping();
          }
        },
        stopTyping: (conversationId) => {
          if (hook.stopTyping) {
            hook.stopTyping();
          }
        },
        searchConversations: async (query) => {
          await hook.performGlobalSearch(query);
        },
        searchMessages: async (query, conversationId) => {
          if (conversationId === hook.activeConversationId) {
            await hook.performConversationSearch(query);
          }
        },
        clearSearch: () => {
          hook.clearSearch('all');
        },
      },
    };
  }
}

// Export singleton instance
export const internalProviderAdapter = new InternalProviderAdapter();