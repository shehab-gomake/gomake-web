import { EReportType } from "@/enums";
import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickCreateNewTransaction?: () => void;
  onClickOpenAdjustmentsModal?: () => void;
  onClickExportAccountingReportExcel?: () => void;
  onClickExportJournalExcelReport?: () => void;
  onClickDownloadMovingFiles?: () => void;
  onClickExportJournalPDFReport?: () => void;
  reportType: EReportType;
}

const useLedgerReportHeader = ({
  onClickPrintCard,
  onClickShowCard,
  onClickCreateNewTransaction,
  onClickOpenAdjustmentsModal,
  onClickExportAccountingReportExcel,
  onClickExportJournalExcelReport,
  onClickDownloadMovingFiles,
  onClickExportJournalPDFReport,
  reportType,
}: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation();
  const isAccountingTransaction =
    reportType === EReportType.AccountingTransaction;
  const isAdjustmentsReport = reportType === EReportType.AdjustmentsReport;
  const isDailyPaymentsReport = reportType === EReportType.DailyPayments;

  const tabs = [
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard,
    },

    ...(isAdjustmentsReport
      ? [
          {
            name: t("reports.createNewAdjustment"),
            onclick: onClickOpenAdjustmentsModal,
          },
          {
            name: t("reports.createNewTransaction"),
            onclick: onClickCreateNewTransaction,
          },
        ]
      : []),
    ...(isAccountingTransaction
      ? [
          {
            name: t("reports.createNewTransaction"),
            onclick: onClickCreateNewTransaction,
          },
          {
            name: t("reports.excelReport"),
            onclick: onClickExportAccountingReportExcel,
          },
          {
            name: t("reports.downloadAccountingFiles"),
            onclick: onClickDownloadMovingFiles,
          },
        ]
      : []),

    ...(isDailyPaymentsReport
      ? [
          {
            name: t("reports.excelReport"),
            onclick: onClickExportJournalExcelReport,
          }, 
          {
             name: t("reports.printCard"),
             onclick: onClickExportJournalPDFReport,
          },
        ]
      : []),

    ...(!isAccountingTransaction &&
    !isAdjustmentsReport &&
    !isDailyPaymentsReport
      ? [
          {
            name: t("reports.printCard"),
            onclick: onClickPrintCard,
          },
        ]
      : []),
  ];
  return {
    tabs,
  };
};

export { useLedgerReportHeader };
