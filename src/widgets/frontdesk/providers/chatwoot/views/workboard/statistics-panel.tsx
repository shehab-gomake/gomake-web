/**
 * Statistics Panel Component
 *
 * Displays key metrics for the Control Station overview.
 * Uses unified StatCard component from the FrontDesk design system.
 */

import React, { memo, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Inbox as InboxIcon,
  PendingActions as PendingIcon,
  CheckCircle as ResolvedIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

// Design system - unified components and tokens
import {
  colorTokens,
  StatCard,
  StatsCardSkeleton,
} from "@/widgets/frontdesk/design-system";

// Types
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

// ============================================
// Types
// ============================================

export interface StatisticsPanelProps {
  conversations: ChatwootConversation[];
  agents: Agent[];
  loading?: boolean;
}

// ============================================
// Main Component
// ============================================

const StatisticsPanelComponent: React.FC<StatisticsPanelProps> = ({
  conversations,
  agents,
  loading,
}) => {
  const { t } = useTranslation();
  // Calculate statistics (excludes snoozed conversations)
  const stats = useMemo(() => {
    // Filter out snoozed conversations
    const activeConversations = conversations.filter(
      (c) => c.status !== "snoozed"
    );
    const total = activeConversations.length;
    const open = activeConversations.filter((c) => c.status === "open").length;
    const pending = activeConversations.filter(
      (c) => c.status === "pending"
    ).length;
    const resolved = activeConversations.filter(
      (c) => c.status === "resolved"
    ).length;
    const unassigned = activeConversations.filter(
      (c) => !c.meta?.assignee?.id
    ).length;

    // Calculate high priority (urgent + high)
    const highPriority = activeConversations.filter(
      (c) => c.priority === "urgent" || c.priority === "high"
    ).length;

    // Calculate unread (conversations with unread messages)
    const withUnread = activeConversations.filter(
      (c) => (c.unread_count || 0) > 0
    ).length;

    // Active agents (agents with at least one open conversation)
    const activeAgentIds = new Set(
      activeConversations
        .filter((c) => c.status === "open" && c.meta?.assignee?.id)
        .map((c) => c.meta?.assignee?.id)
    );
    const activeAgents = activeAgentIds.size;

    return {
      total,
      open,
      pending,
      resolved,
      unassigned,
      highPriority,
      withUnread,
      activeAgents,
      totalAgents: agents.length,
    };
  }, [conversations, agents]);

  // Loading state with unified skeleton
  if (loading) {
    return (
      <Box
        sx={{
          padding: "16px 24px",
          backgroundColor: colorTokens.neutral[50],
          borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        }}
      >
        <Stack
          direction="row"
          sx={{
            overflowX: "auto",
            gap: 2.5,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <StatsCardSkeleton key={i} sx={{ minWidth: 150 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "16px 24px",
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      }}
    >
      {/* Cards container with unified spacing */}
      <Stack
        direction="row"
        sx={{
          overflowX: "auto",
          paddingBottom: "4px",
          gap: 2.5,
          "&::-webkit-scrollbar": {
            height: 4,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colorTokens.neutral[300],
            borderRadius: 2,
          },
        }}
      >
        {/* Open Conversations */}
        <StatCard
          label={t("frontdesk.workboard.stats.open")}
          value={stats.open}
          icon={<InboxIcon />}
          variant="success"
          description={t("frontdesk.workboard.stats.withUnread", {
            count: stats.withUnread,
          })}
        />

        {/* Pending Conversations */}
        <StatCard
          label={t("frontdesk.workboard.stats.pending")}
          value={stats.pending}
          icon={<PendingIcon />}
          variant="warning"
          description={t("frontdesk.workboard.stats.awaitingResponse")}
        />

        {/* Unassigned */}
        <StatCard
          label={t("frontdesk.workboard.stats.unassigned")}
          value={stats.unassigned}
          icon={<WarningIcon />}
          variant={stats.unassigned > 0 ? "error" : "neutral"}
          description={t("frontdesk.workboard.stats.needsAttention")}
        />

        {/* High Priority */}
        <StatCard
          label={t("frontdesk.workboard.stats.highPriority")}
          value={stats.highPriority}
          icon={<SpeedIcon />}
          variant={stats.highPriority > 0 ? "error" : "neutral"}
          description={t("frontdesk.workboard.stats.urgentHigh")}
        />

        {/* Active Agents */}
        <StatCard
          label={t("frontdesk.workboard.stats.activeAgents")}
          value={`${stats.activeAgents}/${stats.totalAgents}`}
          icon={<PeopleIcon />}
          variant="primary"
          description={t("frontdesk.workboard.stats.handlingConversations")}
        />

        {/* Resolved Today */}
        <StatCard
          label={t("frontdesk.workboard.stats.resolved")}
          value={stats.resolved}
          icon={<ResolvedIcon />}
          variant="neutral"
          description={t("frontdesk.workboard.stats.completed")}
        />
      </Stack>
    </Box>
  );
};

export const StatisticsPanel = memo(StatisticsPanelComponent);
