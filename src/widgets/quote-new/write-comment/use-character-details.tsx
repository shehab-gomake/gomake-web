import { useGomakeAxios, useSnackBar } from "@/hooks";
import { updateDocumentCommentsApi, updateDocumentInternalNotesApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const useWriteCommentComp = ({ getQuote, documentType }) => {
  const [isValueChanged, setIsValueChanged] = useState(false);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [data, setData] = useState(quoteItemValue?.notes)
  const [dataForInternalNotes, setDataForInternalNotes] = useState(quoteItemValue?.internalNotes)

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
        documentType: documentType,
        contact:
        {
          documentId: quoteItemValue?.id,
          comments: data
        }
      })
    }

  }

  const updateDocumentItemInternalNotes = async () => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      updatedQuoteItemValue.internalNotes = dataForInternalNotes;
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
      //Change the api to internal notes 
      await updateDocumentInternalNotesApi(callApi, callBack, {
        documentType: documentType,
        contact:
        {
          documentId: quoteItemValue?.id,
          internalNotes: dataForInternalNotes
        }
      })
    }

  }
  const handleChange = (e) => {
    setData(e.target.value);
    setIsValueChanged(e.target.value !== data);

  }
  const handleChangeForInternalNotes = (e) => {
    setDataForInternalNotes(e.target.value);
    setIsValueChanged(e.target.value !== data);

  }

  const handleBlur = () => {
    if (data !== quoteItemValue?.notes) {
      updateDocumentItemContent();
    }

  }
  const handleBlurForInternalNotes = () => {
    if (dataForInternalNotes !== quoteItemValue?.internalNotes) {
      updateDocumentItemInternalNotes();
    }
  }

  useEffect(() => {
    if (quoteItemValue?.notes === null)
      setData("");
    else if (quoteItemValue?.internalNotes === null) {
      setDataForInternalNotes("")
    }
    else
      setData(quoteItemValue?.notes);
    setDataForInternalNotes(quoteItemValue?.internalNotes)
  }, [quoteItemValue])

  return {
    handleChange,
    handleBlur,
    data,
    t,
    quoteItemValue,
    handleBlurForInternalNotes,
    handleChangeForInternalNotes,
    dataForInternalNotes,

  };
};

export { useWriteCommentComp };
