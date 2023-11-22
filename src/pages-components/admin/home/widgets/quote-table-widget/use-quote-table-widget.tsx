import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";

const useQuoteTableWidget = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();


    const tableHeaders = [
        t("offer number"),
        t("client type"),
        t("job name"),
        t("Production Date"),
        t("final price"),
        t("Status"),
        t("remark"),
        t("more"),
    ];

    const tableRows = [
        ['1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010062', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010063', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010064', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010065', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{display:"flex", justifyContent:"center"}} ><h2  style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
    ];

    return {
        tableHeaders,
        tableRows
    };
};

export { useQuoteTableWidget };
