import { PrimaryButton } from "@/components/button/primary-button";
import { setItem } from "@/services/storage-data";
import {
  printHouseWelcomeModalState,
  SetupStep,
  StepStatus,
} from "@/store/print-house-setup-state-state";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";

interface WelcomeModalProps {
  handleOpenResetPassword: () => void;

  updatePrintHouseSetupSteps: (
    step: SetupStep,
    status?: StepStatus
  ) => Promise<void>;
}

export const WelcomeModal = ({
  updatePrintHouseSetupSteps,
  handleOpenResetPassword,
}: WelcomeModalProps) => {
  const { t } = useTranslation();
  const [printHouseWelcomeModal, setPrintHouseWelcomeModal] =
    useRecoilState<boolean>(printHouseWelcomeModalState);

  const handleClose = () => {
    setPrintHouseWelcomeModal(false);
  };

  const handleStart = () => {
    setPrintHouseWelcomeModal(false);
    setTimeout(() => {
      handleOpenResetPassword();
    }, 300);
    setItem("gomake_setupGuideExpanded", "true");
    updatePrintHouseSetupSteps(SetupStep.WELCOME_MESSAGE, StepStatus.DONE);
  };

  return (
    <Dialog
      open={printHouseWelcomeModal}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: "20px" }}>
        {t("quickSetup.modal.welcomeTitle")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("quickSetup.modal.welcomeBody")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("quickSetup.modal.welcomeNote")}
        </Typography>
      </DialogContent>
      <DialogActions>
        <PrimaryButton
          style={{ width: "fit-content", borderRadius: "12px" }}
          variant="contained"
          onClick={handleStart}
        >
          {t("quickSetup.modal.startButton")}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};
