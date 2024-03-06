import { GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";


export interface AgingReportButtonWidgetProps {
  onClickBtn1: () => void;
  onClickBtn2: () => void;
  onClickBtn3: () => void;
}
const AgingReportButtonWidget = ({ onClickBtn1, onClickBtn2, onClickBtn3 }: AgingReportButtonWidgetProps) => {
  const { clasess } = useStyle()
  const tabs = [
    {
      name: "Show Delinquency",
      onclick: onClickBtn1
    },
    {
      name: "Print Debt Settlement",
      onclick: onClickBtn2
    },
    {
      name: "Debt Settlement Excel",
      onclick: onClickBtn3
    }
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
export { AgingReportButtonWidget };
