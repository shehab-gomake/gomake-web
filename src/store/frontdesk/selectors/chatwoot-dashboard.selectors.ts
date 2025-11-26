/**
 * Chatwoot Dashboard Selectors
 *
 * Selectors for computing dashboard statistics and metrics.
 * Pre-computes expensive calculations for optimal performance.
 */

import { selector, selectorFamily } from "recoil";
import {
  chatwootConversationsAtom,
  chatwootProfileAtom,
  chatwootInboxesAtom,
  chatwootAgentsAtom,
  chatwootTeamsAtom,
  chatwootNotificationsAtom,
  chatwootConversationCountsAtom,
} from "../atoms/chatwoot.atoms";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

// ============================================================================
// DASHBOARD OVERVIEW STATS
// ============================================================================

/**
 * Dashboard Overview Stats
 * All key metrics in a single selector for the dashboard header
 */
export interface DashboardOverviewStats {
  totalConversations: number;
  openConversations: number;
  pendingConversations: number;
  resolvedConversations: number;
  unreadCount: number;
  unassignedCount: number;
  myConversations: number;
  averageResponseTime: number | null; // In seconds
}

export const dashboardOverviewStatsSelector = selector<DashboardOverviewStats>({
  key: "chatwoot.dashboard.overviewStats",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    const profile = get(chatwootProfileAtom);
    const currentUserId = profile?.id;

    let openConversations = 0;
    let pendingConversations = 0;
    let resolvedConversations = 0;
    let unreadCount = 0;
    let unassignedCount = 0;
    let myConversations = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    for (const conv of conversations) {
      // Status counts
      switch (conv.status) {
        case "open":
          openConversations++;
          break;
        case "pending":
          pendingConversations++;
          break;
        case "resolved":
          resolvedConversations++;
          break;
      }

      // Unread count
      unreadCount += conv.unread_count || 0;

      // Unassigned count
      if (!conv.meta?.assignee?.id) {
        unassignedCount++;
      }

      // My conversations
      if (currentUserId && conv.meta?.assignee?.id === currentUserId) {
        myConversations++;
      }

      // Average response time (if available)
      const firstReplyTime = conv.additional_attributes?.first_reply_created_at;
      const createdAt = conv.created_at;
      if (firstReplyTime && createdAt) {
        const responseTime = new Date(firstReplyTime).getTime() - new Date(createdAt).getTime();
        if (responseTime > 0) {
          totalResponseTime += responseTime / 1000; // Convert to seconds
          responseTimeCount++;
        }
      }
    }

    return {
      totalConversations: conversations.length,
      openConversations,
      pendingConversations,
      resolvedConversations,
      unreadCount,
      unassignedCount,
      myConversations,
      averageResponseTime: responseTimeCount > 0 ? Math.round(totalResponseTime / responseTimeCount) : null,
    };
  },
});

// ============================================================================
// AGENT PERFORMANCE METRICS
// ============================================================================

export interface AgentPerformanceMetrics {
  agentId: number;
  agentName: string;
  assignedConversations: number;
  resolvedConversations: number;
  openConversations: number;
  averageResponseTime: number | null;
  resolutionRate: number; // 0-100
}

/**
 * Performance metrics for a specific agent
 */
export const agentPerformanceSelector = selectorFamily<AgentPerformanceMetrics | null, number>({
  key: "chatwoot.dashboard.agentPerformance",
  get:
    (agentId) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);
      const agents = get(chatwootAgentsAtom);

      const agent = agents.find((a) => a.id === agentId);
      if (!agent) return null;

      const agentConversations = conversations.filter((c) => c.meta?.assignee?.id === agentId);

      const resolved = agentConversations.filter((c) => c.status === "resolved").length;
      const open = agentConversations.filter((c) => c.status === "open").length;
      const total = agentConversations.length;

      return {
        agentId,
        agentName: agent.name || `Agent ${agentId}`,
        assignedConversations: total,
        resolvedConversations: resolved,
        openConversations: open,
        averageResponseTime: null, // Would need message data to compute
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      };
    },
});

/**
 * All agents performance leaderboard
 */
export const agentLeaderboardSelector = selector<AgentPerformanceMetrics[]>({
  key: "chatwoot.dashboard.agentLeaderboard",
  get: ({ get }) => {
    const agents = get(chatwootAgentsAtom);
    const metrics: AgentPerformanceMetrics[] = [];

    for (const agent of agents) {
      const performance = get(agentPerformanceSelector(agent.id));
      if (performance) {
        metrics.push(performance);
      }
    }

    // Sort by resolution rate descending
    return metrics.sort((a, b) => b.resolutionRate - a.resolutionRate);
  },
});

// ============================================================================
// TEAM PERFORMANCE METRICS
// ============================================================================

export interface TeamPerformanceMetrics {
  teamId: number;
  teamName: string;
  totalConversations: number;
  openConversations: number;
  resolvedConversations: number;
  memberCount: number;
}

/**
 * Performance metrics for a specific team
 */
