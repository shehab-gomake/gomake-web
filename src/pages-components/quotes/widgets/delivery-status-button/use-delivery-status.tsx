import { useTranslation } from "react-i18next";
import { useState } from "react";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const onOpenDeliveryModal = () => {
    setOpenDeliveryModal(true);
  };

  const onCloseDeliveryModal = () => {
    setOpenDeliveryModal(false);
  };

  return {
    t,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
  };
};

export { useDeliveryStatusButton };
