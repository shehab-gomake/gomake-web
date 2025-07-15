import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrintIcon } from "@/icons";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button } from "@mui/material";
import { ReportActionsMenu } from "@/pages-components/transaction-journal-report/widgets/button-widget/report-actions-menu/report-actions-menu";

export interface SalesReportButtonWidgetProps {
  onClickBtn1: () => void;
  onPrintClick: () => void;
  onClickExportExcelReport: () => void;
}
const SalesReportButtonWidget = ({
  onClickBtn1,
  onPrintClick,
  onClickExportExcelReport,
}: SalesReportButtonWidgetProps) => {
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
      onclick: onPrintClick,
      icon: <PrintIcon stroke={primaryColor(300)} />,
    },
    {
      name: t("reports.excelReport"),
      onclick: onClickExportExcelReport,
      icon: <FileDownloadOutlinedIcon style={{ color: primaryColor(300) }} />,
    },
  ];

  return (
    <div style={classes.mainContainer}>
      {primaryActions.map((action, index) => (
        <Button
          key={index}
          variant={"contained"}
          onClick={action.onclick}
          sx={classes.primaryButton}
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
export { SalesReportButtonWidget };
