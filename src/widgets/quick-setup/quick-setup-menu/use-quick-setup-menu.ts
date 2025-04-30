import { useState } from "react";
import { useRecoilValue } from "recoil";
import { setupGuideOpenState } from "@/store/setup-guide-state";
import { useTranslation } from "react-i18next";

const useSetupGuideMenu = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isOpen = useRecoilValue(setupGuideOpenState);
  const [isExpanded, setIsExpanded] = useState(true);
  const [openVerifyBusiness, setOpenVerifyBusiness] = useState(false);

  const handleToggleVerifyBusiness = () => {
    setOpenVerifyBusiness((prev) => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  /*******************Handle based backend********************/
  const completedSteps = 2;
  const totalSteps = 5;
  const progressValue = (completedSteps / totalSteps) * 100;

  const steps = [
    { title: "Set up products", completed: true },
    { title: "Test Connect", completed: false },
    { title: "Verify your business", completed: false },
  ];
  /******************* Handle based backend*******************/

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
  };
};

export { useSetupGuideMenu };
