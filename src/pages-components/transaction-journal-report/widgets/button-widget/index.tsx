import {
  LedgerReportButtonWidgetProps,
  useLedgerReportHeader,
} from "./use-button-widget";
import { useStyle } from "./style";
import { ReportActionsMenu } from "./report-actions-menu/report-actions-menu";
import { Button } from "@mui/material";

const LedgerReportButtonWidget = (props: LedgerReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { primaryActions, menuActions } = useLedgerReportHeader(props);

  return (
    <div style={classes.mainContainer}>
      {primaryActions.map((action, index) => (
        <Button
          key={index}
          variant={"outlined"}
          onClick={action.onclick}
          // startIcon={action.icon}
          sx={classes.optionsButtons}
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
