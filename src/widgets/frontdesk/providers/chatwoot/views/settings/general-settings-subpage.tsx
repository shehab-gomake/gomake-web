/**
 * General Settings (Account) Subpage
 *
 * Displays general account settings configuration including
 * account name, language, timezone, and other account-level preferences.
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";

export const GeneralSettingsSubpage: React.FC = () => {
  const { selectedAccountId, accounts } = useChatwootProvider();

  // Find the current account
  const currentAccount = accounts.find((acc) => acc.id === selectedAccountId);

  return (
    <BaseSettingsSubpage
      title="General Settings"
      description="Manage your account settings and preferences"
    >
      {/* Empty State - Placeholder for future implementation */}
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
        <SettingsIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
        <Typography variant="h6" color="text.primary" fontWeight={600}>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          Configure account-level settings such as account name, language, timezone,
          business hours, and auto-assignment rules.
        </Typography>
        {currentAccount && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "action.hover",
              borderRadius: 1,
              maxWidth: 400,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Current Account
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {currentAccount.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {currentAccount.id}
            </Typography>
          </Box>
        )}
        <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
          This feature is under development.
        </Typography>
      </Box>
    </BaseSettingsSubpage>
  );
};

