/**
 * Chatwoot Dashboard View
 *
 * Main dashboard for Chatwoot showing stats, activity feed, and quick views.
 * Composed of smaller components for better maintainability.
 */

import React from "react";
import { Box, Paper, Chip, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HistoryIcon from "@mui/icons-material/History";
import { colorTokens } from "@/widgets/frontdesk/design-system/tokens";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootSettingsSubpage } from "@/widgets/frontdesk/routing/types";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { useAgentDashboardStats, useAdminDashboardStats } from "../hooks/use-chatwoot-dashboard-stats";
import { useChatwootDashboardType } from "../hooks/use-chatwoot-dashboard-type";
import { useDashboardNavigation } from "../hooks/use-dashboard-navigation";
import { AgentStatsCards } from "../components/dashboard/agent-stats-cards";
import { AdminStatsCards } from "../components/dashboard/admin-stats-cards";
import { ChatwootActivityFeed } from "../components/dashboard/chatwoot-activity-feed";
import { ChatwootNotificationsWidget } from "../components/dashboard/chatwoot-notifications-widget";
import { DashboardHeader } from "../components/dashboard/dashboard-header";
import { useRecoilValue } from "recoil";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingLegacyAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ErrorBoundary } from "@/widgets/frontdesk/components/shared/ErrorBoundary";

export const DashboardView: React.FC = () => {
  const theme = useTheme();
  const { primaryColor } = useGomakeTheme();
  const { router: chatwootRouter } = useChatwootProvider();
  const dashboardType = useChatwootDashboardType();
  const { handleCardClick, handleConversationSelect } = useDashboardNavigation();

  // Use role-specific stats hooks - only call the one we need
  const agentStats = useAgentDashboardStats();
  const adminStats = useAdminDashboardStats();

  // Get conversations and selection state
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const selectedConversation = useRecoilValue(chatwootSelectedConversationAtom);
  const conversationsLoading = useRecoilValue(chatwootConversationsLoadingLegacyAtom);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
        overflow: "hidden",
      }}
    >
      <DashboardHeader type={dashboardType} />

      {/* Stats Overview - Role-specific */}
      <ErrorBoundary context="Dashboard Stats">
        <Box sx={{ px: 3, py: 3, backgroundColor: theme.palette.background.paper }}>
          {dashboardType === "admin" ? (
            <AdminStatsCards
              stats={adminStats}
              onCardClick={handleCardClick}
              onWarningsClick={() => chatwootRouter.navigateToSettings(ChatwootSettingsSubpage.WARNINGS)}
            />
          ) : (
            <AgentStatsCards
              stats={agentStats}
              onCardClick={handleCardClick}
              onWarningsClick={() => chatwootRouter.navigateToSettings(ChatwootSettingsSubpage.WARNINGS)}
            />
          )}
        </Box>
      </ErrorBoundary>

      {/* Main Content Area - Recent Activity and Notifications Side by Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          overflow: "hidden",
          minHeight: 0,
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Activity Feed - Left Side (50% width) */}
        <ErrorBoundary context="Activity Feed">
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: `1px solid ${colorTokens.neutral[200]}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: `1px solid ${colorTokens.neutral[200]}`,
                backgroundColor: colorTokens.neutral[50],
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <HistoryIcon sx={{ fontSize: 18, color: colorTokens.neutral[700] }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: colorTokens.neutral[900],
                  }}
                >
                  Recent Activity
                </Typography>
                {conversations.length > 0 && (
                  <Chip
                    label={conversations.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.688rem",
                      fontWeight: 600,
                      backgroundColor: primaryColor(600),
                      color: "white",
                    }}
                  />
                )}
              </Stack>
            </Box>
            <Box sx={{ flex: 1, overflow: "hidden" }}>
              <ChatwootActivityFeed
                conversations={conversations}
                selectedId={selectedConversation?.id}
                onSelect={handleConversationSelect}
                isLoading={conversationsLoading}
              />
            </Box>
          </Paper>
        </ErrorBoundary>

        {/* Notifications Widget - Right Side (50% width) */}
        <ErrorBoundary context="Notifications Widget">
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: `1px solid ${colorTokens.neutral[200]}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <ChatwootNotificationsWidget maxItems={10} showHeader={true} onViewAll={() => chatwootRouter.navigateToMyInbox()} />
          </Paper>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default DashboardView;
