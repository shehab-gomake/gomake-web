import {
  LedgerReportButtonWidgetProps,
  useLedgerReportHeader,
} from "./use-button-widget";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

const LedgerReportButtonWidget = ({
  onClickPrintCard,
  onClickShowCard,
  onClickCreateNewTransaction,
  onClickOpenAdjustmentsModal,
  onClickExportAccountingReportExcel,
  onClickExportJournalExcelReport,
  onClickDownloadMovingFiles,
  reportType,
}: LedgerReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { tabs } = useLedgerReportHeader({
    onClickPrintCard,
    onClickShowCard,
    onClickCreateNewTransaction,
    onClickOpenAdjustmentsModal,
    onClickExportAccountingReportExcel,
    onClickExportJournalExcelReport,
    onClickDownloadMovingFiles,
    reportType,
  });

  return (
    <div style={classes.mainContainer}>
      {tabs.map((tab, index) => {
        return (
          <SecondaryButton
            variant="contained"
            key={index}
            onClick={tab.onclick}
            style={classes.btnContainer}
          >
            {tab.name}
          </SecondaryButton>
        );
      })}
    </div>
  );
};
export { LedgerReportButtonWidget };
