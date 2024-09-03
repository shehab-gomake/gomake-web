import { getAndSetAllCustomers, getAndSetClientContacts } from "@/services/hooks";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useDebouncedCallback } from "use-debounce";

interface UseCustomerDropDownListProps {
  shouldRenderCustomersOnMount?: boolean;
  shouldRenderSuppliersOnMount?: boolean;
}

const useCustomerDropDownList = ({
  shouldRenderCustomersOnMount = true,
  shouldRenderSuppliersOnMount = false,
}: UseCustomerDropDownListProps = {}) => {
  const { callApi } = useGomakeAxios();
  const [customersListCreateQuote, setCustomersListCreateQuote] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [clientContactsValue, setClientContactsValue] = useState<any>([]);
  const [customer, setCustomer] = useState<{
    name: string;
    id: string;
  } | null>();

  const renderOptions = () => {
    return customersListCreateQuote;
  };

  const getAllCustomersCreateQuote = useCallback(async (SearchTerm?: string) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      clientType: "C",
      searchTerm: SearchTerm as string,
      onlyCreateOrderClients: false,
    });
  }, []);

  const getAllCustomersCreateOrder = useCallback(async (SearchTerm?: string) => {
    await getAndSetAllCustomers(callApi, setCustomersListCreateQuote, {
      clientType: "C",
      searchTerm: SearchTerm as string,
      onlyCreateOrderClients: true,
    });
  }, []);

  const getAllSupplierList = useCallback(async (SearchTerm?: string) => {
    await getAndSetAllCustomers(callApi, setSupplierList, {
      clientType: "S",
      searchTerm: SearchTerm as string,
      onlyCreateOrderClients: true,
    });
  }, []);

  const debouncedGetAllCustomersCreateOrder = useDebouncedCallback((value: string) => {
    getAllCustomersCreateOrder(value);
  }, 500);

  const checkWhatRenderArray = (e) => {
    const value = e.target.value;
    if (value) {
      debouncedGetAllCustomersCreateOrder(value);
    } else {
      getAllCustomersCreateQuote();
    }
  };

  const handleCustomerChange = (e: any, value: any) => {
    setCustomer(value);
  };


  const getAllClientContacts = useCallback(async () => {
    await getAndSetClientContacts(callApi, setClientContactsValue, {
      ClientId: customer?.id,
    });
  }, [customer]);


  useEffect(() => {
    if (shouldRenderSuppliersOnMount) {
      getAllSupplierList();
    }
  }, [shouldRenderSuppliersOnMount, getAllSupplierList]);

  useEffect(() => {
    if (shouldRenderCustomersOnMount) {
      getAllCustomersCreateQuote();
    }
  }, [shouldRenderCustomersOnMount, getAllCustomersCreateQuote]);

  return {
    customer,
    getAllCustomersCreateQuote,
    renderOptions,
    checkWhatRenderArray,
    handleCustomerChange,
    getAllClientContacts,
    setCustomer,
    clientContactsValue,
    supplierList
  };
};

export { useCustomerDropDownList };