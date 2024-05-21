import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SortByTypes } from "@/enums";

const TableSortingMenu = ({ handleClose, open, anchorEl, sortDocumentItems }) => {
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
        <div style={clasess.menuTabStyle} className="table-sorting" onClick={() => {
          sortDocumentItems(SortByTypes.Date)
          handleClose()
        }}>
          {t("sales.quote.creationDate")}
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting" onClick={() => {
          sortDocumentItems(SortByTypes.ProductABC)
          handleClose()
        }}>
          {t("sales.quote.productName")}
        </div>
        <Divider />
        <div style={clasess.menuTabStyle} className="table-sorting" onClick={() => {
          sortDocumentItems(SortByTypes.WorkNameABC)
          handleClose()
        }}>
          {t("sales.quote.jobName")}
        </div>
      </div>
    </GoMakeMenu>
  );
};

export { TableSortingMenu };
