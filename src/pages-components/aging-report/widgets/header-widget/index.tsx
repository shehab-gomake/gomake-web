import { Checkbox } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";
import {
  AgingReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";

const AgingReportHeaderWidget = ({
  agent,
  agentsCategories,
  handleAgentChange,
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  detailedReport,
  onChangeDetailedReport,
  handleDateChange,
  fromDate,
  toDate,
  isFetchingCustomers,
}: AgingReportHeaderWidgetProps) => {
  const { classes, t } = useAgingReportHeader();
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
        <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
        <GoMakeAutoComplate
          key={customer?.id}
          options={renderOptions()}
          defaultFiltering={false}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={classes.textInputStyle}
          placeholder={t("sales.quote.chooseCustomer")}
          onChange={handleCustomerChange}
          value={customer}
          loading={isFetchingCustomers}
        />
      </div>
      <div style={{ ...classes.date1FilterContainer, alignSelf: "flex-end" }}>
        <div style={classes.checkboxStyle}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeDetailedReport}
            checked={detailedReport}
          />
          <div style={classes.labelSwichStyle}>
            {t("reports.detailedReport")}
          </div>
        </div>
      </div>
    </div>
  );
};
export { AgingReportHeaderWidget };
