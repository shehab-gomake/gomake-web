import { useGomakeAxios } from "@/hooks";
import { getAndSetEmployees2 } from "@/services/api-service/customers/employees-api";
import { getAndSetAllCustomers } from "@/services/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const useAgingReport = () => {
  const { callApi } = useGomakeAxios();
  const dateRef = useRef(null);
  const { t } = useTranslation()

  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
    setResetDatePicker(false);
    setFromDate(fromDate);
    setToDate(toDate);
  };
  const [selectDate, setSelectDate] = useState<string>();
  const handleClickSelectDate = () => {
    dateRef?.current?.showPicker();
  };
  const [agentsCategories, setAgentsCategories] = useState<[]>();
  const [agent, setAgent] = useState<{ label: string; id: string } | null>();
  const [showTable, setShowTable] = useState<boolean>(false);
  const [detailedReport, setDetailedReport] = useState<boolean>(false);
  console.log("detailedReport", detailedReport)
  const tableUnDetailedHeaders = [
    "customer code",
    "customer name",
    "customer phone",
    "Terms of Payment",
    "1/2024",
    "2/2024",
    "Total"
  ]
  const tabledetailedHeaders = [
    "customer code",
    "customer name",
    "Terms of Payment",
    "Sales Person",
    "S. Document",
    "M. Document",
    "Date of refernce",
    "Value Date",
    "Balance Due",
    "0-30",
    "31-60",
    "61-90",
    "91-120",
    "+120"
  ]
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
    setShowTable(!showTable);
  }
  const onClickBtn2 = () => {
    console.log("BBBB")
  }
  const onClickBtn3 = () => {
    console.log("CCCC")
  }

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
    tableUnDetailedHeaders,
    tabledetailedHeaders
  };
};

export { useAgingReport };
