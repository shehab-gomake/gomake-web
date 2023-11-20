import { useGomakeAxios, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import {
  getAndSetAllCustomers,
  getAndSetQuotesByUserId,
} from "@/services/hooks";
import { businessListsState, quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useQuoteNew = () => {
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);

  const [selectDate, setSelectDate] = useState(quoteItemValue?.dueDate);

  const getQuote = useCallback(async () => {
    await getAndSetQuotesByUserId(callApi, setQuoteItemValue);
  }, []);

  const updateDueDate = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/update-due-date`,
      {
        quoteId: quoteItemValue?.id,
        dueDate: selectDate,
      }
    );
    if (res?.success) {
      alertSuccessAdded();
      getQuote();
    } else {
      alertFaultAdded();
    }
  }, [quoteItemValue, selectDate]);
  useEffect(() => {
    getQuote();
  }, []);

  return {
    selectDate,
    setSelectDate,
    updateDueDate,
    getQuote,
    t,
  };
};

export { useQuoteNew };
