/**
 * Labels Subpage
 *
 * Displays and manages Chatwoot labels for organizing and categorizing
 * conversations with color-coded tags.
 */

import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import { BaseSettingsSubpage } from "../../components/settings";

export const LabelsSubpage: React.FC = () => {
  return (
    <BaseSettingsSubpage
      title="Labels"
      description="Create and manage labels to organize conversations"
    >
      <Alert severity="info" sx={{ mb: 3 }}>
        Labels service is not yet implemented in the API layer. This feature will be available
        once the backend service is added.
      </Alert>

      {/* Empty State - Waiting for service implementation */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          textAlign: "center",
          gap: 2,
        }}
      >
        <LabelIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          Labels Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          Organize your conversations with custom labels. Add colors and descriptions
          to categorize messages for better filtering and reporting.
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 1,
            maxWidth: 400,
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
            Upcoming Features:
          </Typography>
          <Box component="ul" sx={{ textAlign: "left", pl: 2, mt: 1, mb: 0 }}>
            <Typography component="li" variant="caption" color="text.secondary">
              Create custom labels with colors
            </Typography>
            <Typography component="li" variant="caption" color="text.secondary">
              Apply labels to conversations
            </Typography>
            <Typography component="li" variant="caption" color="text.secondary">
              Filter conversations by label
            </Typography>
            <Typography component="li" variant="caption" color="text.secondary">
              Label-based reporting
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
          This feature requires backend API implementation.
        </Typography>
      </Box>
    </BaseSettingsSubpage>
  );
};

