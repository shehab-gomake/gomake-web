import { getAndSetAllCustomers } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";

const useCustomerDropDownList = () => {
    const { callApi } = useGomakeAxios();
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

    useEffect(() => {
        getAllCustomersCreateQuote();
      }, []);
    return {
        customer,
        getAllCustomersCreateQuote,
        renderOptions,
        checkWhatRenderArray,
        handleCustomerChange
    };
};

export {useCustomerDropDownList};
