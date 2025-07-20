import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { ReportActionsMenu } from "@/pages-components/transaction-journal-report/widgets/button-widget/report-actions-menu/report-actions-menu";
import { Button } from "@mui/material";
import { PrintIcon } from "@/icons";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export interface VatReportButtonWidgetProps {
  onClickBtn1: () => void;
  onClickBtn2: () => void;
}

const VatReportButtonWidget = ({
  onClickBtn1,
  onClickBtn2,
}: VatReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  const primaryActions = [
    {
      name: t("permissions.ShowReports"),
      onclick: onClickBtn1,
    },
  ];

  const menuActions = [
    {
      name: t("reports.printReport"),
      onclick: onClickBtn2,
      icon: <PrintIcon stroke={primaryColor(300)} />,
    },
  ];

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
export { VatReportButtonWidget };
