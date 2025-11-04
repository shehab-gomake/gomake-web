/**
 * Base Settings Subpage Component
 *
 * Provides a consistent layout wrapper for all Chatwoot settings subpages.
 * Uses FrontDesk design system for consistency with other views.
 */

import React from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface BaseSettingsSubpageProps {
  /** Page title */
  title: string;
  /** Optional page description */
  description?: string;
  /** Optional header actions (buttons, etc.) */
  headerActions?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Page content */
  children: React.ReactNode;
}

export const BaseSettingsSubpage: React.FC<BaseSettingsSubpageProps> = ({
  title,
  description,
  headerActions,
  isLoading = false,
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "1.5rem",
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {headerActions && <Box>{headerActions}</Box>}
        </Box>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};
