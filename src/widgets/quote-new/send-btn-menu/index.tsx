import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const SendBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickSendQuoteToClient,
  onClickOpenWatssAppModal
}) => {
  const { t } = useTranslation();

  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
    >
      <MenuItem
        onClick={() => {
          onClickSendQuoteToClient(0);
          handleClose();
        }}
      >
        {t("sales.quote.email")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickSendQuoteToClient(1);
          handleClose();
        }}
      >
        {t("sales.quote.phone")}
      </MenuItem>
      <MenuItem
      // onClick={() => {
      //   onClickOpenWatssAppModal()
      //   handleClose();
      // }}
      >
        {t("sales.quote.whatsApp")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenWatssAppModal()
          handleClose();
        }}
      >
        {t("sales.quote.whatsAppWeb")}
      </MenuItem>

    </GoMakeMenu>
  );
};

export { SendBtnMenu };
