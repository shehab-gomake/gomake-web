import { forwardRef } from "react";
import { useRecoilState } from "recoil";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { snackbarState } from "@/store";
import { useTranslation } from "react-i18next";

const useSnackBar = () => {
  const { t } = useTranslation();
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

  const showAlert = (messageKey: string, type: "success" | "error") => {
    setSnackbarStateValue({
      state: true,
      message: t(messageKey),
      type,
    });
  };

  return {
    snackbarStateValue,
    setSnackbarStateValue,
    handleClose,
    Alert,
    alertFaultUpdate: () => showAlert("modal.updatedfailed", "error"),
    alertSuccessUpdate: () => showAlert("modal.updatedSusuccessfully", "success"),
    alertFaultAdded: () => showAlert("modal.addedfailed", "error"),
    alertSuccessAdded: () => showAlert("modal.addedSusuccessfully", "success"),
    alertSuccessDelete: () => showAlert("modal.deleteSusuccessfully", "success"),
    alertFaultDelete: () => showAlert("modal.deletefailed", "error"),
    alertRequiredFields: () => showAlert("modal.RequiredFields", "error"),
    alertFaultDuplicate: () => showAlert("modal.duplicateFailed", "error"),
    alertFault: (errorMessage: string) => showAlert(errorMessage, "error"),
    alertSuccess: (successMessage: string) => showAlert(successMessage, "success"),
    alertFaultGetData: () => showAlert("modal.getDataFailed", "error"),
    alertSuccessGetData: () => showAlert("modal.getDataSuccessfully", "success"),
    alertFaultSend: () => showAlert("alerts.sendFailed", "error"),
  };
};

export { useSnackBar };