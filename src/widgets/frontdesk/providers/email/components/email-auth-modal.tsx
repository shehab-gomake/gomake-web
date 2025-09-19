import React, { useState } from "react";
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
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

interface EmailAuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticate: (provider: string) => Promise<void>;
  error?: string | null;
}

export const EmailAuthModal: React.FC<EmailAuthModalProps> = ({
  open,
  onClose,
  onAuthenticate,
  error,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleConnect = async (provider: string) => {
    setIsAuthenticating(true);
    try {
      await onAuthenticate(provider);
      onClose();
    } catch (error) {
      console.error("Authentication failed:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Connect Email Account</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">
            Connect your email account to manage messages directly from this platform.
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          <Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={isAuthenticating ? <CircularProgress size={20} /> : <GoogleIcon />}
              onClick={() => handleConnect("gmail")}
              disabled={isAuthenticating}
              sx={{
                backgroundColor: "#4285f4",
                "&:hover": { backgroundColor: "#357ae8" },
              }}
            >
              {isAuthenticating ? "Connecting..." : "Connect Gmail Account"}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" align="center">
            Your credentials are securely stored and only used to access your emails.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isAuthenticating}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};