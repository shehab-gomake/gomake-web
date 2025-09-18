import { useTranslation } from "react-i18next";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  getPrintHouseProductsSetupFormApi,
  updatePrintHouseSetupStepsApi,
} from "@/services/api-service/quick-setup-menu/set-up-api";
import { ProductsSetupData } from "./compoennets/interfaces";
import {
  printHouseResetPasswordModalState,
  SetupStep,
  StepStatus,
} from "@/store/print-house-setup-state-state";
import { useRecoilState } from "recoil";

const useQuickSetup = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const ActionsModal = useModal();
  const [resetPasswordModal, setResetPasswordModal] = useRecoilState<boolean>(
    printHouseResetPasswordModalState
  );
  const DemoVideoModalControl = useModal();
  const { alertFaultGetData } = useSnackBar();
  const [initialSetupData, setInitialSetupData] =
    useState<ProductsSetupData | null>(null);

  const getPrintHouseProductsSetupForm = async () => {
    const callBack = (res) => {
      if (res.success) {
        setInitialSetupData(res.data);
      } else {
        alertFaultGetData();
      }
    };
    await getPrintHouseProductsSetupFormApi(callApi, callBack);
  };

  const handleOpenModal = async () => {
    try {
      await getPrintHouseProductsSetupForm();
      ActionsModal.open();
    } catch (error) {
      console.error("Failed to load setup data", error);
    }
  };

  const updatePrintHouseSetupSteps = async (
    step: SetupStep,
    status: StepStatus = StepStatus.IN_PROGRESS
  ) => {
    const updatedStep = {
      step: step,
      status: status,
    };

    await updatePrintHouseSetupStepsApi(callApi, () => {}, updatedStep);
  };

  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/0JzMbKDcI9Q"
  );
  const [currentVideoStep, setCurrentVideoStep] = useState(
    SetupStep.HELP_CENTER_BASIC_WALKTHROUGH
  );

  const videoSteps = {
    [SetupStep.HELP_CENTER_BASIC_WALKTHROUGH]: {
      url: "https://www.youtube.com/embed/0JzMbKDcI9Q",
      nextStep: SetupStep.HELP_CENTER_CREATE_A_QUOTE,
    },
    [SetupStep.HELP_CENTER_CREATE_A_QUOTE]: {
      url: "https://www.youtube.com/embed/G1wdiiUY98g",
      nextStep: null,
    },
  };

  const handleOpenDemoVideo = (
    step: SetupStep = SetupStep.HELP_CENTER_BASIC_WALKTHROUGH
  ) => {
    setCurrentVideoStep(step);
    setVideoUrl(videoSteps[step].url);
    DemoVideoModalControl.open();
  };

  const handleNextVideo = () => {
    const currentStepData = videoSteps[currentVideoStep];
    if (currentStepData.nextStep) {
      handleOpenDemoVideo(currentStepData.nextStep);
    }
  };

  const handlePreviousVideo = () => {
    // Find the previous step
    const currentStepIndex = Object.keys(videoSteps).indexOf(
      currentVideoStep.toString()
    );
    if (currentStepIndex > 0) {
      const previousStep = parseInt(
        Object.keys(videoSteps)[currentStepIndex - 1]
      );
      handleOpenDemoVideo(previousStep);
    }
  };

  const onOpenResetModal = () => {
    setResetPasswordModal(true);
  };

  const onCloseResetModal = () => {
    setResetPasswordModal(false);
  };
  return {
    t,
    ActionsModal,
    handleOpenModal,
    initialSetupData,
    setInitialSetupData,
    DemoVideoModalControl,
    updatePrintHouseSetupSteps,
    handleOpenDemoVideo,
    videoUrl,
    setVideoUrl,
    currentVideoStep,
    videoSteps,
    handleNextVideo,
    handlePreviousVideo,
    resetPasswordModal,
    onOpenResetModal,
    onCloseResetModal,
  };
};

export { useQuickSetup };
