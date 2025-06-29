// GoMakeDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";

interface GoMakeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
  children?: React.ReactNode;
}

const GoMakeDialog: React.FC<GoMakeDialogProps> = ({
  open,
  onClose,
  title,
  description,
  buttonText = "modal.ok",
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="go-make-dialog-title"
      aria-describedby="go-make-dialog-description"
    >
      <DialogTitle
        id="go-make-dialog-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ padding: "0" }}>
        {description && (
          <DialogContentText
            id="go-make-dialog-description"
            style={{ padding: "20px" }}
          >
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {t(buttonText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { GoMakeDialog };
