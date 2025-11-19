/**
 * Add Agent Modal
 *
 * Modal for inviting new agents to the account.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from "@mui/material";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // Basic email validation
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Agent
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Invite a new team member to join your account
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
            {/* Name Field */}
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={loading}
              required
              placeholder="Enter agent's full name"
            />

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={loading}
              required
              placeholder="agent@example.com"
              helperText="An invitation email will be sent to this address"
            />

            {/* Role Selection */}
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: e.target.value as "administrator" | "agent",
                  }))
                }
              >
                <MenuItem value="agent">
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Agent
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Can handle conversations and access assigned inboxes
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="administrator">
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Administrator
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Full access to all account settings and features
                    </Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
          <Button onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? "Adding..." : "Add Agent"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
