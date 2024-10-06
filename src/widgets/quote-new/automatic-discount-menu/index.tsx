import React from "react";
import { GoMakeMenu } from "@/components";
import { Divider } from "@mui/material";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";


enum DiscountType {
  NONE = 1,
  Product,
  ProductSKU
}

const AutomaticDiscountMenu = ({ handleClose, open, anchorEl, updateDiscountType }) => {

  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const selectedSort = quoteStateValue?.discountType
  const { classes } = useStyle();
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={classes.mainContainer}
    >
      <div style={classes.bodyContainer}>
        <div style={{ backgroundColor: selectedSort === DiscountType.NONE ? "#EBECFF" : "", ...classes.menuTabStyle }} className="table-sorting"
          onClick={() => {
            updateDiscountType(DiscountType.NONE)
            handleClose()
          }}>
          {t("sales.quote.none")}
        </div>
        <Divider />
        <div style={{ backgroundColor: selectedSort === DiscountType.Product ? "#EBECFF" : "", ...classes.menuTabStyle }} className="table-sorting"
          onClick={() => {
            updateDiscountType(DiscountType.Product)
            handleClose()
          }}>
          {t("sales.quote.byProduct")}
        </div>
        <Divider />
        <div style={{ backgroundColor: selectedSort === DiscountType.ProductSKU ? "#EBECFF" : "", ...classes.menuTabStyle }} className="table-sorting" onClick={() => {
          updateDiscountType(DiscountType.ProductSKU)
          handleClose()
        }}>
          {t("sales.quote.bySku")}
        </div>
      </div>
    </GoMakeMenu>
  );
};

export { AutomaticDiscountMenu };
