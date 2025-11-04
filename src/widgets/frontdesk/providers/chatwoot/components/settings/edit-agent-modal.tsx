/**
 * Edit Agent Modal
 *
 * Modal for editing agent role and availability status.
 * Follows Chatwoot's production UI design patterns.
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";
import type { Agent, AgentUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/agents.types";

interface EditAgentModalProps {
  open: boolean;
  agent: Agent | null;
  onClose: () => void;
  onSave: (agentId: number, updates: AgentUpdatePayload) => Promise<void>;
  loading?: boolean;
}

export const EditAgentModal: React.FC<EditAgentModalProps> = ({
  open,
  agent,
  onClose,
  onSave,
  loading = false,
}) => {
  const [role, setRole] = useState<string>("agent");
  const [availabilityStatus, setAvailabilityStatus] = useState<string>("offline");
  const [autoOffline, setAutoOffline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form values when agent changes
  useEffect(() => {
    if (agent) {
      setRole(agent.role || "agent");
      setAvailabilityStatus(agent.availability_status || "offline");
      setAutoOffline(agent.auto_offline || false);
      setError(null);
    }
  }, [agent]);

  const handleSave = async () => {
    if (!agent?.id) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(agent.id, {
        role,
        availability_status: availabilityStatus,
        auto_offline: autoOffline,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update agent");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setError(null);
      onClose();
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    console.log("Reset password for agent:", agent?.id);
  };

  if (!agent) return null;

  const agentName = agent.name || agent.available_name || agent.email || "Unknown Agent";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          minHeight: "400px",
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
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Edit agent - {agentName.toLowerCase()}
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={saving}
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Agent Name - Display Only */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.875rem",
                color: "text.primary",
              }}
            >
              Agent Name
            </Typography>
            <TextField
              fullWidth
              value={agentName}
              disabled
              variant="outlined"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "text.primary",
                  color: "text.primary",
                },
              }}
            />
          </Box>

          {/* Role Dropdown */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.875rem",
                color: "text.primary",
              }}
            >
              Role
            </Typography>
            <FormControl fullWidth>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={saving || loading}
              >
                <MenuItem value="administrator">Administrator</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Availability Dropdown */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: "0.875rem",
                color: "text.primary",
              }}
            >
              Availability
            </Typography>
            <FormControl fullWidth>
              <Select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                disabled={saving || loading}
              >
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Reset Password Link */}
        <Link
          component="button"
          variant="body2"
          onClick={handleResetPassword}
          disabled={saving || loading}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            textDecoration: "none",
            color: "primary.main",
            "&:hover": {
              textDecoration: "underline",
            },
            "&.Mui-disabled": {
              color: "text.disabled",
            },
          }}
        >
          <LockResetIcon fontSize="small" />
          Reset Password
        </Link>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={handleClose}
            disabled={saving}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              minWidth: 120,
            }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Edit Agent"
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
