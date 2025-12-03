/**
 * Inbox Collaborators Tab
 *
 * Manage agents assigned to this inbox.
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
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
import { SettingsSection } from "../../../components/settings";
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
        // Response format: { payload: [...agents...] } or similar
        const inboxAgents = response?.payload || response || [];
        const agentIds = inboxAgents.map((agent: any) => agent.id);

        setSelectedAgentIds(agentIds);
      } catch (error) {
        console.error("Failed to load inbox agents:", error);
        // Start with empty if API fails
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
          minHeight: 200,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2, color: "text.secondary" }}>
          {loadingAgents ? "Loading agents..." : "Loading inbox assignments..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      {/* Agent Assignment */}
      <SettingsSection
        title="Assigned Agents"
        description="Select agents who can access and respond to conversations in this inbox"
      >
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Agents</InputLabel>
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
                    />
                  );
                })}
              </Box>
            )}
            disabled={isSaving}
          >
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor:
                        agent.availability_status === "online"
                          ? "success.main"
                          : "text.disabled",
                    }}
                  />
                  <Typography>{agent.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({agent.email})
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedAgentIds.length === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            At least one agent must be assigned to this inbox
          </Alert>
        )}

        <Button
          variant="outlined"
          onClick={handleSaveAgents}
          disabled={!hasAgentChanges || selectedAgentIds.length === 0 || isSaving}
        >
          {isSaving ? "Updating..." : "Update Agents"}
        </Button>
      </SettingsSection>
    </Box>
  );
};
