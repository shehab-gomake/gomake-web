import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";

const SendBtnMenu = ({ handleClose, open, anchorEl }) => {
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: -45 }}
    >
      <MenuItem
        onClick={() => {
          handleClose();
        }}
      >
        Email
      </MenuItem>
      <MenuItem
        onClick={() => {
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
