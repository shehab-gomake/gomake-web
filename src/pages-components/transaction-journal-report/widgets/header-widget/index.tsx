import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate } from "@/components"

import { TransactionJournalReportHeaderWidgetProps, useAgingReportHeader } from "./use-header-widget";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";

const TransactionJournalReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  handleDocumentTypeChange,
  documentType,
  documentsTypeList,
  isPayment,
  handleDateChange,
  fromDate,
  toDate,
}: TransactionJournalReportHeaderWidgetProps) => {

  const { classes, t } = useAgingReportHeader()
  const dir: 'rtl' | 'ltr' = t('direction');
  const RTL = dir === 'rtl';
  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? 'auto' : '150px')} !important;
    right: ${({ RTL }: any) => (RTL ? '150px' : 'auto')} !important;
  }
`;
  return (
    <div style={classes.mainContainer}>
      {
        !isPayment && <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>{t("reports.documentsType")}</h3>
          <GoMakeAutoComplate
            options={documentsTypeList}
            style={classes.textInputStyle}
            placeholder={t("reports.documentsType")}
            onChange={handleDocumentTypeChange}
            value={documentType}
          />
        </div>
      }

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


    </div>
  );
};
export { TransactionJournalReportHeaderWidget };
