/**
 * Add Agent Modal
 *
 * Modal for inviting new agents to the account.
 * Uses unified CompactModal system for consistency.
 */

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { CompactModal } from "./CompactModal";
import {
  CompactFormSection,
  CompactTextField,
  CompactModalActions,
} from "./CompactFormFields";

export interface AddAgentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: AddAgentData) => Promise<void>;
}

export interface AddAgentData {
  name: string;
  email: string;
  role: "administrator" | "agent";
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState<AddAgentData>({
    name: "",
    email: "",
    role: "agent",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", email: "", role: "agent" });
      setError(null);
      onClose();
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await onAdd(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to add agent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && formData.name.trim().length > 0 && formData.email.trim().length > 0;

  return (
    <CompactModal
      open={open}
      onClose={handleClose}
      title="Add New Agent"
      icon={<PersonAddIcon />}
      error={error}
      disabled={loading}
      actions={
        <CompactModalActions
          onCancel={handleClose}
          onSubmit={handleSubmit}
          submitLabel="Add Agent"
          isSubmitting={loading}
          submitDisabled={!canSubmit}
          cancelDisabled={loading}
        />
      }
    >
      <CompactFormSection>
        {/* Name */}
        <CompactTextField
          label="Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter agent's full name"
          disabled={loading}
          autoFocus
        />

        {/* Email */}
        <Box>
          <CompactTextField
            label="Email Address"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="agent@example.com"
            disabled={loading}
          />
          <Typography
            sx={{
              mt: 0.5,
              fontSize: "0.75rem",
              color: "#6b7280",
              lineHeight: 1.4,
            }}
          >
            An invitation email will be sent to this address
          </Typography>
        </Box>

        {/* Role */}
        <Box>
          <Typography
            sx={{
              mb: 0.75,
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#4b5563",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
            }}
          >
            Role <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>*</span>
          </Typography>
          <FormControl fullWidth size="small" disabled={loading}>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as "administrator" | "agent",
                }))
              }
              sx={{
                fontSize: "0.813rem",
              }}
            >
              <MenuItem value="agent" sx={{ py: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.813rem", color: "#1f2937" }}>
                    Agent
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.3 }}>
                    Can handle conversations and access assigned inboxes
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="administrator" sx={{ py: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.813rem", color: "#1f2937" }}>
                    Administrator
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.75rem", lineHeight: 1.3 }}>
                    Full access to all account settings and features
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CompactFormSection>
    </CompactModal>
  );
};
