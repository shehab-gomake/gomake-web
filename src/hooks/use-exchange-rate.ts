import { useRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { materialsState } from "@/store";
import { ICallAndSetData } from "@/services/api-service/interface";
import { EHttpMethod } from "@/services/api-service/enums";
import { getSetApiData } from "@/services/api-service/get-set-api-data";
import { useState } from "react";

const useExchangeRate = () => {
  const { callApi } = useGomakeAxios();
  const [rate, setRate] = useState<any>();

  const calculateExchangeRate: ICallAndSetData = async (
    callApi,
    setState,
    data: {
      fromCurrency: string;
      toCurrency: string;
    }
  ) => {
    return await getSetApiData(
      callApi,
      EHttpMethod.GET,
      "/v1/erp-service/currencies/get-exchange-rate",
      setState,
      data
    );
  };

  const getExchangeRate = async (fromCurrency, toCurrency) => {
    const callBack = (res) => {
      if (res?.success) {
        setRate(res?.data);
      } else {
        setRate(null);
      }
    };
    await calculateExchangeRate(callApi, callBack, {
      fromCurrency,
      toCurrency,
    });
  };

  return { rate, setRate, getExchangeRate };
};

export { useExchangeRate };
