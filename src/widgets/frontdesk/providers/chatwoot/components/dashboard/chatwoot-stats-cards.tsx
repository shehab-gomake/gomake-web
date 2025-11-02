/**
 * Chatwoot Stats Cards
 *
 * Displays 4 stat cards showing Chatwoot-specific metrics.
 * Based on StatsOverviewCards from unified dashboard.
 */

import React from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import ChatIcon from "@mui/icons-material/Chat";
import ForumIcon from "@mui/icons-material/Forum";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import type { ChatwootDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";

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
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Unread Conversations */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Unread Conversations"
            value={
              stats.unreadConversations === 0
                ? "All caught up!"
                : stats.unreadConversations
            }
            icon={<ChatIcon />}
            variant={stats.unreadConversations === 0 ? "success" : "error"}
            description={
              stats.unreadConversations === 0
                ? "No unread messages"
                : "Need your attention"
            }
            isLoading={isLoading}
            onClick={() => onCardClick?.("unread-conversations")}
          />
        </Grid>

        {/* Open Conversations */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Open Conversations"
            value={stats.openConversations}
            icon={<ForumIcon />}
            variant="primary"
            description={`${stats.myConversations} assigned to me`}
            isLoading={isLoading}
            onClick={() => onCardClick?.("open-conversations")}
          />
        </Grid>

        {/* Mentions */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Mentions"
            value={stats.mentions}
            icon={<AlternateEmailIcon />}
            variant="warning"
            description="You were mentioned"
            isLoading={isLoading}
            onClick={() => onCardClick?.("mentions")}
          />
        </Grid>

        {/* Unattended */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Unattended"
            value={stats.unattended}
            icon={<AssignmentLateIcon />}
            variant="error"
            description="Need assignment"
            isLoading={isLoading}
            onClick={() => onCardClick?.("unattended")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatwootStatsCards;
