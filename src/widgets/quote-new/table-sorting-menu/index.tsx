import React from "react";
import { GoMakeMenu, SecondSwitch } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";

const TableSortingMenu = ({ handleClose, open, anchorEl }) => {
  const { clasess } = useStyle();
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={clasess.mainContainer}
    >
      <div style={clasess.bodyContainer}>
        <div style={clasess.menuTabStyle} className="table-sorting">
          Creation Date
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting">
          Product Name
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting">
          Job Name
        </div>
      </div>
    </GoMakeMenu>
  );
};

export { TableSortingMenu };
