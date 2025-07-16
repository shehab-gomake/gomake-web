import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import { PrintIcon } from "@/icons";

export interface LedgerReportButtonWidgetProps {
  onClickCreateNewTransaction: () => void;
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickSendingTicketByEmail: () => void;
  onClickAdjustments: () => void;
}

const useLedgerReportHeader = ({
  onClickCreateNewTransaction,
  onClickSendingTicketByEmail,
  onClickPrintCard,
  onClickShowCard,
  onClickAdjustments,
}: LedgerReportButtonWidgetProps) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  const primaryActions = [
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard,
    },
    {
      name: t("reports.adjustments"),
      onclick: onClickAdjustments,
    },
    {
      name: t("reports.createNewTransaction"),
      onclick: onClickCreateNewTransaction,
    },
  ];

  const menuActions = [
    {
      name: t("reports.printCard"),
      onclick: onClickPrintCard,
      icon: <PrintIcon stroke={primaryColor(300)} />,
    },
    {
      name: t("reports.sendingTicketByEmail"),
      onclick: onClickSendingTicketByEmail,
      icon: (
        <ForwardToInboxRoundedIcon
          style={{ color: primaryColor(300), fontSize: "22px" }}
        />
      ),
    },
  ];

  return {
    primaryActions,
    menuActions,
  };
};

export { useLedgerReportHeader };
