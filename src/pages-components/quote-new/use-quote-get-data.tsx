import { useGomakeAxios } from "@/hooks";
import { getAndSetClientAddress} from "@/services/hooks";
import { addressSelectState, clientAddressState,quoteItemState} from "@/store";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

const useQuoteGetData = () => {
  
  const { callApi } = useGomakeAxios();
  const [clientAddressValue, setClientAddressValue] = useRecoilState<any>(clientAddressState);
  const addressSelect = useRecoilValue(addressSelectState);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
     return await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);

  return {
    quoteItemValue,
    clientAddressValue,
    addressSelect,
    getAllClientAddress,
  };
};

export { useQuoteGetData };