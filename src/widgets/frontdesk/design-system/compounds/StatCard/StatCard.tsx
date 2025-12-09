/**
 * StatCard - Modern Dashboard Stats Card
 *
 * A clean, modern stat card with:
 * - 16px rounded corners
 * - Soft shadow
 * - Consistent 22px padding
 * - Icon in small rounded container
 * - Improved typography hierarchy
 * - Subtle, calm accent colors (no loud border-top)
 * - Muted label below main value
 */

import React from "react";
import { Box, Typography, Skeleton, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { colorTokens, radiusTokens, shadowTokens } from "../../tokens";

export interface StatCardProps {
  /**
   * The main metric label
   */
  label: string;

  /**
   * The primary metric value (large number display)
   */
  value: number | string;

  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;

  /**
   * Optional trend indicator
   * Positive values show green up arrow, negative show red down arrow
   */
  trend?: {
    value: number;
    label?: string;
  };

  /**
   * Optional description or subtext (muted label below value)
   */
  description?: string;

  /**
   * Color variant for the card accent
   */
  variant?: "primary" | "success" | "warning" | "error" | "neutral";

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom background color
   */
  backgroundColor?: string;
}

// Modern card design tokens
const STAT_CARD_TOKENS = {
  borderRadius: radiusTokens["2xl"], // 16px
  padding: 22, // 20-24px range
  minHeight: 148,
  iconSize: 44,
  iconBorderRadius: 12,
  shadow: {
    default: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
    hover: "0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04)",
  },
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Variant color configurations with light backgrounds
const getVariantColors = (variant: StatCardProps["variant"]) => {
  const colorMap = {
    primary: {
      main: colorTokens.primary[600],
      light: colorTokens.primary[50],
      hover: colorTokens.primary[100],
    },
    success: {
      main: colorTokens.success[600],
      light: colorTokens.success[50],
      hover: colorTokens.success[100],
    },
    warning: {
      main: colorTokens.warning[600],
      light: colorTokens.warning[50],
      hover: colorTokens.warning[100],
    },
    error: {
      main: colorTokens.error[600],
      light: colorTokens.error[50],
      hover: colorTokens.error[100],
    },
    neutral: {
      main: colorTokens.neutral[500],
      light: colorTokens.neutral[100],
      hover: colorTokens.neutral[200],
    },
  };
  return colorMap[variant || "primary"];
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  description,
  variant = "primary",
  isLoading = false,
  onClick,
  backgroundColor,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const colors = getVariantColors(variant);

  // Trend color
  const trendColor =
    trend && trend.value > 0
      ? colorTokens.success[600]
      : trend && trend.value < 0
      ? colorTokens.error[600]
      : colorTokens.neutral[500];

  const TrendIcon =
    trend && trend.value > 0 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor:
          backgroundColor || colorTokens.semantic.background.primary,
        borderRadius: `${STAT_CARD_TOKENS.borderRadius}px`,
        border: `1px solid ${colorTokens.semantic.border.default}`,
        padding: `${STAT_CARD_TOKENS.padding}px`,
        minHeight: STAT_CARD_TOKENS.minHeight,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: STAT_CARD_TOKENS.transition,
        cursor: onClick ? "pointer" : "default",
        boxShadow: STAT_CARD_TOKENS.shadow.default,
        position: "relative",
        "&:hover": onClick
          ? {
              boxShadow: STAT_CARD_TOKENS.shadow.hover,
              transform: "translateY(-2px)",
              borderColor: alpha(colors.main, 0.3),
              "& .stat-card-icon": {
                backgroundColor: colors.hover,
              },
            }
          : {},
      }}
    >
      {/* Header Row - Label and Icon */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ flex: 1, [isRTL ? "paddingLeft" : "paddingRight"]: 1 }}>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="70%"
              height={18}
              sx={{ borderRadius: 1 }}
            />
          ) : (
            <Typography
              sx={{
                color: colorTokens.semantic.text.secondary,
                fontWeight: 500,
                fontSize: "0.8125rem",
                lineHeight: 1.4,
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </Typography>
          )}
        </Box>

        {icon && (
          <Box
            className="stat-card-icon"
            sx={{
              width: STAT_CARD_TOKENS.iconSize,
              height: STAT_CARD_TOKENS.iconSize,
              borderRadius: `${STAT_CARD_TOKENS.iconBorderRadius}px`,
              backgroundColor: colors.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.main,
              flexShrink: 0,
              transition: STAT_CARD_TOKENS.transition,
              "& > svg": {
                fontSize: 22,
              },
            }}
          >
            {isLoading ? (
              <Skeleton variant="circular" width={22} height={22} />
            ) : (
              icon
            )}
          </Box>
        )}
      </Box>

      {/* Value Display - Large prominent number */}
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        {isLoading ? (
          <Skeleton
            variant="text"
            width="45%"
            height={48}
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: colorTokens.semantic.text.primary,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>

      {/* Footer Row - Trend or Description (muted label) */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 20 }}
      >
        {isLoading ? (
          <Skeleton
            variant="text"
            width="55%"
            height={16}
            sx={{ borderRadius: 1 }}
          />
        ) : (
          <>
            {trend && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: trendColor,
                }}
              >
                <TrendIcon sx={{ fontSize: 16 }} />
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                  }}
                >
                  {Math.abs(trend.value)}%
                </Typography>
                {trend.label && (
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: colorTokens.semantic.text.tertiary,
                      [isRTL ? "marginRight" : "marginLeft"]: 0.5,
                    }}
                  >
                    {trend.label}
                  </Typography>
                )}
              </Box>
            )}

            {description && !trend && (
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: colorTokens.semantic.text.tertiary,
                  fontWeight: 400,
                }}
              >
                {description}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default StatCard;
