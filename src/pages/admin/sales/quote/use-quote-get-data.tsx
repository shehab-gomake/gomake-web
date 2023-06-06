import { useGomakeAxios } from "@/hooks";
import { getAndSetAllCustomers } from "@/services/hooks";
import { businessListsState } from "@/store";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();
  const [customersListValue, setCustomersListValue] =
    useRecoilState(businessListsState);
  const getAllCustomers = useCallback(async () => {
    await getAndSetAllCustomers(callApi, setCustomersListValue, {
      ClientType: "C",
      onlyCreateOrderClients: false,
    });
  }, []);

  useEffect(() => {
    getAllCustomers();
  }, []);

  return { customersListValue };
};

export { useQuoteGetData };
