import { useGomakeAxios } from "@/hooks";
import { getAndSetClientAddress} from "@/services/hooks";
import { addressSelectState, clientAddressState,quoteItemState} from "@/store";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currencyUnitState } from "@/store/currency-units";
import { getAllShipmentTypesApi } from "@/services/api-service/shipmentTypes/get-shipment-types-api";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();
  const [clientAddressValue, setClientAddressValue] = useRecoilState<any>(clientAddressState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);
  const addressSelect = useRecoilValue(addressSelectState);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [shipmentTypes, setShipmentTypes] = useState<{label: string, value: string}[]>([]);

  
  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
     return await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);


  const getAllShipmentTypes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const types = res?.data.map((item) => ({ value: item.id, label: item.title }))
        setShipmentTypes(types)
      } 
    }
    await getAllShipmentTypesApi(callApi, callBack)
  }

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
    getCurrencyUnitText,
    getAllShipmentTypes,
    shipmentTypes
  };
};

export { useQuoteGetData };