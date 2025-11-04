/**
 * Teams Subpage
 *
 * Displays and manages Chatwoot teams, including team members
 * and team-assigned conversations.
 */

import React from "react";
import { Box, Typography, Alert, IconButton } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import RefreshIcon from "@mui/icons-material/Refresh";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootTeams } from "../../hooks/resources/use-chatwoot-teams";

export const TeamsSubpage: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { teams, loading, error, refresh } = useChatwootTeams(selectedAccountId);

  return (
    <BaseSettingsSubpage
      title="Teams"
      description="Manage teams and their members"
      isLoading={loading}
      headerActions={
        <IconButton onClick={refresh} size="small" disabled={loading}>
          <RefreshIcon />
        </IconButton>
      }
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "Failed to load teams"}
        </Alert>
      ) : teams.length === 0 ? (
        /* Empty State */
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
          <GroupsIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            No Teams Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Create teams to organize agents and route conversations efficiently.
            Teams help distribute workload and maintain accountability.
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
            Team management UI is under development.
          </Typography>
        </Box>
      ) : (
        /* Teams List - Placeholder for future implementation */
        <SettingsSection
          title={`Teams (${teams.length})`}
          description="Organize agents into teams for better collaboration"
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Found {teams.length} team{teams.length !== 1 ? "s" : ""} in this account.
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Team list UI and management features are under development.
          </Typography>
        </SettingsSection>
      )}
    </BaseSettingsSubpage>
  );
};

