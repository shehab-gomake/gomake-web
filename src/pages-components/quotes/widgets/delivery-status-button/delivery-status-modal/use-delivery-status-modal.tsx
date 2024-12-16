import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { DeliveryStateDetails } from "../interfaces";
import { useSnackBar } from "@/hooks";
import React from "react";

export enum DeliveryStatus {
  DELIVERED = "Delivered",
  PENDING = "Pending",
  SHIPPED = "Shipped",
  CANCELED = "Canceled",
}

export enum DocumentDeliveryStatuses {
  NotDelivered = 1,
  PartiallyDelivered,
  FullyDelivered,
  Canceled,
  Pasued,
}

const useDeliveryStatusModal = (documentItems) => {
  const { t } = useTranslation();
  const dir = t("direction");
  const { alertFault } = useSnackBar();
  const [client, setClient] = useState();
  const [selectedItems, setSelectedItems] = useState<
    { itemId: string; deliveredQuantity: number }[]
  >([]);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const initialDeliveryState: DeliveryStateDetails = {
    deliveryDate: new Date(),
    recipientName: "",
    recipientNumber: "",
    recipientMail: "",
  };
  const [deliveryState, setDeliveryState] =
    useState<DeliveryStateDetails>(initialDeliveryState);

  const tableHeaders = [
    t("sales.documentDeliveries.itemCode"),
    t("sales.documentDeliveries.itemName"),
    t("sales.documentDeliveries.description"),
    t("sales.documentDeliveries.quantity"),
    t("sales.documentDeliveries.deliveryStatus"),
    t("sales.documentDeliveries.signature"),
    t("sales.documentDeliveries.signedAt"),
    t("sales.documentDeliveries.deliveryDetailes"),
    "",
  ];

  const options = useMemo(
    () => [
      { label: "lama", value: 1 },
      { label: "lama2", value: 2 },
    ],
    []
  );

  const handleChangeDeliveryInputs = (key, value) => {
    setDeliveryState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // for signature modal

  const openSignatureModal = () => {
    if (Array.isArray(selectedItems) && selectedItems.length === 0) {
      alertFault("reports.pleaseSelectOneItem");
      return;
    }
    setIsSignatureModalOpen(true);
  };

  const closeSignatureModal = () => setIsSignatureModalOpen(false);

  const handleSelectionChange = (selectedRows: Set<number>) => {
    const selectedData = Array.from(selectedRows).map((index) => {
      const deliveryStatusElement = documentItems[index][5];
      const deliveredQuantityElement = documentItems[index][4]?.props?.value;

      return {
        itemId: extractDeliveryStatusRowId(deliveryStatusElement),
        deliveredQuantity: deliveredQuantityElement,
      };
    });

    setSelectedItems(selectedData);
  };

  //get the status
  const extractDeliveryStatus = (
    deliveryStatusElement: React.ReactNode
  ): string => {
    if (
      React.isValidElement(deliveryStatusElement) &&
      deliveryStatusElement.props?.children?.[1]
    ) {
      return deliveryStatusElement.props.children?.[1];
    }
    return "";
  };

  //get the id
  const extractDeliveryStatusRowId = (
    deliveryStatusElement: React.ReactNode
  ): string => {
    if (
      React.isValidElement(deliveryStatusElement) &&
      deliveryStatusElement.props?.id
    ) {
      return deliveryStatusElement.props?.id;
    }
    return "";
  };

  return {
    t,
    dir,
    tableHeaders,
    handleChangeDeliveryInputs,
    deliveryState,
    setDeliveryState,
    initialDeliveryState,
    options,
    client,
    setClient,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    extractDeliveryStatus,
    handleSelectionChange,
    selectedItems,
  };
};

export { useDeliveryStatusModal };
