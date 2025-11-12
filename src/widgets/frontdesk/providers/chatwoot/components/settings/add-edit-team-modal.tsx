/**
 * Add/Edit Team Modal
 *
 * Modal for creating a new team or editing an existing one.
 * Includes name, description, auto-assignment settings, and team member selection.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import type { Team, TeamCreateUpdatePayload } from "@/services/frontdesk/api/chatwoot/services/chatwoot-teams.service";
import type { Agent } from "@/services/frontdesk/api/chatwoot/services/chatwoot-agents.service";
import { useChatwootAgents } from "../../hooks/resources/use-chatwoot-agents";

export interface AddEditTeamData {
  name: string;
  description?: string;
  allow_auto_assign?: boolean;
  member_ids?: number[];
}

interface AddEditTeamModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddEditTeamData, teamId?: number) => Promise<void>;
  isSubmitting: boolean;
  accountId: number;
  editingTeam?: Team | null;
  initialMembers?: Agent[];
}

export const AddEditTeamModal: React.FC<AddEditTeamModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  accountId,
  editingTeam,
  initialMembers = [],
}) => {
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allowAutoAssign, setAllowAutoAssign] = useState(true);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!editingTeam;

  // Initialize form when modal opens or editingTeam changes
  useEffect(() => {
    if (open) {
      if (editingTeam) {
        setName(editingTeam.name || "");
        setDescription(editingTeam.description || "");
        setAllowAutoAssign(editingTeam.allow_auto_assign ?? true);
        setSelectedAgentIds(initialMembers.map(m => m.id));
      } else {
        // Reset for new team
        setName("");
        setDescription("");
        setAllowAutoAssign(true);
        setSelectedAgentIds([]);
      }
      setError(null);
    }
  }, [open, editingTeam, initialMembers]);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    setError(null);

    try {
      await onSubmit(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          allow_auto_assign: allowAutoAssign,
          member_ids: selectedAgentIds,
        },
        editingTeam?.id
      );

      // Success - modal will be closed by parent
    } catch (err: any) {
      setError(err.message || "Failed to save team");
    }
  };

  const handleAgentChange = (event: any) => {
    const value = event.target.value;
    setSelectedAgentIds(typeof value === "string" ? value.split(",").map(Number) : value);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isSubmitting && onClose()}
      maxWidth="sm"
      fullWidth
      aria-labelledby="team-modal-title"
    >
      <DialogTitle id="team-modal-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <GroupsIcon color="primary" />
          <Typography variant="h6" component="span">
            {isEditMode ? "Edit Team" : "Create New Team"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          {/* Team Name */}
          <TextField
            label="Team Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Support Team"
            required
            fullWidth
            disabled={isSubmitting}
            error={!!error && !name.trim()}
            helperText={!name.trim() && error ? error : ""}
            autoFocus
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this team handles..."
            multiline
            rows={3}
            fullWidth
            disabled={isSubmitting}
          />

          {/* Auto Assignment Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={allowAutoAssign}
                onChange={(e) => setAllowAutoAssign(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="Enable auto-assignment to team members"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: -2 }}>
            Automatically assign new conversations to available agents in this team
          </Typography>

          {/* Team Members Selection */}
          <FormControl fullWidth disabled={isSubmitting || loadingAgents}>
            <InputLabel>Team Members</InputLabel>
            <Select
              multiple
              value={selectedAgentIds}
              onChange={handleAgentChange}
              input={<OutlinedInput label="Team Members" />}
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

          {loadingAgents && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Loading agents...
              </Typography>
            </Box>
          )}

          {/* General Error */}
          {error && name.trim() && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !name.trim()}
          startIcon={isSubmitting ? <CircularProgress size={18} /> : null}
        >
          {isSubmitting ? "Saving..." : isEditMode ? "Update Team" : "Create Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
