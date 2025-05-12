import { ModalControls } from "@/hooks/use-modal";
import { useTranslation } from "react-i18next";
import { Modal, Box, IconButton, Typography, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  printHouseSetupStepsState,
  SetupStep,
  SetupStepItem,
  StepStatus,
} from "@/store/print-house-setup-state-state";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
// import { GomakeIcon } from "./icons";

interface DemoVideoModalProps {
  modalControl: ModalControls;
  videoUrl: string;
  setVideoUrl: any;
  updatePrintHouseSetupSteps: (
    step: SetupStep,
    status?: StepStatus
  ) => Promise<void>;
}

export const DemoVideoModal = ({
  modalControl,
  videoUrl,
  setVideoUrl,
  updatePrintHouseSetupSteps,
}: DemoVideoModalProps) => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();
  const theme = useTheme();
  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );
  const basicWalkthroughStep = printHouseSetupSteps.find(
    (step) => step.step === SetupStep.HELP_CENTER_BASIC_WALKTHROUGH
  );

  const closeModal = () => {
    modalControl.close();
    setVideoUrl("");
  };

  useEffect(() => {
    if (
      modalControl.isOpen &&
      basicWalkthroughStep?.status !== StepStatus.DONE
    ) {
      updatePrintHouseSetupSteps(
        SetupStep.HELP_CENTER_BASIC_WALKTHROUGH,
        StepStatus.DONE
      );
    }
  }, [modalControl.isOpen]);

  return (
    <Modal
      open={modalControl.isOpen}
      onClose={closeModal}
      aria-labelledby="video-modal-title"
      aria-describedby="video-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#f6f6f6",
          borderRadius: 3,
          width: "80vw",
          maxWidth: "1000px",
          outline: "none",
          overflow: "hidden",
          boxShadow: theme.shadows[6],
          p: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: primaryColor(500),
            color: theme.palette.primary.contrastText,
            p: 1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography variant="h6" id="video-modal-title">
            {t("quickSetup.gettingStartedGuide")}
          </Typography>
          <IconButton onClick={closeModal} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            src={`${videoUrl}?rel=0&vq=hd720`}
            title="YouTube Video"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              padding: "16px",
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Box
          sx={{
            padding: "12px 16px",
            backgroundColor: secondColor(50),
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {t("Enjoy watching the video!")}
          </Typography>
          {/* <GomakeIcon /> */}
        </Box>
      </Box>
    </Modal>
  );
};
