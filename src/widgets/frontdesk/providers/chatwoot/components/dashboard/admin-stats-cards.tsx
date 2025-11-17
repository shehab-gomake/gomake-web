/**
 * Admin Stats Cards
 *
 * Displays admin/manager-specific team performance metrics for the dashboard.
 * Focuses on team-wide metrics and operational health.
 */

import React from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import ForumIcon from "@mui/icons-material/Forum";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type { AdminDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";

export interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats, isLoading = false, onCardClick }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Total Open Tickets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Open Tickets"
            value={stats.totalOpenTickets}
            icon={<ForumIcon />}
            variant="primary"
            description="Across all agents"
            isLoading={isLoading}
            onClick={() => onCardClick?.("total-open-tickets")}
          />
        </Grid>

        {/* Unassigned Tickets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Unassigned Tickets"
            value={stats.unassignedTickets}
            icon={<AssignmentLateIcon />}
            variant={stats.unassignedTickets === 0 ? "success" : "error"}
            description="Need assignment"
            isLoading={isLoading}
            onClick={() => onCardClick?.("unassigned-tickets")}
          />
        </Grid>

        {/* Active Today */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Active Today"
            value={stats.activeToday}
            icon={<TrendingUpIcon />}
            variant="success"
            description="Last 24 hours"
            isLoading={isLoading}
            onClick={() => onCardClick?.("active-today")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStatsCards;
