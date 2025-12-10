/**
 * Dashboard Header - Modern SaaS Design
 *
 * Header component with modern typography and improved visual hierarchy.
 * Features a larger, bolder title with subtle accent and clear description.
 */

import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import DashboardIcon from "@mui/icons-material/Dashboard";

// Modern typography tokens
const HEADER_TOKENS = {
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "0.9375rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  badge: {
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  colors: {
    title: "#0F172A",
    subtitle: "#64748B",
    accent: "#3B82F6",
    accentBg: "#EFF6FF",
    badgeBg: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    iconBg: "#F8FAFC",
    iconColor: "#3B82F6",
  },
};

interface DashboardHeaderProps {
  type: "admin" | "agent";
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ type }) => {
  const { t } = useTranslation();

  const descriptions = {
    admin: t("frontdesk.dashboard.adminDescription"),
    agent: t("frontdesk.dashboard.agentDescription"),
  };

  const badges = {
    admin: t("frontdesk.dashboard.adminView"),
    agent: t("frontdesk.dashboard.myDashboard"),
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "12px",
          backgroundColor: HEADER_TOKENS.colors.accentBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <DashboardIcon
          sx={{
            fontSize: 24,
            color: HEADER_TOKENS.colors.iconColor,
          }}
        />
      </Box>

      {/* Text Content */}
      <Box sx={{ flex: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mb: 0.5,
            gap: 1.5,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: HEADER_TOKENS.title.fontSize,
              fontWeight: HEADER_TOKENS.title.fontWeight,
              letterSpacing: HEADER_TOKENS.title.letterSpacing,
              lineHeight: HEADER_TOKENS.title.lineHeight,
              color: HEADER_TOKENS.colors.title,
              margin: 0,
            }}
          >
            {t("frontdesk.title")}
          </Typography>
          <Chip
            label={badges[type]}
            size="small"
            sx={{
              height: 22,
              background: HEADER_TOKENS.colors.badgeBg,
              color: "white",
              fontSize: HEADER_TOKENS.badge.fontSize,
              fontWeight: HEADER_TOKENS.badge.fontWeight,
              letterSpacing: HEADER_TOKENS.badge.letterSpacing,
              textTransform: "uppercase",
              borderRadius: "6px",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Stack>
        <Typography
          sx={{
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: HEADER_TOKENS.subtitle.fontSize,
            fontWeight: HEADER_TOKENS.subtitle.fontWeight,
            lineHeight: HEADER_TOKENS.subtitle.lineHeight,
            color: HEADER_TOKENS.colors.subtitle,
          }}
        >
          {descriptions[type]}
        </Typography>
      </Box>
    </Box>
  );
};
