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
  alpha
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { OutlookIcon } from "@/icons/outlook-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface EmailAuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticate: (provider: string) => Promise<void>;
  error?: string | null;
}

export const EmailAuthModal: React.FC<EmailAuthModalProps> = ({ open, onClose, onAuthenticate, error }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { primaryColor, neutralColor } = useGomakeTheme();

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          border: `1px solid ${neutralColor(200)}`,
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: neutralColor(25),
          borderBottom: `1px solid ${neutralColor(200)}`,
          color: neutralColor(900),
          fontWeight: 600
        }}
      >
        Connect Email Account
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Typography variant="body2" sx={{ color: neutralColor(600) }}>
            Connect your email account to manage messages directly from this platform.
          </Typography>

          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={isAuthenticating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <GoogleIcon />}
              onClick={() => handleConnect("gmail")}
              disabled={isAuthenticating}
              sx={{
                backgroundColor: "#4285f4",
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                boxShadow: `0 2px 8px ${alpha('#4285f4', 0.3)}`,
                transition: 'all 0.2s ease',
                "&:hover": {
                  backgroundColor: "#357ae8",
                  boxShadow: `0 4px 12px ${alpha('#4285f4', 0.4)}`,
                  transform: 'translateY(-1px)'
                },
                "&:disabled": {
                  backgroundColor: neutralColor(300),
                  color: neutralColor(500)
                }
              }}
            >
              {isAuthenticating ? "Connecting..." : "Connect Gmail Account"}
            </Button>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={isAuthenticating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <OutlookIcon size={20} />}
              onClick={() => handleConnect("outlook")}
              disabled={isAuthenticating}
              sx={{
                backgroundColor: "#0078d4",
                color: 'white',
                py: 1.5,
                borderRadius: 2,
                fontWeight: 500,
                boxShadow: `0 2px 8px ${alpha('#0078d4', 0.3)}`,
                transition: 'all 0.2s ease',
                "&:hover": {
                  backgroundColor: "#106ebe",
                  boxShadow: `0 4px 12px ${alpha('#0078d4', 0.4)}`,
                  transform: 'translateY(-1px)'
                },
                "&:disabled": {
                  backgroundColor: neutralColor(300),
                  color: neutralColor(500)
                }
              }}
            >
              {isAuthenticating ? "Connecting..." : "Connect Outlook Account"}
            </Button>
          </Stack>

          <Typography variant="caption" sx={{ color: neutralColor(500), textAlign: 'center' }}>
            Your credentials are securely stored and only used to access your emails.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${neutralColor(200)}` }}>
        <Button
          onClick={onClose}
          disabled={isAuthenticating}
          sx={{
            color: neutralColor(600),
            '&:hover': {
              backgroundColor: alpha(neutralColor(100), 0.5)
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
