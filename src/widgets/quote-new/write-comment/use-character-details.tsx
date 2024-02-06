import { useGomakeAxios, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { updateDocumentCommentsApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

const useWriteCommentComp = ({ getQuote }) => {
  const [isValueChanged, setIsValueChanged] = useState(false);
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const [data, setData] = useState(quoteItemValue?.notes)
  const [originalValue,] = useState("");
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessUpdate,
    alertFaultUpdate,
  } = useSnackBar();
  const { t } = useTranslation();
  const updateDocumentItemContent = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getQuote()
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
