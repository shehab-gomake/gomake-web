import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  calculateSelectedItemsApi,
  getDocumentByIdApi,
  updateDocumentCommentsConfirmationApi,
} from "@/services/api-service/generic-doc/quote-confirmation-api";
import { fileItemsState, quoteConfirmationState, requestAbortControllerState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";
import { getPrePaymentByIdApi } from "@/services/api-service/pay/pay-api";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { getCompanyLoginLogo } from "@/services/api-service/profiles/company-profile-api";
import { useDebouncedCallback } from "use-debounce";

interface IProps {
  documentType?: DOCUMENT_TYPE;
  isPrePaymentPage?: boolean;
}
const useQuoteConfirmation = ({ documentType, isPrePaymentPage }: IProps = {}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const direction = t("direction");
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(
    quoteConfirmationState
  );
  const [requestAbortController, setRequestAbortController] = useRecoilState<AbortController | null>(requestAbortControllerState);

  const [isPageNotFound, setIsPageNotFound] = useState(false); // Add state for page not found

  const [checkedItems, setCheckedItems] = useState({});
  const { i18n } = useTranslation();

  const getQuoteConfirmation = async () => {
    let documentItemIds = [];
    const callBack = (res) => {
      if (res?.success) {
        const quote = res?.data;
        quote.documentItems = quote.documentItems.map((item) => {
          item.isChecked = false;
          return item;
        });
        
        // Add documentItemIds array to store selected item IDs
        quote.documentItems.forEach((item) => {
          if (item.isSelected) {
            documentItemIds.push(item.id);
          }
        });

        quote.clientLang && i18n.changeLanguage(quote.clientLang);
        setQuoteConfirm(quote);
      } else {
        alertFaultUpdate();
      }
    };
    await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id,documentItemIds: documentItemIds });
  };
  const getTempUserToken = useCallback(async () => {
    const TokenRes: any = await callApi("GET", "/v1/auth/get-temp-user-token", {
      token: isPrePaymentPage ? router?.query?.recordId : router?.query?.Id,
    });
    if (TokenRes?.success) {
      const userToken = TokenRes?.data?.data?.result?.token;
      return userToken;
    }
    return null;
  }, [router]);

  const getPrePaymentById = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const quote = res?.data;
        setQuoteConfirm(quote);
        quote.clientLang && i18n.changeLanguage(quote.clientLang);
      } else {
        setIsPageNotFound(true);
      }
    };
    await getPrePaymentByIdApi(callApi, callBack, {
      recordId: router?.query?.recordId,
      documentType,
    });
  };
 
  const [counter,setCounter] = useState(0);

  const calculateSelectedItems = useCallback(async (quote) => {
    const documentItemIds = quote?.documentItems?.filter((x) => x.isChecked)?.map((x) => x.id);
    // Abort any existing request
    if (requestAbortController) {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      requestAbortController.abort();
    }
    const newRequestAbortController = new AbortController();
    if(setRequestAbortController){
      setRequestAbortController(newRequestAbortController);
    }
  console.log("counter", counter);
    setCounter(counter+1);

    
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
  
    try {
      await calculateSelectedItemsApi(
        callApi, 
        callBack, 
        {
          quoteId: quote?.id,
          documentItemIds: documentItemIds,
        },
        false,
        newRequestAbortController
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      throw error;
    }
  }, [requestAbortController]); 
  const [fileItems, setFileItems] = useRecoilState(fileItemsState);
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
  
    // Add or remove item from fileItems based on checkbox state
    if (e.target.checked) {
      const selectedItem = quoteConfirm?.documentItems.find(item => item.id === itemId);
      if (selectedItem) {
        const existingItemIndex = fileItems.findIndex(item => item.id === itemId);
        
        if (existingItemIndex === -1) {
          // Add new item if it doesn't exist
          setFileItems([
            ...fileItems,
            {
              id: selectedItem.id,
              productName: selectedItem.productName,
              files: null
            }
          ]);
        }
      }
    } else {
      // Remove item when unchecked
      setFileItems(fileItems.filter(item => item.id !== itemId));
    }
  };
  // const handleItemCheck = (e, itemId) => {
  //   let quoteCopy = cloneDeep(quoteConfirm);
  //   if (quoteCopy?.documentItems) {
  //     const documentItems = quoteConfirm?.documentItems.map((x) =>
  //       x.id === itemId ? { ...x, isChecked: e.target.checked } : x
  //     );

  //     quoteCopy = { ...quoteCopy, documentItems: documentItems };
  //   }
  //   setQuoteConfirm(quoteCopy);
  //   calculateSelectedItems(quoteCopy);
  // };

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

  const [companyLogo, setCompanyLogo] = useState<{
    loginLogo: string;
    name: string;
  }>({ loginLogo: "", name: "" });

  const getCompanyLogo = async () => {
    const callBack = (res) => {
      if (res.success) {
        setCompanyLogo(res.data);
      }
    };
    await getCompanyLoginLogo(callApi, callBack);
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
    router,
    companyLogo,
    getCompanyLogo,
  };
};

export { useQuoteConfirmation };
