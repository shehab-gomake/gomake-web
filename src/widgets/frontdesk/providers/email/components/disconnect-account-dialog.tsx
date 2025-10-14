import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface DisconnectAccountDialogProps {
  open: boolean;
  accountEmail?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DisconnectAccountDialog: React.FC<DisconnectAccountDialogProps> = ({ open, accountEmail, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Disconnect Email Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {accountEmail ? (
            <>
              Are you sure you want to disconnect <strong>{accountEmail}</strong>? This action cannot be undone and you will lose
              access to all emails from this account.
            </>
          ) : (
            "Are you sure you want to disconnect this email account? This action cannot be undone and you will lose access to all emails from this account."
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Disconnect
        </Button>
      </DialogActions>
    </Dialog>
  );
};
