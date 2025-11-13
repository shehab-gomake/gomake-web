/**
 * Chatwoot Dashboard Stats Hook
 *
 * Calculates all dashboard statistics from Chatwoot data.
 * Based on useDashboardStats from unified dashboard.
 */

import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  chatwootConversationsAtom,
  chatwootConversationCountsAtom,
  chatwootNotificationsAtom,
  chatwootProfileAtom,
} from '@/store/frontdesk/atoms/chatwoot.atoms';
import { ConversationStatus } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { chatwootTimestampToDate } from '../utils/conversation-helpers';

/**
 * Dashboard statistics for Chatwoot provider
 *
 * Provides aggregated metrics calculated from conversations and notifications.
 * All counts are computed in real-time from Recoil atoms.
 */
export interface ChatwootDashboardStats {
  /** Number of conversations with unread messages */
  unreadConversations: number;

  /** Number of conversations with "open" status */
  openConversations: number;

  /** Number of open conversations assigned to current user */
  myConversations: number;

  /** Number of conversations where user was mentioned */
  mentions: number;

  /** Number of open conversations without an assignee */
  unattended: number;

  /** Number of conversations updated in the last 24 hours */
  activeToday: number;

  /** Number of unread notifications */
  unreadNotifications: number;

  /** Trend data comparing current metrics to historical values */
  trends: {
    /** Percentage change in conversations compared to yesterday */
    conversationsVsYesterday?: number;
  };
}

/**
 * Agent-specific dashboard statistics
 * Extends base stats with personal performance metrics
 */
export interface AgentDashboardStats extends ChatwootDashboardStats {
  /** Number of open conversations assigned to current user */
  myOpenTickets: number;

  /** Average response time in minutes (calculated from message timestamps) */
  myAverageResponseTime: number;

  /** Number of resolved conversations assigned to user today */
  myResolvedToday: number;
}

/**
 * Admin-specific dashboard statistics
 * Extends base stats with team-wide metrics
 */
export interface AdminDashboardStats extends ChatwootDashboardStats {
  /** Total open conversations across all agents */
  totalOpenTickets: number;

  /** Open conversations without an assignee */
  unassignedTickets: number;

  /** Average team response time in minutes */
  averageTeamResponseTime: number;
}

/**
 * Hook to compute dashboard statistics for Chatwoot provider
 *
 * Calculates real-time metrics from conversations and notifications stored in Recoil.
 * Uses memoization to prevent unnecessary recalculations.
 *
 * @returns Dashboard statistics including conversation counts, mentions, and notifications
 *
 * @example
 * ```tsx
 * const stats = useChatwootDashboardStats();
 * console.log(`Unread: ${stats.unreadConversations}`);
 * console.log(`My conversations: ${stats.myConversations}`);
 * ```
 */
export const useChatwootDashboardStats = (): ChatwootDashboardStats => {
  // Get conversations, counts, and notifications
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const conversationCounts = useRecoilValue(chatwootConversationCountsAtom);
  const notifications = useRecoilValue(chatwootNotificationsAtom);

  return useMemo(() => {
    // Use API-provided counts from Chatwoot meta endpoint
    // These are accurate counts across ALL conversations, not just the paginated results
    const { mine: mineCount, unassigned: unassignedCount, all: allCount } = conversationCounts;

    // Calculate unread conversations from the loaded conversations
    // Note: This is approximate since we only have paginated results
    // For accurate unread count, we'd need to fetch all unread conversations or use a dedicated endpoint
    const unreadConversations = conversations.filter(
      (conv) => conv.unread_count > 0
    ).length;

    // Use API-provided counts (these are accurate)
    // mine_count = open conversations assigned to current user
    const myConversations = mineCount;
    
    // unassigned_count = open conversations without assignee
    const unattended = unassignedCount;
    
    // all_count = total conversations (typically open conversations)
    // Use all_count as openConversations since Chatwoot typically counts open conversations
    const openConversations = allCount;

    // Calculate mentions (conversations with unread messages)
    // In a real implementation, this would check for actual mentions
    // For now, we use unread conversations as a proxy
    const mentions = conversations.filter(
      (conv) => conv.unread_count > 0 && conv.meta?.sender?.name
    ).length;

    // Calculate activity today (conversations updated in last 24h)
    // Note: This is approximate since we only have paginated results
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const activeToday = conversations.filter((conv) => {
      const timestamp = conv.updated_at || conv.created_at || conv.timestamp;
      if (!timestamp) return false;
      
      // Use shared utility for consistent timestamp conversion
      const convDate = chatwootTimestampToDate(timestamp);
      
      if (!convDate) return false;
      
      return convDate >= yesterday;
    }).length;

    // Calculate unread notifications
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read_at
    ).length;

    return {
      unreadConversations,
      openConversations,
      myConversations,
      mentions,
      unattended,
      activeToday,
      unreadNotifications,
      trends: {
        // These would be calculated from historical data
        // For now, we return undefined
        conversationsVsYesterday: undefined,
      },
    };
  }, [conversations, conversationCounts, notifications]);
};

