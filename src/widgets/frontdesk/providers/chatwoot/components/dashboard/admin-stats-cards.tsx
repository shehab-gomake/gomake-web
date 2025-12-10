/**
 * Admin Stats Cards - Modern Clean Design
 *
 * Displays admin/manager-specific team performance metrics for the dashboard.
 * Features:
 * - 16px rounded corners
 * - Soft shadow with hover elevation
 * - Consistent 22px padding
 * - Icon in small rounded container with subtle background
 * - Improved typography hierarchy
 * - Subtle, calm accents (no loud border-top colors)
 * - Muted description label below main value
 * - Clean 4-column grid layout
 */

import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import ForumIcon from "@mui/icons-material/Forum";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ChatwootWarningsCard } from "./chatwoot-warnings-widget";
import type { AdminDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";
import { formatStatCardValue, getCardVariant } from "../../utils";
import { StatCard } from "@/widgets/frontdesk/design-system";

// Grid layout tokens
const GRID_TOKENS = {
  columns: 4,
  gap: 20, // Consistent gap between cards
} as const;

export interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
  onWarningsClick?: () => void;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  onWarningsClick,
}) => {
  const { t } = useTranslation();
  
  // Memoize card configurations to prevent unnecessary recalculations
  const cards = useMemo(
    () => [
      {
        id: "total-open-tickets" as const,
        label: t("frontdesk.dashboard.admin.totalOpenTickets"),
        value: formatStatCardValue(stats.totalOpenTickets),
        icon: <ForumIcon />,
        variant: "primary" as const,
        description: t("frontdesk.dashboard.admin.acrossAllAgents"),
      },
      {
        id: "unassigned-tickets" as const,
        label: t("frontdesk.dashboard.admin.unassignedTickets"),
        value: formatStatCardValue(stats.unassignedTickets),
        icon: <AssignmentLateIcon />,
        variant: getCardVariant(stats.unassignedTickets, "success", "error"),
        description: t("frontdesk.dashboard.admin.needAssignment"),
      },
      {
        id: "active-today" as const,
        label: t("frontdesk.dashboard.admin.activeToday"),
        value: formatStatCardValue(stats.activeToday),
        icon: <TrendingUpIcon />,
        variant: "success" as const,
        description: t("frontdesk.dashboard.admin.last24Hours"),
      },
    ],
    [stats, t]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_TOKENS.columns}, 1fr)`,
        gap: `${GRID_TOKENS.gap}px`,
      }}
    >
      {cards.map((card) => (
        <StatCard
          key={card.id}
          label={card.label}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          description={card.description}
          isLoading={isLoading}
          onClick={() => onCardClick?.(card.id)}
        />
      ))}
      {/* System Warnings */}
      <ChatwootWarningsCard onClick={onWarningsClick} />
    </Box>
  );
};

export default AdminStatsCards;
