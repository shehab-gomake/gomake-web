import { atom, selector } from 'recoil';
import {
  Conversation,
  ConversationMember,
  DMMessage,
  DMPresenceData,
} from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';

// Connection state
export const dmConnectionState = atom<'connecting' | 'connected' | 'disconnected' | 'error'>({
  key: 'dmConnectionState',
  default: 'disconnected'
});

export const dmConnectedState = atom<boolean>({
  key: 'dmConnectedState',
  default: false
});

// Current user
export const dmCurrentUserState = atom<ConversationMember | null>({
  key: 'dmCurrentUserState',
  default: null
});

// Conversations
export const dmConversationsState = atom<Conversation[]>({
  key: 'dmConversationsState',
  default: []
});

export const dmActiveConversationIdState = atom<string | null>({
  key: 'dmActiveConversationIdState',
  default: null
});

// Messages grouped by conversation
export const dmMessagesState = atom<Record<string, DMMessage[]>>({
  key: 'dmMessagesState',
  default: {}
});

// Unread message counts per conversation
export const dmUnreadCountsState = atom<Record<string, number>>({
  key: 'dmUnreadCountsState',
  default: {}
});

// Online users
export const dmOnlineUsersState = atom<string[]>({
  key: 'dmOnlineUsersState',
  default: []
});

// User presence data
export const dmUserPresenceState = atom<Record<string, DMPresenceData>>({
  key: 'dmUserPresenceState',
  default: {}
});

// Typing indicators grouped by conversation
export const dmTypingUsersState = atom<Record<string, string[]>>({
  key: 'dmTypingUsersState',
  default: {}
});

// UI state
export const dmIsTypingState = atom<boolean>({
  key: 'dmIsTypingState',
  default: false
});

// Draft messages per conversation
export const dmDraftState = atom<Record<string, string>>({
  key: 'dmDraftState',
  default: {}
});

// Sidebar open state for mobile
export const dmIsSidebarOpenState = atom<boolean>({
  key: 'dmIsSidebarOpenState',
  default: true
});

// Error state
export const dmErrorState = atom<string | null>({
  key: 'dmErrorState',
  default: null
});

// Loading states
export const dmIsLoadingState = atom<boolean>({
  key: 'dmIsLoadingState',
  default: false
});

export const dmIsSendingState = atom<boolean>({
  key: 'dmIsSendingState',
  default: false
});

export const dmIsLoadingHistoryState = atom<boolean>({
  key: 'dmIsLoadingHistoryState',
  default: false
});

export const dmIsLoadingConversationsState = atom<boolean>({
  key: 'dmIsLoadingConversationsState',
  default: false
});

// Selectors
export const dmActiveConversationSelector = selector({
  key: 'dmActiveConversationSelector',
  get: ({ get }) => {
    const conversations = get(dmConversationsState);
    const activeId = get(dmActiveConversationIdState);
    return conversations.find(conv => conv.id === activeId) || null;
  }
});

export const dmActiveMessagesSelector = selector({
  key: 'dmActiveMessagesSelector',
  get: ({ get }) => {
    const messages = get(dmMessagesState);
    const activeId = get(dmActiveConversationIdState);
    return activeId ? messages[activeId] || [] : [];
  }
});

export const dmActiveDraftSelector = selector({
  key: 'dmActiveDraftSelector',
  get: ({ get }) => {
    const drafts = get(dmDraftState);
    const activeId = get(dmActiveConversationIdState);
    return activeId ? drafts[activeId] || '' : '';
  }
});

export const dmActiveTypingUsersSelector = selector({
  key: 'dmActiveTypingUsersSelector',
  get: ({ get }) => {
    const typingUsers = get(dmTypingUsersState);
    const activeId = get(dmActiveConversationIdState);
    return activeId ? typingUsers[activeId] || [] : [];
  }
});

export const dmTotalUnreadCountSelector = selector({
  key: 'dmTotalUnreadCountSelector',
  get: ({ get }) => {
    const unreadCounts = get(dmUnreadCountsState);
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  }
});

export const dmConversationsWithUnreadSelector = selector({
  key: 'dmConversationsWithUnreadSelector',
  get: ({ get }) => {
    const conversations = get(dmConversationsState);
    const unreadCounts = get(dmUnreadCountsState);
    
    return conversations.map(conv => ({
      ...conv,
      unreadCount: unreadCounts[conv.id] || 0
    }));
  }
});

export const dmSortedConversationsSelector = selector({
  key: 'dmSortedConversationsSelector',
  get: ({ get }) => {
    const conversations = get(dmConversationsWithUnreadSelector);
    
    return [...conversations].sort((a, b) => {
      // Sort by last message time, with unread conversations first
      const aTime = new Date(a.lastMessageAt || 0).getTime();
      const bTime = new Date(b.lastMessageAt || 0).getTime();
      
      // If one has unread messages and the other doesn't, prioritize the unread one
      if (a.unreadCount && !b.unreadCount) return -1;
      if (!a.unreadCount && b.unreadCount) return 1;
      
      // Otherwise sort by time (most recent first)
      return bTime - aTime;
    });
  }
});

export const dmOnlineUsersWithPresenceSelector = selector({
  key: 'dmOnlineUsersWithPresenceSelector',
  get: ({ get }) => {
    const onlineUsers = get(dmOnlineUsersState);
    const userPresence = get(dmUserPresenceState);
    
    return onlineUsers.map(userId => ({
      userId,
      ...userPresence[userId]
    })).filter(user => user.userId); // Filter out users without presence data
  }
});

export const dmConversationMembersSelector = selector({
  key: 'dmConversationMembersSelector',
  get: ({ get }) => {
    const activeConversation = get(dmActiveConversationSelector);
    return activeConversation?.members || [];
  }
});

export const dmOtherMembersSelector = selector({
  key: 'dmOtherMembersSelector',
  get: ({ get }) => {
    const currentUser = get(dmCurrentUserState);
    const members = get(dmConversationMembersSelector);
    
    if (!currentUser) return members;
    return members.filter(member => member.userId !== currentUser.userId);
  }
});

// Search and filter selectors
export const dmSearchQueryState = atom<string>({
  key: 'dmSearchQueryState',
  default: ''
});

export const dmFilteredConversationsSelector = selector({
  key: 'dmFilteredConversationsSelector',
  get: ({ get }) => {
    const conversations = get(dmSortedConversationsSelector);
    const searchQuery = get(dmSearchQueryState);
    
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => 
      conv.name?.toLowerCase().includes(query) ||
      conv.members?.some(member => 
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
      )
    );
  }
});

// User suggestions for new conversations
export const dmUserSuggestionsState = atom<ConversationMember[]>({
  key: 'dmUserSuggestionsState',
  default: []
});

export const dmIsLoadingSuggestionsState = atom<boolean>({
  key: 'dmIsLoadingSuggestionsState',
  default: false
});