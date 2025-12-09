/**
 * Chatwoot Dashboard View - Modern SaaS Design
 *
 * Main dashboard for Chatwoot showing stats, activity feed, and quick views.
 * Redesigned with a sleek, minimal modern SaaS visual system.
 */

import React from "react";
import { Box, Paper, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import HistoryIcon from "@mui/icons-material/History";
import { ChatwootSettingsSubpage } from "@/widgets/frontdesk/routing/types";
import { useChatwootProvider } from "../hooks/use-chatwoot-provider";
import {
  useAgentDashboardStats,
  useAdminDashboardStats,
} from "../hooks/use-chatwoot-dashboard-stats";
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

// Modern SaaS Design Tokens
const DASHBOARD_TOKENS = {
  // Grid system
  grid: {
    columns: 12,
    gutter: 24,
    maxWidth: 1440,
  },
  // Spacing scale
  spacing: {
    headerPaddingY: 32,
    sectionGap: 24,
    cardGap: 16,
    contentPaddingX: 32,
  },
  // Card styling
  card: {
    borderRadius: 14,
    shadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    shadowHover:
      "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
  },
  // Background
  background: {
    page: "#F8FAFC",
    card: "#FFFFFF",
    sectionHeader: "#FAFBFC",
  },
  // Colors
  colors: {
    primary: "#3B82F6",
    primaryLight: "#EFF6FF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
  },
} as const;

export const DashboardView: React.FC = () => {
  const { t } = useTranslation();
  const { router: chatwootRouter } = useChatwootProvider();
  const dashboardType = useChatwootDashboardType();
  const { handleCardClick, handleConversationSelect } =
    useDashboardNavigation();

  // Use role-specific stats hooks - only call the one we need
  const agentStats = useAgentDashboardStats();
  const adminStats = useAdminDashboardStats();

  // Get conversations and selection state
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const selectedConversation = useRecoilValue(chatwootSelectedConversationAtom);
  const conversationsLoading = useRecoilValue(
    chatwootConversationsLoadingLegacyAtom
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: DASHBOARD_TOKENS.background.page,
        overflow: "hidden",
      }}
    >
      {/* Header Section with more breathing room */}
      <Box
        sx={{
          px: `${DASHBOARD_TOKENS.spacing.contentPaddingX}px`,
          pt: `${DASHBOARD_TOKENS.spacing.headerPaddingY}px`,
          pb: 3,
          backgroundColor: DASHBOARD_TOKENS.background.card,
          borderBottom: `1px solid ${DASHBOARD_TOKENS.colors.borderSubtle}`,
        }}
      >
        <DashboardHeader type={dashboardType} />
      </Box>

      {/* Stats Overview Section - Role-specific */}
      <ErrorBoundary context="Dashboard Stats">
        <Box
          sx={{
            px: `${DASHBOARD_TOKENS.spacing.contentPaddingX}px`,
            py: 3,
            backgroundColor: DASHBOARD_TOKENS.background.card,
          }}
        >
          {dashboardType === "admin" ? (
            <AdminStatsCards
              stats={adminStats}
              onCardClick={handleCardClick}
              onWarningsClick={() =>
                chatwootRouter.navigateToSettings(
                  ChatwootSettingsSubpage.WARNINGS
                )
              }
            />
          ) : (
            <AgentStatsCards
              stats={agentStats}
              onCardClick={handleCardClick}
              onWarningsClick={() =>
                chatwootRouter.navigateToSettings(
                  ChatwootSettingsSubpage.WARNINGS
                )
              }
            />
          )}
        </Box>
      </ErrorBoundary>

      {/* Main Content Area - 12-column grid with Activity and Notifications */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: `${DASHBOARD_TOKENS.grid.gutter}px`,
          overflow: "hidden",
          minHeight: 0,
          px: `${DASHBOARD_TOKENS.spacing.contentPaddingX}px`,
          py: `${DASHBOARD_TOKENS.spacing.sectionGap}px`,
        }}
      >
        {/* Activity Feed Panel - Left Side */}
        <ErrorBoundary context="Activity Feed">
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: DASHBOARD_TOKENS.card.border,
              borderRadius: `${DASHBOARD_TOKENS.card.borderRadius}px`,
              backgroundColor: DASHBOARD_TOKENS.background.card,
              boxShadow: DASHBOARD_TOKENS.card.shadow,
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: DASHBOARD_TOKENS.card.shadowHover,
              },
            }}
          >
            {/* Section Header */}
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: `1px solid ${DASHBOARD_TOKENS.colors.border}`,
                backgroundColor: DASHBOARD_TOKENS.background.sectionHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    backgroundColor: DASHBOARD_TOKENS.colors.primaryLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HistoryIcon
                    sx={{
                      fontSize: 18,
                      color: DASHBOARD_TOKENS.colors.primary,
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: DASHBOARD_TOKENS.colors.textPrimary,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {t("frontdesk.dashboard.recentActivity")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: DASHBOARD_TOKENS.colors.textMuted,
                      mt: 0.25,
                    }}
                  >
                    {t("frontdesk.dashboard.latestConversations")}
                  </Typography>
                </Box>
              </Stack>
              {conversations.length > 0 && (
                <Chip
                  label={conversations.length}
                  size="small"
                  sx={{
                    height: 24,
                    minWidth: 24,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: DASHBOARD_TOKENS.colors.primary,
                    color: "white",
                    borderRadius: "6px",
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              )}
            </Box>
            {/* Activity Content */}
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

        {/* Notifications Widget - Right Side */}
        <ErrorBoundary context="Notifications Widget">
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: DASHBOARD_TOKENS.card.border,
              borderRadius: `${DASHBOARD_TOKENS.card.borderRadius}px`,
              backgroundColor: DASHBOARD_TOKENS.background.card,
              boxShadow: DASHBOARD_TOKENS.card.shadow,
              transition: "box-shadow 0.2s ease",
              "&:hover": {
                boxShadow: DASHBOARD_TOKENS.card.shadowHover,
              },
            }}
          >
            <ChatwootNotificationsWidget
              maxItems={10}
              showHeader={true}
              onViewAll={() => chatwootRouter.navigateToMyInbox()}
            />
          </Paper>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default DashboardView;
