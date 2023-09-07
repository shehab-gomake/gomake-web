import { useGomakeRouter } from "@/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useProductsSettings = () => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("Product management");
  const tabs = [
    {
      name: "Product management",
    },
    {
      name: "Shipments setting",
    },
    {
      name: "Pricing setting",
    },
  ];

  return { tabs, activeTab, setActiveTab, navigate, t };
};

export { useProductsSettings };
