import { PrimaryButton } from "@/components/button/primary-button";
import { ModalControls } from "@/hooks/use-modal";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Link,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { setUserNewPasswordApi } from "@/services/api-service/quick-setup-menu/reset-password";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useStyle } from "./style";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  printHouseSetupStepsState,
  printHouseWelcomeModalState,
  setupGuideExpandedState,
  SetupStep,
  SetupStepItem,
  StepStatus,
} from "@/store/print-house-setup-state-state";

interface ResetPasswordModalProps {
  openModal: boolean;
  onClose: () => void;
}

export const ResetPasswordModal = ({
  openModal,
  onClose,
}: ResetPasswordModalProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const setIsExpanded = useSetRecoilState(setupGuideExpandedState);
  const setPrintHouseWelcomeModal = useSetRecoilState<boolean>(
    printHouseWelcomeModalState
  );
  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError(t("quickSetup.resetPass.passwordsDoNotMatch"));
      return;
    }
    setTimeout(() => {
      resetPassword(newPassword);
      setError("");
    }, 500);
  };

  const handleCloseModal = () => {
    onClose();
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const resetPassword = async (newPassword) => {
    const callBack = (res) => {
      if (res.success) {
        handleCloseModal();
        alertSuccessUpdate();

        const welcomeStep = printHouseSetupSteps.find(
          (step) => step.step === SetupStep.WELCOME_MESSAGE
        );
        if (welcomeStep.status === StepStatus.NOT_YET) {
          setTimeout(() => {
            setPrintHouseWelcomeModal(true);
            //!here should update
          }, 200);
        }

        setTimeout(() => {
          setIsExpanded(true);
        }, 200);
      } else {
        alertFaultUpdate();
      }
    };
    await setUserNewPasswordApi(callApi, callBack, { newPassword });
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box sx={classes.mainBox}>
        <Box sx={classes.headerBox}>
          <Typography variant="h6">
            {t("quickSetup.resetPass.title")}
          </Typography>

          <IconButton onClick={() => handleCloseModal()}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label={t("quickSetup.resetPass.newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={classes.textFiled}
            required
          />
          <TextField
            fullWidth
            type="password"
            label={t("quickSetup.resetPass.confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={classes.textFiled}
            required
          />
          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}
          <PrimaryButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
          >
            {t("quickSetup.resetPass.resetButton")}
          </PrimaryButton>
        </form>
      </Box>
    </Modal>
  );
};
