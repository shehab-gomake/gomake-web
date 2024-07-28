import React, { useState } from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SortByTypes } from "@/enums";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const TableSortingMenu = ({ handleClose, open, anchorEl, sortDocumentItems }) => {

  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const selectedSort = quoteStateValue?.sortType
  const { clasess } = useStyle();
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={clasess.mainContainer}
    >
      <div style={clasess.bodyContainer}>
        <div style={{ backgroundColor: selectedSort === SortByTypes.Date ? "#EBECFF" : "", ...clasess.menuTabStyle }} className="table-sorting" onClick={() => {
          sortDocumentItems(SortByTypes.Date)
          handleClose()
        }}>
          {t("sales.quote.creationDate")}
        </div>
        <Divider />
        <div style={{ backgroundColor: selectedSort === SortByTypes.ProductABC ? "#EBECFF" : "", ...clasess.menuTabStyle }} className="table-sorting" onClick={() => {
          sortDocumentItems(SortByTypes.ProductABC)
          handleClose()
        }}>
          {t("sales.quote.productName")}
        </div>
        <Divider />
        <div style={{ backgroundColor: selectedSort === SortByTypes.WorkNameABC ? "#EBECFF" : "", ...clasess.menuTabStyle }} className="table-sorting" onClick={() => {
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
