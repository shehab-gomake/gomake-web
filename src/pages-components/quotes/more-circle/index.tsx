import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import Link from "next/link";
import { DOCUMENT_TYPE } from "../enums";

const MoreMenuWidget = ({
  quote,
  documentType,
  onClickPdf,
  onClickDuplicate,
  onClickLoggers,
  onClickOpenIrrelevantModal,
  onClickOpenPriceModal,
  onClickOpenDeliveryTimeModal,
  onClickOpenModal,
  onClickSendPayment,
  onClickOpenCloseOrderModal,
  onClickOpenCloseOrderNotesModal,
  onClickMakePayment,
  onClickCloseAndTrack,
  onClickOpenPrintPDFModal,
  onOpenCancelReceiptModal,
  onOpenCancelReceiptModalRefund,
  onClickOpenChangeProductionStatusModal,
  onClickPauseOrResume,
  onOpenDuplicateModal,
  onClickStartProduction,
  onClickReopenDocument,
  onClickEditQuote,
  onClickOpenRemoveDraftModal,
  handleGetTaxConfirmNo,
  onClickOpenMoveOrderToReadyModal,
  onOpenPackagesModal,
  onClickSendToCustomerEmail,
  onClickSendToCustomerSMS,
  onClickSendToCustomerWhatsApp,
  onClickSendPaymentEmail,
  onClickSendPaymentSMS,
  onClickSendPaymentWhatsApp,
  onClickOpenInventoryIntakeModal,
  onClickUndoDocumentIntake,
  onClickToggleOrderLock,
  onClickOpenUploadFilesModal,
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { getMenuList } = useMoreCircle();
  const menuList = getMenuList({
    t,
    quote,
    documentType,
    onClickPdf,
    onClickDuplicate,
    onClickLoggers,
    onClickOpenIrrelevantModal,
    onClickOpenPriceModal,
    onClickOpenDeliveryTimeModal,
    onClickOpenModal,
    onClickSendPayment,
    onClickOpenCloseOrderModal,
    onClickOpenCloseOrderNotesModal,
    onClickMakePayment,
    onClickCloseAndTrack,
    onClickOpenPrintPDFModal,
    onOpenCancelReceiptModal,
    onOpenCancelReceiptModalRefund,
    onClickOpenChangeProductionStatusModal,
    onClickPauseOrResume,
    onOpenDuplicateModal,
    onClickStartProduction,
    onClickReopenDocument,
    onClickEditQuote,
    onClickOpenRemoveDraftModal,
    handleGetTaxConfirmNo,
    onClickOpenMoveOrderToReadyModal,
    onOpenPackagesModal,
    onClickOpenInventoryIntakeModal,
    onClickSendToCustomerEmail,
    onClickSendToCustomerSMS,
    onClickSendToCustomerWhatsApp,
    onClickSendPaymentEmail,
    onClickSendPaymentSMS,
    onClickSendPaymentWhatsApp,
    onClickUndoDocumentIntake,
    onClickToggleOrderLock,
    onClickOpenUploadFilesModal,
    classes,
  });

  // For purchase orders, check if we should show the menu even if isEditable is false
  // Show menu if: can delete OR has items that can be undone (undo intake)
  const isPurchaseOrder = documentType === DOCUMENT_TYPE.purchaseOrder;
  const hasIntakedItems = isPurchaseOrder && quote?.documentItems?.some((item: any) => item.isIntake === true);
  const isCanceledPurchaseOrder = quote?.statusTitleText?.includes("PurchaseOrderCanceled") || quote?.statusTitleText?.includes("Canceled");
  const canDelete = isPurchaseOrder && !isCanceledPurchaseOrder && quote?.isDeletable;
  const shouldShowMenuForPurchaseOrder = isPurchaseOrder && (hasIntakedItems || canDelete);

  // Filter menu items - show items that meet their condition OR are special purchase order items
  const filteredMenuList = menuList.filter((item: any) => {
    if (item?.condition) return true;
    // For purchase orders, always show delete and undo intake options even if other conditions fail
    if (shouldShowMenuForPurchaseOrder) {
      const itemName = typeof item?.name === 'string' ? item.name : item?.name;
      if (itemName === t("sales.quote.cancel") ||
        itemName === t("sales.purchaseOrder.undoDocumentIntake") ||
        itemName === "Undo Document Intake") {
        return true;
      }
    }
    return false;
  });

  // Don't render menu if no items to show
  if (filteredMenuList.length === 0) {
    return null;
  }

  return (
    <OptionsButton>
      {(closeMenu: any) =>
        filteredMenuList.map((item: any, index: number) => {
          const itemName = typeof item?.name === 'string' ? item.name : item?.name;
          const shouldShow = item?.condition ||
            (shouldShowMenuForPurchaseOrder &&
              (itemName === t("sales.quote.cancel") ||
                itemName === t("sales.purchaseOrder.undoDocumentIntake") ||
                itemName === "Undo Document Intake"));

          return shouldShow ? (
            item?.component ? (
              // Render custom component (e.g., submenu) with close handler
              <div key={index}>
                {typeof item.component === "function"
                  ? item.component(closeMenu)
                  : item.component}
              </div>
            ) : (
              <MenuItem
                style={classes.menuRowStyle}
                key={index}
                onClick={item.onClick}
              >
                {item?.isLink ? (
                  <Link
                    href={item.href || "#"}
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      gap: 8,
                    }}
                  >
                    {item.icon}
                    <span style={classes.rowTextStyle}>{item.name}</span>
                  </Link>
                ) : (
                  <>
                    {item.icon}
                    <div style={classes.rowTextStyle}>{item.name}</div>
                  </>
                )}
              </MenuItem>
            )
          ) : null;
        })
      }
    </OptionsButton>
  );
};

export { MoreMenuWidget };
