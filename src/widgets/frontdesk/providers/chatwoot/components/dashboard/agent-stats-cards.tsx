/**
 * Agent Stats Cards
 *
 * Displays agent-specific performance metrics for the dashboard.
 * Focuses on personal productivity and immediate tasks.
 */

import React from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ChatwootWarningsCard } from "./chatwoot-warnings-widget";
import type { AgentDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";

export interface AgentStatsCardsProps {
  stats: AgentDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
  onWarningsClick?: () => void;
}

/**
 * Formats response time in minutes to a human-readable string
 */
const formatResponseTime = (minutes: number): string => {
  if (minutes === 0) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  onWarningsClick,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* My Open Tickets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="My Open Tickets"
            value={stats.myOpenTickets}
            icon={<AssignmentIcon />}
            variant={stats.myOpenTickets === 0 ? "success" : "primary"}
            description={
              stats.myOpenTickets === 0
                ? "All caught up!"
                : "Assigned to me"
            }
            isLoading={isLoading}
            onClick={() => onCardClick?.("my-open-tickets")}
          />
        </Grid>

        {/* My Average Response Time */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Avg Response Time"
            value={formatResponseTime(stats.myAverageResponseTime)}
            icon={<AccessTimeIcon />}
            variant="neutral"
            description="My average"
            isLoading={isLoading}
            onClick={() => onCardClick?.("my-response-time")}
          />
        </Grid>

        {/* My Resolved Today */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Resolved Today"
            value={stats.myResolvedToday}
            icon={<CheckCircleIcon />}
            variant="success"
            description="Completed today"
            isLoading={isLoading}
            onClick={() => onCardClick?.("my-resolved-today")}
          />
        </Grid>

        {/* System Warnings */}
        <Grid item xs={12} sm={6} md={3}>
          <ChatwootWarningsCard onClick={onWarningsClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentStatsCards;

