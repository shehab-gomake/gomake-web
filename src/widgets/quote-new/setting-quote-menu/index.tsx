import React from "react";
import { Divider, IconButton } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import { Check } from "@mui/icons-material";
import { GoMakeMenu, SecondSwitch } from "@/components";
import { DotIcon } from "@/icons";
import { AutoCompleteUpdatedValue } from "../auto-complete-updated";
import { AutomaticDiscountMenu } from "../automatic-discount-menu";
import { useSttingsQuoteMenu } from "./use-setting-quote-menu";
import { InputUpdatedValues } from "../input-updated-values";
import { TableSortingMenu } from "../table-sorting-menu";
import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { EPreferences } from "@/enums/prefernces";
import { DocumentPreferencesEnum } from "@/enums";

const SettingQuoteMenu = ({
  handleClose,
  open,
  anchorEl,
  onBlurExchangeRate,
  setIsUpdateExchangeRate,
  isUpdateExchangeRate,
  onBlurCurrency,
  isUpdateCurrency,
  setIsUpdateCurrency,
  updateCurrency,
  onClickRefresh,
  sortDocumentItems,
  updateDiscountType,
  updateDocumentPreference,
  updatePaymentRequired,
  documentType,
  onBlurVatStatus,
  setIsUpdateVatStatus,
  isUpdateVatStatus,
  updateVatStatus,
  updateDefaultLanguage,
  onBlurDefaultLanguage,
  isUpdateDefaultLanguage,
  setIsUpdateDefaultLanguage,
}) => {
  const { classes } = useStyle();
  const {
    quoteStateValue,
    exchangeRate,
    anchorElTableSorting,
    anchorElAutomaticDiscount,
    openTableSorting,
    openAutomaticDiscount,
    matchingCurrency,
    currencies,
    switchConfigs,
    vatStatusList,
    vatStatus,
    handleTableSorting,
    handleTableSortingClose,
    handleAutomaticDiscount,
    handleAutomaticDiscountClose,
    _renderSelectionType,
    _renderSortingBy,
    setExchangeRate,
    t,
    CheckPreferenceValue,
    showDetailsOptions,
    showPricesOptions,
    setShowPrices,
    setDetailsView,
    showPrices,
    detailsView,
    isUpdateShowPrices,
    setIsUpdateShowPrices,
    onBlurShowPrices,
    isUpdateShowDetails,
    setIsUpdateShowDetails,
    onBlurShowDetails,
    defaultLanguageText,
    printHouseLanguages,
    defaultLanguage,
  } = useSttingsQuoteMenu({
    updateDocumentPreference,
    updatePaymentRequired,
    documentType,
    updateDefaultLanguage,
    onBlurDefaultLanguage,
    isUpdateDefaultLanguage,
    setIsUpdateDefaultLanguage,
  });

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
            {quoteStateValue?.sortType !== null ? (
              <div style={classes.selectedTabStyle}>
                <div style={classes.mainTabContainer}>
                  {t("sales.quote.tableSortingBy")}
                  <DotIcon />
                </div>
                <div style={classes.selectedTabContainer}>
                  <Check style={{ width: 16, height: 16 }} />{" "}
                  {_renderSortingBy(quoteStateValue?.sortType)}
                </div>
              </div>
            ) : (
              t("sales.quote.tableSortingBy")
            )}
          </div>

          <Divider />
          {(documentType === DOCUMENT_TYPE.quote ||
            documentType === DOCUMENT_TYPE.order) && (
              <>
                <div
                  onClick={handleAutomaticDiscount}
                  className="table-sorting"
                  style={classes.menuTabStyle}
                >
                  {quoteStateValue?.discountType !== null ? (
                    <div style={classes.selectedTabStyle}>
                      <div style={classes.mainTabContainer}>
                        {t("sales.quote.automaticDiscount")}
                        <DotIcon />
                      </div>
                      <div style={classes.selectedTabContainer}>
                        <Check style={{ width: 16, height: 16 }} />{" "}
                        {_renderSelectionType(quoteStateValue?.discountType)}
                      </div>
                    </div>
                  ) : (
                    t("sales.quote.automaticDiscount")
                  )}
                </div>
                <Divider />
              </>
            )}
          {switchConfigs.map((config, index) => (
            <React.Fragment key={index}>
              <div style={classes.menuRowStyle}>
                <div style={classes.menuTabStyle}>{config.label}</div>
                <SecondSwitch
                  checked={config.checked}
                  onChange={config.onChange}
                />
              </div>
              <Divider />
            </React.Fragment>
          ))}

          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.details")}</div>
            <AutoCompleteUpdatedValue
              value={
                showDetailsOptions.find((opt) => opt.value === detailsView)
                  ?.text || t("sales.quote.showAllDetails")
              }
              options={showDetailsOptions}
              onBlur={onBlurShowDetails}
              isUpdate={isUpdateShowDetails}
              setIsUpdate={setIsUpdateShowDetails}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => {
                setIsUpdateShowDetails(null);
                setDetailsView(value?.value);
                updateDocumentPreference(
                  value?.value,
                  DocumentPreferencesEnum.ShowDetails
                );
              }}
            />
          </div>

          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.prices")}</div>
            <AutoCompleteUpdatedValue
              value={
                showPricesOptions.find((opt) => opt.value === showPrices)
                  ?.text || t("sales.quote.showAllPrices")
              }
              options={showPricesOptions}
              onBlur={onBlurShowPrices}
              isUpdate={isUpdateShowPrices}
              setIsUpdate={setIsUpdateShowPrices}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => {
                setIsUpdateShowPrices(null);
                setShowPrices(value?.value);
                updateDocumentPreference(
                  value?.value,
                  DocumentPreferencesEnum.ShowPrice
                );
              }}
            />
          </div>

          {quoteStateValue?.isForeignCurrency && (
            <>
              <Divider />
              <div style={classes.menuRowStyle}>
                <div style={classes.menuTabStyle}>
                  {t("sales.quote.exchangeRate")}
                </div>
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
            </>
          )}
          <Divider />
          <div style={classes.menuRowStyle}>
            <div style={classes.menuTabStyle}>{t("sales.quote.currency")}</div>
            <AutoCompleteUpdatedValue
              value={matchingCurrency}
              options={currencies.map((currency) => ({
                value: currency.value,
                text: currency.label,
              }))}
              onBlur={onBlurCurrency}
              isUpdate={isUpdateCurrency}
              setIsUpdate={setIsUpdateCurrency}
              getOptionLabel={(item) => item.text}
              onChange={(e, value) => updateCurrency(value?.value)}
            />
          </div>
          {!CheckPreferenceValue(EPreferences.HIDE_VAT_FROM_DOCUMENTS) &&
            documentType !== DOCUMENT_TYPE.invoice &&
            documentType !== DOCUMENT_TYPE.deliveryNote &&
            documentType !== DOCUMENT_TYPE.invoiceRefund &&
            documentType !== DOCUMENT_TYPE.deliveryNoteRefund && (
              <>
                <Divider />
                <div style={classes.menuRowStyle}>
                  <div style={classes.menuTabStyle}>{t("sales.quote.vat")}</div>
                  <AutoCompleteUpdatedValue
                    value={vatStatus || t("accounting.defaultVat")}
                    options={vatStatusList}
                    onBlur={onBlurVatStatus}
                    isUpdate={isUpdateVatStatus}
                    setIsUpdate={setIsUpdateVatStatus}
                    getOptionLabel={(item) => item.text}
                    onChange={(e, value) => updateVatStatus(value?.value)}
                  />
                </div>
              </>
            )}
          {printHouseLanguages && printHouseLanguages.length > 0 && (
            <>
              <Divider />
              <div style={classes.menuRowStyle}>
                <div style={classes.menuTabStyle}>
                  {t("signup.defaultLanguage")}
                </div>
                <AutoCompleteUpdatedValue
                  value={defaultLanguageText}
                  options={printHouseLanguages.map((lang) => ({
                    value: lang.value,
                    text: lang.text,
                  }))}
                  onBlur={onBlurDefaultLanguage}
                  isUpdate={isUpdateDefaultLanguage}
                  setIsUpdate={setIsUpdateDefaultLanguage}
                  getOptionLabel={(item) => item.text}
                  onChange={(e, value) =>
                    updateDefaultLanguage(value?.value)
                  }
                />
              </div>
            </>
          )}
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
