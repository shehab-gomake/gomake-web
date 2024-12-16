import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { DocumentDeliveryStatuses } from "./delivery-status-modal/use-delivery-status-modal";
import { toRgba } from "@/utils/helpers";
import { CanceledIcon, DeliveredIcon, PendingIcon } from "./icons";
import { CharacterDetails } from "@/widgets/quote-new/quote-table/row-details/character-details";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { getDocumentDeliveryItemsApi } from "@/services/api-service/document-deliveries/get-document-delivery-items";
import { IconButton } from "@mui/material";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData } = useSnackBar();
  const [documentItems, setDocumentItems] = useState<any>();
  const [editableQuantities, setEditableQuantities] = useState({});
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const [anchorChangeEl, setAnchorChangeEl] = useState<null | HTMLElement>(
    null
  );

  const handleMenuClick = (event) => {
    setAnchorChangeEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorChangeEl(null);
  };

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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>({});
  const open = Boolean(anchorEl);

  const handleDetailsClick = (
    event: React.MouseEvent<HTMLSpanElement>,
    documentItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemDetails(documentItem?.deliveryDetails);
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
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
      <input
        type="number"
        key={`quantity-${documentItem?.id}`}
        value={editableQuantities[documentItem.id] || documentItem?.quantity}
        onChange={(e) => handleQuantityChange(documentItem.id, e.target.value)}
        style={{
          width: "70px",
          textAlign: "center",
          border: "none",
          height: "25px",
          outline: "none",
        }}
      />,
      _renderDeliveryStatus(documentItem?.deliveryStatus, documentItem?.id),
      documentItem?.signImage,
      documentItem?.signedAt,
      <span
        onClick={(e) => handleDetailsClick(e, documentItem)}
        style={{
          cursor: "pointer",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          maxWidth: "200px",
          padding: "0px 20px",
        }}
      >
        {`${t("sales.documentDeliveries.recipientName")}: ${
          selectedItemDetails?.contactName || "N/A"
        }, `}
        {`${t("sales.documentDeliveries.recipientMail")}: ${
          selectedItemDetails?.contactEmail || "N/A"
        }, `}
        {`${t("sales.documentDeliveries.recipientNumber")}: ${
          selectedItemDetails?.contactPhone || "N/A"
        }`}
      </span>,
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseDetails}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            boxShadow:
              "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
            padding: "16px",
            minWidth: "200px",
          },
        }}
      >
        <IconButton
          onClick={handleCloseDetails}
          style={{
            position: "absolute",
            top: 8,
            ...(isRTL ? { left: 8 } : { right: 8 }),
            backgroundColor: "white",
          }}
        >
          <CloseIcon width={20} height={20} />
        </IconButton>

        <div>
          <Typography>
            <span style={{ ...FONT_FAMILY.Inter(600, 15) }}>
              {/* Recipient’s name */}
              {t("sales.documentDeliveries.recipientName")}
            </span>
            <div
              style={{
                marginTop: "6px",
                color: "gray",
                lineHeight: "24px",
                ...FONT_FAMILY.Inter(400, 15),
              }}
            >
              {selectedItemDetails?.contactName || "N/A"}
              {/* Lama anbtawe */}
            </div>
          </Typography>
          <Typography style={{ marginTop: "8px", color: "black" }}>
            <span style={{ ...FONT_FAMILY.Inter(600, 15) }}>
              {/* Recipient’s email */}
              {t("sales.documentDeliveries.recipientMail")}
            </span>
            <div
              style={{
                marginTop: "6px",
                color: "gray",
                lineHeight: "24px",
                ...FONT_FAMILY.Inter(400, 15),
              }}
            >
              {/* {selectedItemDetails?.contactEmail || "N/A" } */}
              lama@gomake.net
            </div>
          </Typography>
          <Typography style={{ marginTop: "8px", color: "black" }}>
            <span style={{ ...FONT_FAMILY.Inter(600, 15) }}>
              {/* Recipient’s mobile */}
              {t("sales.documentDeliveries.recipientName")}
            </span>
            <div
              style={{
                marginTop: "6px",
                color: "gray",
                lineHeight: "24px",
                ...FONT_FAMILY.Inter(400, 15),
              }}
            >
              {/* {selectedItemDetails?.contactPhone || "N/A"} */}
              0545568623
            </div>
          </Typography>
        </div>
      </Popover>,
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
    handleMenuClose,
    handleMenuClick,
    anchorChangeEl,
  };
};

export { useDeliveryStatusButton };
