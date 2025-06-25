import { GoMakeAutoComplate } from "@/components";
import {
  TransactionJournalReportHeaderWidgetProps,
  useAgingReportHeader,
} from "./use-header-widget";
import { EReportType } from "@/enums";
import { Box } from "@mui/material";
import { formatDateToISOString } from "@/components/date-time/date-time-component";
import { DateField } from "@/components/date-picker/date-filed";

const TransactionJournalReportHeaderWidget = ({
  handleDocumentTypeChange,
  documentType,
  documentsTypeList,
  reportType,
  fromDate,
  toDate,
  setToDate,
  setFromDate,
}: TransactionJournalReportHeaderWidgetProps) => {
  const { classes, t } = useAgingReportHeader();
  const dir: "rtl" | "ltr" = t("direction");
  const handleFromDateChange = (newDate) => {
    setFromDate(newDate ? new Date(newDate) : null);
  };

  const handleToDateChange = (newDate) => {
    setToDate(newDate ? new Date(newDate) : null);
  };

  return (
    <div style={classes.mainContainer}>
      {reportType !== EReportType.DailyPayments && (
        <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>{t("reports.documentsType")}</h3>
          <GoMakeAutoComplate
            options={documentsTypeList}
            style={classes.textInputStyle}
            placeholder={t("reports.documentsType")}
            onChange={handleDocumentTypeChange}
            value={documentType}
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
    </div>
  );
};
export { TransactionJournalReportHeaderWidget };
