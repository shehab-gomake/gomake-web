import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { createMuiTheme } from "@mui/material";

const useQuoteTableWidget = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    const tabLabels = [
        t('Quotes'),
        t('Orders'),
        t('Items'),
        t('Delivery'),
        t('Invoice'),
        t('Receipt'),
    ];

    function createData(
        offerNumber: any,
        clientType: any,
        jobName: any,
        product: any,
        finalPrice: any,
        status: any,
        remark: any,
        more: any,
    ) {
        return {
            offerNumber,
            clientType,
            jobName,
            product,
            finalPrice,
            status,
            remark,
            more
        };
    }

    const quoteRows = [
        createData('1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010062', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010063', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010064', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010065', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>)
    ];

    const orderRows = [
        createData('1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>)
    ];

    const itemRows = [
        createData('1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
    ];

    const deliveryRows = [
        createData('1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>)
    ];
    const invoiceRows = [
        createData('1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
    ];

    const receiptRows = [
        createData('1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>),
        createData('1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>)
    ];

    const theme = createMuiTheme({
        palette: {
            secondary: {
                main: '#FFF',
            },
        },
    });
    return {
        tabLabels,
        quoteRows,
        orderRows,
        itemRows,
        deliveryRows,
        invoiceRows,
        receiptRows,
        theme
    };
};

export { useQuoteTableWidget };