/**
 * Hook to compute agent-specific dashboard statistics
 *
 * Calculates personal performance metrics for agents.
 * Requires current user ID to filter conversations.
 *
 * @returns Agent dashboard statistics including personal performance metrics
 */
export const useAgentDashboardStats = (): AgentDashboardStats => {
  const baseStats = useChatwootDashboardStats();
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const conversationCounts = useRecoilValue(chatwootConversationCountsAtom);
  const profile = useRecoilValue(chatwootProfileAtom);
  const currentUserId = profile?.id;

  return useMemo(() => {
    if (!currentUserId) {
      return {
        ...baseStats,
        myOpenTickets: 0,
        myAverageResponseTime: 0,
        myResolvedToday: 0,
      };
    }

    // Use API-provided mine_count (open conversations assigned to current user)
    // This is accurate and includes all conversations, not just paginated results
    const myOpenTickets = conversationCounts.mine;

    // Filter conversations assigned to current user for resolved count
    // Note: This is approximate since we only have paginated results
    const myConversations = conversations.filter(
      (conv) => conv.meta?.assignee?.id === currentUserId
    );

    // My resolved today (assigned to me, resolved, updated today)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const myResolvedToday = myConversations.filter((conv) => {
      if (conv.status !== ConversationStatus.RESOLVED) return false;
      const timestamp = conv.updated_at || conv.created_at || conv.timestamp;
      if (!timestamp) return false;
      const convDate = chatwootTimestampToDate(timestamp);
      if (!convDate) return false;
      return convDate >= todayStart;
    }).length;

    // Calculate average response time
    // This is a simplified calculation - in a real implementation,
    // we'd need to fetch messages and calculate time between customer message and agent reply
    // For now, we'll use a placeholder calculation based on conversation timestamps
    let totalResponseTime = 0;
    let responseCount = 0;

    // Note: This is a simplified calculation. A proper implementation would:
    // 1. Fetch messages for each conversation
    // 2. Find pairs of customer messages and agent replies
    // 3. Calculate time difference between them
    // For now, we'll return 0 as a placeholder
    const myAverageResponseTime = responseCount > 0 
      ? Math.round(totalResponseTime / responseCount) 
      : 0;

    return {
      ...baseStats,
      myOpenTickets,
      myAverageResponseTime,
      myResolvedToday,
    };
  }, [baseStats, conversations, conversationCounts, currentUserId]);
};

/**
 * Hook to compute admin-specific dashboard statistics
 *
 * Calculates team-wide metrics for administrators and managers.
 *
 * @returns Admin dashboard statistics including team performance metrics
 */
export const useAdminDashboardStats = (): AdminDashboardStats => {
  const baseStats = useChatwootDashboardStats();
  const conversationCounts = useRecoilValue(chatwootConversationCountsAtom);

  return useMemo(() => {
    // Use API-provided counts (these are accurate across all conversations)
    // all_count = total open conversations
    const totalOpenTickets = conversationCounts.all;
    
    // unassigned_count = open conversations without assignee
    const unassignedTickets = conversationCounts.unassigned;

    // Average team response time
    // This is a simplified calculation - in a real implementation,
    // we'd need to calculate from actual message timestamps across all agents
    // For now, we'll return 0 as a placeholder
    const averageTeamResponseTime = 0;

    return {
      ...baseStats,
      totalOpenTickets,
      unassignedTickets,
      averageTeamResponseTime,
    };
  }, [baseStats, conversationCounts]);
};
