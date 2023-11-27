import { Menu } from "@mui/material";
import * as React from "react";

const GoMakeMenu = ({ handleClose, open, anchorEl, ...props }) => {
  const { children }: any = props;
  return (
    <Menu
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          style={props.style}
        >
          {children}
    </Menu>
  );
};

export { GoMakeMenu };
