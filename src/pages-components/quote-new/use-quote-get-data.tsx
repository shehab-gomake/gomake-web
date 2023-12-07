import { useGomakeAxios } from "@/hooks";
import { getAndSetClientAddress} from "@/services/hooks";
import { clientAddressState,quoteItemState} from "@/store";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

const useQuoteGetData = () => {
  const { callApi } = useGomakeAxios();

  const [clientAddressValue, setClientAddressValue] = useRecoilState<any>(clientAddressState);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);

  // drop down list in addresses
  const getAllClientAddress = useCallback(async () => {
    if (quoteItemValue?.customerID) {
      await getAndSetClientAddress(callApi, setClientAddressValue, {
        ClientId: quoteItemValue?.customerID,
      });
    }
  }, [quoteItemValue]);
  


  return {
    quoteItemValue,
    clientAddressValue,
    getAllClientAddress,
  };
};

export { useQuoteGetData };