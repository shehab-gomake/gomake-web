import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { getDocumentDeliveryItemsApi } from "@/services/api-service/erp-service/document-deliveries-apis";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { DocumentDeliveryStatuses } from "./delivery-status-modal/use-delivery-status-modal";
import { toRgba } from "@/utils/helpers";
import { CanceledIcon, DeliveredIcon, PendingIcon } from "./icons";
import { CharacterDetails } from "@/widgets/quote-new/quote-table/row-details/character-details";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [documentItems, setDocumentItems] = useState<any>();
  const [editableQuantities, setEditableQuantities] = useState({});
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const onOpenDeliveryModal = () => {
    setOpenDeliveryModal(true);
  };

  const onCloseDeliveryModal = () => {
    setOpenDeliveryModal(false);
    setEditableQuantities({});
  };

  const _renderDeliveryStatus = (
    statusEnum: DocumentDeliveryStatuses,
    id: string
  ): React.ReactNode => {
    const icon = (() => {
      switch (statusEnum) {
        case DocumentDeliveryStatuses.FullyDelivered:
          return <DeliveredIcon />;
        case DocumentDeliveryStatuses.PartiallyDelivered:
          return <DeliveredIcon />;
        case DocumentDeliveryStatuses.Pasued:
          return <PendingIcon />;
        case DocumentDeliveryStatuses.Canceled:
          return <CanceledIcon />;
        case DocumentDeliveryStatuses.NotDelivered:
          return "❔";
        default:
          return "❔"; // Default icon
      }
    })();

    let statusColor = _renderDeliveryStatusColor(statusEnum);
    return (
      <span
        id={id}
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
        {/* {DocumentDeliveryStatuses[statusEnum]} */}
        {t(`sales.documentDeliveries.${DocumentDeliveryStatuses[statusEnum]}`)}
      </span>
    );
  };

  const _renderDeliveryStatusColor = (statusEnum: DocumentDeliveryStatuses) => {
    switch (statusEnum) {
      case DocumentDeliveryStatuses.NotDelivered:
        return "#667085";
      case DocumentDeliveryStatuses.PartiallyDelivered:
        return "#099250";
      case DocumentDeliveryStatuses.FullyDelivered:
        return "#099250";
      case DocumentDeliveryStatuses.Pasued:
        return "#FFD700";
      case DocumentDeliveryStatuses.Canceled:
        return "#f44336"; // Purple
      default:
        return "#808080"; // Gray
    }
  };

  const handleQuantityChange = (id, value) => {
    setEditableQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getDocumentDeliveryItems = async (documentType, documentId) => {
    const callBack = (res) => {
      if (res.success) {
        setDocumentItems(res.data);
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

  const renderTableRows = useCallback(() => {
    return documentItems?.map((documentItem) => [
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
      <input
        type="number"
        key={`quantity-${documentItem?.id}`}
        value={editableQuantities[documentItem.id] || documentItem?.quantity}
        onChange={(e) => handleQuantityChange(documentItem.id, e.target.value)}
        style={{ width: "60px", textAlign: "center" }}
      />,
      _renderDeliveryStatus(documentItem?.deliveryStatus, documentItem?.id),
      documentItem?.agentName,
      documentItem?.number,
      documentItem?.notes,
    ]);
  }, [documentItems, editableQuantities, handleQuantityChange]);

  return {
    t,
    openDeliveryModal,
    onOpenDeliveryModal,
    onCloseDeliveryModal,
    getDocumentDeliveryItems,
    documentItems,
    _renderDeliveryStatusColor,
    renderTableRows,
    editableQuantities,
    setDocumentItems,
    setEditableQuantities,
  };
};

export { useDeliveryStatusButton };
