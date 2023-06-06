import { useGomakeAxios } from "@/hooks";
import { getAndSetAllCustomers, getAndSetQuotes } from "@/services/hooks";
import { businessListsState, quoteItemState } from "@/store";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();
  const [customersListValue, setCustomersListValue] =
    useRecoilState<any>(businessListsState);

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);

  const getQuote = useCallback(async () => {
    await getAndSetQuotes(callApi, setQuoteItemValue);
  }, []);

  useEffect(() => {
    getAllCustomers();
    getQuote();
  }, []);

  return { customersListValue, quoteItemValue };
};

export { useQuoteGetData };
