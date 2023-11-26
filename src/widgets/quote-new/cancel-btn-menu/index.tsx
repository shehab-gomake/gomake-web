import React from "react";
import { GoMakeMenu } from "@/components";
import { Box, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

const CancelBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClcikOpenDeliveryTimeModal,
  onClcikOpenPriceModal,
  onClcikOpenIrreleventModal,
  onClcikOpenModal,
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
          onClcikOpenIrreleventModal();
          handleClose();
        }}
      >
        {t("sales.quote.irrelevant")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClcikOpenPriceModal();
          handleClose();
        }}
      >
        {t("sales.quote.price")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClcikOpenDeliveryTimeModal();
          handleClose();
        }}
      >
        {t("sales.quote.deliveryTime")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClcikOpenModal();
          handleClose();
        }}
      >
        {t("sales.quote.other")}
      </MenuItem>
    </GoMakeMenu>
  );
};

export { CancelBtnMenu };
