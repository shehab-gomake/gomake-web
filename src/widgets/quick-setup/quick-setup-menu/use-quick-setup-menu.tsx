import { useEffect, useState } from "react";
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
import { getItem, setItem } from "@/services/storage-data";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonCheckedRoundedIcon from "@mui/icons-material/RadioButtonCheckedRounded";
import { Checkbox } from "@mui/material";

const useSetupGuideMenu = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isOpen = useRecoilValue(setupGuideOpenState);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openVerifyBusiness, setOpenVerifyBusiness] = useState(false);
  const { primaryColor } = useGomakeTheme();
  const [showGuideMenuState, setShowGuideMenuState] = useState(true);

  useEffect(() => {
    const saved = getItem("gomake_showGuideMenu");
    if (saved === "false") {
      setShowGuideMenuState(false);
    }
  }, []);

  const setShowGuideMenu = (value: boolean) => {
    setItem("gomake_showGuideMenu", value);
    setShowGuideMenuState(value);
  };

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

  const productsSetupStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.PRODUCTS_SETUPS
  )?.status;

  const resetPasswordStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.RESET_PASSWORD
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

  const renderStepStatusIconNew = (status?: StepStatus) => {
    switch (status) {
      case StepStatus.DONE:
        return (
          <Checkbox
            size="small"
            checked
            checkedIcon={<CheckCircleRoundedIcon />}
            sx={{
              p: 0,
              color: primaryColor(400),
              "&.Mui-checked": {
                color: primaryColor(400),
              },
            }}
          />
        );
      case StepStatus.IN_PROGRESS:
        return (
          <Checkbox
            size="small"
            checked
            checkedIcon={<RadioButtonCheckedRoundedIcon />}
            sx={{
              p: 0,
              color: primaryColor(400),
              "&.Mui-checked": {
                color: primaryColor(400),
              },
            }}
          />
        );
      case StepStatus.NOT_YET:
      default:
        return (
          <Checkbox
            size="small"
            checked={false}
            icon={<RadioButtonUncheckedRoundedIcon />}
            sx={{ p: 0, color: "#ccc" }}
          />
        );
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
    setShowGuideMenu,
    showGuideMenuState,
    resetPasswordStatus,
  };
};

export { useSetupGuideMenu };
