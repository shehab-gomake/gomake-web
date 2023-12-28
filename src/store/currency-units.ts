import { atom, selector } from "recoil";
import { useGomakeAxios } from "@/hooks";

const currencyUnitSelector = selector({
    key: "mySelectorCurrencyUnit",
    get: async ({ get }) => {
      const { callApi } = useGomakeAxios();
      const res = await callApi("Get", "/v1/enum/get-enums/CurrencyUnit");
      return res?.data?.data?.data;
    },
  });
  
  export const currencyUnitState= atom({
    key: "currencyUnitState",
    default: currencyUnitSelector,
  });

  