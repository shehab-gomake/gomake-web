/**
 * Agent Stats Cards
 *
 * Displays agent-specific performance metrics for the dashboard.
 * Focuses on personal productivity and immediate tasks.
 */

import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ChatwootWarningsCard } from "./chatwoot-warnings-widget";
import type { AgentDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";
import {
  formatStatCardValue,
  formatResponseTime,
  getCardVariant,
} from "../../utils";

export interface AgentStatsCardsProps {
  stats: AgentDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
  onWarningsClick?: () => void;
}

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  onWarningsClick,
}) => {
  // Memoize card configurations to prevent unnecessary recalculations
  const cards = useMemo(
    () => [
      {
        id: "my-open-tickets" as const,
        label: "My Open Tickets",
        value: formatStatCardValue(stats.myOpenTickets),
        icon: <AssignmentIcon />,
        variant: getCardVariant(stats.myOpenTickets, "success", "primary"),
        description:
          stats.myOpenTickets === 0
            ? "All caught up!"
            : "Assigned to me",
      },
      {
        id: "my-response-time" as const,
        label: "Avg Response Time",
        value: formatResponseTime(stats.myAverageResponseTime),
        icon: <AccessTimeIcon />,
        variant: "neutral" as const,
        description: "My average",
      },
      {
        id: "my-resolved-today" as const,
        label: "Resolved Today",
        value: formatStatCardValue(stats.myResolvedToday),
        icon: <CheckCircleIcon />,
        variant: "success" as const,
        description: "Completed today",
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

export default AgentStatsCards;

