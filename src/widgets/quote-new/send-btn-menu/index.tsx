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
}) => {
  const { t } = useTranslation();

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
            if (documentType === DOCUMENT_TYPE.receipt) {
              onClickSendReceiptToClient(MessageType.Email);
            } else {
              onClickSendQuoteToClient(MessageType.Email);
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
            if (documentType === DOCUMENT_TYPE.receipt) {
              onClickSendReceiptToClient(MessageType.SMS);
            } else {
              onClickSendQuoteToClient(MessageType.SMS);
            }
            handleClose();
          }}
        >
          {t("sales.quote.phone")}
        </MenuItem>
      )}

      {/* !here menu button*/}

      {documentState.isSendWhatsappWeb && (
        <MenuItem
          onClick={() => {
            onClickOpenWhatsAppModal();
            handleClose();
          }}
        >
          {t("sales.quote.whatsApp")}
        </MenuItem>
      )}
    </GoMakeMenu>
  );
};

export { SendBtnMenu };