export const teamPerformanceSelector = selectorFamily<TeamPerformanceMetrics | null, number>({
  key: "chatwoot.dashboard.teamPerformance",
  get:
    (teamId) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);
      const teams = get(chatwootTeamsAtom);

      const team = teams.find((t) => t.id === teamId);
      if (!team) return null;

      const teamConversations = conversations.filter((c) => c.meta?.team?.id === teamId);

      return {
        teamId,
        teamName: team.name || `Team ${teamId}`,
        totalConversations: teamConversations.length,
        openConversations: teamConversations.filter((c) => c.status === "open").length,
        resolvedConversations: teamConversations.filter((c) => c.status === "resolved").length,
        memberCount: (team as any).members?.length || 0,
      };
    },
});

// ============================================================================
// INBOX STATISTICS
// ============================================================================

export interface InboxStats {
  inboxId: number;
  inboxName: string;
  channelType: string;
  totalConversations: number;
  openConversations: number;
  unreadCount: number;
}

/**
 * Statistics for a specific inbox
 */
export const inboxStatsSelector = selectorFamily<InboxStats | null, number>({
  key: "chatwoot.dashboard.inboxStats",
  get:
    (inboxId) =>
    ({ get }) => {
      const conversations = get(chatwootConversationsAtom);
      const inboxes = get(chatwootInboxesAtom);

      const inbox = inboxes.find((i) => i.id === inboxId);
      if (!inbox) return null;

      const inboxConversations = conversations.filter((c) => c.inbox_id === inboxId);

      return {
        inboxId,
        inboxName: inbox.name || `Inbox ${inboxId}`,
        channelType: inbox.channel_type || "unknown",
        totalConversations: inboxConversations.length,
        openConversations: inboxConversations.filter((c) => c.status === "open").length,
        unreadCount: inboxConversations.reduce((sum, c) => sum + (c.unread_count || 0), 0),
      };
    },
});

/**
 * All inboxes statistics
 */
export const allInboxStatsSelector = selector<InboxStats[]>({
  key: "chatwoot.dashboard.allInboxStats",
  get: ({ get }) => {
    const inboxes = get(chatwootInboxesAtom);
    const stats: InboxStats[] = [];

    for (const inbox of inboxes) {
      const inboxStat = get(inboxStatsSelector(inbox.id));
      if (inboxStat) {
        stats.push(inboxStat);
      }
    }

    // Sort by total conversations descending
    return stats.sort((a, b) => b.totalConversations - a.totalConversations);
  },
});

// ============================================================================
// TIME-BASED ANALYTICS
// ============================================================================

/**
 * Conversations created today
 */
export const conversationsCreatedTodaySelector = selector<ChatwootConversation[]>({
  key: "chatwoot.dashboard.conversationsCreatedToday",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime() / 1000;

    return conversations.filter((c) => {
      const createdAt = typeof c.created_at === "number" ? c.created_at : new Date(c.created_at).getTime() / 1000;
      return createdAt >= todayTimestamp;
    });
  },
});

/**
 * Conversations resolved today
 */
export const conversationsResolvedTodaySelector = selector<number>({
  key: "chatwoot.dashboard.conversationsResolvedToday",
  get: ({ get }) => {
    const conversations = get(chatwootConversationsAtom);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime() / 1000;

    return conversations.filter((c) => {
      if (c.status !== "resolved") return false;
      // Use last_activity_at as proxy for resolution time
      const lastActivity =
        typeof c.last_activity_at === "number" ? c.last_activity_at : new Date(c.last_activity_at || 0).getTime() / 1000;
      return lastActivity >= todayTimestamp;
    }).length;
  },
});

// ============================================================================
// NOTIFICATION STATISTICS
// ============================================================================

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

export const notificationStatsSelector = selector<NotificationStats>({
  key: "chatwoot.dashboard.notificationStats",
  get: ({ get }) => {
    const notifications = get(chatwootNotificationsAtom);

    const stats: NotificationStats = {
      total: notifications.length,
      unread: 0,
      byType: {},
    };

    for (const notification of notifications) {
      if (!notification.read_at) {
        stats.unread++;
      }

      const type = notification.notification_type || "unknown";
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    }

    return stats;
  },
});

// ============================================================================
// COMBINED DASHBOARD DATA
// ============================================================================

export interface DashboardData {
  overview: DashboardOverviewStats;
  inboxes: InboxStats[];
  notifications: NotificationStats;
  conversationsToday: number;
  resolvedToday: number;
}

/**
 * All dashboard data in a single selector
 * Use this for the main dashboard view
 */
export const dashboardDataSelector = selector<DashboardData>({
  key: "chatwoot.dashboard.combinedData",
  get: ({ get }) => {
    return {
      overview: get(dashboardOverviewStatsSelector),
      inboxes: get(allInboxStatsSelector),
      notifications: get(notificationStatsSelector),
      conversationsToday: get(conversationsCreatedTodaySelector).length,
      resolvedToday: get(conversationsResolvedTodaySelector),
    };
  },
});

