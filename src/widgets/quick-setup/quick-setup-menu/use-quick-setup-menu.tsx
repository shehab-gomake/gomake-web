import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { useTranslation } from "react-i18next";
import {
  printHouseSetupStepsState,
  setupGuideExpandedState,
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
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useSetupGuideMenu = ({
  handleOpenModal,
  handleOpenResetPassword,
  updatePrintHouseSetupSteps,
  handleOpenDemoVideo,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isOpen = useRecoilValue(setupGuideOpenState);
  const [isExpanded, setIsExpanded] = useRecoilState(setupGuideExpandedState);
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

  useEffect(() => {
    const savedExpand = getItem("gomake_setupGuideExpanded");
    setIsExpanded(savedExpand === "true");
  }, []);

  const printHouseSetupSteps = useRecoilValue<SetupStepItem[]>(
    printHouseSetupStepsState
  );

  const handleToggleVerifyBusiness = () => {
    setOpenVerifyBusiness((prev) => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      setItem("gomake_setupGuideExpanded", String(next));
      return next;
    });
  };

  const totalSteps = printHouseSetupSteps.length;

  const completedSteps = printHouseSetupSteps.filter(
    (step) => step.status === StepStatus.DONE
  ).length;

  const progressValue =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const machinesSetupStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.SETUP_YOUR_MACHINES
  )?.status;

  const materialsSetupStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.SETUP_YOUR_MATERIALS
  )?.status;

  const resetPasswordStatus = printHouseSetupSteps?.find(
    (step) => step?.step === SetupStep.RESET_PASSWORD
  )?.status;

  const renderStepStatusIcon = (status?: StepStatus) => {
    switch (status) {
      case StepStatus.DONE:
        return (
          <CheckCircleIcon
            sx={{ fontSize: "16px", color: primaryColor(300) }}
          />
        );
      case StepStatus.IN_PROGRESS:
        return (
          <DonutLargeRoundedIcon
            sx={{ color: primaryColor(500), fontSize: "16px" }}
          />
        );
      case StepStatus.NOT_YET:
      default:
        return (
          <RadioButtonUncheckedIcon
            sx={{ fontSize: "16px" }}
            color="disabled"
          />
        );
    }
  };

  const getStepStatus = (step: SetupStep): StepStatus =>
    printHouseSetupSteps.find((s) => s.step === step)?.status ??
    StepStatus.NOT_YET;

  const steps = [
    {
      key: SetupStep.RESET_PASSWORD,
      label: t("quickSetup.steps.resetButton"),
      onClick: handleOpenResetPassword,
      status: resetPasswordStatus,
    },
    {
      key: SetupStep.SETUP_YOUR_MACHINES,
      label: t("quickSetup.steps.setUpYourMachines"),
      onClick:
        machinesSetupStatus !== StepStatus.DONE
          ? () => navigate("/onboarding-setup")
          : undefined,
      status: machinesSetupStatus,
    },
    {
      key: SetupStep.SETUP_YOUR_MATERIALS,
      label: t("quickSetup.steps.setUpYourMaterials"),
      onClick:
        materialsSetupStatus !== StepStatus.DONE
          ? () => navigate("/materials-setup")
          : undefined,
      status: materialsSetupStatus,
    },
    {
      key: "company_profile",
      label: t("quickSetup.steps.companyProfile"),
      children: [
        {
          key: SetupStep.COMPANY_PROFILE_LOGO,
          label: t("quickSetup.steps.logo"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_LOGO),
          onClick: () => {
            if (
              getStepStatus(SetupStep.COMPANY_PROFILE_LOGO) ===
              StepStatus.NOT_YET
            ) {
              updatePrintHouseSetupSteps(SetupStep.COMPANY_PROFILE_LOGO);
            }
            navigate("/settings/company-profile?tab=company");
          },
        },
        {
          key: SetupStep.COMPANY_PROFILE_HOURS,
          label: t("quickSetup.steps.hours"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_HOURS),
          onClick: () => {
            if (
              getStepStatus(SetupStep.COMPANY_PROFILE_HOURS) ===
              StepStatus.NOT_YET
            ) {
              updatePrintHouseSetupSteps(SetupStep.COMPANY_PROFILE_HOURS);
            }
            navigate("/settings/company-profile?tab=hours");
          },
        },
        {
          key: SetupStep.COMPANY_PROFILE_STRIPE,
          label: t("quickSetup.steps.stripe"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_STRIPE),
          onClick: () => {
            if (
              getStepStatus(SetupStep.COMPANY_PROFILE_STRIPE) ===
              StepStatus.NOT_YET
            ) {
              updatePrintHouseSetupSteps(SetupStep.COMPANY_PROFILE_STRIPE);
            }
            navigate("/settings/company-profile?tab=financial");
          },
        },
        {
          key: SetupStep.COMPANY_PROFILE_ADDRESSES,
          label: t("quickSetup.steps.addresses"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_ADDRESSES),
          onClick: () => {
            if (
              getStepStatus(SetupStep.COMPANY_PROFILE_ADDRESSES) ===
              StepStatus.NOT_YET
            ) {
              updatePrintHouseSetupSteps(SetupStep.COMPANY_PROFILE_ADDRESSES);
            }
            navigate("/settings/company-profile?tab=addresses");
          },
        },
        {
          key: SetupStep.COMPANY_PROFILE_MAILING,
          label: t("quickSetup.steps.mailing"),
          status: getStepStatus(SetupStep.COMPANY_PROFILE_MAILING),
          onClick: () => {
            if (
              getStepStatus(SetupStep.COMPANY_PROFILE_MAILING) ===
              StepStatus.NOT_YET
            ) {
              updatePrintHouseSetupSteps(SetupStep.COMPANY_PROFILE_MAILING);
            }
            navigate("/settings/company-profile?tab=communication");
          },
        },
      ],
    },
    {
      key: "contacts",
      label: t("tabs.contacts"),
      children: [
        {
          key: SetupStep.CONTACTS_CLIENTS,
          label: t("quickSetup.steps.addCustomer"),
          status: getStepStatus(SetupStep.CONTACTS_CLIENTS),
          onClick: () => {
            if (getStepStatus(SetupStep.CONTACTS_CLIENTS) !== StepStatus.DONE) {
              updatePrintHouseSetupSteps(
                SetupStep.CONTACTS_CLIENTS,
                StepStatus.IN_PROGRESS
              );
            }
            navigate("/customers");
          },
        },
        {
          key: SetupStep.CONTACTS_SUPPLIERS,
          label: t("quickSetup.steps.addSupplier"),
          status: getStepStatus(SetupStep.CONTACTS_SUPPLIERS),
          onClick: () => {
            if (
              getStepStatus(SetupStep.CONTACTS_SUPPLIERS) !== StepStatus.DONE
            ) {
              updatePrintHouseSetupSteps(
                SetupStep.CONTACTS_SUPPLIERS,
                StepStatus.IN_PROGRESS
              );
            }
            navigate("/suppliers");
          },
        },
      ],
    },
    {
      key: "help_center",
      label: t("quickSetup.steps.trainingAndTutorial"),
      children: [
        {
          key: SetupStep.HELP_CENTER_BASIC_WALKTHROUGH,
          label: t("quickSetup.steps.basicWalkthrough"),
          status: getStepStatus(SetupStep.HELP_CENTER_BASIC_WALKTHROUGH),
          onClick: () => {
            handleOpenDemoVideo();
            if (
              getStepStatus(SetupStep.HELP_CENTER_BASIC_WALKTHROUGH) !==
              StepStatus.DONE
            ) {
              updatePrintHouseSetupSteps(
                SetupStep.HELP_CENTER_BASIC_WALKTHROUGH,
                StepStatus.DONE
              );
            }
          },
        },
        {
          key: SetupStep.HELP_CENTER_KNOWLEDGE_BASE,
          label: t("quickSetup.steps.helpCenter"),
          status: getStepStatus(SetupStep.HELP_CENTER_KNOWLEDGE_BASE),
          onClick: () => {
            if (
              getStepStatus(SetupStep.HELP_CENTER_KNOWLEDGE_BASE) !==
              StepStatus.DONE
            ) {
              updatePrintHouseSetupSteps(
                SetupStep.HELP_CENTER_KNOWLEDGE_BASE,
                StepStatus.DONE
              );
            }
            window.open("https://gomake.document360.io", "_blank");
          },
        },
        {
          key: SetupStep.HELP_CENTER_CUSTOMER_SERVICE,
          label: t("quickSetup.steps.customerService"),
          status: getStepStatus(SetupStep.HELP_CENTER_CUSTOMER_SERVICE),
          onClick: () => {
            if (
              getStepStatus(SetupStep.HELP_CENTER_CUSTOMER_SERVICE) !==
              StepStatus.DONE
            ) {
              updatePrintHouseSetupSteps(
                SetupStep.HELP_CENTER_CUSTOMER_SERVICE,
                StepStatus.DONE
              );
            }
            navigate("/customer-service");
          },
        },
      ],
    },
  ];

  const getAllGroupKeys = (items: any[]): string[] =>
    items.flatMap((item) =>
      "children" in item ? [item.key, ...getAllGroupKeys(item.children)] : []
    );

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const stored = getItem("gomake_expandedGroups", true);
      if (stored) return stored;

      return getAllGroupKeys(steps).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as Record<string, boolean>);
    }
  );

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const updated = {
        ...prev,
        [groupKey]: !prev[groupKey],
      };
      localStorage.setItem("gomake_expandedGroups", JSON.stringify(updated));
      return updated;
    });
  };

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

  const findNextStep = (items: any[]): any | null => {
    for (const item of items) {
      if ("children" in item) {
        const nextChild = findNextStep(item.children);
        if (nextChild) return nextChild;
      } else if (item.status !== StepStatus.DONE) {
        return item;
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
    machinesSetupStatus,
    materialsSetupStatus,
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
    findNextStep,
  };
};

export { useSetupGuideMenu };
