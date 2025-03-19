import { Checkbox } from "@mui/material";

import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";

import {
  AgingReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { DateRangePicker } from "rsuite";

const LedgerReportHeaderWidget = ({
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  isExtended,
  onChangeIsExtended,
  handleDateChange,
  fromDate,
  toDate,
  customerId,
  isFetchingCustomers,
  isPurchaseReport,
  supplierList,
}: AgingReportHeaderWidgetProps) => {
  const { classes, t } = useAgingReportHeader();
  return (
    <div style={classes.mainContainer}>
      {!customerId && (
        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>
            {isPurchaseReport
              ? t("reports.supplier")
              : t("sales.quote.customer")}
          </h3>
          <GoMakeAutoComplate
            key={customer?.id}
            getOptionLabel={(option: any) => `${option.name}`}
            style={classes.textInputStyle}
            onChange={handleCustomerChange}
            value={customer}
            loading={isFetchingCustomers}
            defaultFiltering={isPurchaseReport ? true : false}
            options={isPurchaseReport ? supplierList : renderOptions()}
            onChangeTextField={(e) => {
              if (isPurchaseReport) {
                return;
              }
              checkWhatRenderArray(e);
            }}
            placeholder={t(
              `sales.quote.${
                isPurchaseReport ? "chooseSupplier" : "chooseCustomer"
              }`
            )}
          />
        </div>
      )}

      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <DateRangePicker
            onChange={handleDateChange}
            value={fromDate && toDate ? [fromDate, toDate] : null}
          />
        </div>
      </div>

      <div style={classes.checkBoxContainer}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeIsExtended}
            checked={isExtended}
          />
        </div>
        <h3 style={classes.filterLabelStyle}>{t("reports.extendedCard")}</h3>
      </div>
    </div>
  );
};
export { LedgerReportHeaderWidget };
