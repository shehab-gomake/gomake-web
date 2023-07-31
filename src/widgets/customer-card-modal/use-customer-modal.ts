import { useCallback, useEffect,  useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetCurrency } from "@/services/hooks/get-set-enums";

const useCustomersModal = () => {
  const { callApi } = useGomakeAxios();


  ///////////////////////// select currency //////////////////////////////
  
  const [currencyCategores, setCurrencyCategores] = useState([]);
  const getCurrencyCategores = useCallback(async () => {
    await getAndSetCurrency(
      callApi,
      setCurrencyCategores,
    );
  }, []);

  useEffect(() => {
    getCurrencyCategores();
  }, []);


  return {
    currencyCategores,
  };
};
export { useCustomersModal };
