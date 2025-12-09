/**
 * Workload Header Component
 *
 * Displays agent workload summary cards at the top of the Kanban board.
 * Uses unified design system components and tokens for consistency.
 */

import React, { memo, useMemo } from "react";
import { Box, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Inbox as InboxIcon,
  PendingActions as PendingIcon,
} from "@mui/icons-material";

// Design system - unified components and tokens
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticTypography,
  slaColors,
  Avatar,
  StatsCardSkeleton,
} from "@/widgets/frontdesk/design-system";

// Types
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import {
  getWorkloadLevel,
  WORKLOAD_THRESHOLDS,
} from "../../types/kanban.types";

// ============================================
// Types
// ============================================

export interface WorkloadHeaderProps {
  agents: Agent[];
  conversations: ChatwootConversation[];
  loading?: boolean;
}

interface AgentWorkloadSummary {
  agent: Agent;
  openCount: number;
  pendingCount: number;
  totalCount: number;
  loadLevel: "low" | "medium" | "high";
}

// ============================================
// Helper Functions
// ============================================

const getWorkloadColor = (level: "low" | "medium" | "high"): string => {
  switch (level) {
    case "low":
      return slaColors.onTrack.main;
    case "medium":
      return slaColors.warning.main;
    case "high":
      return slaColors.breached.main;
    default:
      return colorTokens.neutral[400];
  }
};

// Status colors for conversation counts
const statusColors = {
  open: colorTokens.success[500],
  pending: colorTokens.warning[500],
};

// ============================================
// Loading Skeleton - Using unified StatsCardSkeleton
// ============================================

const WorkloadSkeleton: React.FC = () => (
  <Stack
    direction="row"
    sx={{
      gap: 2.5,
      padding: "16px 24px",
      overflowX: "auto",
      "&::-webkit-scrollbar": {
        height: 4,
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: colorTokens.neutral[300],
        borderRadius: 2,
      },
    }}
  >
    {[1, 2, 3, 4].map((i) => (
      <StatsCardSkeleton key={i} sx={{ minWidth: 170 }} />
    ))}
  </Stack>
);

// ============================================
// Agent Card Component - Using design system tokens
// ============================================

interface AgentCardProps {
  summary: AgentWorkloadSummary;
}

