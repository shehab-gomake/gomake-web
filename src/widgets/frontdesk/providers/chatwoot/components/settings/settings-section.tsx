/**
 * Settings Section Component
 *
 * Reusable section wrapper for organizing content within settings subpages.
 * Provides consistent spacing, borders, and typography.
 */

import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface SettingsSectionProps {
  /** Section title */
  title: string;
  /** Optional section description */
  description?: string;
  /** Section content */
  children: React.ReactNode;
  /** Optional actions to display in section header */
  actions?: React.ReactNode;
  /** Whether to show divider at bottom */
  showDivider?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  children,
  actions,
  showDivider = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 2.5,
        pb: showDivider ? 2.5 : 0,
        borderBottom: showDivider ? `1px solid rgba(0,0,0,0.06)` : "none",
        "&:last-child": {
          mb: 0,
          pb: 0,
          borderBottom: "none",
        },
      }}
    >
      {/* Compact Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "0.938rem", // Smaller, more compact
              fontWeight: 600,
              color: "#1f2937", // Muted dark
              mb: description ? 0.25 : 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280", // Muted gray
                fontSize: "0.75rem", // Smaller type
                lineHeight: 1.4,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Box>

      {/* Section Content */}
      <Box>{children}</Box>
    </Box>
  );
};
