import { useCallback, useRef, useState } from "react";
import { useAgentsList, useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { format } from 'date-fns';
import { useTranslation } from "react-i18next";

const useAgingReport = () => {
  const { t } = useTranslation()
  const { callApi } = useGomakeAxios();
  const { alertFault, alertFaultGetData, alertSuccessGetData } = useSnackBar();
  const { customer, renderOptions, checkWhatRenderArray, handleCustomerChange } = useCustomerDropDownList();
  const { agent, agentsCategories, handleAgentChange } = useAgentsList();
  const [selectDate, setSelectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [byReferenceDate, setByReferenceDate] = useState<boolean>(false);
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [tableHeader, setTableHeader] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
    const transformedHeaders = tableHeader?.map(header => {
    // Check if the header key contains any numbers
    const containsNumber = /\d/.test(header.key);
  
    // If it contains numbers, use header.name; otherwise, use the translated text
    return containsNumber ? header.name : t(`reports.${header.key}`);
  });

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
    return tableData.flatMap((data: any) => {
      const rows = [];

      const mainRow = tableHeader.map((header: any) => {
        const nestedKey = header.key;
        const value = nestedKey.split('.').reduce((acc, part) => acc && acc[part], data);

        if (Array.isArray(value)) {
          return value.map((item: any) => {
            return tableHeader.map((nestedHeader: any) => {
              const nestedValue = nestedHeader.key.split('.').reduce((acc, part) => acc && acc[part], item);
              return nestedValue || '';
            });
          });
        } else if (typeof value === 'object' && value !== null) {
          return Object.entries(value)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ');
        } else {
          return value || '';
        }
      });

      // Add the main row (this will be the first row)
      rows.push(mainRow);
      // Handle nested rows
      if (Array.isArray(data.data) && detailedReport) {
        rows.push(...data.data.map((nestedItem: any) => {
          return tableHeader.map((header: any, index: number) => {
            if (index < 3) {
              // Keep the first three headers empty
              return '';
            } else {
              const nestedValue = header.key.split('.').reduce((acc, part) => acc && acc[part], nestedItem);
              return nestedValue || '';
            }
          });
        }));
      }

      return rows;
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
      if (!format || !toDate) {
        alertFault(("alerts.pleaseEnsureDatesSelected"))
        return;
      }

      const formattedStartDate = format(fromDate, 'yyyy-MM-dd');
      const formattedEndDate = format(toDate, 'yyyy-MM-dd');

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/get-aging-report`,
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
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
      if (!format || !toDate) {
        alertFault(("alerts.pleaseEnsureDatesSelected"))
        return;
      }

      const formattedStartDate = format(fromDate, 'yyyy-MM-dd');
      const formattedEndDate = format(toDate, 'yyyy-MM-dd');

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-aging-report-pdf`,
        {
          myBody: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
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
      if (!format || !toDate) {
        alertFault(("alerts.pleaseEnsureDatesSelected"))
        return;
      }

      const formattedStartDate = format(fromDate, 'yyyy-MM-dd');
      const formattedEndDate = format(toDate, 'yyyy-MM-dd');

      const res = await callApi(
        EHttpMethod.POST,
        `/v1/erp-service/reports/export-aging-report-excel`,
        {
          myBody: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
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
    t,
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
