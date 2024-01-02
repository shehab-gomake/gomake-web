import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { MoreMenuWidget } from "../more-circle";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect, useState } from "react";
import { getAllDocumentsApi } from "@/services/api-service/generic-doc/documents-api";
import { useGomakeAxios } from "@/hooks";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { useQuoteWidget } from "../quote-widget/use-quote-widget";

const useQuoteTableWidget = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { callApi } = useGomakeAxios();

    const tabLabels = [
        t('home.tabs.Quotes'),
        t('home.tabs.Orders'),
        t('home.tabs.Items'),
        t('home.tabs.Delivery'),
        t('home.tabs.Invoice'),
        t('home.tabs.Receipt'),
    ];

    const tableHeaders = [
        t("home.headers.documentNumber"),
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
        ['10100669', 'Tester 3', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['10100679', 'Tester 1', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>],
        ['10100689', 'Tester 2', 'US006_CheckPrinting', '02-23-2023 at 10:07pm', 'NIS 9,822', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.closeBtnStyle}>closed</h2></div>, 'Get a signed', <MoreMenuWidget></MoreMenuWidget>]
    ];

    const [allDocuments, setAllDocuments] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { getCurrencyUnitText } = useQuoteGetData();
    const {selectedClient , userQuote , getAndSetExistQuote} = useQuoteWidget();

    const getAllQuotes = async (docType) => {
        const callBack = (res) => {
          if (res?.success) {
            const data = res?.data?.data;
            const mapData = data?.map((document: any) => [
             // GetDateFormat(quote?.createdDate),
              document?.number,
              document?.clientType,
              document?.worksNames,
              document?.totalPrice + " " + getCurrencyUnitText(document?.currency),
              document?.notes,
              "open",
              <MoreMenuWidget
                // document={document}
                // documentType={docType}
                // onClickDuplicate={onClickQuoteDuplicate}
                // onClickLoggers={() => onClickOpenLogsModal(document?.number)}
              />,
            ]);
            setAllDocuments(mapData);
          }
        };
        await getAllDocumentsApi(callApi, callBack, {documentType: docType,  data: {
            model: {
              pageNumber: page,
              pageSize: limit,
            },
            customerId: selectedClient,
          }}); 
      };
    

      useEffect(() => {
        getAllQuotes(0);
        console.log("heeeeeeeeeeeeeeeeee " , selectedClient)
    }, []);



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
