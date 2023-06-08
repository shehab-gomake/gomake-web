import { useGomakeAxios } from "@/hooks";
import {
  getAndSetAllCustomers,
  getAndSetAllEmployees,
  getAndSetQuotes,
} from "@/services/hooks";
import { agentListsState, businessListsState, quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();
  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);

  const [agentListValue, setAgentListValue] =
    useRecoilState<any>(agentListsState);

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

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

  useEffect(() => {
    getAllCustomers();
    getQuote();
    getAllEmployees();
  }, []);

  return { customersListValue, quoteItemValue, agentListValue };
};

export { useQuoteGetData };