const AgentCard: React.FC<AgentCardProps> = memo(({ summary }) => {
  const { t } = useTranslation();
  const { agent, openCount, pendingCount, totalCount, loadLevel } = summary;

  return (
    <Tooltip
      title={t("frontdesk.workboard.agentWorkload", {
        name: agent.name,
        open: openCount,
        pending: pendingCount,
        total: totalCount,
      })}
      placement="bottom"
    >
      <Box
        sx={{
          minWidth: 170,
          maxWidth: 190,
          padding: "16px",
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${radiusTokens.lg}px`,
          boxShadow: shadowTokens.card,
          border: `1px solid ${colorTokens.semantic.border.default}`,
          borderLeft: `3px solid ${getWorkloadColor(loadLevel)}`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: shadowTokens.cardHover,
          },
        }}
      >
        {/* Agent Info - Using Avatar primitive */}
        <Stack
          direction="row"
          alignItems="center"
          marginBottom="12px"
          sx={{
            gap: 1.5,
          }}
        >
          <Avatar
            name={agent.name || "Agent"}
            src={agent.thumbnail}
            size="sm"
          />
          <Box flex={1} minWidth={0}>
            {/* Name - Using semantic typography */}
            <Box
              component="span"
              sx={{
                ...semanticTypography.body.medium,
                fontWeight: semanticTypography.heading.h5.fontWeight,
                color: colorTokens.semantic.text.primary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {agent.name}
            </Box>
            {/* Status */}
            <Box
              component="span"
              sx={{
                ...semanticTypography.caption.small,
                fontWeight: semanticTypography.label.small.fontWeight,
                color: getWorkloadColor(loadLevel),
                display: "block",
              }}
            >
              {loadLevel === "low" && "Available"}
              {loadLevel === "medium" && "Moderate"}
              {loadLevel === "high" && "Heavy Load"}
            </Box>
          </Box>
        </Stack>

        {/* Stats - Using semantic typography */}
        <Stack
          direction="row"
          sx={{
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              gap: 0.5,
            }}
          >
            <InboxIcon sx={{ fontSize: 13, color: statusColors.open }} />
            <Box
              component="span"
              sx={{
                ...semanticTypography.body.small,
                fontWeight: semanticTypography.heading.h5.fontWeight,
                color: colorTokens.semantic.text.primary,
              }}
            >
              {openCount}
            </Box>
            <Box
              component="span"
              sx={{
                ...semanticTypography.caption.small,
                color: colorTokens.semantic.text.tertiary,
              }}
            >
              open
            </Box>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            sx={{
              gap: 0.5,
            }}
          >
            <PendingIcon sx={{ fontSize: 13, color: statusColors.pending }} />
            <Box
              component="span"
              sx={{
                ...semanticTypography.body.small,
                fontWeight: semanticTypography.heading.h5.fontWeight,
                color: colorTokens.semantic.text.primary,
              }}
            >
              {pendingCount}
            </Box>
            <Box
              component="span"
              sx={{
                ...semanticTypography.caption.small,
                color: colorTokens.semantic.text.tertiary,
              }}
            >
              pending
            </Box>
          </Stack>
        </Stack>

        {/* Workload Bar */}
        <Box sx={{ marginTop: "12px" }}>
          <Box
            sx={{
              height: 4,
              borderRadius: radiusTokens.sm,
              backgroundColor: colorTokens.neutral[200],
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${Math.min(
                  (openCount / WORKLOAD_THRESHOLDS.medium) * 100,
                  100
                )}%`,
                backgroundColor: getWorkloadColor(loadLevel),
                borderRadius: radiusTokens.sm,
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
});

// ============================================
// Main Component
// ============================================

const WorkloadHeaderComponent: React.FC<WorkloadHeaderProps> = ({
  agents,
  conversations,
  loading,
}) => {
  // Calculate workload for each agent
  const agentWorkloads = useMemo<AgentWorkloadSummary[]>(() => {
    return agents
      .map((agent) => {
        const agentConvs = conversations.filter(
          (c) => c.meta?.assignee?.id === agent.id
        );
        const openCount = agentConvs.filter((c) => c.status === "open").length;
        const pendingCount = agentConvs.filter(
          (c) => c.status === "pending"
        ).length;

        return {
          agent,
          openCount,
          pendingCount,
          totalCount: agentConvs.length,
          loadLevel: getWorkloadLevel(openCount),
        };
      })
      .sort((a, b) => b.openCount - a.openCount);
  }, [agents, conversations]);

  // Calculate totals
  const totals = useMemo(() => {
    const unassigned = conversations.filter((c) => !c.meta?.assignee?.id);
    return {
      total: conversations.length,
      unassigned: unassigned.length,
      unassignedOpen: unassigned.filter((c) => c.status === "open").length,
    };
  }, [conversations]);

  if (loading) {
    return <WorkloadSkeleton />;
  }

  if (agents.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: "16px 24px",
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      }}
    >
      {/* Header - Using semantic typography */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="12px"
      >
        <Box
          component="span"
          sx={{
            ...semanticTypography.heading.h5,
            color: colorTokens.semantic.text.primary,
          }}
        >
          Team Workload
        </Box>
        <Stack
          direction="row"
          sx={{
            gap: 2.5,
          }}
        >
          <Box
            component="span"
            sx={{
              ...semanticTypography.caption.medium,
              color: colorTokens.semantic.text.tertiary,
              "& strong": {
                fontWeight: semanticTypography.heading.h5.fontWeight,
                color: colorTokens.semantic.text.primary,
              },
            }}
          >
            Total: <strong>{totals.total}</strong>
          </Box>
          {totals.unassigned > 0 && (
            <Box
              component="span"
              sx={{
                ...semanticTypography.caption.medium,
                color: colorTokens.warning[600],
                "& strong": {
                  fontWeight: semanticTypography.heading.h5.fontWeight,
                },
              }}
            >
              Unassigned: <strong>{totals.unassignedOpen}</strong> open
            </Box>
          )}
        </Stack>
      </Stack>

      {/* Agent Cards */}
      <Stack
        direction="row"
        sx={{
          gap: 2.5,
          overflowX: "auto",
          paddingBottom: "4px",
          "&::-webkit-scrollbar": {
            height: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colorTokens.neutral[300],
            borderRadius: 2,
          },
        }}
      >
        {agentWorkloads.map((summary) => (
          <AgentCard key={summary.agent.id} summary={summary} />
        ))}
      </Stack>
    </Box>
  );
};

export const WorkloadHeader = memo(WorkloadHeaderComponent);
