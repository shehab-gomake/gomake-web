import { useTranslation } from "react-i18next";

export interface LedgerReportButtonWidgetProps {
  onClickCreateNewTransaction: () => void;
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickSendingTicketByEmail: () => void;
  onClickAdjustments: () => void;

}

const useLedgerReportHeader = ({ onClickCreateNewTransaction, onClickSendingTicketByEmail, onClickPrintCard, onClickShowCard, onClickAdjustments }: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation()
  const tabs = [
    {
      name: t("reports.createNewTransaction"),
      onclick: onClickCreateNewTransaction
    },
    {
      name: t("reports.sendingTicketByEmail"),
      onclick: onClickSendingTicketByEmail
    },
    {
      name: t("reports.printCard"),
      onclick: onClickPrintCard
    },
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard
    },
    {
      name: "Adjustments",
      onclick: onClickAdjustments
    }
  ]

  return {
    tabs
  };
};

export { useLedgerReportHeader };
