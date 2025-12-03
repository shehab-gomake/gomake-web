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
        backgroundColor: "#f8f9fa", // Muted background
      }}
    >
      {/* Compact Header Section */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem", // Smaller, more compact
                color: "#1f2937", // Darker muted color
                lineHeight: 1.3,
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.25,
                  color: "#6b7280", // Muted gray
                  fontSize: "0.813rem", // Smaller type
                  lineHeight: 1.4,
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          {headerActions && <Box sx={{ flexShrink: 0 }}>{headerActions}</Box>}
        </Box>
      </Box>

      {/* Content Section - Floating White Card */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 3,
          pb: 3,
          pt: 1,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)", // Soft shadow
            }}
          >
            <CircularProgress size={32} sx={{ color: "#6366f1" }} />
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)", // Soft shadow
              p: 3,
              minHeight: "calc(100% - 16px)",
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};
