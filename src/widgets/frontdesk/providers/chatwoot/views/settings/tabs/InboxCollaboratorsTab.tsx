/**
 * Inbox Collaborators Tab
 *
 * Manage agents assigned to this inbox and auto-assignment settings.
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
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { SettingsSection } from "../../../components/settings";
import { useChatwootAgents } from "../../../hooks/resources/use-chatwoot-agents";

interface InboxCollaboratorsTabProps {
  inbox: ChatwootInbox;
  accountId: number;
  onSave: (updates: Partial<ChatwootInbox>) => Promise<void>;
  onUpdateAgents: (agentIds: number[]) => Promise<void>;
  isSaving: boolean;
}

export const InboxCollaboratorsTab: React.FC<InboxCollaboratorsTabProps> = ({
  inbox,
  accountId,
  onSave,
  onUpdateAgents,
  isSaving,
}) => {
  const theme = useTheme();
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(
    inbox.enable_auto_assignment ?? true
  );
  const [maxAssignmentLimit, setMaxAssignmentLimit] = useState(
    inbox.auto_assignment_config?.max_assignment_limit ?? 0
  );
  const [hasAgentChanges, setHasAgentChanges] = useState(false);
  const [hasSettingsChanges, setHasSettingsChanges] = useState(false);

  // Load current inbox agents (mock - would come from API)
  useEffect(() => {
    // TODO: Fetch inbox agents from API
    // For now, just set empty array
    setSelectedAgentIds([]);
  }, [inbox.id]);

  const handleAgentChange = (event: any) => {
    const value = event.target.value;
    setSelectedAgentIds(typeof value === "string" ? value.split(",").map(Number) : value);
    setHasAgentChanges(true);
  };

  const handleAutoAssignmentToggle = (checked: boolean) => {
    setAutoAssignmentEnabled(checked);
    setHasSettingsChanges(true);
  };

  const handleMaxLimitChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setMaxAssignmentLimit(numValue);
    setHasSettingsChanges(true);
  };

  const handleSaveAgents = async () => {
    await onUpdateAgents(selectedAgentIds);
    setHasAgentChanges(false);
  };

  const handleSaveSettings = async () => {
    await onSave({
      enable_auto_assignment: autoAssignmentEnabled,
      auto_assignment_config: {
        max_assignment_limit: maxAssignmentLimit,
      },
    });
    setHasSettingsChanges(false);
  };

  if (loadingAgents) {
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

      {/* Auto Assignment Settings */}
      <SettingsSection
        title="Auto Assignment"
        description="Automatically assign new conversations to available agents"
        showDivider={false}
      >
        <FormControlLabel
          control={
            <Switch
              checked={autoAssignmentEnabled}
              onChange={(e) => handleAutoAssignmentToggle(e.target.checked)}
              disabled={isSaving}
            />
          }
          label="Enable auto assignment"
          sx={{ mb: 3 }}
        />

        {autoAssignmentEnabled && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Maximum Assignments
            </Typography>
            <TextField
              type="number"
              value={maxAssignmentLimit}
              onChange={(e) => handleMaxLimitChange(e.target.value)}
              placeholder="0 for unlimited"
              disabled={isSaving}
              inputProps={{ min: 0 }}
              sx={{ maxWidth: 200, mb: 1 }}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              Maximum number of conversations an agent can be auto-assigned at once.
              Set to 0 for unlimited.
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            onClick={handleSaveSettings}
            disabled={!hasSettingsChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </Box>
      </SettingsSection>
    </Box>
  );
};
