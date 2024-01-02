import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTable } from "@/components/tables/primary-table";

const useQuoteTableWidget = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();

    const tabLabels = [
        t('home.tabs.Quotes'),
        t('home.tabs.Orders'),
        t('home.tabs.Items'),
        t('home.tabs.Delivery'),
        t('home.tabs.Invoice'),
        t('home.tabs.Receipt'),
    ];

    const tableHeaders = [
        t("home.headers.offerNumber"),
        t("home.headers.clientType"),
        t("home.headers.jobName"),
        t("home.headers.productDate"),
        t("home.headers.finalPrice"),
        t("home.headers.status"),
        t("home.headers.remark"),
        t("home.headers.more")
    ];


    const quoteRows = [
        ['1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010062', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010063', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010064', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010065', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
    ];

    const orderRows = [
        ['1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
    ];

    const itemRows = [
        ['1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
    ];

    const deliveryRows = [
        ['1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
    ];
    const invoiceRows = [
        ['1010060', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.openBtnStyle}>open</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010061', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
    ];

    const receiptRows = [
        ['1010066', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010067', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['1010068', 'Tester', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
    ];

    const tabs: ITab[] = [
        {
            title: t('home.tabs.Quotes'), component: <PrimaryTable
                rows={quoteRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        },
        {
            title: t('home.tabs.Orders'), component: <PrimaryTable
                rows={orderRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        },
        {
            title: t('home.tabs.Items'), component: <PrimaryTable
                rows={itemRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        },
        {
            title: t('home.tabs.Delivery'), component: <PrimaryTable
                rows={deliveryRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        },
        {
            title: t('home.tabs.Invoice'), component: <PrimaryTable
                rows={invoiceRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        },
        {
            title: t('home.tabs.Receipt'), component: <PrimaryTable
                rows={receiptRows}
                headers={tableHeaders}
                variant="ClassicTable"
            />
        }
    ];

    return {
        tabLabels,
        quoteRows,
        orderRows,
        itemRows,
        deliveryRows,
        invoiceRows,
        receiptRows,
        tableHeaders,
        tabs
    };
};

export { useQuoteTableWidget };
