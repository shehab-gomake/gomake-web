import { forwardRef } from "react";
import { useRecoilState } from "recoil";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { snackbarState } from "@/store";

const useSnackBar = () => {
  const [snackbarStateValue, setSnackbarStateValue] =
    useRecoilState(snackbarState);

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleClose = () => {
    setTimeout(() => {
      setSnackbarStateValue({
        state: false,
        message: "",
        type: "",
      });
    }, 1000);
  };

  return { snackbarStateValue, setSnackbarStateValue, handleClose, Alert };
};

export { useSnackBar };
