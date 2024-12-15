import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { DeliveryStateDetails } from "../interfaces";
import { FONT_FAMILY } from "@/utils/font-family";
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

  const [client, setClient] = useState();
  const [selectedItems, setSelectedItems] = useState<
    { itemId: string; deliveredQuantity: number }[]
  >([]);

  const tableHeaders = [
    t("sales.documentDeliveries.itemCode"),
    t("sales.documentDeliveries.itemName"),
    t("sales.documentDeliveries.description"),
    t("sales.documentDeliveries.date"),
    t("sales.documentDeliveries.quantity"),
    t("sales.documentDeliveries.deliveryStatus"),
    t("sales.documentDeliveries.signature"),
    t("sales.documentDeliveries.deliveryDetailes"),
    // t("Action"),
  ];

  const options = useMemo(
    () => [
      { label: "lama", value: 1 },
      { label: "lama2", value: 2 },
    ],
    []
  );

  const initialDeliveryState: DeliveryStateDetails = {
    deliveryDate: new Date(),
    recipientName: "",
    recipientNumber: "",
    recipientMail: "",
  };

  const [deliveryState, setDeliveryState] =
    useState<DeliveryStateDetails>(initialDeliveryState);

  const handleChangeDeliveryInputs = (key, value) => {
    setDeliveryState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = 50;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Limit visible pages
  const getVisiblePages = (current: number, total: number) => {
    const visiblePages: (number | string)[] = [];
    const range = 3;

    // Add the first three pages
    for (let i = 1; i <= range; i++) {
      if (i <= total) visiblePages.push(i);
    }

    // Add ellipsis after the first range
    if (current > range + 1) visiblePages.push("...");

    // Add the middle range around the current page
    const start = Math.max(range + 1, current - 1);
    const end = Math.min(total - range, current + 1);

    for (let i = start; i <= end; i++) {
      if (!visiblePages.includes(i)) visiblePages.push(i);
    }

    // Add ellipsis before the last range
    if (current < total - range) visiblePages.push("...");

    // Add the last three pages
    for (let i = total - range + 1; i <= total; i++) {
      if (i > range && !visiblePages.includes(i)) visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages(page, totalPages);

  // for signature modal
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const openSignatureModal = () => setIsSignatureModalOpen(true);
  const closeSignatureModal = () => setIsSignatureModalOpen(false);

  // const handleSelectionChange = (selectedRows: Set<number>) => {
  //   const selectedIdsNew = Array.from(selectedRows).map((index) =>
  //     extractDeliveryStatusRowId(documentItems[index][5])
  //   );
  //   console.log("Selected IDs: ", selectedIdsNew);
  // };

  const handleSelectionChange = (selectedRows: Set<number>) => {
    const selectedData = Array.from(selectedRows).map((index) => {
      const deliveryStatusElement = documentItems[index][5];
      const deliveredQuantityElement = documentItems[index][4];

      return {
        itemId: extractDeliveryStatusRowId(deliveryStatusElement),
        deliveredQuantity: deliveredQuantityElement,
      };
    });

    setSelectedItems(selectedData);
    console.log("Selected Data: ", selectedData);
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
    page,
    totalPages,
    handlePageClick,
    handleNextPage,
    handlePrevPage,
    visiblePages,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    extractDeliveryStatus,
    handleSelectionChange,
    selectedItems,
  };
};

export { useDeliveryStatusModal };
