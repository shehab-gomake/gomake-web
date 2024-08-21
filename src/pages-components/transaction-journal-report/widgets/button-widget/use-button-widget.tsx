import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;

}

const useLedgerReportHeader = ({ onClickPrintCard, onClickShowCard }: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation()
  const tabs = [
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard
    },
    {
      name: t("reports.printCard"),
      onclick: onClickPrintCard
    },
  ]

  return {
    tabs
  };
};

export { useLedgerReportHeader };
