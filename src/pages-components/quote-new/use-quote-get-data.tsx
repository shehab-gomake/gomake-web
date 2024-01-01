import { useGomakeAxios } from "@/hooks";
import { getAndSetClientAddress} from "@/services/hooks";
import { addressSelectState, clientAddressState,quoteItemState} from "@/store";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currencyUnitState } from "@/store/currency-units";

const useQuoteGetData = () => {
  
  const { callApi } = useGomakeAxios();
  const [clientAddressValue, setClientAddressValue] = useRecoilState<any>(clientAddressState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);

  const addressSelect = useRecoilValue(addressSelectState);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
     return await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

  const getCurrencyUnitText = (currency) => {
    const foundCurrency = currenciesUnits.find(c => c.value === currency);
    if (foundCurrency) {
      return foundCurrency.text;
    } else {
      return "";
    }
  };
  
  return {
    quoteItemValue,
    clientAddressValue,
    addressSelect,
    getAllClientAddress,
    getCurrencyUnitText
  };
};

export { useQuoteGetData };