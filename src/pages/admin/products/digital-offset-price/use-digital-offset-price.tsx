import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { DoneIcon } from "./icons/done";
import { useState } from "react";
import { PricingIcon } from "./icons/pricing";
import { FinishingIcon } from "./icons/finishing";

const useDigitalOffsetPrice = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("customer_details");
  const tabs = [
    {
      key: "customer_details",
      name: "customer details",
      icon: <DoneIcon />,
      activeIcon: <DoneIcon />,
      onclick: () => setActiveTab("customer_details"),
    },
    {
      key: "printing_details",
      name: "printing details",
      icon: <DoneIcon />,
      activeIcon: <DoneIcon />,
      onclick: () => setActiveTab("printing_details"),
    },
    {
      key: "finishing",
      name: "Finishing",
      icon: <FinishingIcon />,
      activeIcon: <DoneIcon />,
      onclick: () => setActiveTab("finishing"),
    },
    {
      key: "pricing",
      name: "Pricing",
      icon: <PricingIcon />,
      activeIcon: <DoneIcon />,
      onclick: () => setActiveTab("pricing"),
    },
  ];
  return { t, tabs };
};

export { useDigitalOffsetPrice };
