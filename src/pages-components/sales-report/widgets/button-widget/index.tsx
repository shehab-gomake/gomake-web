import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";


export interface SalesReportButtonWidgetProps {
  onClickBtn1: () => void;
}
const SalesReportButtonWidget = ({ onClickBtn1 }: SalesReportButtonWidgetProps) => {
  const { clasess } = useStyle()
  const tabs = [
    {
      name: "Show Report",
      onclick: onClickBtn1
    },
  ]
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
export { SalesReportButtonWidget };
