import { useCallback, useEffect, useRef, useState } from "react";
import {
    useAgentsList,
    useGomakeAxios,
} from "@/hooks";
import { startOfMonth, endOfMonth } from "date-fns";
import { useTranslation } from "react-i18next";
import { getAndSetCustomerById } from "@/services/api-service/customers/customers-api";
import { CLIENT_TYPE_Id } from "@/pages/customers/enums";
import { getDocumentTypeName } from "../transaction-journal-report/use-transaction-journal-report";
import { DocumentsTypeReportList } from "@/enums";
import { useClientTypesList } from "@/hooks/use-client-types";

const useVatReport = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();


    const { agent, agentsCategories, handleAgentChange } = useAgentsList();
    const [selectDate, setSelectDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [showTable, setShowTable] = useState<boolean>(false);

    const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
    const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

    const dateRef = useRef(null);

    const onClickBtn1 = () => {
        setShowTable(false);
        // getVatReportFilter(detailedReport);
    };

    const onClickBtn2 = () => {
        // ExportVatReportPDF();
    };



    // const getVatReportFilter = useCallback(
    //     async (expendedReport = false, vatReportByCreationDate = false, orderBy?, isDescOrder?) => {
    //         if (!fromDate || !toDate) {
    //             alertFault("alerts.pleaseEnsureDatesSelected");
    //             return;
    //         }

    //         const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    //         const formattedEndDate = format(toDate, "yyyy-MM-dd");

    //         const res = await callApi(
    //             EHttpMethod.POST,
    //             `/v1/erp-service/reports/get-vat-report`,
    //             {
    //                 startDate: formattedStartDate,
    //                 endDate: formattedEndDate,
    //                 clientId: customer?.id,
    //                 referDate: selectDate ? selectDate : new Date(),
    //                 agentId: agent?.id,
    //                 //byCreationDate: byReferenceDate,
    //                 expendedReport: expendedReport,
    //                 byCreationDate: vatReportByCreationDate,
    //                 orderBy, //balanceDue  cardCode    cardName
    //                 isDescOrder,
    //                 cardType: isPurchaseReport
    //                     ? CLIENT_TYPE.SUPPLIER
    //                     : CLIENT_TYPE.CUSTOMER,
    //             }
    //         );
    //         if (res?.success) {
    //             setTableData(res?.data?.data?.data?.data);
    //             setTableHeader(res?.data?.data?.data?.headers);
    //             alertSuccessGetData();
    //             setShowTable(true);
    //         } else {
    //             alertFaultGetData();
    //             setShowTable(false);
    //         }
    //     },
    //     [
    //         fromDate,
    //         toDate,
    //         detailedReport,
    //         agent,
    //         customer,
    //         selectDate,
    //         byReferenceDate,
    //     ]
    // );

    // const ExportVatReportPDF = useCallback(async () => {
    //     if (!fromDate || !toDate) {
    //         alertFault("alerts.pleaseEnsureDatesSelected");
    //         return;
    //     }

    //     const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    //     const formattedEndDate = format(toDate, "yyyy-MM-dd");

    //     const res = await callApi(
    //         EHttpMethod.POST,
    //         `/v1/erp-service/reports/export-vat-report-pdf`,
    //         {
    //             myBody: {
    //                 startDate: formattedStartDate,
    //                 endDate: formattedEndDate,
    //                 clientId: customer?.id,
    //                 referDate: selectDate ? selectDate : new Date(),
    //                 agentId: agent?.id,
    //                 byCreationDate: vatReportByCreationDate,
    //                 expendedReport: detailedReport,
    //                 orderBy,
    //                 isDescOrder,
    //                 cardType: isPurchaseReport
    //                     ? CLIENT_TYPE.SUPPLIER
    //                     : CLIENT_TYPE.CUSTOMER,
    //             },
    //         },
    //         true,
    //         null
    //     );
    //     const pdfLink = res?.data?.data?.data;
    //     downloadPdf(pdfLink);
    // }, [
    //     fromDate,
    //     toDate,
    //     detailedReport,
    //     agent,
    //     selectDate,
    //     byReferenceDate,
    //     orderBy,
    //     isDescOrder,
    // ]);
    // const downloadPdf = (url) => {
    //     const anchor = document.createElement("a");
    //     anchor.href = url;
    //     anchor.target = "_blank";
    //     anchor.addEventListener("click", () => {
    //         setTimeout(() => {
    //             anchor.remove();
    //         }, 100);
    //     });
    //     anchor.click();
    // };
    // const ExportVatReportExcel = useCallback(async () => {
    //     if (!fromDate || !toDate) {
    //         alertFault("alerts.pleaseEnsureDatesSelected");
    //         return;
    //     }

    //     const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    //     const formattedEndDate = format(toDate, "yyyy-MM-dd");

    //     const res = await callApi(
    //         EHttpMethod.POST,
    //         `/v1/erp-service/reports/export-vat-report-excel`,
    //         {
    //             myBody: {
    //                 startDate: formattedStartDate,
    //                 endDate: formattedEndDate,
    //                 clientId: customer?.id,
    //                 referDate: selectDate ? selectDate : new Date(),
    //                 agentId: agent?.id,
    //                 byCreationDate: vatReportByCreationDate,
    //                 expendedReport: detailedReport,
    //                 cardType:  CLIENT_TYPE.CUSTOMER,
    //             },
    //         },
    //         true,
    //         null,
    //         "blob"
    //     );

    //     const downloadLink = document.createElement("a");
    //     const link = URL?.createObjectURL(res.data);
    //     downloadLink.href = link;
    //     downloadLink.download = `customer vat.xlsx`;
    //     downloadLink.click();
    // }, [
    //     fromDate,
    //     toDate,
    //     detailedReport,
    //     agent,
    //     selectDate,
    //     byReferenceDate,
    // ]);





    const handleFromDateChange = (newDate) => {
        setFromDate(newDate);
    };
    const handleToDateChange = (newDate) => {
        setToDate(newDate);
    };
    return {
        t,
        agent,
        agentsCategories,
        handleAgentChange,
        onClickBtn1,
        onClickBtn2,
        showTable,
        setShowTable,
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        handleFromDateChange,
        handleToDateChange
    };
};

export { useVatReport }; 