import { Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";
import {
  SalesReportHeaderWidgetProps,
  useSalesReportHeader,
} from "./use-header-widget";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { predefinedRanges } from "@/utils/dateRanges";

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
  handleDateChange,
  fromDate,
  toDate,
  isFetchingCustomers,
  isPurchaseReport,
}: SalesReportHeaderWidgetProps) => {
  const { classes, t } = useSalesReportHeader();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? "auto" : "150px")} !important;
    right: ${({ RTL }: any) => (RTL ? "150px" : "auto")} !important;
  }
`;

  return (
    <div style={classes.mainContainer}>
      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GlobalStyle RTL={RTL} />
          <DateRangePicker
            onChange={handleDateChange}
            value={fromDate && toDate ? [fromDate, toDate] : null}
            ranges={predefinedRanges}
          />
        </div>
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
