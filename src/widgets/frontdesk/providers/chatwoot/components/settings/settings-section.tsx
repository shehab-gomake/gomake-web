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
        mb: 3,
        pb: showDivider ? 3 : 0,
        borderBottom: showDivider ? `1px solid ${theme.palette.divider}` : "none",
        "&:last-child": {
          mb: 0,
          pb: 0,
          borderBottom: "none",
        },
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: description ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Box>

      {/* Section Content */}
      <Box>{children}</Box>
    </Box>
  );
};
