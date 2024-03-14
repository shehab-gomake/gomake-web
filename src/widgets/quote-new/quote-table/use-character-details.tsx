import { useGomakeAxios, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { updateDocumentItemContentApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, } from "recoil";

const useCharacterDetails = ({ details, getQuote, documentItemId }) => {
  const router = useRouter()
  const [showAll, setShowAll] = useState(false);
  const [originalValue,] = useState(details);
  const [isValueChanged, setIsValueChanged] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState(details)
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessUpdate,
    alertFaultUpdate,
  } = useSnackBar();
  const { t } = useTranslation();
  const truncatedDetails = showAll ? details : details?.slice(0, 90);
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  const updateDocumentItemContent = async () => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const documentItemIndex = updatedQuoteItemValue.documentItems.findIndex(item => item.id === documentItemId);

      if (documentItemIndex !== -1) {
        // Create a new object with the updated content
        const updatedDocumentItem = {
          ...updatedQuoteItemValue.documentItems[documentItemIndex],
          details: data
        };

        // Create a new array with the updated document item
        const updatedDocumentItems = [
          ...updatedQuoteItemValue.documentItems.slice(0, documentItemIndex),
          updatedDocumentItem,
          ...updatedQuoteItemValue.documentItems.slice(documentItemIndex + 1)
        ];

        // Update the state with the new document items array
        setQuoteItemValue({
          ...updatedQuoteItemValue,
          documentItems: updatedDocumentItems
        });
      }
    }
    else {
      const callBack = (res) => {
        if (res?.success) {
          alertSuccessUpdate();
          getQuote()
        } else {
          alertFaultUpdate();
        }
      }
      await updateDocumentItemContentApi(callApi, callBack, {
        documentType: DOCUMENT_TYPE.quote,
        contact:
        {
          documentItemId: documentItemId,
          content: data
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
    setIsEdit(false);
  }
  return {
    isEdit, showAll, truncatedDetails, data, handleShowLess, handleShowMore, t, setIsEdit, handleChange, handleBlur
  };
};

export { useCharacterDetails };
