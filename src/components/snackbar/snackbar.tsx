import React from "react";

import { Snackbar } from "@mui/material";
import { useSnackBar } from "@/hooks";
import { useRecoilValue } from "recoil";
import { navStatusState } from "@/store/nav-status";

const GoMakeSnackBar = () => {
  const { snackbarStateValue, handleClose, Alert } = useSnackBar();
  const navStatus = useRecoilValue(navStatusState);
  return (
    <Snackbar
      open={snackbarStateValue.state}
      autoHideDuration={3000}
      onClose={handleClose}
      message={snackbarStateValue.message}
      style={{ position: "absolute", left: navStatus?.isClosed ? 135 : 250 }}
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
