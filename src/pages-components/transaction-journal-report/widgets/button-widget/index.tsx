import { LedgerReportButtonWidgetProps, useLedgerReportHeader } from "./use-button-widget";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";


const LedgerReportButtonWidget = ({
  onClickPrintCard,
  onClickShowCard,
}: LedgerReportButtonWidgetProps) => {
  const { classes } = useStyle()
  const { tabs } = useLedgerReportHeader({
    onClickPrintCard,
    onClickShowCard,
  })

  return (
    <div style={classes.mainContainer}>
      {tabs.map((tab, index) => {
        return (
          <SecondaryButton
          variant="contained"
          key={index}
          onClick={tab.onclick}
          style={classes.btnContainer}
        >
          {tab.name}
        </SecondaryButton>
        )
      })}
    </div>
  );
};
export { LedgerReportButtonWidget };
