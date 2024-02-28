import { GomakePrimaryButton } from "@/components";

import { LedgerReportButtonWidgetProps, useLedgerReportHeader } from "./use-button-widget";
import { useStyle } from "./style";


const LedgerReportButtonWidget = ({
  onClickCreateNewTransaction,
  onClickPrintCard,
  onClickShowCard,
  onClickSendingTicketByEmail,
  onClickAdjustments
}: LedgerReportButtonWidgetProps) => {
  const { clasess } = useStyle()
  const { tabs } = useLedgerReportHeader({
    onClickCreateNewTransaction,
    onClickPrintCard,
    onClickShowCard,
    onClickSendingTicketByEmail,
    onClickAdjustments
  })
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
export { LedgerReportButtonWidget };
