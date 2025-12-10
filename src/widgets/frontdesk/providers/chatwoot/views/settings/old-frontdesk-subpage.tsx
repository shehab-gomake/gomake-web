/**
 * Old FrontDesk Settings Subpage
 * 
 * Legacy FrontDesk navigation and features.
 * This subpage provides access to the original FrontDesk functionality
 * including Dashboard, Ticket Views, and Live Chats.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Paper, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BaseSettingsSubpage } from "../../components/settings";

export const OldFrontDeskSubpage: React.FC = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = useTheme();

  return (
    <BaseSettingsSubpage
      title={t("frontdesk.settings.oldFrontDesk")}
      description={t("frontdesk.settings.oldFrontDeskDescription")}
    >
      <Box sx={{ p: 3, direction: dir }}>
        <Alert severity="info" sx={{ mb: 3, direction: dir }}>
          {t("frontdesk.settings.oldFrontDeskAlert")}
        </Alert>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            direction: dir,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ direction: dir }}>
            {t("frontdesk.settings.oldFrontDeskLegacyTitle")}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ direction: dir }}>
            {t("frontdesk.settings.oldFrontDeskLegacyDescription")}
          </Typography>
          <Box component="ul" sx={{ [dir === "rtl" ? "pr" : "pl"]: 3, mb: 2, direction: dir }}>
            <li>
              <Typography variant="body2" color="text.secondary" sx={{ direction: dir }}>
                {t("frontdesk.settings.oldFrontDeskDashboard")}
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary" sx={{ direction: dir }}>
                {t("frontdesk.settings.oldFrontDeskTickets")}
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary" sx={{ direction: dir }}>
                {t("frontdesk.settings.oldFrontDeskChats")}
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ direction: dir }}>
            {t("frontdesk.settings.oldFrontDeskAccessible")}
          </Typography>
        </Paper>
      </Box>
    </BaseSettingsSubpage>
  );
};

