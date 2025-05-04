import { useTranslation } from "react-i18next";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getPrintHouseProductsSetupFormApi } from "@/services/api-service/quick-setup-menu/set-up-products-api";
import { ProductsSetupData } from "./interfaces";

const useQuickSetup = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const ActionsModal = useModal();
  const ResetPasswordModalControl = useModal();

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

  return {
    t,
    ActionsModal,
    handleOpenModal,
    initialSetupData,
    setInitialSetupData,
    ResetPasswordModalControl,
  };
};

export { useQuickSetup };
