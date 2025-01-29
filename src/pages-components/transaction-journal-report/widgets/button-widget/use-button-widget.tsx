import { EReportType } from "@/enums";
import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickCreateNewTransaction?: () => void;
  onClickOpenAdjustmentsModal?: () => void;
  onClickExportAccountingReportExcel?: () => void;
  onClickDownloadMovingFiles?: () => void;
  reportType: EReportType;
}

const useLedgerReportHeader = ({
  onClickPrintCard,
  onClickShowCard,
  onClickCreateNewTransaction,
  onClickOpenAdjustmentsModal,
  onClickExportAccountingReportExcel,
  onClickDownloadMovingFiles,
  reportType,
}: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation();
  const isAccountingTransaction =
    reportType === EReportType.AccountingTransaction;
  const isAdjustmentsReport = reportType === EReportType.AdjustmentsReport;

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

    ...(!isAccountingTransaction && !isAdjustmentsReport
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
