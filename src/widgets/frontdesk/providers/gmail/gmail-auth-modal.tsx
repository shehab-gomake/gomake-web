import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";
import { useGmailAuth } from "@/hooks/frontdesk/providers/gmail";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface GmailAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const GmailAuthModal: React.FC<GmailAuthModalProps> = ({ open, onClose }) => {
  const { connectionState, oauthState, initiateAuth, disconnect, isConnected, isLoading } = useGmailAuth();
  const { primaryColor } = useGomakeTheme();

  const handleConnect = async () => {
    await initiateAuth();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const renderConnectionStatus = () => {
    if (isConnected && connectionState.email) {
      return (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Gmail is connected to: {connectionState.email}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your Gmail account is successfully connected and ready to use.
          </Typography>
        </Box>
      );
    }

    if (connectionState.error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {connectionState.error}
        </Alert>
      );
    }

    if (oauthState.error) {
      return (
        <Alert severity="error" sx={{ mb: 2 }}>
          {oauthState.error}
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Connect your Gmail account to manage emails directly from the front desk.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You'll be redirected to Google to authorize access to your Gmail account.
        </Typography>
      </Box>
    );
  };

  const renderActions = () => {
    if (isConnected) {
      return (
        <>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
          <Button
            onClick={handleDisconnect}
            variant="outlined"
            color="error"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
          >
            Disconnect
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConnect}
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <EmailIcon />}
        >
          {isLoading ? "Connecting..." : "Connect Gmail"}
        </Button>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          <EmailIcon color="primary" />
          <Typography variant="h6">Gmail Integration</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {renderConnectionStatus()}

        {oauthState.isAuthenticating && (
          <Alert severity="info">
            <Stack direction="row" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              <Typography variant="body2">
                Authenticating with Google... Please complete the authorization in the popup window.
              </Typography>
            </Stack>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {renderActions()}
      </DialogActions>
    </Dialog>
  );
};