import { useGomakeAxios } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetClientAddress,
  getAndSetClientContacts,
  getAndSetQuotesByUserId,
} from "@/services/hooks";
import {
  agentListsState,
  businessListsState,
  clientAddressState,
  clientContactsState,
  quoteItemState,
} from "@/store";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();
  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);

  const [agentListValue, setAgentListValue] =
    useRecoilState<any>(agentListsState);

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

  const [clientContactsValue, setClientContactsValue] =
    useRecoilState<any>(clientContactsState);

  const [clientAddressValue, setClientAddressValue] =
    useRecoilState<any>(clientAddressState);

  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);
  const getAllEmployees = useCallback(async () => {
    await getAndSetAllEmployees(callApi, setAgentListValue, {
      isAgent: true,
    });
  }, []);

  const getQuote = useCallback(async () => {
    await getAndSetQuotesByUserId(callApi, setQuoteItemValue);
  }, []);

  const getAllClientContacts = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientContacts(callApi, setClientContactsValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

  useEffect(() => {
    getAllCustomers();
    getQuote();
    getAllEmployees();
  }, []);
  
  useEffect(() => {
    getAllClientContacts();
    getAllClientAddress();
  }, [quoteItemValue]);

  return {
    customersListValue,
    quoteItemValue,
    agentListValue,
    clientContactsValue,
    clientAddressValue,
    getQuote,
    getAllClientContacts,
    getAllClientAddress,
  };
};

export { useQuoteGetData };
