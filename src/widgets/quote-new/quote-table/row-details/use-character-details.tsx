import { ShowDocumentDetailsEnum } from "@/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { updateDocumentItemContentApi } from "@/services/api-service/generic-doc/documents-api";
import { quoteItemState } from "@/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useSetRecoilState } from "recoil";
import { hasTableCellUpdatesState } from "@/pages-components/quote-new/store/quote";

const useCharacterDetails = ({
  details,
  getQuote,
  documentItemId,
  documentType,
  workName,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [showAll, setShowAll] = useState(false);
  const [originalValue, setOriginalValue] = useState(details);
  const [data, setData] = useState(details);
  useEffect(() => {
    setData(details);
  }, [details]);
  const [jobName, setJobName] = useState(workName);
  useEffect(() => {
    setJobName(workName);
  }, []);
  const [isValueChanged, setIsValueChanged] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [quoteItemValue, setQuoteItemValue] =
    useRecoilState<any>(quoteItemState);
  const setHasTableCellUpdates = useSetRecoilState(hasTableCellUpdatesState);
  const truncatedDetails = showAll ? details : details?.slice(0, 90);
  const canNotEditWhenShowJobNameOnly =
    quoteItemValue?.showDetails === ShowDocumentDetailsEnum.ShowJobNameOnly;

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };
  const formatContent = (str: string) => {
    // First replace closing </p> tags with <br/>
    let formatted = str?.replace(/<\/p>/g, "<br/>");
    // Then remove remaining <p> tags
    formatted = formatted?.replace(/<p>/g, "");
    // Keep <strong> tags and <br/> tags, remove any other HTML tags
    formatted = formatted?.replace(/<(?!\/?strong|\/?br\/?)[^>]+>/g, "");
    return formatted;
  };

  const updateDocumentItemContent = async (jobName?: string, data?: string) => {
    if (router.query.isNewCreation) {
      const updatedQuoteItemValue = { ...quoteItemValue };
      const documentItemIndex = updatedQuoteItemValue.documentItems.findIndex(
        (item) => item.id === documentItemId
      );

      if (documentItemIndex !== -1) {
        // Create a new object with the updated content
        const updatedDocumentItem = {
          ...updatedQuoteItemValue.documentItems[documentItemIndex],
          details: data,
        };

        // Create a new array with the updated document item
        const updatedDocumentItems = [
          ...updatedQuoteItemValue.documentItems.slice(0, documentItemIndex),
          updatedDocumentItem,
          ...updatedQuoteItemValue.documentItems.slice(documentItemIndex + 1),
        ];
        // Update the state with the new document items array
        setQuoteItemValue({
          ...updatedQuoteItemValue,
          documentItems: updatedDocumentItems,
        });
      }
    } else {
      const callBack = (res) => {
        const updatedQuoteItemValue = { ...quoteItemValue };
        const documentItemIndex = updatedQuoteItemValue.documentItems.findIndex(
          (item) => item.id === documentItemId
        );
        const updatedDocumentItem = {
          ...updatedQuoteItemValue.documentItems[documentItemIndex],
          details: res?.data,
        };

        if (res?.success) {
          alertSuccessUpdate();
          setQuoteItemValue({
            ...updatedQuoteItemValue,
            documentItems: [
              ...updatedQuoteItemValue.documentItems.slice(
                0,
                documentItemIndex
              ),
              updatedDocumentItem,
              ...updatedQuoteItemValue.documentItems.slice(
                documentItemIndex + 1
              ),
            ],
          });
          // Mark that table cells (details) were updated for orders
          if (documentType === DOCUMENT_TYPE.order && !router.query.isNewCreation) {
            setHasTableCellUpdates(true);
          }
          // getQuote();
        } else {
          alertFaultUpdate();
        }
      };
      await updateDocumentItemContentApi(callApi, callBack, {
        documentType: documentType ?? DOCUMENT_TYPE.quote,
        contact: {
          documentItemId: documentItemId,
          content: formatContent(data),
          jobName: jobName,
        },
      });
    }
  };

  const handleClose = () => {
    if (isValueChanged) {
      setData(originalValue);
    }
    setIsEdit(false);
  };

  const handleSave = (data: string) => {
    const hasDataChanged = data !== originalValue;
    const hasJobNameChanged = jobName !== workName;

    // Early return if nothing has changed
    if (!hasDataChanged && !hasJobNameChanged) {
      setIsEdit(false);
      return;
    }

    // Only update if something has actually changed
    if (hasJobNameChanged) {
      updateDocumentItemContent(jobName, data);
    } else if (hasDataChanged) {
      updateDocumentItemContent(null, data);
    }

    // Update the original value only after successful change
    setOriginalValue(data);
    setIsEdit(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setIsValueChanged(data !== originalValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [data, originalValue]);

  return {
    t,
    isRTL,
    isEdit,
    showAll,
    truncatedDetails,
    data,
    handleShowLess,
    handleShowMore,
    setIsEdit,
    setData,
    handleClose,
    handleSave,
    jobName,
    setJobName,
    canNotEditWhenShowJobNameOnly,
  };
};

export { useCharacterDetails };
