import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { EHttpMethod } from "@/services/api-service/enums";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const useAgingReport = () => {
  const { callApi } = useGomakeAxios();
  const dateRef = useRef(null);
  const { t } = useTranslation()
  const {
    alertFaultGetData,
    alertSuccessGetData
  } = useSnackBar();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const [selectDate, setSelectDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  const [agentsCategories, setAgentsCategories] = useState<[]>();
  const [agent, setAgent] = useState<{ label: string; id: string } | null>();
  const [showTable, setShowTable] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([])
  const [tableHeader, setTableHeader] = useState<any>([])

  const onChangeDetailedReport = () => {
    setDetailedReport(!detailedReport)
  }
  const transformedHeaders = tableHeader?.map(header => header.name);
  const getTableDataRows = useCallback(() => {
    return tableData.map(data => {
      const rowData = [];
      tableHeader.forEach(header => {
        rowData.push(data[header.key]);
      });
      return rowData;
    });
  }, [tableData, tableHeader]);
  const handleAgentChange = (e: any, value: any) => {
    setAgent(value);
  };
  const getAgentCategories = async (isAgent: boolean) => {
    const callBack = (res) => {
      if (res.success) {
        const agentNames = res.data.map((agent) => ({
          label: agent.text,
          id: agent.value,
        }));
        setAgentsCategories(agentNames);
      }
    };
    await getAndSetEmployees2(callApi, callBack, { isAgent: isAgent });
  };
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [customer, setCustomer] = useState<{
    label: string;
    id: string;
  } | null>();

  const renderOptions = () => {
    return customersListCreateQuote;
  };
  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      searchTerm: SearchTerm,
      onlyCreateOrderClients: false,
    });
  }, []);

  const getAllCustomersCreateOrder = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      ClientType: "C",
      searchTerm: SearchTerm,
      onlyCreateOrderClients: true,
    });
  }, []);
  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllCustomersCreateOrder(e.target.value);
    } else {
      getAllCustomersCreateQuote();
    }
  };
  const handleCustomerChange = (e: any, value: any) => {
    setCustomer(value);
  };
  const onClickBtn1 = () => {
    setShowTable(false);
    getAgingReportFilter()
  }
  const onClickBtn2 = () => {
    console.log("BBBB")
  }
  const onClickBtn3 = () => {
    console.log("CCCC")
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
          byCreationDate: true,
          expendedReport: detailedReport
        }
      );
      if (res?.success) {
        console.log("res?.data?.data?.data", res?.data?.data?.data)
        setTableData(res?.data?.data?.data?.data)
        setTableHeader(res?.data?.data?.data?.headers)

        alertSuccessGetData();
        setShowTable(true)
      } else {
        alertFaultGetData();
        setShowTable(false)
      }
    },
    [fromDate, toDate, detailedReport, agent, customer, selectDate]
  );

  return {
    getAllCustomersCreateQuote,
    getAgentCategories,
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
    transformedHeaders
  };
};

export { useAgingReport };
