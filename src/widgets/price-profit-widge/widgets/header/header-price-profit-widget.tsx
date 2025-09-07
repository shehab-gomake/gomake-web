import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate } from "@/components";
import { ArrowDownNewIcon } from "@/icons";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";
import { useRef } from "react";
import { predefinedRanges } from "@/utils/dateRanges";
import { PrimaryButton } from "@/components/button/primary-button";
import { ExcelMenu } from "../excel-menu/excel-menu";

const PriceProfitHeaderWidget = ({
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
  handleAutoFix,
  handleRollback,
  isFixed,
  onClickDownloadExcel,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
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
      <div style={classes.title}>
        {t("settings.priceProfit")}
        {action?.label
          ? ` - ${action.label}`
          : ` - ${t("priceProfit.allActions")}`}
      </div>
      <div style={classes.buttonContainer}>
        <PrimaryButton
          variant={"outlined"}
          sx={{
            ...classes.fixBtn,
            ...(isFixed && {
              color: "#d32f2f",
              border: "1px solid #d32f2f",
              // fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#ffebee",
                border: "1px solid #d32f2f",
              },
            }),
          }}
          onClick={() => {
            const fromDataString = fromDate
              ? fromDate.toISOString()
              : undefined;
            const toDataString = toDate ? toDate.toISOString() : undefined;
            if (isFixed) {
              handleRollback(
                fromDataString,
                toDataString,
                action?.actionId ?? undefined,
                selectedPricingTable?.value ?? undefined
              );
            } else {
              handleAutoFix(
                fromDataString,
                toDataString,
                action?.actionId ?? undefined,
                selectedPricingTable?.value ?? undefined
              );
            }
          }}
        >
          {isFixed ? t("products.profits.rollback") : t("products.profits.fix")}
        </PrimaryButton>
        <div style={classes.statusFilterContainer}>
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
              options={(profitsPricingTables ?? [])
                .filter(
                  (table) => table.pricingBy === 1 && table.name !== "Default"
                )
                .map((table) => ({
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
        <ExcelMenu
          onClickDownloadExcel={() => {
            const fromDataString = fromDate
              ? fromDate.toISOString()
              : undefined;
            const toDataString = toDate ? toDate.toISOString() : undefined;

            onClickDownloadExcel(
              fromDataString,
              toDataString,
              action?.actionId ?? undefined,
              selectedPricingTable?.value ?? undefined
            );
          }}
        />
      </div>
    </div>
  );
};
export { PriceProfitHeaderWidget };
