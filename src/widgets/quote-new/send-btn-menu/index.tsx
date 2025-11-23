import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { MessageType } from "@/pages-components/quote-new/use-quote";

const SendBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickSendQuoteToClient,
  onClickOpenWhatsAppModal,
  documentState,
  documentType,
  onClickSendReceiptToClient,
  openReceiptModal,
  onClickSendEmailViaComposer,
}) => {
  const { t } = useTranslation();
  const isReceipt = documentType === DOCUMENT_TYPE.receipt;

  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
      sx={{
        "& .MuiPaper-root": {
          border: "1px solid #cbcbe4",
          borderRadius: "8px",
        },
      }}
    >
      {documentState.isSendMails && (
        <MenuItem
          onClick={() => {
            if (isReceipt) {
              openReceiptModal((includeInvoices) => {
                onClickSendReceiptToClient(MessageType.Email, includeInvoices);
                handleClose();
              });
            } else {
              // Use FrontDesk email composer
              onClickSendEmailViaComposer?.();
            }
            handleClose();
          }}
        >
          {t("sales.quote.email")}
        </MenuItem>
      )}
      {documentState.isSendSMS && (
        <MenuItem
          onClick={() => {
            if (isReceipt) {
              openReceiptModal((includeInvoices) => {
                onClickSendReceiptToClient(MessageType.SMS, includeInvoices);
                handleClose();
              });
            } else {
              onClickSendQuoteToClient(MessageType.SMS);
            }
            handleClose();
          }}
        >
          {t("sales.quote.phone")}
        </MenuItem>
      )}
      {documentState.isSendWhatsappWeb && (
        <MenuItem
          onClick={() => {
            if (isReceipt) {
              openReceiptModal((includeInvoices) => {
                onClickOpenWhatsAppModal(includeInvoices);
                handleClose();
              });
            } else {
              onClickOpenWhatsAppModal();
              handleClose();
            }
          }}
        >
          {t("sales.quote.whatsApp")}
        </MenuItem>
      )}
    </GoMakeMenu>
  );
};

export { SendBtnMenu };
