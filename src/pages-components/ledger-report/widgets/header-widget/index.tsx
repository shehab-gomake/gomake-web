import { Box, Checkbox } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import {
  AgingReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { DateField } from "@/components/date-picker/date-filed";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

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
  setToDate,
  setFromDate,
}: AgingReportHeaderWidgetProps) => {
  const { classes, t } = useAgingReportHeader();

  const handleFromDateChange = (newDate) => {
    setFromDate(newDate ? new Date(newDate) : null);
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate ? new Date(newDate) : null);
  };

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
        <Box display="flex" gap={2} width="100%">
          <DateField
            label={t("general.startDate")}
            date={formatDateToISOString(fromDate)}
            handleChange={handleFromDateChange}
            isEditable={true}
            withTime={false}
            inputWidth="100%"
            direction="column"
            compactMode={true}
          />

          <DateField
            label={t("general.endDate")}
            date={formatDateToISOString(toDate)}
            handleChange={handleToDateChange}
            isEditable={true}
            withTime={false}
            inputWidth="100%"
            direction="column"
            compactMode={true}
          />
        </Box>
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
