import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const SendBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickSendQuoteToClient,
  onClickOpenWhatsAppModal,
  documentState
}) => {
  const { t } = useTranslation();

  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
    >
      {documentState.isSendMails && (
        <MenuItem
          onClick={() => {
            onClickSendQuoteToClient(0);
            handleClose();
          }}
        >
          {t("sales.quote.email")}
        </MenuItem>
      )}
      {documentState.isSendSMS && (
        <MenuItem
          onClick={() => {
            onClickSendQuoteToClient(1);
            handleClose();
          }}
        >
          {t("sales.quote.phone")}
        </MenuItem>
      )}
      {documentState.isSendWhatsapp && (
        <MenuItem
        // onClick={() => {
        //   onClickOpenWhatsAppModal();
        //   handleClose();
        // }}
        >
          {t("sales.quote.whatsApp")}
        </MenuItem>
      )}
      {documentState.isSendWhatsappWeb && (
        <MenuItem
          onClick={() => {
            onClickOpenWhatsAppModal();
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
