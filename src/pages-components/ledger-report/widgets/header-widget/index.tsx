import { Checkbox } from "@mui/material";

import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";

import {
  AgingReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { DateRangePicker } from "rsuite";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { predefinedRanges } from "@/utils/dateRanges";

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
          <ClientAutocomplete
            key={customer?.id}
            clientType={
              isPurchaseReport ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
            }
            getOptionLabel={(option: any) => `${option.name}`}
            style={classes.textInputStyle}
            onChange={handleCustomerChange}
            value={customer}
            loading={isFetchingCustomers}
            options={renderOptions()}
            onChangeTextField={checkWhatRenderArray}
          />
        </div>
      )}

      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <DateRangePicker
            onChange={handleDateChange}
            value={fromDate && toDate ? [fromDate, toDate] : null}
            ranges={predefinedRanges}
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
