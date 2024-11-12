import { EReportType } from "@/enums";
import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  reportType: EReportType;
}

const useLedgerReportHeader = ({
  onClickPrintCard,
  onClickShowCard,
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
