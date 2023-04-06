import React from "react";

import { Snackbar } from "@mui/material";
import { useSnackBar } from "@/hooks";

const GoMakeSnackBar = () => {
  const { snackbarStateValue, handleClose, Alert } = useSnackBar();
  return (
    <Snackbar
      open={snackbarStateValue.state}
      autoHideDuration={3000}
      onClose={handleClose}
      message={snackbarStateValue.message}
    >
      {snackbarStateValue.type === "error" ? (
        <Alert severity="error">{snackbarStateValue.message}</Alert>
      ) : (
        <Alert severity="success">{snackbarStateValue.message}</Alert>
      )}
    </Snackbar>
  );
};

export { GoMakeSnackBar };
