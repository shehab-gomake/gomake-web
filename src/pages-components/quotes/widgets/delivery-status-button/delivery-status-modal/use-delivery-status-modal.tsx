import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { DeliveryStateDetails } from "../interfaces";
import { FONT_FAMILY } from "@/utils/font-family";
import { DeliveredIcon, PendingIcon, CanceledIcon } from "../icons";
import { toRgba } from "@/utils/helpers";

enum DeliveryStatus {
  DELIVERED = "Delivered",
  PENDING = "Pending",
  SHIPPED = "Shipped",
  CANCELED = "Canceled",
}

const useDeliveryStatusModal = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";

  const [client, setClient] = useState();

  const _renderDeliveryStatus = (
    statusEnum: DeliveryStatus,
    statusColor: string
  ): React.ReactNode => {
    const icon = (() => {
      switch (statusEnum) {
        case DeliveryStatus.DELIVERED:
          return <DeliveredIcon />; // Delivered icon
        case DeliveryStatus.PENDING:
          return <PendingIcon />; // Pending icon
        case DeliveryStatus.CANCELED:
          return <CanceledIcon />; // Shipped icon
        default:
          return "❔"; // Default icon
      }
    })();

    return (
      <span
        style={{
          display: "flex",
          color: statusColor,
          backgroundColor: toRgba(statusColor, 0.1),
          ...FONT_FAMILY.Inter(500, 12),
          alignItems: "center",
          borderRadius: "var(--radius-full, 9999px)",
          border: `1px solid ${statusColor}`,
          width: "fit-content",
          padding: isRTL ? "0px 5px 0px 8px" : "0px 8px 0px 5px",
          gap: "4px",
        }}
      >
        {icon} {statusEnum}
      </span>
    );
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

  const mockRows: React.ReactNode[][] = [
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #12345
      </span>, // Item code
      "Item 1", // Item name
      "This is item 1", // Description
      "2024-12-05", // Date
      10, // Quantity
      // "Delivered", // Delivery status

      _renderDeliveryStatus(DeliveryStatus.DELIVERED, "#17B26A"), // Delivery status

      "John Doe", // Signature
      "Delivered on time", // Delivery details
      "View Details", // Action
    ],
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #67890
      </span>, // Item code
      ,
      "Item 2", // Item name
      "This is item 2", // Description
      "2024-12-06", // Date
      5, // Quantity
      // "Pending", // Delivery status

      _renderDeliveryStatus(DeliveryStatus.CANCELED, "#667085"), // Delivery status

      "-", // Signature
      "Pending delivery", // Delivery details
      "Track", // Action
    ],
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #11223
      </span>, // Item code
      ,
      "Item 3", // Item name
      "This is item 3", // Description
      "2024-12-07", // Date
      8, // Quantity
      // "Shipped", // Delivery status
      _renderDeliveryStatus(DeliveryStatus.PENDING, "#F04438"), // Delivery status

      "-", // Signature
      "Shipped but not yet delivered", // Delivery details
      "View Details", // Action
    ],
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

  return {
    t,
    dir,
    tableHeaders,
    handleChangeDeliveryInputs,
    deliveryState,
    setDeliveryState,
    initialDeliveryState,
    mockRows,
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
  };
};

export { useDeliveryStatusModal };
