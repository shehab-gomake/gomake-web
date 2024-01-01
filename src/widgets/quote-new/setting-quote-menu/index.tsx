import React, { useEffect, useState } from "react";
import { GoMakeMenu, SecondSwitch } from "@/components";
import { Divider, IconButton } from "@mui/material";
import { useStyle } from "./style";
import { TableSortingMenu } from "../table-sorting-menu";
import { InputUpdatedValues } from "../input-updated-values";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { quoteItemState } from "@/store";
import { useRecoilValue } from "recoil";
import { currencyUnitState } from "@/store/currency-units";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import SyncIcon from '@mui/icons-material/Sync';

const SettingQuoteMenu = ({ handleClose, open, anchorEl, onBlurExchangeRate, setIsUpdateExchangeRate, isUpdateExchangeRate, onBlurCurrency, isUpdateCurrency, setIsUpdateCurrency, updateCurrency, onClickRefresh }) => {
  const { clasess } = useStyle();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const currencies = useRecoilValue<any>(currencyUnitState);
  const { getCurrencyUnitText } = useQuoteGetData();
  const [exchangeRate, setExchangeRate] =
    useState(quoteStateValue?.exchangeRate || "-");
  const [anchorElTableSorting, setAnchorElTableSorting] =
    useState<null | HTMLElement>(null);
  const openTableSorting = Boolean(anchorElTableSorting);
  const handleTableSorting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTableSorting(event.currentTarget);
  };
  const handleTableSortingClose = () => {
    setAnchorElTableSorting(null);
  };

  useEffect(() => {
    setExchangeRate(quoteStateValue?.exchangeRate || "-");
  }, [quoteStateValue?.exchangeRate]);

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
          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>Exchange rate</div>
            <InputUpdatedValues
              value={exchangeRate}
              onBlur={() => onBlurExchangeRate(exchangeRate)}
              isUpdate={isUpdateExchangeRate}
              setIsUpdate={setIsUpdateExchangeRate}
              onInputChange={(v) => setExchangeRate(v)}
            />
            <IconButton onClick={onClickRefresh}>
              <SyncIcon />
            </IconButton>
          </div>
          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>Currency</div>
            <AutoCompleteUpdatedValue
              value={getCurrencyUnitText(quoteStateValue?.currency)}
              options={currencies}
              onBlur={onBlurCurrency}
              isUpdate={isUpdateCurrency}
              setIsUpdate={setIsUpdateCurrency}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => updateCurrency(value?.value)}
            />
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