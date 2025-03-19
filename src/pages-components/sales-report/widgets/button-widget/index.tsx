import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

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

  const tabs = [
    {
      name: t("permissions.ShowReports"),
      onclick: onClickBtn1,
    },
    {
      name: t("reports.printReport"),
      onclick: onPrintClick,
    },
    {
      name: t("reports.excelReport"),
      onclick: onClickExportExcelReport,
    },
  ];
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
        );
      })}
    </div>
  );
};
export { SalesReportButtonWidget };
