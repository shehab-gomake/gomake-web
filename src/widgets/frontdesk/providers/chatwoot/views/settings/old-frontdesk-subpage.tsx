/**
 * Old FrontDesk Settings Subpage
 * 
 * Legacy FrontDesk navigation and features.
 * This subpage provides access to the original FrontDesk functionality
 * including Dashboard, Ticket Views, and Live Chats.
 */

import React from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BaseSettingsSubpage } from "../../components/settings";
import HistoryIcon from "@mui/icons-material/History";

export const OldFrontDeskSubpage: React.FC = () => {
  const theme = useTheme();

  return (
    <BaseSettingsSubpage
      title="Old FrontDesk"
      description="Access legacy FrontDesk features and navigation"
      icon={<HistoryIcon />}
    >
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          This section provides access to the original FrontDesk functionality.
          Use the main navigation sidebar to access Dashboard, Ticket Views, and Live Chats.
        </Alert>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Legacy Features
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            The Old FrontDesk section includes:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li>
              <Typography variant="body2" color="text.secondary">
                Dashboard - Unified inbox view
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Ticket Views - My Tickets, Unassigned, All Tickets, Done, Archived
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Live Chats - Email, WhatsApp, Direct Messages
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" color="text.secondary">
            These features are accessible through the main navigation sidebar when collapsed or expanded.
          </Typography>
        </Paper>
      </Box>
    </BaseSettingsSubpage>
  );
};

