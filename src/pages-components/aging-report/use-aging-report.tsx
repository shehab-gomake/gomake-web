import { useCallback, useRef, useState } from "react";

import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { EExportType } from "@/enums";

const useAgingReport = () => {
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList()
  const { agent, agentsCategories, handleAgentChange } = useAgentsList()

  const [selectDate, setSelectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [byReferenceDate, setByReferenceDate] = useState<boolean>(false);
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableHeader, setTableHeader] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const transformedHeaders = tableHeader?.map(header => header.name);
  const dateRef = useRef(null);

  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };

  const onChangeDetailedReport = () => {
    setDetailedReport(!detailedReport)
  }
  const onChangeByReferenceDate = () => {
    setByReferenceDate(!byReferenceDate)
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
  const onClickBtn2 = () => {
    // ExportAgingReport(EExportType.PDF)
    ExportAgingReportPDF()
  }
  const onClickBtn3 = () => {
    // ExportAgingReport(EExportType.EXCEL)
    ExportAgingReportExcel()
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
          referDate: selectDate ? selectDate : new Date(),
          agentId: agent?.id,
          byCreationDate: byReferenceDate,
          expendedReport: detailedReport
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
    [fromDate, toDate, detailedReport, agent, customer, selectDate, byReferenceDate]
  );
  const ExportAgingReportPDF = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-aging-report-pdf`,
        {
          myBody: {
            startDate: fromDate,
            endDate: toDate,
            clientId: customer?.id,
            referDate: selectDate ? selectDate : new Date(),
            agentId: agent?.id,
            byCreationDate: byReferenceDate,
            expendedReport: detailedReport
          }
        },
        true,
        null,
        "blob"
      );


      const downloadLink = document.createElement('a');
      const link = URL?.createObjectURL(res.data);
      downloadLink.href = link
      downloadLink.download = `aging report.pdf`;
      downloadLink.click();
    },
    [fromDate, toDate, detailedReport, agent, customer, selectDate, byReferenceDate]
  );
  const ExportAgingReportExcel = useCallback(
    async () => {
      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-aging-report-excel`,
        {
          myBody: {
            startDate: fromDate,
            endDate: toDate,
            clientId: customer?.id,
            referDate: selectDate ? selectDate : new Date(),
            agentId: agent?.id,
            byCreationDate: byReferenceDate,
            expendedReport: detailedReport
          }
        },
        true,
        null,
        "blob"
      );


      const downloadLink = document.createElement('a');
      const link = URL?.createObjectURL(res.data);
      downloadLink.href = link
      downloadLink.download = `aging report.xlsx`;
      downloadLink.click();
    },
    [fromDate, toDate, detailedReport, agent, customer, selectDate, byReferenceDate]
  );

  return {
    onSelectDeliveryTimeDates,
    resetDatePicker,
    handleClickSelectDate,
    selectDate,
    setSelectDate,
    dateRef,
    agent,
    agentsCategories,
    handleAgentChange,
    customer,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    onClickBtn1,
    onClickBtn2,
    onClickBtn3,
    showTable,
    detailedReport,
    setShowTable,
    setDetailedReport,
    getTableDataRows,
    onChangeDetailedReport,
    onChangeByReferenceDate,
    transformedHeaders
  };
};

export { useAgingReport };
