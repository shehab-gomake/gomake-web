import React, { useState } from "react";
import { GoMakeMenu, SecondSwitch } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { TableSortingMenu } from "../table-sorting-menu";

const SettingQuoteMenu = ({ handleClose, open, anchorEl }) => {
  const { clasess } = useStyle();
  const [anchorElTableSorting, setAnchorElTableSorting] =
    useState<null | HTMLElement>(null);
  const openTableSorting = Boolean(anchorElTableSorting);
  const handleTableSorting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTableSorting(event.currentTarget);
  };
  const handleTableSortingClose = () => {
    setAnchorElTableSorting(null);
  };
  return (
    <>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={clasess.mainContainer}
      >
        <div style={clasess.bodyContainer}>
          <div
            onClick={handleTableSorting}
            className="table-sorting"
            style={clasess.menuTabStyle}
          >
            Table sorting by
          </div>
          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>Auto Discount</div>
            <SecondSwitch />
          </div>
          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>Details</div>
            <SecondSwitch />
          </div>
        </div>
      </GoMakeMenu>
      <TableSortingMenu
        handleClose={handleTableSortingClose}
        open={openTableSorting}
        anchorEl={anchorElTableSorting}
      />
    </>
  );
};

export { SettingQuoteMenu };
