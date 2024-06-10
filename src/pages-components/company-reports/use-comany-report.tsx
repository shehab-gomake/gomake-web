import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAllDataPrintHousesReports } from "@/services/api-service/company-report/get-print-houses-report";
import { PrimaryButton } from "@/components/button/primary-button";
import { DirectboxSendIcon } from "@/icons";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { generateCalculateProductsExcelForPrintHousesApi } from "@/services/hooks";

export const useCompanyReport = () => {
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const { alertFault, alertSuccess, } = useSnackBar()

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
                    item?.quoteItemsCount,
                    item?.orderCount,
                    item?.orderItemsCount,
                    item?.successRate,
                    <PrimaryButton
                        onClick={() => generateCalculateProductsExcelForPrintHousesWithPrintHouseId(item?.id)}
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

    const generateCalculateProductsExcelForPrintHouses = async () => {

        const callBack = (res) => {
            if (res.success) {
                alertSuccess("Email has been sent")
            }
            else {
                alertFault("Failed to send email")
            }

        }
        await generateCalculateProductsExcelForPrintHousesApi(callApi, callBack, {})
    }
    const generateCalculateProductsExcelForPrintHousesWithPrintHouseId = async (printHouseId) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccess("Email has been sent")
            }
            else {
                alertFault("Failed to send email")
            }

        }
        await generateCalculateProductsExcelForPrintHousesApi(callApi, callBack, { printHouseId: printHouseId })
    }
    return {
        t,
        tableHeaders,
        AllReport,
        generateCalculateProductsExcelForPrintHouses
    }

};


