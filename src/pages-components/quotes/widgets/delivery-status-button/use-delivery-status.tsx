import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { FONT_FAMILY } from "@/utils/font-family";
import { DocumentDeliveryStatuses } from "./delivery-status-modal/use-delivery-status-modal";
import { toRgba } from "@/utils/helpers";
import {
  CanceledIcon,
  DeleteIcon,
  DeliveredIcon,
  NotDeliveredIcon,
  PendingIcon,
} from "./utils/icons";
import { CharacterDetails } from "@/widgets/quote-new/quote-table/row-details/character-details";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { getDocumentDeliveryItemsApi } from "@/services/api-service/document-deliveries/get-document-delivery-items";
import { IconButton } from "@mui/material";
import { CloseIcon } from "@/widgets/quote-new/receipts-table/Payment-methods-details/icons/close-icon";
import { useDateFormat } from "@/hooks/use-date-format";
import { removeDocumentDeliveryApi } from "@/services/api-service/document-deliveries/remove-document-delivery";
import { removeDocumentDeliveryItemApi } from "@/services/api-service/document-deliveries/remove-document-delivery-item";

const useDeliveryStatusButton = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertFaultDelete, alertSuccessDelete } =
    useSnackBar();
  const { getFormattedLocalDate } = useDateFormat();
  const [documentItems, setDocumentItems] = useState<any>();
  const [editableQuantities, setEditableQuantities] = useState({});
  const [openDeliveryModal, setOpenDeliveryModal] = useState<boolean>(false);
  const [anchorChangeEl, setAnchorChangeEl] = useState<null | HTMLElement>(
    null
  );

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

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

  const onOpenDeleteModal = (id: string) => {
    setOpenDeleteModal(true);
    setSelectedItem(id);
  };

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedItem("");
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
          return <DeliveredIcon color={"#f0ca45"} />;
        case DocumentDeliveryStatuses.Pasued:
          return <PendingIcon />;
        case DocumentDeliveryStatuses.Canceled:
          return <CanceledIcon />;
        case DocumentDeliveryStatuses.NotDelivered:
          return <NotDeliveredIcon />;
        default:
          return "❔"; // Default icon
      }
    })();

    let statusColor = _renderDeliveryStatusColor(statusEnum);
    return (
      <span
        id={id}
        data-status-enum={statusEnum}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: statusColor,
          backgroundColor: toRgba(statusColor, 0.1),
          ...FONT_FAMILY.Inter(500, 12),
          borderRadius: "var(--radius-full, 9999px)",
          border: `1px solid ${statusColor}`,
          padding: isRTL ? "1px 5px 1px 8px" : "1px 8px 1px 5px",
          textAlign: "center",
          gap: "4px",
          minWidth: "fit-content",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        {t(`sales.documentDeliveries.${DocumentDeliveryStatuses[statusEnum]}`)}
      </span>
    );
  };

  const _renderDeliveryStatusColor = (statusEnum: DocumentDeliveryStatuses) => {
    switch (statusEnum) {
      case DocumentDeliveryStatuses.NotDelivered:
        return "#e15656";
      case DocumentDeliveryStatuses.PartiallyDelivered:
        return "#f0ca45";
      case DocumentDeliveryStatuses.FullyDelivered:
        return "#66d671";
      case DocumentDeliveryStatuses.Pasued:
        return "#FFD700";
      case DocumentDeliveryStatuses.Canceled:
        return "#f44336";
      default:
        return "#808080";
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

  const removeDocumentDeliveryItem = async (documentDItemId) => {
    const callBack = (res) => {
      if (res.success) {
        setDocumentItems(res.data);
        alertSuccessDelete();
      } else {
        alertFaultDelete();
      }
    };

    await removeDocumentDeliveryItemApi(callApi, callBack, {
      documentDItemId,
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
    setSelectedItemDetails(documentItem);
  };

  const handleCloseDetails = () => {
    setAnchorEl(null);
  };

  const RecipientDetail = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <Typography style={{ marginTop: "8px", color: "black" }}>
      <span style={{ ...FONT_FAMILY.Inter(600, 15) }}>{label}</span>
      <div
        style={{
          marginTop: "6px",
          color: "gray",
          lineHeight: "24px",
          ...FONT_FAMILY.Inter(400, 15),
        }}
      >
        {value || "N/A"}
      </div>
    </Typography>
  );

  const renderPopover = () =>
    open && (
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
          <RecipientDetail
            label={t("sales.documentDeliveries.recipientName")}
            value={selectedItemDetails?.contactName}
          />
          <RecipientDetail
            label={t("sales.documentDeliveries.recipientMail")}
            value={selectedItemDetails?.contactEmail}
          />
          <RecipientDetail
            label={t("sales.documentDeliveries.recipientNumber")}
            value={selectedItemDetails?.contactPhone}
          />
        </div>
      </Popover>
    );

  const renderTableRows = useCallback(() => {
    return documentItems?.map((documentItem) => {
      const {
        deliveryStatus,
        id,
        code,
        quantity,
        signImage,
        signedAt,
        contactName,
        contactEmail,
        contactPhone,
        deliveredQuantity,
      } = documentItem || {};

      const isDeliveredItem =
        deliveryStatus === DocumentDeliveryStatuses.FullyDelivered ||
        deliveryStatus === DocumentDeliveryStatuses.PartiallyDelivered;

      return [
        <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
          #{code}
        </span>,
        documentItem?.productName,
        <CharacterDetails
          details={documentItem?.details}
          showLessHeightFit={true}
          canUpdate={false}
        />,
        isDeliveredItem ? (
          `${deliveredQuantity}/${quantity}`
        ) : (
          <input
            type="number"
            key={`quantity-${id}`}
            value={editableQuantities[id] || quantity}
            disabled={isDeliveredItem}
            onChange={(e) => handleQuantityChange(id, e.target.value)}
            style={{
              width: "70px",
              textAlign: "center",
              border: "none",
              height: "25px",
              outline: "none",
            }}
          />
        ),
        _renderDeliveryStatus(deliveryStatus, id),
        <img src={signImage} style={{ width: "80px", maxHeight: "40px" }} />,
        signedAt && getFormattedLocalDate(signedAt),
        isDeliveredItem ? (
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
              contactName || "N/A"
            }, `}
            {`${t("sales.documentDeliveries.recipientMail")}: ${
              contactEmail || "N/A"
            }, `}
            {`${t("sales.documentDeliveries.recipientNumber")}: ${
              contactPhone || "N/A"
            }`}
          </span>
        ) : null,
        renderPopover(),
        isDeliveredItem && (
          <IconButton
            key={`delete-${id}`}
            onClick={() => onOpenDeleteModal(id)}
          >
            <DeleteIcon />
          </IconButton>
        ),
        "",
      ];
    });
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
    onCloseDeleteModal,
    selectedItem,
    removeDocumentDeliveryItem,
    openDeleteModal,
  };
};

export { useDeliveryStatusButton };
