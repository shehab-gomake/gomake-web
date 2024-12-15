import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getDocumentDeliveryItemsApi } from "@/services/api-service/erp-service/document-deliveries-apis";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { DeliveryStatus } from "./delivery-status-modal/use-delivery-status-modal";
import { toRgba } from "@/utils/helpers";
import { CanceledIcon, DeliveredIcon, PendingIcon } from "./icons";
import parse from "html-react-parser";
import { CharacterDetails } from "@/widgets/quote-new/quote-table/row-details/character-details";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [documentItems, setDocumentItems] = useState<any>();

  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const onOpenDeliveryModal = () => {
    setOpenDeliveryModal(true);
  };

  const onCloseDeliveryModal = () => {
    setOpenDeliveryModal(false);
  };

  const _renderDeliveryStatus = (
    statusEnum: DeliveryStatus,
    statusColor: string,
    id: string,
    isSelected?: boolean
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
        id={id}
        data-is-selected={isSelected} // Use a `data-*` attribute
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: statusColor,
          backgroundColor: toRgba(statusColor, 0.1),
          ...FONT_FAMILY.Inter(500, 12),
          borderRadius: "var(--radius-full, 9999px)",
          border: `1px solid ${statusColor}`,
          padding: isRTL ? "0px 5px 0px 8px" : "0px 8px 0px 5px",
          textAlign: "center",
          gap: "4px",
        }}
      >
        {icon}
        {statusEnum}
      </span>
    );
  };

  const getDocumentDeliveryItems = async (documentType, documentId) => {
    const callBack = (res) => {
      if (res.success) {
        const mapDocumentDeliveryItems = res?.data?.map((documentItem: any) => [
          <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
            #{documentItem?.code}
          </span>,
          documentItem?.productName,
          <CharacterDetails
            details={documentItem?.details}
            showLessHeightFit={true}
            canUpdate={false}
          />,
          "-",
          documentItem?.quantity,
          _renderDeliveryStatus(
            DeliveryStatus.DELIVERED,
            "#17B26A",
            documentItem?.id,
            documentItem?.isSelected
          ),
          documentItem?.agentName,
          documentItem?.number,
          documentItem?.notes,
        ]);

        setDocumentItems(mapDocumentDeliveryItems);
        onOpenDeliveryModal();
      } else {
        alertFaultGetData();
      }
    };

    await getDocumentDeliveryItemsApi(callApi, callBack, {
      documentType,
      documentId,
    });
  };

  return {
    t,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
    getDocumentDeliveryItems,
    documentItems,
  };
};

export { useDeliveryStatusButton };
