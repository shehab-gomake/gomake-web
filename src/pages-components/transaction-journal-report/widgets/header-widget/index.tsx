import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate } from "@/components"

import { TransactionJournalReportHeaderWidgetProps, useAgingReportHeader } from "./use-header-widget";

const TransactionJournalReportHeaderWidget = ({
  onSelectDeliveryTimeDates,
  resetDatePicker,
  handleDocumentTypeChange,
  documentType,
  documentsTypeList,
  isPayment
}: TransactionJournalReportHeaderWidgetProps) => {

  const { classes, t } = useAgingReportHeader()

  return (
    <div style={classes.mainContainer}>
      {
        !isPayment && <div style={classes.date2FilterContainer}>
          <h3 style={classes.filterLabelStyle}>Documents Type</h3>
          <GoMakeAutoComplate
            options={documentsTypeList}
            style={classes.textInputStyle}
            placeholder="choose Document Type"
            onChange={handleDocumentTypeChange}
            value={documentType}
          />
        </div>
      }

      <div style={classes.date1FilterContainer}>
        <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
        <div style={{ width: "100%" }}>
          <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
        </div>
      </div>


    </div>
  );
};
export { TransactionJournalReportHeaderWidget };
