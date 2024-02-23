import { useGomakeAxios, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { updateDocumentCommentsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";

const useWriteCommentComp = ({ getQuote }) => {
  const [isValueChanged, setIsValueChanged] = useState(false);
  // const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [data, setData] = useState(quoteItemValue?.notes)
  const [originalValue,] = useState("");
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessUpdate,
    alertFaultUpdate,
  } = useSnackBar();
  const router = useRouter()
  const { t } = useTranslation();
  const updateDocumentItemContent = async () => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.notes = data;
      setQuoteItemValue(updatedQuoteItemValue);
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote();
        } else {
          alertFaultUpdate();
        }
      }
      await updateDocumentCommentsApi(callApi, callBack, {
        documentType: DOCUMENT_TYPE.quote,
        contact:
        {
          documentId: quoteItemValue?.id,
          comments: data
        }
      })
    }

  }
  const handleChange = (e) => {
    setData(e.target.value);
    setIsValueChanged(e.target.value !== originalValue);
  }
  const handleBlur = () => {
    if (isValueChanged) {
      updateDocumentItemContent();
    }
  }
  return {
    handleChange, handleBlur, data, t, quoteItemValue
  };
};

export { useWriteCommentComp };
