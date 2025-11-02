/**
 * Add Channel Modal Component
 *
 * A robust modal for adding new channels to Chatwoot.
 * Based on the email auth modal but enhanced with better UX, error handling, and structure.
 */

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Box,
  alpha,
  IconButton,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface AddChannelModalProps {
  open: boolean;
  onClose: () => void;
  error?: string | null;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  open,
  onClose,
  error,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const { primaryColor, neutralColor } = useGomakeTheme();

  // Reset error when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setInternalError(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose();
    }
  }, [isLoading, onClose]);

  // Display either external error prop or internal error state
  const displayError = error || internalError;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${neutralColor(200)}`,
          boxShadow: `0 8px 32px ${alpha(neutralColor(900), 0.12)}`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: neutralColor(25),
          borderBottom: `1px solid ${neutralColor(200)}`,
          color: neutralColor(900),
          fontWeight: 600,
          fontSize: "1.25rem",
          py: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: primaryColor(50),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "1.5rem",
                color: primaryColor(600),
                fontWeight: 600,
              }}
            >
              +
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Channel
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={isLoading}
          size="small"
          sx={{
            color: neutralColor(600),
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.8),
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 4, px: 3 }}>
        <Stack spacing={3}>
          {/* Description */}
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: neutralColor(700),
                lineHeight: 1.6,
                mb: 0.5,
              }}
            >
              Connect a new communication channel to manage conversations directly from FrontDesk.
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: neutralColor(500),
                fontSize: "0.813rem",
              }}
            >
              Channels help you organize and manage conversations from different communication platforms in one place.
            </Typography>
          </Box>

          {/* Error Display */}
          {displayError && (
            <Alert
              severity="error"
              onClose={() => setInternalError(null)}
              sx={{
                borderRadius: 2,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              {displayError}
            </Alert>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Channel Options Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: neutralColor(700),
                fontWeight: 600,
                mb: 2,
                fontSize: "0.938rem",
              }}
            >
              Available Channel Types
            </Typography>

            {/* Placeholder for future channel options */}
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${neutralColor(200)}`,
                  backgroundColor: neutralColor(25),
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: neutralColor(500),
                    fontStyle: "italic",
                  }}
                >
                  Channel configuration options will be available here.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          borderTop: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isLoading}
          variant="outlined"
          sx={{
            color: neutralColor(700),
            borderColor: neutralColor(300),
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 500,
            textTransform: "none",
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.8),
              borderColor: neutralColor(400),
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Cancel
        </Button>
        {/* Placeholder for future action buttons */}
      </DialogActions>
    </Dialog>
  );
};

