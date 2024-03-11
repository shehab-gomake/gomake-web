import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;

}

const useLedgerReportHeader = ({ onClickPrintCard, onClickShowCard }: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation()
  const tabs = [
    {
      name: t("reports.printCard"),
      onclick: onClickPrintCard
    },
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard
    },
  ]

  return {
    tabs
  };
};

export { useLedgerReportHeader };
