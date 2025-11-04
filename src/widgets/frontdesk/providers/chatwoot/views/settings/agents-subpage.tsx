/**
 * Agents Subpage
 *
 * Displays and manages Chatwoot agents including their roles,
 * availability, and assigned conversations.
 */

import React from "react";
import { Box, Typography, Alert, IconButton, Paper, Chip, Avatar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { BaseSettingsSubpage, SettingsSection } from "../../components/settings";
import { useChatwootProvider } from "../../hooks/use-chatwoot-provider";
import { useChatwootAgents } from "../../hooks/resources/use-chatwoot-agents";
import type { Agent } from "@/services/frontdesk/api/chatwoot/types/agents.types";

// Helper function to get status color and label
const getAvailabilityInfo = (status?: string) => {
  switch (status) {
    case "online":
    case "available":
      return { color: "success", label: "Available", icon: <CheckCircleIcon fontSize="small" /> };
    case "busy":
      return { color: "warning", label: "Busy", icon: <RadioButtonUncheckedIcon fontSize="small" /> };
    case "offline":
      return { color: "error", label: "Offline", icon: <RadioButtonUncheckedIcon fontSize="small" /> };
    default:
      return { color: "default", label: "Unknown", icon: <RadioButtonUncheckedIcon fontSize="small" /> };
  }
};

// Helper function to get role display
const getRoleInfo = (role?: string) => {
  switch (role?.toLowerCase()) {
    case "administrator":
    case "admin":
      return { label: "Administrator", color: "primary", icon: <AdminPanelSettingsIcon fontSize="small" /> };
    case "agent":
      return { label: "Agent", color: "default", icon: <PersonIcon fontSize="small" /> };
    default:
      return { label: role || "Agent", color: "default", icon: <PersonIcon fontSize="small" /> };
  }
};

export const AgentsSubpage: React.FC = () => {
  const { selectedAccountId } = useChatwootProvider();
  const { agents, loading, error, refresh } = useChatwootAgents(selectedAccountId);

  return (
    <BaseSettingsSubpage
      title="Agents"
      description="Manage team members, roles, and permissions"
      isLoading={loading}
      headerActions={
        <IconButton onClick={refresh} size="small" disabled={loading}>
          <RefreshIcon />
        </IconButton>
      }
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || "Failed to load agents"}
        </Alert>
      ) : agents.length === 0 ? (
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
          <PeopleIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
          <Typography variant="h6" color="text.primary" fontWeight={600}>
            No Agents Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            Start by inviting team members to join your account. Agents can handle
            conversations, manage inboxes, and collaborate with teams.
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 2 }}>
            Agent management UI is under development.
          </Typography>
        </Box>
      ) : (
        /* Agents List */
        <SettingsSection
          title={`Agents (${agents.length})`}
          description="Team members with access to this account"
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {agents.map((agent) => {
              const availabilityInfo = getAvailabilityInfo(agent.availability_status);
              const roleInfo = getRoleInfo(agent.role);

              return (
                <Paper
                  key={agent.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    {/* Avatar */}
                    <Avatar
                      src={agent.thumbnail}
                      alt={agent.name || agent.available_name || agent.email}
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "primary.main",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {(agent.name || agent.available_name || agent.email || "?")[0].toUpperCase()}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {/* Header */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
                            {agent.name || agent.available_name || "Unknown Agent"}
                          </Typography>
                          {agent.confirmed && (
                            <CheckCircleIcon sx={{ fontSize: 18, color: "success.main" }} titleAccess="Confirmed" />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Chip
                            icon={availabilityInfo.icon}
                            label={availabilityInfo.label}
                            size="small"
                            color={availabilityInfo.color as any}
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                          />
                          <Chip
                            icon={roleInfo.icon}
                            label={roleInfo.label}
                            size="small"
                            color={roleInfo.color as any}
                            sx={{ fontSize: "0.75rem" }}
                          />
                        </Box>
                      </Box>

                      {/* Details */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
                        {agent.email && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Email:</strong> {agent.email}
                          </Typography>
                        )}
                        {agent.account_id && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Account ID:</strong> {agent.account_id}
                          </Typography>
                        )}
                      </Box>

                      {/* Status Badges */}
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {agent.auto_offline && (
                          <Chip
                            label="Auto Offline"
                            size="small"
                            sx={{
                              bgcolor: "grey.200",
                              fontSize: "0.688rem",
                              height: 22,
                            }}
                          />
                        )}
                        {agent.custom_role_id && (
                          <Chip
                            label={`Custom Role: ${agent.custom_role_id}`}
                            size="small"
                            sx={{
                              bgcolor: "grey.200",
                              fontSize: "0.688rem",
                              height: 22,
                            }}
                          />
                        )}
                        <Chip
                          label={`ID: ${agent.id}`}
                          size="small"
                          sx={{
                            bgcolor: "grey.200",
                            fontSize: "0.688rem",
                            height: 22,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </SettingsSection>
      )}
    </BaseSettingsSubpage>
  );
};

