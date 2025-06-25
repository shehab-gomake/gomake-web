import { Box, Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";
import {
  SalesReportHeaderWidgetProps,
  useSalesReportHeader,
} from "./use-header-widget";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { DateField } from "@/components/date-picker/date-filed";

const SalesReportHeaderWidget = ({
  agent,
  agentsCategories,
  handleAgentChange,
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  displayByGroups,
  onChangeDisplayByGroups,
  reportsTypeList,
  handleDocumentTypeChange,
  documentType,
  fromDate,
  toDate,
  isFetchingCustomers,
  isPurchaseReport,
  setToDate,
  setFromDate,
}: SalesReportHeaderWidgetProps) => {
  const { classes, t } = useSalesReportHeader();
  const dir: "rtl" | "ltr" = t("direction");

  const handleFromDateChange = (newDate) => {
    setFromDate(newDate ? new Date(newDate) : null);
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate ? new Date(newDate) : null);
  };

  return (
    <div style={classes.mainContainer}>
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
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.agent")}</h3>
        <GoMakeAutoComplate
          key={agent?.id}
          options={agentsCategories}
          style={classes.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.ChooseAgent")}
          onChange={handleAgentChange}
          value={agent}
        />
      </div>
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>
          {" "}
          {isPurchaseReport
            ? t("reports.supplier")
            : t("productionFloor.customer")}
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
      <div style={classes.date2FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("reports.reportType")}</h3>
        <GoMakeAutoComplate
          options={reportsTypeList}
          style={classes.textInputStyle}
          placeholder={t("reports.chooseDocumentType")}
          onChange={handleDocumentTypeChange}
          value={documentType}
        />
      </div>
      <div style={classes.date1FilterContainer}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDisplayByGroups}
            checked={displayByGroups}
          />
          <div style={classes.labelSwichStyle}>
            {t("reports.DisplayByGroups")}
          </div>
        </div>
      </div>
    </div>
  );
};
export { SalesReportHeaderWidget };
