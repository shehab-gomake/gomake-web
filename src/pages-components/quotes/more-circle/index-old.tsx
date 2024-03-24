import { MenuItem } from "@mui/material";
import { useMoreCircle } from "./use-more-circle";
import { useStyle } from "./style";
import { ConvertIcon } from "./icons/convert";
import { EditingIcon } from "./icons/editing";
import { useTranslation } from "react-i18next";
import { QUOTE_STATUSES } from "../enums";
import { PDFIcon } from "./icons/pdf";
import { OptionsButton } from "@/components/options-button/options-button";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { TickIcon } from "@/icons";
import { LoggerIcon } from "@/pages-components/admin/home/widgets/more-circle/icons/logger";

const MoreMenuWidget = ({ quote, documentType, onClickOpenModal, onClickPdf, onClickDuplicate, onClickLoggers }: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { user, navigate } = useMoreCircle();
  const documentPath = DOCUMENT_TYPE[documentType];
  const renderMenuItem = () => {
    if (documentType === DOCUMENT_TYPE.quote) {
      const isCreateStatus = quote?.documentStatus === QUOTE_STATUSES.Create;
      const isOpenStatus = quote?.documentStatus === QUOTE_STATUSES.Open;
      const isCurrentUser = quote?.userID === user?.id;

      if ((isCreateStatus && isCurrentUser) || isOpenStatus) {
        return (
          <MenuItem
            onClick={() =>
              isCreateStatus ? navigate(`/quote`) : onClickOpenModal(quote)
            }
          >
            <div style={classes.menuRowStyle}>
              <EditingIcon />
              <div style={classes.rowTextStyle}>{t("sales.quote.edit")}</div>
            </div>
          </MenuItem>
        );
      }
    }
    else if (documentType !== DOCUMENT_TYPE.quote) {
      return (
        <MenuItem onClick={() => navigate(`/${documentPath}?Id=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <EditingIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.edit")}</div>
          </div>
        </MenuItem>
      );
    }
    else {
      return <></>;

    }
  };

  const showNewDuplicate = documentType === DOCUMENT_TYPE.deliveryNote || documentType === DOCUMENT_TYPE.deliveryNoteRefund || documentType === DOCUMENT_TYPE.invoice || documentType === DOCUMENT_TYPE.invoiceRefund;

  return (
    <OptionsButton>
      <MenuItem onClick={onClickLoggers}>
        <div style={classes.menuRowStyle}>
          <LoggerIcon />
          <div style={classes.rowTextStyle}>{t("sales.quote.loggers")}</div>
        </div>
      </MenuItem>
      <MenuItem onClick={() => onClickPdf(quote?.id)}>
        <div style={classes.menuRowStyle}>
          <PDFIcon />
          <div style={classes.rowTextStyle}>{t("sales.quote.pdf")}</div>
        </div>
      </MenuItem>
      {
        (documentType === DOCUMENT_TYPE.order || documentType === DOCUMENT_TYPE.quote) && <MenuItem onClick={() => onClickDuplicate(quote?.id)}>
          <div style={classes.menuRowStyle}>
            <ConvertIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.duplicate")}</div>
          </div>
        </MenuItem>
      }
      {
        showNewDuplicate && <MenuItem onClick={() => navigate(`/${documentPath}?isNewCreation=true&documentToDuplicateId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <ConvertIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.duplicate")}</div>
          </div>
        </MenuItem>
      }
      {renderMenuItem()}
      {
        documentType === DOCUMENT_TYPE.order && <MenuItem onClick={() => navigate(`/deliveryNote?isNewCreation=true&orderId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.closeAsDeliveryNote")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.order && <MenuItem onClick={() => navigate(`/invoice?isNewCreation=true&orderId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.closeAsInvoice")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.deliveryNote && <MenuItem onClick={() => navigate(`/invoice?isNewCreation=true&deliveryNoteId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.closeAsInvoice")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.deliveryNote && <MenuItem onClick={() => navigate(`/deliveryNoteRefund?isNewCreation=true&documentId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.createDeliveryNoteRefund")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.invoice && <MenuItem onClick={() => navigate(`/invoiceRefund?isNewCreation=true&documentId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.createInvoiceRefund")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.purchaseInvoice && <MenuItem onClick={() => navigate(`/purchaseInvoiceRefund?isNewCreation=true&documentId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.createPurchaseInvoiceRefund")}</div>
          </div>
        </MenuItem>
      }
      {
        documentType === DOCUMENT_TYPE.purchaseOrder && <MenuItem onClick={() => navigate(`/purchaseInvoice?isNewCreation=true&documentId=${quote?.id}`)}>
          <div style={classes.menuRowStyle}>
            <TickIcon />
            <div style={classes.rowTextStyle}>{t("sales.quote.closeAsPurchaseInvoice")}</div>
          </div>
        </MenuItem>
      }
    </OptionsButton>
  );
};
export { MoreMenuWidget };