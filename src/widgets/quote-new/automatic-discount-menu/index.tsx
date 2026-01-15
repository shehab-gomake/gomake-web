import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { DiscountType } from "@/enums";

const AutomaticDiscountMenu = ({
  handleClose,
  open,
  anchorEl,
  updateDiscountType,
}) => {
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const selectedSort = quoteStateValue?.discountType;
  const { classes, primaryColor } = useStyle();
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={classes.mainContainer}
    >
      <div style={classes.bodyContainer}>
        <div
          style={{
            backgroundColor:
              selectedSort === DiscountType.NONE ? primaryColor(50) : "",
            ...classes.menuTabStyle,
          }}
          className="table-sorting"
          onClick={() => {
            updateDiscountType(DiscountType.NONE);
            handleClose();
          }}
        >
          {t("sales.quote.none")}
        </div>
        <Divider />
        <div
          style={{
            backgroundColor:
              selectedSort === DiscountType.Product ? primaryColor(50) : "",
            ...classes.menuTabStyle,
          }}
          className="table-sorting"
          onClick={() => {
            updateDiscountType(DiscountType.Product);
            handleClose();
          }}
        >
          {t("sales.quote.byProduct")}
        </div>
        <Divider />
        <div
          style={{
            backgroundColor:
              selectedSort === DiscountType.ProductSKU ? primaryColor(50) : "",
            ...classes.menuTabStyle,
          }}
          className="table-sorting"
          onClick={() => {
            updateDiscountType(DiscountType.ProductSKU);
            handleClose();
          }}
        >
          {t("sales.quote.bySku")}
        </div>
      </div>
    </GoMakeMenu>
  );
};

export { AutomaticDiscountMenu };
