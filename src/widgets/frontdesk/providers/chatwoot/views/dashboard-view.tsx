/**
 * Chatwoot Dashboard View
 *
 * Main dashboard for Chatwoot showing stats, activity feed, and quick views.
 * Follows the same structure as the unified dashboard but specifically for Chatwoot data.
 */

import React from "react";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HistoryIcon from "@mui/icons-material/History";
import { colorTokens } from "@/widgets/frontdesk/design-system/tokens";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootSettingsSubpage } from "@/widgets/frontdesk/routing/types";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import { useAgentDashboardStats, useAdminDashboardStats } from "../hooks/use-chatwoot-dashboard-stats";
import { useChatwootDashboardType } from "../hooks/use-chatwoot-dashboard-type";
import { AgentStatsCards } from "../components/dashboard/agent-stats-cards";
import { AdminStatsCards } from "../components/dashboard/admin-stats-cards";
import { ChatwootActivityFeed } from "../components/dashboard/chatwoot-activity-feed";
import { ChatwootNotificationsWidget } from "../components/dashboard/chatwoot-notifications-widget";
import { useRecoilValue } from "recoil";
import {
  chatwootConversationsAtom,
  chatwootConversationsLoadingLegacyAtom,
  chatwootSelectedConversationAtom,
} from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ErrorBoundary } from "@/widgets/frontdesk/components/shared/ErrorBoundary";
import { RouteBuilder } from "@/widgets/frontdesk/routing/route-builder";
import { ChatwootView } from "@/widgets/frontdesk/routing/types";

export const DashboardView: React.FC = () => {
  const theme = useTheme();
  const { primaryColor } = useGomakeTheme();
  const { router: chatwootRouter } = useChatwootProvider();
  const dashboardType = useChatwootDashboardType();

  // Use role-specific stats hooks - only call the one we need
  const agentStats = useAgentDashboardStats();
  const adminStats = useAdminDashboardStats();

  // Select stats based on dashboard type
  const stats = dashboardType === "admin" ? adminStats : agentStats;

  // Get conversations and selection state
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const selectedConversation = useRecoilValue(chatwootSelectedConversationAtom);
  const conversationsLoading = useRecoilValue(chatwootConversationsLoadingLegacyAtom);

  // Navigation handlers with smart filters
  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      // Agent-specific navigation
      case "my-open-tickets":
        // Navigate to My Inbox with filters for open tickets assigned to me
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
            status: "open",
            assigneeType: "me",
          })
        );
        break;
      case "my-resolved-today":
        // Navigate to My Inbox with filters for resolved tickets
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
            status: "resolved",
          })
        );
        break;
      case "my-response-time":
        chatwootRouter.navigateToMyInbox();
        break;

      // Admin-specific navigation
      case "total-open-tickets":
        // Navigate to All Conversations with filters for open tickets
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.ALL_CONVERSATIONS, undefined, undefined, {
            status: "open",
          })
        );
        break;
      case "unassigned-tickets":
        chatwootRouter.navigateToUnattended();
        break;
      case "team-response-time":
        chatwootRouter.navigateToAllConversations();
        break;
      case "active-today":
        chatwootRouter.navigateToAllConversations();
        break;

      // Common navigation
      case "unread-conversations":
        chatwootRouter.navigateToMyInbox();
        break;
      case "open-conversations":
        chatwootRouter.navigateToAllConversations();
        break;
      case "mentions":
        chatwootRouter.navigateToMentions();
        break;
      case "unattended":
        chatwootRouter.navigateToUnattended();
        break;
      default:
        console.warn("[DashboardView] Unknown card type:", cardType);
        break;
    }
  };

  const handleConversationSelect = (conversationId: number, inboxId?: number) => {
    const channelId = inboxId?.toString();
    chatwootRouter.navigateToConversation(conversationId.toString(), channelId);
  };

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
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: colorTokens.neutral[900],
          }}
        >
          FrontDesk
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: "0.875rem",
          }}
        >
          {dashboardType === "admin" ? "Team performance and operational overview" : "Your personal performance and tasks"}
        </Typography>
      </Box>

      {/* Stats Overview - Role-specific */}
      <ErrorBoundary context="Dashboard Stats">
        <Box
          sx={{
            px: 3,
            py: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {dashboardType === "admin" ? (
            <AdminStatsCards
              stats={adminStats}
              onCardClick={handleCardClick}
              onWarningsClick={() => {
                // Navigate to warnings settings subpage using the proper router method
                chatwootRouter.navigateToSettings(ChatwootSettingsSubpage.WARNINGS);
              }}
            />
          ) : (
            <AgentStatsCards
              stats={agentStats}
              onCardClick={handleCardClick}
              onWarningsClick={() => {
                // Navigate to warnings settings subpage using the proper router method
                chatwootRouter.navigateToSettings(ChatwootSettingsSubpage.WARNINGS);
              }}
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
            <ChatwootNotificationsWidget
              maxItems={10}
              showHeader={true}
              onViewAll={() => {
                chatwootRouter.navigateToMyInbox();
              }}
            />
          </Paper>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default DashboardView;
