import { forwardRef } from "react";
import { useRecoilState } from "recoil";

import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { snackbarState } from "@/store";
import { useTranslation } from "react-i18next";

const useSnackBar = () => {
  const [snackbarStateValue, setSnackbarStateValue] =
    useRecoilState(snackbarState);
  const { t } = useTranslation();
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

  const alertSuccessUpdate = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.updatedSusuccessfully"),
      type: "sucess",
    });
  };
  const alertFaultUpdate = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.updatedfailed"),
      type: "error",
    });
  };
  const alertSuccessAdded = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.addedSusuccessfully"),
      type: "sucess",
    });
  };
  const alertFaultAdded = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.addedfailed"),
      type: "error",
    });
  };
  const alertFaultDelete = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.deletefailed"),
      type: "error",
    });
  };
  const alertSuccessDelete = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.deleteSusuccessfully"),
      type: "success",
    });
  };
  const alertRequiredFields = () => {
    setSnackbarStateValue({
      state: true,
      message: t("modal.RequiredFields"),
      type: "error",
    });
  };

  return {
    snackbarStateValue,
    setSnackbarStateValue,
    handleClose,
    Alert,
    alertFaultUpdate,
    alertSuccessUpdate,
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessDelete,
    alertFaultDelete,
    alertRequiredFields,
  };
};

export { useSnackBar };
