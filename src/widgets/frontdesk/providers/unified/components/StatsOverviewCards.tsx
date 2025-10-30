import React from "react";
import { Box, Grid } from "@mui/material";
import { StatCard } from "@/widgets/frontdesk/design-system";
import EmailIcon from "@mui/icons-material/Email";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { DashboardStats } from "../hooks/useDashboardStats";

export interface StatsOverviewCardsProps {
  stats: DashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
}

export const StatsOverviewCards: React.FC<StatsOverviewCardsProps> = ({ stats, isLoading = false, onCardClick }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        {/* Total Unread Messages */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Unread Messages"
            value={stats.totalUnreadMessages === 0 ? "All caught up!" : stats.totalUnreadMessages}
            icon={<NotificationsIcon />}
            variant={stats.totalUnreadMessages === 0 ? "success" : "error"}
            description={stats.totalUnreadMessages === 0 ? "No pending messages" : "Across all channels"}
            isLoading={isLoading}
            onClick={() => onCardClick?.("unread-messages")}
          />
        </Grid>

        {/* Open Tickets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Open Tickets"
            value={stats.openTickets}
            icon={<ConfirmationNumberIcon />}
            variant="primary"
            description={`${stats.myTickets} assigned to me`}
            isLoading={isLoading}
            onClick={() => onCardClick?.("open-tickets")}
          />
        </Grid>

        {/* Unassigned Tickets */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Needs Assignment"
            value={stats.unassignedTickets}
            icon={<AssignmentLateIcon />}
            variant="warning"
            description="Unassigned tickets"
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
            description="Updates in 24h"
            isLoading={isLoading}
            trend={
              stats.trends.messagesVsYesterday
                ? {
                    value: stats.trends.messagesVsYesterday,
                    label: "vs yesterday",
                  }
                : undefined
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsOverviewCards;
