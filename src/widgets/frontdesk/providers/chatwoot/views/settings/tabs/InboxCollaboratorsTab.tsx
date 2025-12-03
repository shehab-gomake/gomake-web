/**
 * Inbox Collaborators Tab
 *
 * Manage agents assigned to this inbox.
 * Uses unified compact components for consistency.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { SettingsSection, CompactPrimaryButton } from "../../../components/settings";
import { useChatwootAgents } from "../../../hooks/resources/use-chatwoot-agents";
import { chatwootService } from "@/services/frontdesk";

interface InboxCollaboratorsTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onUpdateAgents: (agentIds: number[]) => Promise<void>;
  isSaving: boolean;
}

export const InboxCollaboratorsTab: React.FC<InboxCollaboratorsTabProps> = ({
  inbox,
  accountId,
  onUpdateAgents,
  isSaving,
}) => {
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [hasAgentChanges, setHasAgentChanges] = useState(false);
  const [loadingInboxAgents, setLoadingInboxAgents] = useState(true);

  // Load current inbox agents from API
  useEffect(() => {
    const fetchInboxAgents = async () => {
      try {
        setLoadingInboxAgents(true);
        const response = await chatwootService.inboxes.getInboxAgents(
          accountId,
          inbox.id
        );

        // Extract agent IDs from response
        const inboxAgents = response?.payload || response || [];
        const agentIds = inboxAgents.map((agent: any) => agent.id);

        setSelectedAgentIds(agentIds);
      } catch (error) {
        console.error("Failed to load inbox agents:", error);
        setSelectedAgentIds([]);
      } finally {
        setLoadingInboxAgents(false);
      }
    };

    fetchInboxAgents();
  }, [inbox.id, accountId]);

  const handleAgentChange = (event: any) => {
    const value = event.target.value;
    setSelectedAgentIds(typeof value === "string" ? value.split(",").map(Number) : value);
    setHasAgentChanges(true);
  };

  const handleSaveAgents = async () => {
    await onUpdateAgents(selectedAgentIds);
    setHasAgentChanges(false);
  };

  if (loadingAgents || loadingInboxAgents) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 180,
        }}
      >
        <CircularProgress size={24} sx={{ color: "#6366f1" }} />
        <Typography variant="body2" sx={{ ml: 2, color: "#6b7280", fontSize: "0.813rem" }}>
          {loadingAgents ? "Loading agents..." : "Loading inbox assignments..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Agent Assignment - Compact */}
      <SettingsSection
        title="Assigned Agents"
        description="Select agents who can access and respond to conversations in this inbox"
      >
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ fontSize: "0.813rem" }}>Select Agents</InputLabel>
          <Select
            multiple
            value={selectedAgentIds}
            onChange={handleAgentChange}
            input={<OutlinedInput label="Select Agents" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((agentId) => {
                  const agent = agents.find((a) => a.id === agentId);
                  return (
                    <Chip
                      key={agentId}
                      label={agent?.name || `Agent ${agentId}`}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: 22,
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "#6366f1",
                        border: "none",
                      }}
                    />
                  );
                })}
              </Box>
            )}
            disabled={isSaving}
            sx={{
              fontSize: "0.813rem",
              "& .MuiSelect-select": {
                py: 1,
              },
            }}
          >
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id} sx={{ fontSize: "0.813rem", py: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, width: "100%" }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor:
                        agent.availability_status === "online"
                          ? "#10b981"
                          : "#d1d5db",
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.813rem", flex: 1 }}>{agent.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedAgentIds.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: "6px", fontSize: "0.813rem", py: 0.75 }}>
            At least one agent must be assigned to this inbox
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <CompactPrimaryButton
            onClick={handleSaveAgents}
            disabled={!hasAgentChanges || selectedAgentIds.length === 0 || isSaving}
            loading={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </CompactPrimaryButton>
        </Box>
      </SettingsSection>
    </Box>
  );
};
