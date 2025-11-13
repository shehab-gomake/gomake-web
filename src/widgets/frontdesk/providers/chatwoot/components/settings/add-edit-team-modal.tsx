/**
 * Add/Edit Team Modal
 *
 * Modal for creating a new team or editing an existing one.
 * Enhanced with live preview, better styling, and modern design.
 * Includes name, description, auto-assignment settings, and team member selection.
 */

import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
  Stack,
  Divider,
  IconButton,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
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
  const { neutralColor, primaryColor } = useGomakeTheme();
  const { agents, loading: loadingAgents } = useChatwootAgents(accountId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allowAutoAssign, setAllowAutoAssign] = useState(true);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditMode = !!editingTeam;

  // Get selected agents for preview
  const selectedAgents = useMemo(() => {
    return agents.filter((agent) => selectedAgentIds.includes(agent.id));
  }, [agents, selectedAgentIds]);

  // Initialize form when modal opens or editingTeam changes
  useEffect(() => {
    if (open) {
      if (editingTeam) {
        setName(editingTeam.name || "");
        setDescription(editingTeam.description || "");
        setAllowAutoAssign(editingTeam.allow_auto_assign ?? true);
        setSelectedAgentIds(initialMembers.map((m) => m.id));
      } else {
        // Reset for new team
        setName("");
        setDescription("");
        setAllowAutoAssign(true);
        setSelectedAgentIds([]);
      }
      setError(null);
      setSaving(false);
    }
  }, [open, editingTeam, initialMembers]);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    setSaving(true);
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
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving && !isSubmitting) {
      setError(null);
      onClose();
    }
  };

  const handleAgentChange = (event: any) => {
    const value = event.target.value;
    setSelectedAgentIds(typeof value === "string" ? value.split(",").map(Number) : value);
  };

  const canSubmit = !saving && !isSubmitting && name.trim().length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: `1px solid ${neutralColor(200)}`,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          pt: 3,
          px: 3,
          background: `linear-gradient(135deg, ${neutralColor(50)} 0%, ${neutralColor(100)} 100%)`,
          borderBottom: `1px solid ${neutralColor(200)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: primaryColor(100),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GroupsIcon sx={{ color: primaryColor(600), fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem", color: neutralColor(900) }}>
            {isEditMode ? "Edit Team" : "Create New Team"}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={saving || isSubmitting}
          sx={{
            color: neutralColor(600),
            "&:hover": {
              bgcolor: neutralColor(200),
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3, px: 3, pb: 2 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "10px",
              border: `1px solid #FEE2E2`,
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Column - Form */}
          <Stack spacing={3} sx={{ flex: 1 }}>
            {/* Team Name */}
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: neutralColor(800),
                }}
              >
                Team Name <span style={{ color: "#DC2626", fontSize: "1rem" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Support Team, Sales Team"
                disabled={saving || isSubmitting}
                error={!!error && !name.trim()}
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    bgcolor: "#FFFFFF",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: primaryColor(400),
                    },
                    "&.Mui-focused": {
                      borderColor: primaryColor(600),
                      borderWidth: "2px",
                      boxShadow: `0 0 0 3px ${primaryColor(100)}`,
                    },
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: neutralColor(800),
                }}
              >
                Description <span style={{ fontSize: "0.75rem", color: neutralColor(500) }}>(Optional)</span>
              </Typography>
              <TextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this team handles..."
                multiline
                rows={3}
                disabled={saving || isSubmitting}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    bgcolor: "#FFFFFF",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: primaryColor(400),
                    },
                    "&.Mui-focused": {
                      borderColor: primaryColor(600),
                      borderWidth: "2px",
                      boxShadow: `0 0 0 3px ${primaryColor(100)}`,
                    },
                  },
                }}
              />
            </Box>

            {/* Auto Assignment Toggle */}
            <Box
              sx={{
                p: 2,
                borderRadius: "10px",
                bgcolor: neutralColor(50),
                border: `1px solid ${neutralColor(200)}`,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={allowAutoAssign}
                    onChange={(e) => setAllowAutoAssign(e.target.checked)}
                    disabled={saving || isSubmitting}
                    sx={{
                      color: primaryColor(600),
                      "&.Mui-checked": {
                        color: primaryColor(600),
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: neutralColor(800) }}>
                      Enable auto-assignment
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: neutralColor(600), mt: 0.25 }}>
                      Automatically assign new conversations to available agents in this team
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Team Members Selection */}
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: neutralColor(800),
                }}
              >
                Team Members <span style={{ fontSize: "0.75rem", color: neutralColor(500) }}>(Optional)</span>
              </Typography>
              <FormControl
                fullWidth
                disabled={saving || isSubmitting || loadingAgents}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    bgcolor: "#FFFFFF",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: primaryColor(400),
                    },
                    "&.Mui-focused": {
                      borderColor: primaryColor(600),
                      borderWidth: "2px",
                      boxShadow: `0 0 0 3px ${primaryColor(100)}`,
                    },
                  },
                }}
              >
                <InputLabel>Select team members</InputLabel>
                <Select
                  multiple
                  value={selectedAgentIds}
                  onChange={handleAgentChange}
                  input={<OutlinedInput label="Select team members" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.length === 0 ? (
                        <Typography sx={{ fontSize: "0.875rem", color: neutralColor(500), fontStyle: "italic" }}>
                          No members selected
                        </Typography>
                      ) : (
                        selected.map((agentId) => {
                          const agent = agents.find((a) => a.id === agentId);
                          return (
                            <Chip
                              key={agentId}
                              label={agent?.name || `Agent ${agentId}`}
                              size="small"
                              sx={{
                                bgcolor: primaryColor(100),
                                color: primaryColor(700),
                                fontWeight: 500,
                              }}
                            />
                          );
                        })
                      )}
                    </Box>
                  )}
                >
                  {loadingAgents ? (
                    <MenuItem disabled>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Loading agents...</Typography>
                      </Box>
                    </MenuItem>
                  ) : agents.length === 0 ? (
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ color: neutralColor(500) }}>
                        No agents available
                      </Typography>
                    </MenuItem>
                  ) : (
                    agents.map((agent) => {
                      const isSelected = selectedAgentIds.includes(agent.id);
                      return (
                        <MenuItem key={agent.id} value={agent.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: agent.availability_status === "online" ? "success.main" : "text.disabled",
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: "0.875rem", fontWeight: isSelected ? 600 : 400 }}>
                                {agent.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: neutralColor(600) }}>
                                {agent.email}
                              </Typography>
                            </Box>
                            {isSelected && (
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 18,
                                  color: primaryColor(600),
                                }}
                              />
                            )}
                          </Box>
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          {/* Vertical Divider */}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Right Column - Live Preview */}
          <Box
            sx={{
              flex: "0 0 280px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  mb: 1.5,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: neutralColor(600),
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Live Preview
              </Typography>

              {/* Preview Card */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  bgcolor: neutralColor(50),
                  border: `2px dashed ${neutralColor(300)}`,
                }}
              >
                {name.trim() ? (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "12px",
                          bgcolor: primaryColor(100),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <GroupsIcon sx={{ color: primaryColor(600), fontSize: 24 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: neutralColor(900),
                            mb: 0.25,
                          }}
                        >
                          {name}
                        </Typography>
                        {description.trim() && (
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              color: neutralColor(600),
                              lineHeight: 1.4,
                            }}
                          >
                            {description}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Members Preview */}
                    {selectedAgents.length > 0 ? (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: neutralColor(700),
                            mb: 1,
                          }}
                        >
                          {selectedAgents.length} {selectedAgents.length === 1 ? "Member" : "Members"}
                        </Typography>
                        <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
                          {selectedAgents.slice(0, 4).map((agent) => (
                            <Avatar
                              key={agent.id}
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: primaryColor(500),
                                fontSize: "0.75rem",
                              }}
                            >
                              {agent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                        {selectedAgents.length > 4 && (
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: neutralColor(500),
                              mt: 0.5,
                            }}
                          >
                            +{selectedAgents.length - 4} more
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.5,
                          borderRadius: "8px",
                          bgcolor: neutralColor(100),
                          border: `1px dashed ${neutralColor(300)}`,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16, color: neutralColor(400) }} />
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: neutralColor(500),
                            fontStyle: "italic",
                          }}
                        >
                          No members selected
                        </Typography>
                      </Box>
                    )}

                    {/* Auto-assignment indicator */}
                    {allowAutoAssign && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${neutralColor(200)}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "success.main",
                            fontWeight: 500,
                          }}
                        >
                          Auto-assignment enabled
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: neutralColor(500),
                      fontStyle: "italic",
                      textAlign: "center",
                    }}
                  >
                    Enter a team name to preview
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Quick Tip */}
            <Box
              sx={{
                p: 2,
                borderRadius: "10px",
                bgcolor: primaryColor(50),
                border: `1px solid ${primaryColor(200)}`,
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: primaryColor(800), mb: 1 }}>
                💡 Quick Tip
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: primaryColor(700), lineHeight: 1.5 }}>
                Teams help organize conversations and distribute workload. Add members to enable collaborative support.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${neutralColor(200)}`,
          gap: 1.5,
          bgcolor: neutralColor(50),
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving || isSubmitting}
          size="large"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: neutralColor(700),
            px: 3,
            py: 1,
            borderRadius: "10px",
            "&:hover": {
              bgcolor: neutralColor(200),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
          size="large"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderRadius: "10px",
            px: 4,
            py: 1,
            bgcolor: primaryColor(600),
            boxShadow: `0 4px 12px ${primaryColor(200)}`,
            "&:hover": {
              bgcolor: primaryColor(700),
              boxShadow: `0 6px 16px ${primaryColor(300)}`,
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&:disabled": {
              bgcolor: neutralColor(300),
              color: neutralColor(500),
              boxShadow: "none",
            },
            transition: "all 0.2s",
          }}
        >
          {saving ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Team" : "Create Team"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
