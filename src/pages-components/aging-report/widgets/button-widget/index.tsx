import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PrintIcon } from "@/icons";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Button } from "@mui/material";
import { ReportActionsMenu } from "@/pages-components/transaction-journal-report/widgets/button-widget/report-actions-menu/report-actions-menu";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export interface AgingReportButtonWidgetProps {
  onClickBtn1: () => void;
  onClickBtn2: () => void;
  onClickBtn3: () => void;
  onClickBtn4: () => void;
  onClickBtn5: () => void;
}
const AgingReportButtonWidget = ({
  onClickBtn1,
  onClickBtn2,
  onClickBtn3,
  onClickBtn4,
  onClickBtn5,
}: AgingReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  const primaryActions = [
    {
      name: t("reports.showDebtCollection"),
      onclick: onClickBtn1,
    },
  ];

  const menuActions = [
    {
      name: t("reports.printDebtCollection"),
      onclick: onClickBtn2,
      icon: <PrintIcon stroke={primaryColor(300)} />,
    },
    {
      name: t("reports.excelDebtCollection"),
      onclick: onClickBtn3,
      icon: <FileDownloadOutlinedIcon style={{ color: primaryColor(300) }} />,
    },
    {
      name: t("sales.quote.sendPayment"),
      onclick: onClickBtn4,
      icon: (
        <ForwardToInboxRoundedIcon
          style={{ color: primaryColor(300), fontSize: "22px" }}
        />
      ),
    },
    {
      name: t("reports.sendViaWhatsApp"),
      onclick: onClickBtn5,
      icon: (
        <WhatsAppIcon style={{ color: primaryColor(300), fontSize: "22px" }} />
      ),
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
export { AgingReportButtonWidget };
