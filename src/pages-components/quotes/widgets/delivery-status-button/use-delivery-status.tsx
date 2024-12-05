import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";

const useDeliveryStatusModal = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccess, alertFault } = useSnackBar();
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const onOpenDeliveryModal = () => {
    setOpenDeliveryModal(true);
  };

  const onCloseDeliveryModal = () => {
    setOpenDeliveryModal(false);
  };

  const tableHeaders = [
    t("Item code"),
    t("Item name"),
    t("Description"),
    t("Date"),
    t("Quantity"),
    t("Delivery status"),
    t("Signature"),
    t("Delivery details"),
    t("Action"),
  ];

  return {
    t,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,

    tableHeaders,
  };
};

export { useDeliveryStatusModal };
