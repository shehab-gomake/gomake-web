import React, { ChangeEvent, useEffect, useState } from "react";
import { GoMakeMenu, SecondSwitch } from "@/components";
import { Divider, IconButton } from "@mui/material";
import { useStyle } from "./style";
import { TableSortingMenu } from "../table-sorting-menu";
import { InputUpdatedValues } from "../input-updated-values";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { quoteItemState } from "@/store";
import { useRecoilValue } from "recoil";
import SyncIcon from '@mui/icons-material/Sync';
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { currenciesState } from "@/widgets/materials-widget/state";
import { useTranslation } from "react-i18next";

const SettingQuoteMenu = ({ handleClose, open, anchorEl, onBlurExchangeRate, setIsUpdateExchangeRate, isUpdateExchangeRate, onBlurCurrency, isUpdateCurrency, setIsUpdateCurrency, updateCurrency, onClickRefresh, sortDocumentItems, updateIsShowDetails }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { getCurrenciesApi } = useCompanyProfile();
  const [detailsView, setdetailsView] = useState(quoteStateValue?.isShowDetails)
  const currencies = useRecoilValue<{ label: string, value: string }[]>(currenciesState);
  const matchingCurrency = currencies.find(currency => currency.value === quoteStateValue?.currency)?.label;
  useEffect(() => {
    setdetailsView(quoteStateValue?.isShowDetails)
  }, [quoteStateValue?.isShowDetails])
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

  useEffect(() => {
    getCurrenciesApi();
  }, []);
  const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setdetailsView(event.target.checked)
    updateIsShowDetails()

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
          >{t("sales.quote.tableSortingBy")}</div>
          {/* <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>{t("sales.quote.autoDiscount")}</div>
            <SecondSwitch />
          </div> */}
          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>{t("sales.quote.details")}</div>
            <SecondSwitch
              checked={detailsView}
              onChange={handleSwitchCheck}
            />
          </div>
          {quoteStateValue?.isForeignCurrency && <>
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
            </div></>}

          <Divider />
          <div style={clasess.menuRowStyle}>
            <div style={clasess.menuTabStyle}>{t("sales.quote.currency")}</div>
            <AutoCompleteUpdatedValue
              value={matchingCurrency}
              options={currencies.map(currency => ({
                value: currency.value,
                text: currency.label
              }))}
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
        sortDocumentItems={sortDocumentItems}
      />
    </>
  );
};

export { SettingQuoteMenu };