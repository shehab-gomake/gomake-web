import {
  Checkbox,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";
import {
  AgingReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { DateField } from "@/components/date-picker/date-filed";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { formatDateToISOString } from "@/components/date-time/date-time-component";

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
  agingReportByCreationDate,
  onChangeAgingReportByCreationDate,
  handleDateChange,
  fromDate,
  toDate,
  isFetchingCustomers,
  isPurchaseReport,
  setFromDate,
  setToDate,
}: AgingReportHeaderWidgetProps) => {
  const { classes, t } = useAgingReportHeader();
  const dir: "rtl" | "ltr" = t("direction");
  const theme = createTheme({
    direction: dir,
  });

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
            <ThemeProvider theme={theme}>
              <CssBaseline/>
              <LocalizationProvider
                  dateAdapter={AdapterMoment}
                  adapterLocale="en-gb"
              >
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
              </LocalizationProvider>
            </ThemeProvider>
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
            {isPurchaseReport
                ? t("reports.supplier")
                : t("productionFloor.customer")}
          </h3>
          <ClientAutocomplete
              key={customer?.id}
              clientType={
                isPurchaseReport ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
              }
              value={customer}
              options={renderOptions()}
              onChangeTextField={checkWhatRenderArray}
              getOptionLabel={(option: any) => `${option.name}`}
              onChange={handleCustomerChange}
              loading={isFetchingCustomers}
              style={classes.textInputStyle}
          />
        </div>
        <div style={{...classes.date1FilterContainer, alignSelf: "flex-end"}}>
          <div style={classes.checkboxStyle}>
            <Checkbox
                icon={<CheckboxIcon/>}
                checkedIcon={<CheckboxCheckedIcon/>}
                onChange={onChangeDetailedReport}
                checked={detailedReport}
            />
            <div style={classes.labelSwichStyle}>
              {t("reports.detailedReport")}
            </div>
          </div>
          <div style={classes.checkboxStyle}>
            <Checkbox
                icon={<CheckboxIcon/>}
                checkedIcon={<CheckboxCheckedIcon/>}
                onChange={onChangeAgingReportByCreationDate}
                checked={agingReportByCreationDate}
            />
            <div style={classes.labelSwichStyle}>
              {t("reports.agingByCreationDate")}
            </div>
          </div>
        </div>
      </div>
  );
};
export {AgingReportHeaderWidget};
