import { useCallback, useRef, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {startOfMonth, endOfMonth, format} from "date-fns";
import { useTranslation } from "react-i18next";
import { EHttpMethod } from "@/services/api-service/enums";
import { downloadPdf } from "@/utils/helpers";

const useVatReport = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();


    const [vatData, setVatData] = useState<any>({});
    const [showTable, setShowTable] = useState<boolean>(false);

    const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
    const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

    const dateRef = useRef(null);

    const onClickBtn1 = () => {
        setShowTable(false);
        getVatReportFilter();
    };

    const onClickBtn2 = () => {
        handleExportRows();
    };

    const getVatReportFilter = useCallback(async () => {
        if (!fromDate || !toDate) {
            alertFault("alerts.pleaseEnsureDatesSelected");
            return;
        }

        const formattedStartDate = format(fromDate, "yyyy-MM-dd");
        const formattedEndDate = format(toDate, "yyyy-MM-dd");

        const res = await callApi(
            EHttpMethod.POST,
            `/v1/erp-service/reports/get-vat-report`,
            {
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
        );
        if (res?.success) {
            setVatData(res.data?.data?.data);
            alertSuccessGetData();
            setShowTable(true);
        } else {
            alertFaultGetData();
            setShowTable(false);
        }
    }, [fromDate, toDate]);





    const handleFromDateChange = (newDate) => {
        setFromDate(newDate ? new Date(newDate) : null);


    };
    const handleToDateChange = (newDate) => {
        setToDate(newDate ? new Date(newDate) : null);
    };

    const handleExportRows = async () => {
        if (!fromDate || !toDate) {
            alertFault("alerts.pleaseEnsureDatesSelected");
            return;
        }
        const res = await callApi(
            EHttpMethod.POST,
            `/v1/erp-service/reports/get-vat-report-pdf`,
            {
                startDate: fromDate,
                endDate: toDate,
            }
        );
        if (res?.success) {
            const pdfLink = res?.data?.data?.data;
            downloadPdf(pdfLink);
            alertSuccessGetData();
        } else {
            alertFaultGetData();
        }
    };
    return {
        t,
        onClickBtn1,
        onClickBtn2,
        showTable,
        setShowTable,
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        handleFromDateChange,
        handleToDateChange,
        vatData
    };
};

export { useVatReport }; 