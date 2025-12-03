/**
 * Chatwoot Warnings Card - Modern SaaS Design
 *
 * Single stat card showing total warnings count.
 * Redesigned to match the unified card styling.
 */

import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useChatwootWarnings } from "../../hooks/use-chatwoot-warnings";
import { formatStatValue } from "../../utils";

// Modern card design tokens (consistent with other stats cards)
const CARD_TOKENS = {
  borderRadius: 14,
  shadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
  shadowHover: "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  padding: 20,
  colors: {
    background: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    warning: { main: "#F59E0B", light: "#FEF3C7", dark: "#D97706" },
    success: { main: "#10B981", light: "#D1FAE5", dark: "#059669" },
  },
};

interface ChatwootWarningsCardProps {
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Loading state */
  isLoading?: boolean;
}

export const ChatwootWarningsCard: React.FC<ChatwootWarningsCardProps> = ({
  onClick,
  isLoading = false,
}) => {
  const warnings = useChatwootWarnings();

  // Use warning colors when there are warnings, success/green when all clear
  const hasWarnings = warnings.length > 0;
  const colors = hasWarnings ? CARD_TOKENS.colors.warning : CARD_TOKENS.colors.success;

  const description = hasWarnings ? "Requires attention" : "All systems operational";

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
              System Warnings
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
          }}
        >
          <WarningIcon sx={{ fontSize: 22 }} />
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
            {formatStatValue(warnings.length)}
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
