import { Permissions } from "@/components/CheckPermission/enum";
import { useGomakeRouter } from "@/hooks";
import { permissionsState } from "@/store/permissions";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useProductsSettings = () => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [permissions, setPermissions] = useRecoilState(permissionsState);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  const tabs = [
    permissions && permissions[Permissions.SHOW_PRODUCT_MANAGMENT] &&  {
      name: t("settings.productManagement"),
    },
    permissions && permissions[Permissions.SHOW_SHIPMENT] &&
    {
      name: t("settings.shipmentsSetting"),
    },
    permissions && permissions[Permissions.SHOW_PRICING] &&
    {
      name: t("settings.pricingSetting"),
    },
  ];

  return { tabs, value, navigate, handleChange, setValue, t };
};

export { useProductsSettings };
