import React from "react";
import { GoMakeMenu } from "@/components";
import { Box, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";



interface CancelBtnMenuProps {
  handleClose: () => void;
  open: boolean;
  anchorEl: null | HTMLElement;
  onClickOpenDeliveryTimeModal?:any | null;
  onClickOpenPriceModal?: any | null;
  onClickOpenIrrelevantModal?:any | null;
  onClickOpenModal?: (() => void) | null;
  menuWidth?: "default" | "small" | "large"; 
}

const CancelBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickOpenDeliveryTimeModal,
  onClickOpenPriceModal,
  onClickOpenIrrelevantModal,
  onClickOpenModal,
} : CancelBtnMenuProps) => {
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
          onClickOpenIrrelevantModal();
          handleClose();
        }}
      >
        {t("sales.quote.irrelevant")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenPriceModal();
          handleClose();
        }}
      >
        {t("sales.quote.price")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenDeliveryTimeModal();
          handleClose();
        }}
      >
        {t("sales.quote.deliveryTime")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickOpenModal();
          handleClose();
        }}
      >
        {t("sales.quote.other")}
      </MenuItem>
    </GoMakeMenu>
  );
};

export { CancelBtnMenu };
