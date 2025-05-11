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
    "https://www.youtube.com/embed/mnRav10tl80"
  );

  const handleOpenDemoVideo = () => {
    setVideoUrl("https://www.youtube.com/embed/mnRav10tl80");
    DemoVideoModalControl.open();
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
    resetPasswordModal,
    onOpenResetModal,
    onCloseResetModal,
  };
};

export { useQuickSetup };
