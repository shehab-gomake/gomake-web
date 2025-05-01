import { useState } from "react";
import { useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { useTranslation } from "react-i18next";
import {
  printHouseSetupStepsState,
  SetupStep,
  SetupStepItem,
  StepStatus,
} from "@/store/print-house-setup-state-state";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useSetupGuideMenu = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isOpen = useRecoilValue(setupGuideOpenState);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openVerifyBusiness, setOpenVerifyBusiness] = useState(false);
  const { primaryColor } = useGomakeTheme();
  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  const handleToggleVerifyBusiness = () => {
    setOpenVerifyBusiness((prev) => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const totalSteps = printHouseSetupSteps.length;

  const completedSteps = printHouseSetupSteps.filter(
    (step) => step.status === StepStatus.DONE
  ).length;

  const progressValue =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const steps = [
    {
      title: "Set up products",
      status: printHouseSetupSteps?.find(
        (step) => step?.step === SetupStep.PRODUCTS_SETUPS
      )?.status,
    },
  ];

  const productsSetupStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.PRODUCTS_SETUPS
  )?.status;

  const renderStepStatusIcon = (status?: StepStatus) => {
    switch (status) {
      case StepStatus.DONE:
        return <TaskAltRoundedIcon fontSize="small" color="success" />;
      case StepStatus.IN_PROGRESS:
        return (
          <DonutLargeRoundedIcon
            fontSize="small"
            sx={{ color: primaryColor(500) }}
          />
        );
      case StepStatus.NOT_YET:
      default:
        return <RadioButtonUncheckedIcon fontSize="small" color="disabled" />;
    }
  };

  return {
    t,
    isOpen,
    setIsExpanded,
    isExpanded,
    setOpenVerifyBusiness,
    openVerifyBusiness,
    progressValue,
    toggleExpand,
    handleToggleVerifyBusiness,
    isRtl,
    printHouseSetupSteps,
    productsSetupStatus,
    renderStepStatusIcon,
  };
};

export { useSetupGuideMenu };
