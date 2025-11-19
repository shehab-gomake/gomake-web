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
  Box,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim() || undefined,
        phone_number: phoneNumber.trim() || undefined,
      });

      // Close and reset on success
      handleClose();
    } catch (error: any) {
      // Handle 422 Unprocessable Entity errors with field-specific messages
      // Error format: {"message":"Email has already been taken","attributes":["email"]}
      if (error?.status === 422) {
        const fieldErrors: { name?: string; email?: string; phone?: string } = {};
        const errorMessage = error?.message || error?.errorData?.message || "Validation error";
        const attributes = error?.attributes || error?.errorData?.attributes || [];
        
        // Map error attributes to form fields
        if (Array.isArray(attributes) && attributes.length > 0) {
          attributes.forEach((attribute: string) => {
            if (attribute === "email") {
              fieldErrors.email = errorMessage;
            } else if (attribute === "phone_number" || attribute === "phone") {
              fieldErrors.phone = errorMessage;
            } else if (attribute === "name") {
              fieldErrors.name = errorMessage;
            }
          });
        } else {
          // If no attributes array, try to infer from error message
          if (errorMessage.toLowerCase().includes("email")) {
            fieldErrors.email = errorMessage;
          } else if (errorMessage.toLowerCase().includes("phone")) {
            fieldErrors.phone = errorMessage;
          } else {
            // Fallback: show error on email field if we can't determine the field
            fieldErrors.email = errorMessage;
          }
        }

        // Set field-specific errors
        setErrors(fieldErrors);
      } else {
        // Handle other errors - show general error message
        const errorMessage = error?.message || "Failed to create contact. Please try again.";
        setErrors({
          email: errorMessage,
        });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-contact-modal-title"
      aria-describedby="create-contact-modal-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          backgroundColor: neutralColor(0),
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `2px solid ${neutralColor(200)}`,
          pb: 2.5,
          pt: 3,
          px: 4,
          backgroundColor: neutralColor(0),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: primaryColor(50),
              color: primaryColor(600),
            }}
          >
            <PersonAddIcon />
          </Box>
          <Typography
            id="create-contact-modal-title"
            variant="h5"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
              fontSize: "1.375rem",
            }}
          >
            Create New Contact
          </Typography>
        </Stack>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={isSubmitting}
          aria-label="Close create contact modal"
          sx={{
            color: neutralColor(600),
            "&:hover": {
              backgroundColor: neutralColor(100),
              color: neutralColor(900),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 4, pt: 3, pb: 2 }}>
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
      <DialogActions
        sx={{
          borderTop: `2px solid ${neutralColor(200)}`,
          px: 4,
          py: 2.5,
          backgroundColor: neutralColor(0),
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            color: neutralColor(700),
            fontWeight: 500,
            fontSize: "0.875rem",
            px: 2.5,
            py: 0.75,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: neutralColor(50),
            },
            "&:disabled": {
              color: neutralColor(400),
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim()}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
          aria-label={isSubmitting ? "Creating contact" : "Create contact"}
          sx={{
            textTransform: "none",
            backgroundColor: primaryColor(600),
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 4,
            py: 1.25,
            borderRadius: 1,
            boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1)`,
            "&:hover": {
              backgroundColor: primaryColor(700),
              boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)`,
            },
            "&:disabled": {
              backgroundColor: neutralColor(300),
              color: neutralColor(500),
            },
          }}
        >
          <Box component="span" role={isSubmitting ? "status" : undefined} aria-live="polite">
            {isSubmitting ? "Creating..." : "Create Contact"}
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
};
