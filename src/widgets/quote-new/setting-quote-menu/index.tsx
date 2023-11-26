import React from "react";
import { GoMakeMenu } from "@/components";
import { MenuItem } from "@mui/material";

const SettingQuoteMenu = ({ handleClose, open, anchorEl }) => {
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={{ marginTop: 5, marginLeft: -25 }}
    >
      <MenuItem>Email</MenuItem>
      <MenuItem>Phone</MenuItem>
      <MenuItem>Whatsapp</MenuItem>
    </GoMakeMenu>
  );
};

export { SettingQuoteMenu };
