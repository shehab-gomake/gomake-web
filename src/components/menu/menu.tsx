import { Menu } from "@mui/material";
import * as React from "react";

const GoMakeMenu = ({ handleClose, open, anchorEl, ...props }) => {
  const { children }: any = props;
  return (
    <div >
      <Menu
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </div>
  );
};

export { GoMakeMenu };
