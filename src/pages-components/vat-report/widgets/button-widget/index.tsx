import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useStyle } from "./style";


export interface VatReportButtonWidgetProps {
    onClickBtn1: () => void;
    onClickBtn2: () => void;
    onClickBtn3: () => void;
}
const VatReportButtonWidget = ({ onClickBtn1, onClickBtn2, onClickBtn3 }: VatReportButtonWidgetProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation()

    const tabs = [
        {
            name: t("reports.showVatReport"),
            onclick: onClickBtn1
        },
        {
            name: t("reports.printVatReport"),
            onclick: onClickBtn2
        },
        {
            name: t("reports.excelVatReport"),
            onclick: onClickBtn3
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
export { VatReportButtonWidget }; 