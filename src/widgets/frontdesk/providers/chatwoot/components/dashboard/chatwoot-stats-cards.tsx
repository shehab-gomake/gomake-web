/**
 * Chatwoot Stats Cards
 *
 * Displays 4 stat cards showing Chatwoot-specific metrics.
 * Based on StatsOverviewCards from unified dashboard.
 */

import React, { useMemo } from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import ChatIcon from "@mui/icons-material/Chat";
import ForumIcon from "@mui/icons-material/Forum";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import type { ChatwootDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";
import {
  formatStatCardValue,
  formatNumberInText,
  getCardVariant,
} from "../../utils";

export interface ChatwootStatsCardsProps {
  stats: ChatwootDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
}

export const ChatwootStatsCards: React.FC<ChatwootStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
}) => {
  // Memoize card configurations to prevent unnecessary recalculations
  const cards = useMemo(
    () => [
      {
        id: "unread-conversations" as const,
        label: "Unread Tickets",
        value: formatStatCardValue(stats.unreadConversations),
        icon: <ChatIcon />,
        variant: getCardVariant(stats.unreadConversations, "success", "error"),
        description:
          stats.unreadConversations === 0
            ? "No unread messages"
            : "Need your attention",
      },
      {
        id: "open-conversations" as const,
        label: "Open Tickets",
        value: formatStatCardValue(stats.openConversations),
        icon: <ForumIcon />,
        variant: "primary" as const,
        description: `${formatNumberInText(stats.myConversations)} assigned to me`,
      },
      {
        id: "mentions" as const,
        label: "Mentions",
        value: formatStatCardValue(stats.mentions),
        icon: <AlternateEmailIcon />,
        variant: "warning" as const,
        description: "You were mentioned",
      },
      {
        id: "unattended" as const,
        label: "Unattended",
        value: formatStatCardValue(stats.unattended),
        icon: <AssignmentLateIcon />,
        variant: "error" as const,
        description: "Need assignment",
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
      </Grid>
    </Box>
  );
};

export default ChatwootStatsCards;
