import { ModalControls } from "@/hooks/use-modal";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  printHouseSetupStepsState,
  SetupStep,
  SetupStepItem,
  StepStatus,
} from "@/store/print-house-setup-state-state";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { PrimaryButton } from "@/components/button/primary-button";
// import { GomakeIcon } from "./icons";

interface DemoVideoModalProps {
  modalControl: ModalControls;
  videoUrl: string;
  setVideoUrl: any;
  currentVideoStep: SetupStep;
  videoSteps: any;
  handleNextVideo: () => void;
  handlePreviousVideo: () => void;
  updatePrintHouseSetupSteps: (
    step: SetupStep,
    status?: StepStatus
  ) => Promise<void>;
}

export const DemoVideoModal = ({
  modalControl,
  videoUrl,
  setVideoUrl,
  currentVideoStep,
  videoSteps,
  handleNextVideo,
  handlePreviousVideo,
  updatePrintHouseSetupSteps,
}: DemoVideoModalProps) => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();
  const theme = useTheme();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );
  const currentStepData = printHouseSetupSteps.find(
    (step) => step.step === currentVideoStep
  );

  const closeModal = () => {
    modalControl.close();
    setVideoUrl("");
  };

  useEffect(() => {
    if (modalControl.isOpen && currentStepData?.status !== StepStatus.DONE) {
      updatePrintHouseSetupSteps(currentVideoStep, StepStatus.DONE);
    }
  }, [modalControl.isOpen, currentVideoStep]);

  const getVideoTitle = () => {
    switch (currentVideoStep) {
      case SetupStep.HELP_CENTER_BASIC_WALKTHROUGH:
        return t("quickSetup.steps.howToStartWithGoMake");
      case SetupStep.HELP_CENTER_CREATE_A_QUOTE:
        return t("quickSetup.steps.createAQuote");
      case SetupStep.FILE_SERVICE_CONFIGS:
        return t("quickSetup.steps.fileServiceConfigs");
      default:
        return t("quickSetup.gettingStartedGuide");
    }
  };

  const canGoNext = videoSteps[currentVideoStep]?.nextStep !== null;
  const canGoPrevious =
    Object.keys(videoSteps).indexOf(currentVideoStep.toString()) > 0;

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
          backgroundColor: "#ffffff",
          borderRadius: 4,
          width: "85vw",
          maxWidth: "1000px",
          outline: "none",
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)",
          p: 0,
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `linear-gradient(135deg, ${primaryColor(
              500
            )} 0%, ${primaryColor(600)} 100%)`,
            color: theme.palette.primary.contrastText,
            p: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.8)",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <Typography
              variant="h6"
              id="video-modal-title"
              sx={{
                fontWeight: 600,
                fontSize: "18px",
                letterSpacing: "0.5px",
              }}
            >
              {getVideoTitle()}
            </Typography>
          </Box>
          <IconButton
            onClick={closeModal}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            backgroundColor: "#26277914",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(45deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)",
              zIndex: 1,
              pointerEvents: "none",
            },
          }}
        >
          <iframe
            src={`${videoUrl}?rel=0&vq=hd1080&modestbranding=1&showinfo=0&controls=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0`}
            title="YouTube Video"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              padding: "20px",
              borderRadius: "0",
            }}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Box
          sx={{
            padding: "20px 24px",
            background: `linear-gradient(135deg, ${secondColor(
              50
            )} 0%, ${secondColor(100)} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0, 0, 0, 0.05)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              background: `linear-gradient(90deg, ${primaryColor(
                300
              )} 0%, ${primaryColor(500)} 50%, ${primaryColor(300)} 100%)`,
              borderRadius: "0 0 3px 3px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: primaryColor(400),
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.7, transform: "scale(1.2)" },
                  "100%": { opacity: 1, transform: "scale(1)" },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              {t("Enjoy watching the video!")}
            </Typography>
            {/* <GomakeIcon /> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "12px",
              flexDirection: isRtl ? "row-reverse" : "row",
            }}
          >
            {canGoPrevious && (
              <PrimaryButton
                variant="outlined"
                size="small"
                startIcon={isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                onClick={handlePreviousVideo}
                sx={{
                  minWidth: "130px",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  borderColor: primaryColor(300),
                  color: primaryColor(600),
                  "&:hover": {
                    borderColor: primaryColor(400),
                    backgroundColor: primaryColor(50),
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${primaryColor(200)}`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {t("Previous")}
              </PrimaryButton>
            )}
            {canGoNext && (
              <PrimaryButton
                variant="contained"
                size="small"
                endIcon={isRtl ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                onClick={handleNextVideo}
                sx={{
                  minWidth: "130px",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  background: `linear-gradient(135deg, ${primaryColor(
                    500
                  )} 0%, ${primaryColor(600)} 100%)`,
                  boxShadow: `0 4px 12px ${primaryColor(300)}`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${primaryColor(
                      600
                    )} 0%, ${primaryColor(700)} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 6px 16px ${primaryColor(400)}`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {t("Next")}
              </PrimaryButton>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
