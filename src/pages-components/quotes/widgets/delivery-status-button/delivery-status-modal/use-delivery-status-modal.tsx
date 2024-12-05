import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useMemo, useState } from "react";
import { DeliveryStateDetails } from "../interfaces";

const useDeliveryStatusModal = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRtl = dir === "rtl";

  const [client, setClient] = useState();
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
      "12345", // Item code
      "Item 1", // Item name
      "This is item 1", // Description
      "2024-12-05", // Date
      10, // Quantity
      "Delivered", // Delivery status
      "John Doe", // Signature
      "Delivered on time", // Delivery details
      "View Details", // Action
    ],
    [
      "67890", // Item code
      "Item 2", // Item name
      "This is item 2", // Description
      "2024-12-06", // Date
      5, // Quantity
      "Pending", // Delivery status
      "-", // Signature
      "Pending delivery", // Delivery details
      "Track", // Action
    ],
    [
      "11223", // Item code
      "Item 3", // Item name
      "This is item 3", // Description
      "2024-12-07", // Date
      8, // Quantity
      "Shipped", // Delivery status
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
  };
};

export { useDeliveryStatusModal };
