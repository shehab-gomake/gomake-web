/**
 * Edit Agent Modal
 *
 * Modal for editing agent role and availability status.
 * Uses unified CompactModal component for consistency.
 */

import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  Link,
  Box,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import CircleIcon from "@mui/icons-material/Circle";
import PersonIcon from "@mui/icons-material/Person";
import type { Agent, AgentUpdatePayload } from "@/services/frontdesk/api/chatwoot/types/agents.types";
import { CompactModal } from "./CompactModal";
import {
  CompactLabel,
  CompactTextField,
  CompactFormSection,
  CompactModalActions,
  CompactSwitch,
} from "./CompactFormFields";

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
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("agent");
  const [availabilityStatus, setAvailabilityStatus] = useState<string>("offline");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize form values when agent changes
  useEffect(() => {
    if (agent) {
      setName(agent.name || agent.available_name || agent.email || "");
      setRole(agent.role || "agent");
      setAvailabilityStatus(agent.availability_status || "offline");
      setError(null);
    }
  }, [agent]);

  const handleSave = async () => {
    if (!agent?.id) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(agent.id, {
        name,
        role,
        availability_status: availabilityStatus,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update agent");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    console.log("Reset password for agent:", agent?.id);
  };

  if (!agent) return null;

  const displayName = name || agent.name || agent.available_name || agent.email || "Unknown Agent";

  return (
    <CompactModal
      open={open}
      onClose={onClose}
      title={`Edit agent - ${displayName}`}
      icon={<PersonIcon />}
      error={error}
      disabled={saving || loading}
      actions={
        <>
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
              color: "#6366f1",
              fontSize: "0.813rem",
              fontWeight: 500,
              marginRight: "auto",
              "&:hover": {
                textDecoration: "underline",
                color: "#4f46e5",
              },
              "&.Mui-disabled": {
                color: "#9ca3af",
              },
            }}
          >
            <LockResetIcon sx={{ fontSize: 16 }} />
            Reset Password
          </Link>
          
          <CompactModalActions
            onCancel={onClose}
            onSubmit={handleSave}
            submitLabel="Save Changes"
            isSubmitting={saving || loading}
          />
        </>
      }
    >
      <CompactFormSection>
        {/* Agent Name */}
        <CompactTextField
          label="Agent Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={saving || loading}
          placeholder="Enter agent name"
        />

        {/* Role */}
        <Box>
          <CompactLabel required>Role</CompactLabel>
          <FormControl fullWidth size="small">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={saving || loading}
              sx={{
                fontSize: "0.813rem",
              }}
            >
              <MenuItem value="administrator" sx={{ fontSize: "0.813rem" }}>
                Administrator
              </MenuItem>
              <MenuItem value="agent" sx={{ fontSize: "0.813rem" }}>
                Agent
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Availability */}
        <Box>
          <CompactLabel required>Availability</CompactLabel>
          <FormControl fullWidth size="small">
            <Select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
              disabled={saving || loading}
              sx={{
                fontSize: "0.813rem",
              }}
            >
              <MenuItem value="online" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#10b981" }} />
                  <span>Online</span>
                </Box>
              </MenuItem>
              <MenuItem value="busy" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#f59e0b" }} />
                  <span>Busy</span>
                </Box>
              </MenuItem>
              <MenuItem value="offline" sx={{ fontSize: "0.813rem" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CircleIcon sx={{ fontSize: 8, color: "#6b7280" }} />
                  <span>Offline</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CompactFormSection>
    </CompactModal>
  );
};
