import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";


export interface AgingReportButtonWidgetProps {
  onClickCreateNewTransaction: () => void;
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickSendingTicketByEmail: () => void;
}
const AgingReportButtonWidget = ({
  onClickCreateNewTransaction,
  onClickPrintCard,
  onClickShowCard,
  onClickSendingTicketByEmail }: AgingReportButtonWidgetProps) => {
  const { clasess } = useStyle()
  const tabs = [
    {
      name: "Create new transaction",
      onclick: onClickCreateNewTransaction
    },
    {
      name: "Sending ticket by email",
      onclick: onClickSendingTicketByEmail
    },
    {
      name: "Print card",
      onclick: onClickPrintCard
    },
    {
      name: "Show card",
      onclick: onClickShowCard
    }
  ]
  return (
    <div style={clasess.mainContainer}>
      {tabs.map((tab, index) => {
        return (
          <GomakePrimaryButton key={index} onClick={tab.onclick} style={clasess.btnContainer}>{tab.name}</GomakePrimaryButton>
        )
      })}
    </div>
  );
};
export { AgingReportButtonWidget };
