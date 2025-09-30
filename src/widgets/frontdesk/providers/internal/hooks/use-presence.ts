import { useCallback, useRef, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { directMessagesWebSocketService } from '@/services/websocket/direct-messages-websocket.service';
import { parsePresenceResponse, parseStatusChangeEvent, isValidUserId } from '@/widgets/frontdesk/providers/internal/utils/presence-helpers';
import {
  dmCurrentUserState,
  dmOnlineUsersState,
  dmUserPresenceState,
  dmTypingUsersState,
  dmIsTypingState,
  dmOnlineUsersWithPresenceSelector,
  dmOtherMembersSelector,
  dmActiveTypingUsersSelector,
} from '@/store/direct-messages';
import {
  DMPresenceData,
  DMUserTypingEvent,
} from '@/widgets/frontdesk/providers/internal/types/direct-messages.types';
import { useUserProfile } from '@/hooks/use-user-profile';

/**
 * Hook for managing user presence, typing indicators, and online status
 *
 * Extracted from monolithic use-direct-messages.ts as part of Phase 5 Part 2
 *
 * Responsibilities:
 * - User presence management (online/offline/away/busy)
 * - Typing indicators (send and receive)
 * - Online users tracking
 * - Current user initialization
 * - Presence event handling with de-duplication
 * - Presence data hydration from backend
 */
export function usePresence() {
  const debug = process.env.NEXT_PUBLIC_DM_DEBUG === 'true';

  // State
  const [currentUser, setCurrentUser] = useRecoilState(dmCurrentUserState);
  const [onlineUsers, setOnlineUsers] = useRecoilState(dmOnlineUsersState);
  const [userPresence, setUserPresence] = useRecoilState(dmUserPresenceState);
  const [typingUsers, setTypingUsers] = useRecoilState(dmTypingUsersState);
  const [isTyping, setIsTyping] = useRecoilState(dmIsTypingState);

  // Selectors
  const onlineUsersWithPresence = useRecoilValue(dmOnlineUsersWithPresenceSelector);
  const otherMembers = useRecoilValue(dmOtherMembersSelector);
  const activeTypingUsers = useRecoilValue(dmActiveTypingUsersSelector);

  // Refs for managing timeouts and de-duplication
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const lastPresenceEventRef = useRef<Record<string, { status: string; timestamp?: string }>>({});
  const pendingPresenceHydrations = useRef<Set<string>>(new Set());

  // Get user profile for current user initialization
  const { profileState: userProfile } = useUserProfile();

  /**
   * Checks if presence data has identifying information
   */
  const hasIdentityInfo = useCallback((data?: Partial<DMPresenceData>): boolean => {
    if (!data) return false;
    const safeString = (value?: string) => (typeof value === 'string' ? value.trim() : '');
    return Boolean(
      safeString(data.name) ||
      safeString(data.firstName) ||
      safeString(data.lastName) ||
      safeString(data.email)
    );
  }, []);

  /**
   * Start typing indicator for active conversation
   */
  const startTyping = useCallback((conversationId: string) => {
    if (!conversationId || isTyping) return;

    setIsTyping(true);
    directMessagesWebSocketService.startTyping({ conversationId });

    // Stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId);
    }, 3000);
  }, [isTyping, setIsTyping]);

  /**
   * Stop typing indicator for active conversation
   */
  const stopTyping = useCallback((conversationId: string) => {
    if (!conversationId || !isTyping) return;

    setIsTyping(false);
    directMessagesWebSocketService.stopTyping({ conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isTyping, setIsTyping]);

  /**
   * Handle incoming typing events from other users
   */
  const handleUserTyping = useCallback((data: DMUserTypingEvent) => {
    const timeoutKey = `${data.conversationId}-${data.userId}`;

    setTypingUsers((prev) => {
      const newTypingUsers = { ...prev };
      const conversationTypers = newTypingUsers[data.conversationId] || [];

      if (data.isTyping) {
        if (!conversationTypers.includes(data.userId)) {
          newTypingUsers[data.conversationId] = [...conversationTypers, data.userId];
        }

        // Clear any existing timeout for this user
        if (typingTimeouts.current[timeoutKey]) {
          clearTimeout(typingTimeouts.current[timeoutKey]);
        }

        // Set auto-cleanup after 5 seconds (in case stop event is missed)
        typingTimeouts.current[timeoutKey] = setTimeout(() => {
          setTypingUsers((prev) => {
            const updatedTypers = { ...prev };
            updatedTypers[data.conversationId] = (updatedTypers[data.conversationId] || [])
              .filter((id) => id !== data.userId);
            return updatedTypers;
          });
          delete typingTimeouts.current[timeoutKey];
        }, 5000);

      } else {
        // User stopped typing
        newTypingUsers[data.conversationId] = conversationTypers.filter((id) => id !== data.userId);

        // Clear the timeout if it exists
        if (typingTimeouts.current[timeoutKey]) {
          clearTimeout(typingTimeouts.current[timeoutKey]);
          delete typingTimeouts.current[timeoutKey];
        }
      }

      return newTypingUsers;
    });
  }, [setTypingUsers]);

  /**
   * Handle user status change events (online/offline/away/busy)
   */
  const handleStatusChanged = useCallback((event: any) => {
    if (debug) console.log('[DM] User status changed event:', event);

    const { userId, status, userData } = parseStatusChangeEvent(event);

    if (!userId || !isValidUserId(userId)) {
      console.warn('[DM] Status change event has invalid or missing userId:', event);
      return;
    }

    if (!status) {
      console.warn('[DM] Status change event missing status:', event);
      return;
    }

    // Lightweight de-duplication: ignore same status with equal or older timestamp
    const incomingTs = (event?.timestamp || userData?.timestamp) as string | undefined;
    const prev = lastPresenceEventRef.current[userId];
    if (prev && prev.status === status) {
      if (!incomingTs || !prev.timestamp || new Date(incomingTs) <= new Date(prev.timestamp)) {
        if (debug) console.log('[DM] Skipping duplicate/older presence event for', userId, status, incomingTs);
        return;
      }
    }
    lastPresenceEventRef.current[userId] = { status, timestamp: incomingTs };

    if (debug) console.log('[DM] Parsed status change:', { userId, status });

    const existingPresence = userPresence[userId];
    const combinedPresence = {
      ...existingPresence,
      ...userData,
    } as Partial<DMPresenceData>;

    // Update presence data
    setUserPresence((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        ...userData,
        userId,
        status,
        timestamp: event.timestamp || userData.timestamp || new Date().toISOString(),
        lastSeen: status === 'offline'
          ? (event.timestamp || userData.timestamp || new Date().toISOString())
          : prev[userId]?.lastSeen,
      },
    }));

    // Update online users list
    if (status === 'online') {
      if (debug) console.log('[DM] Adding user to online list:', userId);
      setOnlineUsers((prev) => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    } else if (status === 'offline') {
      if (debug) console.log('[DM] Removing user from online list:', userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    }

    // If we still don't have identifying details for this user, hydrate via getPresence
    if (!hasIdentityInfo(combinedPresence) && !pendingPresenceHydrations.current.has(userId)) {
      pendingPresenceHydrations.current.add(userId);
      directMessagesWebSocketService
        .getPresence([userId])
        .then((presenceResponse) => {
          const { presenceData } = parsePresenceResponse(presenceResponse);
          const hydrated = presenceData[userId];
          if (hydrated && hasIdentityInfo(hydrated)) {
            setUserPresence((prev) => ({
              ...prev,
              [userId]: {
                ...prev[userId],
                ...hydrated,
              },
            }));
          }
        })
        .catch((error) => {
          console.error('[DM] Failed to hydrate presence details for user:', userId, error);
        })
        .finally(() => {
          pendingPresenceHydrations.current.delete(userId);
        });
    }
  }, [debug, userPresence, setUserPresence, setOnlineUsers, hasIdentityInfo]);

  /**
   * Initialize current user from profile
   */
  useEffect(() => {
    const userId = userProfile?.id || userProfile?.userId;
    if (userProfile && userId && !currentUser) {
      setCurrentUser({
        userId: userId,
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userProfile.email || 'User',
        isArchived: false,
        isFavorite: false,
        role: 'member',
      });
    }
  }, [userProfile, currentUser, setCurrentUser]);

  /**
   * Cleanup typing timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      Object.values(typingTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    // State
    currentUser,
    onlineUsers,
    userPresence,
    typingUsers,
    isTyping,

    // Computed values
    onlineUsersWithPresence,
    otherMembers,
    activeTypingUsers,

    // Actions
    startTyping,
    stopTyping,

    // Event handlers (for WebSocket event registration)
    handleUserTyping,
    handleStatusChanged,
  };
}

export type UsePresenceResult = ReturnType<typeof usePresence>;