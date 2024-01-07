import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const TableSortingMenu = ({ handleClose, open, anchorEl }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={clasess.mainContainer}
    >
      <div style={clasess.bodyContainer}>
        <div style={clasess.menuTabStyle} className="table-sorting">
        {t("sales.quote.creationDate")}
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting">
        {t("sales.quote.productName")}
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting">
        {t("sales.quote.jobName")}
        </div>
      </div>
    </GoMakeMenu>
  );
};

export { TableSortingMenu };
