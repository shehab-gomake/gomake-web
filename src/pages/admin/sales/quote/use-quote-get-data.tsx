import { useGomakeAxios } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetClientAddress,
  getAndSetClientContacts,
  getAndSetQuotes,
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
      IsAgent: true,
      Name: "",
    });
  }, []);

  const getQuote = useCallback(async () => {
    await getAndSetQuotes(callApi, setQuoteItemValue);
  }, []);

  const getAllClientContacts = useCallback(async () => {
    await getAndSetClientContacts(callApi, setClientContactsValue, {
      ClientId: quoteItemValue?.customerID,
    });
  }, [quoteItemValue]);

  const getAllClientAddress = useCallback(async () => {
    await getAndSetClientAddress(callApi, setClientAddressValue, {
      ClientId: quoteItemValue?.customerID,
    });
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
  };
};

export { useQuoteGetData };
