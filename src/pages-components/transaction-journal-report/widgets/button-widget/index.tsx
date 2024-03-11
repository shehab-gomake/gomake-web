import { GomakePrimaryButton } from "@/components";

import { LedgerReportButtonWidgetProps, useLedgerReportHeader } from "./use-button-widget";
import { useStyle } from "./style";


const LedgerReportButtonWidget = ({
  onClickPrintCard,
  onClickShowCard,
}: LedgerReportButtonWidgetProps) => {
  const { clasess } = useStyle()
  const { tabs } = useLedgerReportHeader({
    onClickPrintCard,
    onClickShowCard,
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
