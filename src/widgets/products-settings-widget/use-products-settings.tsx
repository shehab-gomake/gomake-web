import { useGomakeRouter } from "@/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useProductsSettings = () => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  const tabs = [
    {
      name: t("settings.productManagement"),
    },
    {
      name: t("settings.shipmentsSetting"),
    },
    {
      name: t("settings.pricingSetting"),
    },
  ];

  return { tabs, value, navigate, handleChange, setValue, t };
};

export { useProductsSettings };
