import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GoMakeMenu,
  GomakePrimaryButton,
} from "@/components";
import { ArrowDownNewIcon, PrintIcon, SettingNewIcon } from "@/icons";
import { MenuItem } from "@mui/material";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";
import { useRef } from "react";
import { predefinedRanges } from "@/utils/dateRanges";
import { PrimaryButton } from "@/components/button/primary-button";

const PriceProfitHeaderWidget = ({
  handlePrintClose,
  anchorElPrint,
  openPrint,
  handleOpenPrint,
  onClickPrint,
  actionList,
  onChangeActionId,
  action,
  onSelectDeliveryTimeDates,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  profitsPricingTables,
  selectedPricingTable,
  onSelectPricingTable,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? "auto" : "515px")} !important;
    right: ${({ RTL }: any) => (RTL ? "530px" : "auto")} !important;
    top: 320px !important;
  }
`;

  const pickerRef = useRef(null);

  const handleSelect = (date) => {
    if (!fromDate) {
      setFromDate(date);
    } else if (!toDate) {
      setToDate(date);
      onSelectDeliveryTimeDates([fromDate, date]);
      pickerRef.current.close();
    }
  };

  return (
    <div style={classes.mainContainer}>
      <div style={classes.title}>{t("settings.priceProfit")}</div>
      <div style={classes.buttonContainer}>
        <PrimaryButton variant={"outlined"} sx={classes.fixBtn}>
          {t("Fix")}
          {/* !here */}
        </PrimaryButton>
        <div style={classes.statusFilterContainer}>
          {/* <GlobalStyle RTL={RTL} /> */}
          <DateRangePicker
            ref={pickerRef}
            onChange={onSelectDeliveryTimeDates}
            onSelect={handleSelect}
            value={fromDate && toDate ? [fromDate, toDate] : null}
            ranges={predefinedRanges}
          />
        </div>

        <GoMakeAutoComplate
          options={(actionList ?? []).map((a) => ({
            value: a.id,
            label: a.name,
            actionId: a.actionId,
          }))}
          value={action}
          onChange={onChangeActionId}
          getOptionLabel={(o) => o.label}
          style={classes.autoCompleteStyle}
          placeholder={t("products.profits.admin.selectAction")}
          withArrow
          popupIcon={<ArrowDownNewIcon />}
        />
        {action?.actionId &&
          profitsPricingTables &&
          profitsPricingTables.length > 0 && (
            <GoMakeAutoComplate
              options={(profitsPricingTables ?? []).map((table) => ({
                value: table.id,
                label: table.name,
              }))}
              value={selectedPricingTable}
              onChange={onSelectPricingTable}
              getOptionLabel={(o) => o.label}
              style={classes.autoCompleteStyle}
              placeholder={t(
                "products.profits.pricingListWidget.selectPricingTable"
              )}
              withArrow
              popupIcon={<ArrowDownNewIcon />}
            />
          )}
        <GomakePrimaryButton
          style={classes.printBtn}
          leftIcon={<PrintIcon />}
          rightIcon={<ArrowDownNewIcon color="#fff" />}
          onClick={handleOpenPrint}
        >
          {t("priceProfit.print")}
        </GomakePrimaryButton>
      </div>
      <GoMakeMenu
        handleClose={handlePrintClose}
        open={openPrint}
        anchorEl={anchorElPrint}
      >
        <div style={classes.menuContainer}>
          <MenuItem onClick={() => onClickPrint(false)}>
            <div style={classes.menuItemReviewText}>
              {t("priceProfit.printAll")}
            </div>
          </MenuItem>
          <MenuItem onClick={() => onClickPrint(true)}>
            <div style={classes.menuItemReviewText}>
              {t("priceProfit.onlySelected")}
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { PriceProfitHeaderWidget };
