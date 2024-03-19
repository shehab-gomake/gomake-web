import { useCallback, useEffect, useState } from "react";

import { useAgentsList, useCustomerDropDownList, useDocumentsType, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { useTranslation } from "react-i18next";

const useSalesReport = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation()

  const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()
  const { agent, agentsCategories, handleAgentChange } = useAgentsList()
  const { documentsTypeList, documentType, handleDocumentTypeChange } = useDocumentsType()
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [displayByGroups, setDisplayByGroups] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([])
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
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
      }
      else {
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
      let getMonthes = getMonthsArray(toDate)

      setDateList(getMonthes)
    }
  }, [toDate])
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onChangeDisplayByGroups = () => {
    setDisplayByGroups(!displayByGroups)
  }

  const tableHeaders = [
    t("reports.clientCode"),
    t("reports.clientName"),
    t("reports.salesAmount"),
    t("reports.refunds amount"),
    ...dateList,
    t("reports.totalPrice"),

  ];
  function sumAllItems(salesReports) {
    return salesReports?.reduce((total, report) => {
      for (const key in report) {
        if (typeof report[key] === 'number') {
          total[key] = (total[key] || 0) + report[key];
        }
      }
      return total;
    }, {});
  }

  const totalSum = sumAllItems(tableData);
  const getTableDataRows = useCallback(() => {
    if (tableData?.length) {
      return tableData?.map((data) => [
        data?.cardCode,
        data?.cardName,
        data?.totalSalesAmount,
        data?.totalRefundsAmount,
        data?.prevSales.toFixed(2),
        data?.prev3MonthSales.toFixed(2),
        data?.prev2MonthSales.toFixed(2),
        data?.prevMonthSales.toFixed(2),
        data?.thisMonthSales.toFixed(2),
        data?.totalSales.toFixed(2),
      ]);
    }

  }, [tableData]);

  const getTotalTableDataRows = useCallback(() => {
    if ([totalSum]?.length) {
      return [totalSum]?.map((data) => [
        t("reports.SumOfColumns"),
        "",
        data?.totalSalesAmount,
        data?.totalRefundsAmount,
        data?.prevSales.toFixed(2),
        data?.prev3MonthSales.toFixed(2),
        data?.prev2MonthSales.toFixed(2),
        data?.prevMonthSales.toFixed(2),
        data?.thisMonthSales.toFixed(2),
        data?.totalSales.toFixed(2),
      ]);
    }

  }, [tableData]);

  const onClickBtn1 = () => {
    setShowTable(false);
    getAgingReportFilter()
  }
  const getAgingReportFilter = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-sales-report`,
        {
          startDate: fromDate,
          endDate: toDate,
          clientId: customer?.id,
          agentId: agent?.id,
          documentsType: documentType,
          displayByGroup: displayByGroups
        }
      );
      if (res?.success) {
        setTableData(res?.data?.data?.data?.salesReports)

        alertSuccessGetData();
        setShowTable(true)
      } else {
        alertFaultGetData();
        setShowTable(false)
      }
    },
    [fromDate, toDate, agent, customer, documentType, displayByGroups]
  );


  return {
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
    documentsTypeList,
    tableHeaders,
    getTotalTableDataRows
  };
};

export { useSalesReport };
