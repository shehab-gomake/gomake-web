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
import { useGomakeRouter } from "@/hooks";

const useSetupGuideMenu = ({ handleOpenModal, handleOpenResetPassword }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isOpen = useRecoilValue(setupGuideOpenState);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openVerifyBusiness, setOpenVerifyBusiness] = useState(false);
  const { primaryColor } = useGomakeTheme();
  const [showGuideMenuState, setShowGuideMenuState] = useState(true);
  const { navigate } = useGomakeRouter();

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

  const getStepStatus = (step: SetupStep): StepStatus =>
    printHouseSetupSteps.find((s) => s.step === step)?.status ??
    StepStatus.NOT_YET;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  // const toggleGroup = (groupKey: string) => {
  //   setExpandedGroups((prev) => ({
  //     ...prev,
  //     [groupKey]: !prev[groupKey],
  //   }));
  // };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const updated = {
        ...prev,
        [groupKey]: !prev[groupKey],
      };
      localStorage.setItem("gomake_expandedGroups", JSON.stringify(updated)); // 👈 save on toggle
      return updated;
    });
  };

  const steps = [
    {
      key: SetupStep.RESET_PASSWORD,
      label: t("quickSetup.steps.resetButton"),
      onClick: handleOpenResetPassword,
      status: resetPasswordStatus,
    },
    {
      key: SetupStep.PRODUCTS_SETUPS,
      label: t("quickSetup.steps.setUpProducts"),
      onClick:
        productsSetupStatus !== StepStatus.DONE ? handleOpenModal : undefined,
      status: productsSetupStatus,
    },
    {
      key: "company_profile",
      label: t("quickSetup.steps.companyProfile"),
      children: [
        {
          key: SetupStep.COMPANY_PROFILE_LOGO,
          label: t("quickSetup.steps.logo"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_LOGO),
          onClick: () => navigate("/settings/company-profile?tab=company"),
        },
        {
          key: SetupStep.COMPANY_PROFILE_HOURS,
          label: t("quickSetup.steps.hours"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_HOURS),
          onClick: () => navigate("/settings/company-profile?tab=hours"),
        },
        {
          key: SetupStep.COMPANY_PROFILE_STRIPE,
          label: t("quickSetup.steps.stripe"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_STRIPE),
        },
        {
          key: SetupStep.COMPANY_PROFILE_ADDRESSES,
          label: t("quickSetup.steps.addresses"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_ADDRESSES),
          onClick: () => navigate("/settings/company-profile?tab=addresses"),
        },
        {
          key: SetupStep.COMPANY_PROFILE_MAILING,
          label: t("quickSetup.steps.mailing"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_MAILING),
          onClick: () =>
            navigate("/settings/company-profile?tab=communication"),
        },
      ],
    },
    {
      key: "contacts",
      label: t("tabs.contacts"),
      children: [
        {
          key: SetupStep.CONTACTS_CLIENTS,
          label: t("tabs.customers"),
          status: getStepStatus(SetupStep.CONTACTS_CLIENTS),
          onClick: () => navigate("/customers"),
        },
        {
          key: SetupStep.CONTACTS_SUPPLIERS,
          label: t("tabs.suppliers"),
          status: getStepStatus(SetupStep.CONTACTS_SUPPLIERS),
          onClick: () => navigate("/suppliers"),
        },
      ],
    },
  ];

  const getAllGroupKeys = (items: any[]): string[] =>
    items.flatMap((item) =>
      "children" in item ? [item.key, ...getAllGroupKeys(item.children)] : []
    );

  const findNextStepLabel = (items: any[]): string | null => {
    for (const item of items) {
      if ("children" in item) {
        const childLabel = findNextStepLabel(item.children);
        if (childLabel) return childLabel;
      } else if (item.status !== StepStatus.DONE) {
        return item.label;
      }
    }
    return null;
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
    steps,
    toggleGroup,
    expandedGroups,
    setExpandedGroups,
    getAllGroupKeys,
    findNextStepLabel,
  };
};

export { useSetupGuideMenu };
