import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";


export interface AgingReportButtonWidgetProps {
  onClickBtn1: () => void;
  onClickBtn2: () => void;
  onClickBtn3: () => void;
  onClickBtn4: () => void;
}
const AgingReportButtonWidget = ({ onClickBtn1, onClickBtn2, onClickBtn3, onClickBtn4 }: AgingReportButtonWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation()

  const tabs = [
    {
      name: t("reports.showDebtCollection"),
      onclick: onClickBtn1
    },
    {
      name: t("reports.printDebtCollection"),
      onclick: onClickBtn2
    },
    {
      name: t("reports.excelDebtCollection"),
      onclick: onClickBtn3
    },
    {
      name: t("sales.quote.sendPayment"),
      onclick: onClickBtn4
    }
  ]
  return (
    <div style={classes.mainContainer}>
      {tabs.map((tab, index) => {
        return (
          <SecondaryButton variant={"contained"} key={index} onClick={tab.onclick} style={classes.btnContainer}>{tab.name}</SecondaryButton>
        )
      })}
    </div>
  );
};
export { AgingReportButtonWidget };
