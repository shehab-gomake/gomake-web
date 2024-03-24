import { useCallback, useEffect, useState } from "react";
import {useTranslation} from "react-i18next";
import {getAllCompanyReport} from '@/services/hooks';
import { useGomakeAxios } from "@/hooks";

export const useCompanyReport = () => {
    const { t } = useTranslation();
    const tableHeaders =  [
        t("companyReports.companyName"),
        t("companyReports.Domain"),
        t("companyReports.PhoneNumber"),
        t("companyReports.Email"),
        t("companyReports.StartingDate"),
        t("companyReports.LastUpdateIn30Days"),
        t("companyReports.Users"),
        t("companyReports.Quote"),
        t("companyReports.QuoteItems"),
        t("companyReports.Orders"),
        t("companyReports.OrderItems"),
        t("companyReports.EstimationSuccessRate"),
    ];
 
    const [AllReport, setAllReport] = useState<any>();
    const { callApi } = useGomakeAxios();
    const getReport = useCallback(async () => {
        const data = await getAllCompanyReport(callApi);
        setAllReport(data);
    }, [callApi]);

    useEffect(() => {
        getReport();
    }, [getReport]);


  return {
    t,
    tableHeaders,
    AllReport
  }

};


