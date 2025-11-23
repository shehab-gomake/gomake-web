import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OptionsButton } from "@/components/options-button/options-button";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import Link from "next/link";

const MoreMenuWidget = ({
  quote,
  documentType,
  onClickPdf,
  onClickDuplicate,
  onClickLoggers,
  onClickOpenIrrelevantModal,
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
  onClickOpenInventoryIntakeModal,
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
    classes,
  });

  return (
    <OptionsButton>
      {(closeMenu: any) => menuList.map((item: any, index: number) =>
        item?.condition ? (
          item?.component ? (
            // Render custom component (e.g., submenu) with close handler
            <div key={index}>{typeof item.component === 'function' ? item.component(closeMenu) : item.component}</div>
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
        ) : null
      )}
    </OptionsButton>
  );
};

export { MoreMenuWidget };
