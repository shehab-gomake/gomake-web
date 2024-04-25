import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { getAllDataPrintHousesReports } from "@/services/api-service/company-report/get-print-houses-report";
import { PrimaryButton } from "@/components/button/primary-button";
import { DirectboxSendIcon, EditIcon } from "@/icons";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GenerateCalculateProductsExcelForPrintHouses } from "@/services/hooks";

export const useCompanyReport = () => {
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();


    const tableHeaders = [
        t("companyReports.companyName"),
        t("companyReports.Domain"),
        t("companyReports.PhoneNumber"),
        t("companyReports.Email"),
        t("companyReports.StartingDate"),
        t("companyReports.Status"),
        t("companyReports.Quote"),
        t("companyReports.QuoteItems"),
        t("companyReports.Orders"),
        t("companyReports.OrderItems"),
        t("companyReports.EstimationSuccessRate"),
        t("companyReports.testCalculation"),
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
                    item.status,
                    item?.quotesCount,
                    item?.orderCount,
                    item?.quoteItemsCount,
                    item?.orderItemsCount,
                    item?.successRate,
                    <PrimaryButton
                        startIcon={
                            <DirectboxSendIcon stroke={primaryColor(500)} width={20} height={20} />
                        }
                        // onClick={() =>
                        //   navigate(
                        //     `/properties?actionId=${action?.actionId}&actionName=${action?.name}`
                        //   )
                        // }
                        variant={"text"}
                    >
                        <div style={{ textTransform: "lowercase", }}>{t("companyReports.testCalculation")}</div>
                    </PrimaryButton>
                ]);
                setAllReport(formattedData);
            }
        }
        await getAllDataPrintHousesReports(callApi, callBack).then();
    }, [callApi]);

    useEffect(() => {
        getReport()
    }, [])

    const getDocumentDesignByCreationDoc = async (printHouseId) => {

        const callBack = (res) => {
            if (res.success) {
                // setdocumentDesign(res.data);      
                // setdocumentDesignURL(res.data.previewUrl);
            }
            else {

            }

        }
        await GenerateCalculateProductsExcelForPrintHouses(callApi, callBack, { printHouseId: printHouseId })
    }
    return {
        t,
        tableHeaders,
        AllReport
    }

};


