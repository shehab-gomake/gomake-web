import { useCallback, useEffect, useState } from "react";
import {useTranslation} from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { getAllDataPrintHousesReports } from "@/services/api-service/company-report/get-print-houses-report";

export const useCompanyReport = () => {
    const { t } = useTranslation();
    const tableHeaders =  [
        t("companyReports.companyName"),
        t("companyReports.Domain"),
        t("companyReports.PhoneNumber"),
        t("companyReports.Email"),
        t("companyReports.StartingDate"),
        // t("companyReports.LastUpdateIn30Days"),
        // t("companyReports.Users"),
        t("companyReports.Quote"),
        t("companyReports.QuoteItems"),
        t("companyReports.Orders"),
        t("companyReports.OrderItems"),
        t("companyReports.EstimationSuccessRate"),
    ];
 
    const [AllReport, setAllReport] = useState([]);
    const { callApi } = useGomakeAxios();
    const getReport = useCallback(async () => {
        const callBack = (res) => {
            if (res?.success) {
                const formattedData = res.data.map((item) => [
                    item?.printHouseName,
                    item?.domain,
                    item?.phone,
                    item?.mail,
                    item.creationDate ? new Date(item.creationDate).toLocaleDateString() : "N/A",
                    item?.quotesCount,
                    item?.orderCount,
                    item?.quoteItemsCount,
                    item?.orderItemsCount,
                    item?.successRate
            ]);
                setAllReport(formattedData);
            }
        }
       await getAllDataPrintHousesReports(callApi, callBack).then();
    }, [callApi]);

    useEffect(() => {
        getReport()
    }, [])


  return {
    t,
    tableHeaders,
    AllReport
  }

};


