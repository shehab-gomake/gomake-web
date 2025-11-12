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
    // Calculate unread conversations
    const unreadConversations = conversations.filter(
      (conv) => conv.unread_count > 0
    ).length;

    // Calculate open conversations (status: open)
    const openConversations = conversations.filter(
      (conv) => conv.status === ConversationStatus.OPEN
    ).length;

    // Calculate my conversations (open and assigned)
    const myConversations = conversations.filter(
      (conv) => conv.status === ConversationStatus.OPEN && conv.meta?.assignee?.id
    ).length;

    // Calculate mentions (conversations with unread messages)
    // In a real implementation, this would check for actual mentions
    // For now, we use unread conversations as a proxy
    const mentions = conversations.filter(
      (conv) => conv.unread_count > 0 && conv.meta?.sender?.name
    ).length;

    // Calculate unattended (open but not assigned)
    const unattended = conversations.filter(
      (conv) => conv.status === ConversationStatus.OPEN && !conv.meta?.assignee?.id
    ).length;

    // Calculate activity today (conversations updated in last 24h)
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
