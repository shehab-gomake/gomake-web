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
import { AutomaticDiscountMenu } from "../automatic-discount-menu";
import { DotIcon } from "@/icons";
import { Check } from "@mui/icons-material";
import { DiscountType, SortByTypes } from "@/enums";

const SettingQuoteMenu = ({ handleClose, open, anchorEl, onBlurExchangeRate, setIsUpdateExchangeRate, isUpdateExchangeRate, onBlurCurrency, isUpdateCurrency, setIsUpdateCurrency, updateCurrency, onClickRefresh, sortDocumentItems, updateIsShowDetails, updateIsShowPrices, updateDiscountType }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { getCurrenciesApi } = useCompanyProfile();
  const [detailsView, setDetailsView] = useState(quoteStateValue?.isShowDetails)
  const [showPrices, setShowPrices] = useState(quoteStateValue?.isShowPrice)
  const currencies = useRecoilValue<{ label: string, value: string }[]>(currenciesState);
  const matchingCurrency = currencies.find(currency => currency.value === quoteStateValue?.currency)?.label;
  const [exchangeRate, setExchangeRate] = useState(quoteStateValue?.exchangeRate || "-");
  const [anchorElTableSorting, setAnchorElTableSorting] = useState<null | HTMLElement>(null);

  const [anchorElAutomaticDiscount, setAnchorElAutomaticDiscount] = useState<null | HTMLElement>(null);
  const openTableSorting = Boolean(anchorElTableSorting);
  const openAutomaticDiscount = Boolean(anchorElAutomaticDiscount);

  useEffect(() => {
    setDetailsView(quoteStateValue?.isShowDetails)
    setShowPrices(quoteStateValue?.isShowPrice)
  }, [quoteStateValue?.isShowDetails, quoteStateValue?.isShowPrice])

  useEffect(() => {
    setExchangeRate(quoteStateValue?.exchangeRate || "-");
  }, [quoteStateValue?.exchangeRate]);

  useEffect(() => {
    getCurrenciesApi();
  }, []);

  const handleSwitchCheck = (event: ChangeEvent<HTMLInputElement>) => {
    setDetailsView(event.target.checked)
    updateIsShowDetails()
  };

  const handleSwitchCheckForShowPrice = (event: ChangeEvent<HTMLInputElement>) => {
    setShowPrices(event.target.checked)
    updateIsShowPrices()
  };

  const handleTableSorting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTableSorting(event.currentTarget);
  };

  const handleTableSortingClose = () => {
    setAnchorElTableSorting(null);
  };

  const handleAutomaticDiscount = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAutomaticDiscount(event.currentTarget);
  };

  const handleAutomaticDiscountClose = () => {
    setAnchorElAutomaticDiscount(null);
  };

  const _renderSelectionType = (type: DiscountType) => {
    switch (type) {
      case DiscountType.Product:
        return <div>{t("sales.quote.byProduct")}</div>;
      case DiscountType.ProductSKU:
        return <div>{t("sales.quote.bySku")}</div>;
      default:
        return <div> {t("sales.quote.none")}</div>;
    }
  }
  const _renderSortingBy = (type: SortByTypes) => {
    switch (type) {
      case SortByTypes.Date:
        return <div> {t("sales.quote.creationDate")}</div>;
      case SortByTypes.ProductABC:
        return <div>{t("sales.quote.productName")}</div>;
      case SortByTypes.WorkNameABC:
        return <div>{t("sales.quote.jobName")}</div>;
    }
  }

  return (
    <>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={classes.mainContainer}
      >
        <div style={classes.bodyContainer}>
          <div
            onClick={handleTableSorting}
            className="table-sorting"
            style={classes.menuTabStyle}
          >
            {
              quoteStateValue?.sortType !== null ?
                <div style={classes.selectedTabStyle}>
                  <div style={classes.mainTabContainer}>{t("sales.quote.tableSortingBy")}
                    <DotIcon />
                  </div>
                  <div style={classes.selectedTabContainer} >
                    <Check style={{ width: 16, height: 16 }} /> {_renderSortingBy(quoteStateValue?.sortType)}
                  </div>
                </div> : t("sales.quote.tableSortingBy")
            }
          </div>

          <Divider />
          <div
            onClick={handleAutomaticDiscount}
            className="table-sorting"
            style={classes.menuTabStyle}
          >
            {
              quoteStateValue?.discountType !== null ?
                <div style={classes.selectedTabStyle}>
                  <div style={classes.mainTabContainer}>{t("sales.quote.automaticDiscount")}
                    <DotIcon />
                  </div>
                  <div style={classes.selectedTabContainer} >
                    <Check style={{ width: 16, height: 16 }} /> {_renderSelectionType(quoteStateValue?.discountType)}
                  </div>
                </div> : t("sales.quote.automaticDiscount")
            }
          </div>
          <Divider />

          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.details")}</div>
            <SecondSwitch
              checked={detailsView}
              onChange={handleSwitchCheck}
            />
          </div>
          <Divider />
          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.showPrices")}</div>
            <SecondSwitch
              checked={showPrices}
              onChange={handleSwitchCheckForShowPrice}
            />
          </div>
          {quoteStateValue?.isForeignCurrency && <>
            <Divider />
            <div style={classes.menuRowStyle}>
              <div style={classes.menuTabStyle}>{t("sales.quote.exchangeRate")}</div>
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
          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.currency")}</div>
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

      <AutomaticDiscountMenu
        handleClose={handleAutomaticDiscountClose}
        open={openAutomaticDiscount}
        anchorEl={anchorElAutomaticDiscount}
        updateDiscountType={updateDiscountType}
      />
    </>
  );
};

export { SettingQuoteMenu };