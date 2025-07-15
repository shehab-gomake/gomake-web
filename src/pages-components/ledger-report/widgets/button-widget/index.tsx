import {
  LedgerReportButtonWidgetProps,
  useLedgerReportHeader,
} from "./use-button-widget";
import { useStyle } from "./style";
import { Button } from "@mui/material";
import { ReportActionsMenu } from "@/pages-components/transaction-journal-report/widgets/button-widget/report-actions-menu/report-actions-menu";

//!here start
const LedgerReportButtonWidget = ({
  onClickCreateNewTransaction,
  onClickPrintCard,
  onClickShowCard,
  onClickSendingTicketByEmail,
  onClickAdjustments,
}: LedgerReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { primaryActions, menuActions } = useLedgerReportHeader({
    onClickCreateNewTransaction,
    onClickPrintCard,
    onClickShowCard,
    onClickSendingTicketByEmail,
    onClickAdjustments,
  });

  return (
    <div style={classes.mainContainer}>
      {primaryActions.map((action, index) => (
        <Button
          key={index}
          variant={index === 0 ? "contained" : "outlined"}
          onClick={action.onclick}
          sx={index === 0 ? classes.primaryButton : classes.optionsButtons}
        >
          {action.name}
        </Button>
      ))}

      {menuActions.length > 0 && (
        <ReportActionsMenu
          actions={menuActions.map((action) => ({
            name: action.name,
            icon: action.icon,
            onClick: action.onclick,
          }))}
        />
      )}
    </div>
  );
};
export { LedgerReportButtonWidget };
