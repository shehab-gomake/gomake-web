import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  calculateSelectedItemsApi,
  getDocumentByIdApi,
  updateDocumentCommentsConfirmationApi,
} from "@/services/api-service/generic-doc/quote-confirmation-api";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";
import { getPrePaymentByIdApi } from "@/services/api-service/pay/pay-api";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "../quotes/enums";

interface IProps {
  documentType?: DOCUMENT_TYPE;
}
const useQuoteConfirmation = ({ documentType }: IProps = {}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const direction = t("direction");
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(
    quoteConfirmationState
  );

  const [isPageNotFound, setIsPageNotFound] = useState(false); // Add state for page not found

  const [checkedItems, setCheckedItems] = useState({});
  const { i18n } = useTranslation();

  const getQuoteConfirmation = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const quote = res?.data;
        quote.documentItems = quote.documentItems.map((item) => {
          item.isChecked = true;
          return item;
        });
        quote.clientLang && i18n.changeLanguage(quote.clientLang);
        setQuoteConfirm(quote);
      } else {
        alertFaultUpdate();
      }
    };
    await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id });
  };

  const getTempUserToken = useCallback(async () => {
    const TokenRes: any = await callApi("GET", "/v1/auth/get-temp-user-token", {
      token: router?.query?.token ?? "",
    });
    if (TokenRes?.success) {
      const userToken = TokenRes?.data?.data?.result?.token;
      return userToken;
    }
    return null;
  }, []);

  const getPrePaymentById = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const quote = res?.data;
        setQuoteConfirm(quote);
        quote.clientLang && i18n.changeLanguage(quote.clientLang);
      } else {
        // alertFaultUpdate();
        setIsPageNotFound(true);
      }
    };
    await getPrePaymentByIdApi(callApi, callBack, {
      recordId: router?.query?.recordId,
      documentType,
    });
  };

  const calculateSelectedItems = async (quote) => {
    const documentItemIds = quote?.documentItems
      ?.filter((x) => x.isChecked)
      ?.map((x) => x.id);
    const callBack = (res) => {
      if (res?.success) {
        const newQuote = res?.data;
        newQuote.documentItems = newQuote.documentItems.map((item) => {
          item.isChecked = documentItemIds.includes(item.id);
          return item;
        });
        setQuoteConfirm(newQuote);
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await calculateSelectedItemsApi(callApi, callBack, {
      quoteId: quote?.id,
      documentItemIds: documentItemIds,
    });
  };

  const handleItemCheck = (e, itemId) => {
    let quoteCopy = cloneDeep(quoteConfirm);
    if (quoteCopy?.documentItems) {
      const documentItems = quoteConfirm?.documentItems.map((x) =>
        x.id === itemId ? { ...x, isChecked: e.target.checked } : x
      );
      quoteCopy = { ...quoteCopy, documentItems: documentItems };
    }
    setQuoteConfirm(quoteCopy);
    calculateSelectedItems(quoteCopy);
  };

  const documentsTitles = [
    {
      label: t("sales.quote.quote"),
      value: DOCUMENT_TYPE.quote,
    },
    {
      label: t("sales.quote.order"),
      value: DOCUMENT_TYPE.order,
    },
    {
      label: t("sales.quote.invoice"),
      value: DOCUMENT_TYPE.invoice,
    },
  ];

  const documentTitle = documentsTitles.find(
    (item) => item.value === documentType
  )?.label;

  const capitalizeFirstLetter = (text) => {
    if (typeof text !== "string") {
      return text;
    }
    return text?.charAt(0).toUpperCase() + text.slice(1);
  };

  return {
    t,
    getQuoteConfirmation,
    checkedItems,
    setCheckedItems,
    handleItemCheck,
    getPrePaymentById,
    getTempUserToken,
    quoteConfirm,
    documentTitle,
    direction,
    capitalizeFirstLetter,
    isPageNotFound,
    setIsPageNotFound,
  };
};

export { useQuoteConfirmation };
