/**
 * Agent Stats Cards - Modern Clean Design
 *
 * Displays agent-specific performance metrics for the dashboard.
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
import { StatCard } from "@/widgets/frontdesk/design-system";

// Grid layout tokens
const GRID_TOKENS = {
  columns: 4,
  gap: 20, // Consistent gap between cards
} as const;

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
        description: stats.myOpenTickets === 0 ? "All caught up!" : "Assigned to me",
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

export default AgentStatsCards;
