import { useCallback, useEffect, useState } from "react";
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
import { ReportsType } from "@/enums";

const useSalesReport = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const {
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    isFetching,
  } = useCustomerDropDownList();
  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const { reportsTypeList, documentType, handleDocumentTypeChange } =
    useDocumentsType();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [displayByGroups, setDisplayByGroups] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [fromDate, setFromDate] = useState<Date>(startOfYear(new Date()));
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

  const tableHeaders = [
    t("reports.clientCode"),
    t("reports.clientName"),
    t("reports.salesAmount"),
    t("reports.refunds amount"),
    ...dateList,
    t("reports.totalPrice"),
  ];

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

  // const getTotalTableDataRows = useCallback(() => {
  //   if ([totalSum]?.length && totalSum) {
  //     return [totalSum]?.map((data) => [
  //       t("reports.SumOfColumns"),
  //       "",
  //       data?.totalSalesAmount,
  //       data?.totalRefundsAmount,
  //       data?.prevSales.toFixed(2),
  //       data?.prev3MonthSales.toFixed(2),
  //       data?.prev2MonthSales.toFixed(2),
  //       data?.prevMonthSales.toFixed(2),
  //       data?.thisMonthSales.toFixed(2),
  //       data?.totalSales.toFixed(2),
  //     ]);
  //   } else return [];
  // }, [tableData]);

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
      }
    );
    if (res?.success) {
      setTableData(res?.data?.data?.data?.salesReports);

      alertSuccessGetData();
      setShowTable(true);
    } else {
      alertFaultGetData();
      setShowTable(false);
    }
  }, [fromDate, toDate, agent, customer, documentType, displayByGroups]);

  const handleDateChange = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      setFromDate(null);
      setToDate(null);
    }
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
  };
};

export { useSalesReport };
