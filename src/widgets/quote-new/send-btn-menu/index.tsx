import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const SendBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickSendQuoteToClient,
  onClickOpenWhatsAppModal,
  documentState,
  setIsWhatsAppWeb,
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
              onClickSendReceiptToClient(0);
            } else {
              onClickSendQuoteToClient(0);
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
              onClickSendReceiptToClient(1);
            } else {
              onClickSendQuoteToClient(1);
            }
            handleClose();
          }}
        >
          {t("sales.quote.phone")}
        </MenuItem>
      )}
      {documentState.isSendWhatsapp && (
        <MenuItem
          onClick={() => {
            onClickOpenWhatsAppModal();
            setIsWhatsAppWeb(false);
            handleClose();
          }}
        >
          {t("sales.quote.whatsApp")}
        </MenuItem>
      )}
      {documentState.isSendWhatsappWeb && (
        <MenuItem
          onClick={() => {
            onClickOpenWhatsAppModal();
            setIsWhatsAppWeb(true);
            handleClose();
          }}
        >
          {t("sales.quote.whatsAppWeb")}
        </MenuItem>
      )}
    </GoMakeMenu>
  );
};

export { SendBtnMenu };
