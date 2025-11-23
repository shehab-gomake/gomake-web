/**
 * Create Contact Modal
 *
 * Simple modal for creating a new contact with name, email, and phone number.
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface CreateContactModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email?: string; phone_number?: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const CreateContactModal: React.FC<CreateContactModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const handleClose = () => {
    // Reset form
    setName("");
    setEmail("");
    setPhoneNumber("");
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; phone?: string } = {};

    // Name is required
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // At least email or phone must be provided
    if (!email.trim() && !phoneNumber.trim()) {
      newErrors.email = "Provide at least email or phone number";
      newErrors.phone = "Provide at least email or phone number";
    }

    // Validate email format if provided
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate phone format if provided (basic check)
    if (phoneNumber.trim() && !/^[\d\s\-\+\(\)]+$/.test(phoneNumber)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      email: email.trim() || undefined,
      phone_number: phoneNumber.trim() || undefined,
    });

    // Close and reset on success
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${neutralColor(200)}`,
          pb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: neutralColor(900) }}>
          Create New Contact
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          {/* Name Field */}
          <div>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Name <span style={{ color: "#DC2626" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter contact name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </div>

          {/* Email Field */}
          <div>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="contact@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <Typography
              sx={{
                mb: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: neutralColor(700),
              }}
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </div>

          {/* Help Text */}
          <Typography sx={{ fontSize: "0.75rem", color: neutralColor(600) }}>
            Provide at least an email or phone number to create the contact.
          </Typography>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ borderTop: `1px solid ${neutralColor(200)}`, px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{ textTransform: "none", color: neutralColor(700) }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim()}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: primaryColor(600),
            "&:hover": { backgroundColor: primaryColor(700) },
            "&:disabled": { backgroundColor: neutralColor(300) },
          }}
        >
          {isSubmitting ? "Creating..." : "Create Contact"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
