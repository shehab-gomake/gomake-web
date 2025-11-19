/**
 * Admin Stats Cards
 *
 * Displays admin/manager-specific team performance metrics for the dashboard.
 * Focuses on team-wide metrics and operational health.
 */

import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import ForumIcon from "@mui/icons-material/Forum";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ChatwootWarningsCard } from "./chatwoot-warnings-widget";
import type { AdminDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";
import {
  formatStatCardValue,
  getCardVariant,
} from "../../utils";

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
  onWarningsClick 
}) => {
  // Memoize card configurations to prevent unnecessary recalculations
  const cards = useMemo(
    () => [
      {
        id: "total-open-tickets" as const,
        label: "Total Open Tickets",
        value: formatStatCardValue(stats.totalOpenTickets),
        icon: <ForumIcon />,
        variant: "primary" as const,
        description: "Across all agents",
      },
      {
        id: "unassigned-tickets" as const,
        label: "Unassigned Tickets",
        value: formatStatCardValue(stats.unassignedTickets),
        icon: <AssignmentLateIcon />,
        variant: getCardVariant(stats.unassignedTickets, "success", "error"),
        description: "Need assignment",
      },
      {
        id: "active-today" as const,
        label: "Active Today",
        value: formatStatCardValue(stats.activeToday),
        icon: <TrendingUpIcon />,
        variant: "success" as const,
        description: "Last 24 hours",
      },
    ],
    [stats]
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <StatCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              variant={card.variant}
              description={card.description}
              isLoading={isLoading}
              onClick={() => onCardClick?.(card.id)}
            />
          </Grid>
        ))}
        {/* System Warnings */}
        <Grid item xs={12} sm={6} md={3}>
          <ChatwootWarningsCard onClick={onWarningsClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatsCards;
