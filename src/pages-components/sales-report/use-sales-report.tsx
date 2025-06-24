import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  useAgentsList,
  useCustomerDropDownList,
  useDocumentsType,
  useGomakeAxios,
  useSnackBar,
} from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useTranslation } from "react-i18next";
import { endOfToday, startOfYear } from "date-fns";
import { DocumentsTypeReportList, ReportsType } from "@/enums";
import { getDocumentTypeName } from "../transaction-journal-report/use-transaction-journal-report";
import { initialFromDate } from "@/utils/helpers";
import { CLIENT_TYPE } from "@/pages/customers/enums";

const useSalesReport = (clientType: CLIENT_TYPE) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();

  const isPurchaseReport = clientType === CLIENT_TYPE.SUPPLIER;
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList({ clientType });

  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const { reportsTypeList, documentType, handleDocumentTypeChange } =
    useDocumentsType();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [displayByGroups, setDisplayByGroups] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [fromDate, setFromDate] = useState<Date>(
    initialFromDate("sales-report-date")
  );
  const [toDate, setToDate] = useState<Date>(endOfToday());
  const [dateList, setDateList] = useState<string[]>([]);

  function getMonthsArray(date: Date): string[] {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const result = [];

    for (let i = 0; i < 5; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentYear - Math.floor((currentMonth - i + 12) / 12);
      if (i === 4) {
        result.push(t("reports.before"));
      } else {
        if (month === 11) {
          result.push(`${month + 1}/${year - 1}`);
        } else {
          result.push(`${month + 1}/${year + 1}`);
        }
      }
    }

    return result.reverse();
  }

  useEffect(() => {
    if (toDate) {
      let getMonthes = getMonthsArray(toDate);

      setDateList(getMonthes);
    }
  }, [toDate]);

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onChangeDisplayByGroups = () => {
    setDisplayByGroups(!displayByGroups);
  };

  const tableHeaders = useMemo(() => {
    let headers = [
      t("reports.docDate"),
      t("reports.dueDate"),
      t("reports.documentNumber"),
      t("reports.transType"),
      t("reports.TransNumber"),
      t("profileSettings.businessNumber"),
      t("reports.cardcode"),
      t("reports.cardname"),
      t("customers.modal.agent"),
      `${t("reports.credit")} / ${t("reports.debit")}`,
    ];

    return headers;
  }, [t]);

  const getNewTableDataRows = useCallback(
    (dataTable) => {
      if (dataTable?.length) {
        return dataTable?.map((data) => {
          let documentPath;
          switch (data?.transType) {
            case DocumentsTypeReportList.Invoice:
              documentPath = "invoices";
              break;
            case DocumentsTypeReportList.InvoiceRefund:
              documentPath = "invoiceRefunds";
              break;
            default:
              documentPath = null;
          }
          return [
            data?.docDate?.split("T")[0],
            data?.dueDate?.split("T")[0],
            documentPath ? (
              <a
                style={{
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "unset",
                }}
                href={`/${documentPath}?finalPatternSearch=${data?.docNumber}&pageNumber=1`}
              >
                {data?.docNumber}
              </a>
            ) : (
              <span>{data?.docNumber}</span>
            ),
            getDocumentTypeName(t, data?.transType),
            data?.transNumber,
            data?.businessNumber ?? "-",
            data?.cardCode,
            data?.cardName,
            data?.agentName ?? "-",
            data?.credit > 0
              ? Number(data?.credit.toFixed(2))
              : data?.debit
              ? Number((-data.debit).toFixed(2))
              : 0,
          ];
        });
      } else return [];
    },
    [tableData]
  );

  function sumAllItems(salesReports) {
    if (!salesReports || !salesReports.length) return {};
    return salesReports.reduce((total, report) => {
      Object.keys(report).forEach((key) => {
        if (typeof report[key] === "number") {
          total[key] = (total[key] || 0) + report[key];
        }
      });
      return total;
    }, {});
  }

  const totalSum = tableData?.length ? sumAllItems(tableData) : {};
  const getTableDataRows = useCallback(() => {
    if (!tableData?.length) return [];
    return tableData.map((data) => [
      data?.cardCode || "",
      data?.cardName || "",
      data?.totalSalesAmount?.toFixed(2) || "0.00",
      data?.totalRefundsAmount?.toFixed(2) || "0.00",
      data?.prevSales?.toFixed(2) || "0.00",
      data?.prev3MonthSales?.toFixed(2) || "0.00",
      data?.prev2MonthSales?.toFixed(2) || "0.00",
      data?.prevMonthSales?.toFixed(2) || "0.00",
      data?.thisMonthSales?.toFixed(2) || "0.00",
      data?.totalSales?.toFixed(2) || "0.00",
    ]);
  }, [tableData]);

  const getTotalTableDataRows = useCallback(() => {
    if (!totalSum || !Object.keys(totalSum).length) return [];
    return [
      [
        t("reports.SumOfColumns"),
        "",
        totalSum.totalSalesAmount?.toFixed(2) || "0.00",
        totalSum.totalRefundsAmount?.toFixed(2) || "0.00",
        totalSum.prevSales?.toFixed(2) || "0.00",
        totalSum.prev3MonthSales?.toFixed(2) || "0.00",
        totalSum.prev2MonthSales?.toFixed(2) || "0.00",
        totalSum.prevMonthSales?.toFixed(2) || "0.00",
        totalSum.thisMonthSales?.toFixed(2) || "0.00",
        totalSum.totalSales?.toFixed(2) || "0.00",
      ],
    ];
  }, [totalSum, t]);

  const onClickBtn1 = () => {
    setShowTable(false);
    getAgingReportFilter();
  };

  const getAgingReportFilter = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-sales-report`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customer?.id,
        agentId: agent?.id,
        reportType: documentType ? documentType?.id : ReportsType.allInvoices,
        displayByGroup: displayByGroups,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      }
    );
    if (res?.success) {
      // setTableData(res?.data?.data?.data?.salesReports); //!old
      setTableData(res.data?.data?.data); //!new
      alertSuccessGetData();
      setShowTable(true);
    } else {
      alertFaultGetData();
      setShowTable(false);
    }
  }, [fromDate, toDate, agent, customer, documentType, displayByGroups]);

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      localStorage.setItem("sales-report-date", value[0]);
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  };

  const handleExportRows = async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }

    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/get-sales-report-pdf`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customer?.id,
        agentId: agent?.id,
        reportType: documentType ? documentType?.id : ReportsType.allInvoices,
        displayByGroup: displayByGroups,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
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

  const onClickExportExcelReport = useCallback(async () => {
    if (!fromDate || !toDate) {
      alertFault("alerts.pleaseEnsureDatesSelected");
      return;
    }
    const formattedStartDate = format(fromDate, "yyyy-MM-dd");
    const formattedEndDate = format(toDate, "yyyy-MM-dd");

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/reports/export-sales-report-excel`,
      {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        clientId: customer?.id,
        agentId: agent?.id,
        reportType: documentType ? documentType?.id : ReportsType.allInvoices,
        displayByGroup: displayByGroups,
        cardType: isPurchaseReport
          ? CLIENT_TYPE.SUPPLIER
          : CLIENT_TYPE.CUSTOMER,
      },
      true,
      null
    );

    if (res?.success) {
      const base64Data = res?.data?.data?.data?.base64Excel;
      const contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const linkSource = `data:${contentType};base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = isPurchaseReport
        ? "PurchasesReport"
        : "SalesReport.xlsx";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      alertFaultGetData();
    }
  }, [fromDate, toDate, agent, customer, documentType, displayByGroups]);

  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  return {
    t,
    onSelectDeliveryTimeDates,
    resetDatePicker,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickBtn1,
    showTable,
    displayByGroups,
    getTableDataRows,
    onChangeDisplayByGroups,
    documentType,
    handleDocumentTypeChange,
    reportsTypeList,
    tableHeaders,
    getTotalTableDataRows,
    handleDateChange,
    fromDate,
    toDate,
    isFetching,
    getNewTableDataRows,
    tableData,
    handleExportRows,
    onClickExportExcelReport,
    isPurchaseReport,
  };
};

export { useSalesReport };
