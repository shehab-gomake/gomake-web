import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";

const SendBtnMenu = ({
  handleClose,
  open,
  anchorEl,
  onClickSendQuoteToClient,
}) => {
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
        Email
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClickSendQuoteToClient(1);
          handleClose();
        }}
      >
        Phone
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        Whatsapp
      </MenuItem>
    </GoMakeMenu>
  );
};

export { SendBtnMenu };
