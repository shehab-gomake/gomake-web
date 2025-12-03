/**
 * Admin Stats Cards - Modern SaaS Design
 *
 * Displays admin/manager-specific team performance metrics for the dashboard.
 * Redesigned with unified card styling, modern shadows, and better spacing.
 */

import React, { useMemo } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ChatwootWarningsCard } from "./chatwoot-warnings-widget";
import type { AdminDashboardStats } from "../../hooks/use-chatwoot-dashboard-stats";
import { formatStatCardValue, getCardVariant } from "../../utils";

import { colorTokens, radiusTokens, shadowTokens, semanticSpacing } from "@/widgets/frontdesk/design-system";

// Modern card design tokens using design system
const CARD_TOKENS = {
  borderRadius: radiusTokens.lg,
  shadow: shadowTokens.xs,
  shadowHover: shadowTokens.lg,
  border: `1px solid ${colorTokens.semantic.border.default}`,
  padding: semanticSpacing.container.md,
  gap: semanticSpacing.component.lg,
  colors: {
    background: colorTokens.semantic.background.primary,
    textPrimary: colorTokens.semantic.text.primary,
    textSecondary: colorTokens.semantic.text.secondary,
    textMuted: colorTokens.semantic.text.tertiary,
    border: colorTokens.semantic.border.default,
    primary: { main: colorTokens.primary[600], light: colorTokens.primary[50], dark: colorTokens.primary[700] },
    success: { main: colorTokens.success[600], light: colorTokens.success[50], dark: colorTokens.success[700] },
    warning: { main: colorTokens.warning[600], light: colorTokens.warning[50], dark: colorTokens.warning[700] },
    error: { main: colorTokens.error[600], light: colorTokens.error[50], dark: colorTokens.error[700] },
    neutral: { main: colorTokens.neutral[500], light: colorTokens.neutral[100], dark: colorTokens.neutral[600] },
  },
};

const getVariantColors = (variant: string) => {
  const colorMap = {
    primary: CARD_TOKENS.colors.primary,
    success: CARD_TOKENS.colors.success,
    warning: CARD_TOKENS.colors.warning,
    error: CARD_TOKENS.colors.error,
    neutral: CARD_TOKENS.colors.neutral,
  };
  return colorMap[variant as keyof typeof colorMap] || colorMap.neutral;
};

interface ModernStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant: string;
  description: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const ModernStatCard: React.FC<ModernStatCardProps> = ({
  label,
  value,
  icon,
  variant,
  description,
  isLoading = false,
  onClick,
}) => {
  const colors = getVariantColors(variant);

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: CARD_TOKENS.colors.background,
        borderRadius: `${CARD_TOKENS.borderRadius}px`,
        border: CARD_TOKENS.border,
        padding: `${CARD_TOKENS.padding}px`,
        minHeight: 140,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        boxShadow: CARD_TOKENS.shadow,
        position: "relative",
        overflow: "hidden",
        "&:hover": onClick
          ? {
              boxShadow: CARD_TOKENS.shadowHover,
              transform: "translateY(-2px)",
              borderColor: colors.main,
            }
          : {},
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${colors.main} 0%, ${colors.dark} 100%)`,
          borderRadius: `${CARD_TOKENS.borderRadius}px ${CARD_TOKENS.borderRadius}px 0 0`,
        },
      }}
    >
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1, pr: 1 }}>
          {isLoading ? (
            <Skeleton variant="text" width="70%" height={18} sx={{ borderRadius: 1 }} />
          ) : (
            <Typography
              sx={{
                color: CARD_TOKENS.colors.textSecondary,
                fontWeight: 500,
                fontSize: "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                lineHeight: 1.4,
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "10px",
            backgroundColor: colors.light,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.main,
            flexShrink: 0,
            "& > svg": {
              fontSize: 22,
            },
          }}
        >
          {icon}
        </Box>
      </Box>

      {/* Value Display */}
      <Box sx={{ my: 1 }}>
        {isLoading ? (
          <Skeleton variant="text" width="50%" height={48} sx={{ borderRadius: 1 }} />
        ) : (
          <Typography
            sx={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: CARD_TOKENS.colors.textPrimary,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>

      {/* Description */}
      <Box>
        {isLoading ? (
          <Skeleton variant="text" width="60%" height={16} sx={{ borderRadius: 1 }} />
        ) : (
          <Typography
            sx={{
              fontSize: "0.8125rem",
              color: CARD_TOKENS.colors.textMuted,
              fontWeight: 400,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
  isLoading?: boolean;
  onCardClick?: (cardType: string) => void;
  onWarningsClick?: () => void;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  onWarningsClick,
}) => {
  // Memoize card configurations to prevent unnecessary recalculations
  const cards = useMemo(
    () => [
      {
        id: "total-open-tickets" as const,
        label: "Total Open Tickets",
        value: formatStatCardValue(stats.totalOpenTickets),
        icon: <ForumIcon />,
        variant: "primary" as const,
        description: "Across all agents",
      },
      {
        id: "unassigned-tickets" as const,
        label: "Unassigned Tickets",
        value: formatStatCardValue(stats.unassignedTickets),
        icon: <AssignmentLateIcon />,
        variant: getCardVariant(stats.unassignedTickets, "success", "error"),
        description: "Need assignment",
      },
      {
        id: "active-today" as const,
        label: "Active Today",
        value: formatStatCardValue(stats.activeToday),
        icon: <TrendingUpIcon />,
        variant: "success" as const,
        description: "Last 24 hours",
      },
    ],
    [stats]
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: `${CARD_TOKENS.gap}px`,
      }}
    >
      {cards.map((card) => (
        <ModernStatCard
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

export default AdminStatsCards;
