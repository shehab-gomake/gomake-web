import { useCallback, useState } from "react";

import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";

const useSalesReport = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()
  const { agent, agentsCategories, handleAgentChange } = useAgentsList()

  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableHeader, setTableHeader] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const transformedHeaders = tableHeader?.map(header => header.name);

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onChangeDetailedReport = () => {
    setDetailedReport(!detailedReport)
  }

  const getTableDataRows = useCallback(() => {
    return tableData.map(data => {
      const rowData = [];
      tableHeader.forEach(header => {
        rowData.push(data[header.key]);
      });
      return rowData;
    });
  }, [tableData, tableHeader]);

  const onClickBtn1 = () => {
    setShowTable(false);
    getAgingReportFilter()
  }
  const getAgingReportFilter = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-aging-report`,
        {
          startDate: fromDate,
          endDate: toDate,
          clientId: customer?.id,
          agentId: agent?.id,
        }
      );
      if (res?.success) {
        setTableData(res?.data?.data?.data?.data)
        setTableHeader(res?.data?.data?.data?.headers)

        alertSuccessGetData();
        setShowTable(true)
      } else {
        alertFaultGetData();
        setShowTable(false)
      }
    },
    [fromDate, toDate, agent, customer]
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
    detailedReport,
    getTableDataRows,
    onChangeDetailedReport,
    transformedHeaders
  };
};

export { useSalesReport };
