import { quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { useGomakeAxios , useSnackBar } from "@/hooks";
import { updateDocumentCommentsApi } from "@/services/api-service/generic-doc/documents-api";
import { useDebounce } from "@/utils/use-debounce";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface IProps {
  documentType: DOCUMENT_TYPE;
}

const useWriteComment = ({ documentType }: IProps) => {
  // const { t } = useTranslation();
  // const { callApi } = useGomakeAxios();
  // const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  // const quoteItemValue: any = useRecoilValue(quoteItemState);

  // const [documentComments, setDocumentComments] = useState(quoteItemValue?.notes);
  // const [finalDocumentComments, setFinalDocumentComments] = useState("");

  // const debounce = useDebounce(documentComments, 500);

  // // useEffect(() => {
  // //   setFinalDocumentComments(debounce);
  // // }, [debounce]);

  // // useEffect(() => {
  // //   const timerId = setTimeout(() => {
  // //     onUpdateDocumentComments();
  // //   }, 5000);
   
  // //   return () => clearTimeout(timerId);
  // // }, [documentComments]); 

  // const onUpdateDocumentComments = async () => {
  //   const callBack = (res) => {
  //     if (res?.success) {
  //       alertSuccessUpdate();
  //     } else {
  //       alertFaultUpdate();
  //     }
  //   };
  //   await updateDocumentCommentsApi(callApi, callBack, {
  //     documentType: documentType,
  //     comments: {
  //       documentId: quoteItemValue?.id,
  //       comments: finalDocumentComments,
  //     },
  //   });
  // };

  // const onChangeComments = (e: any) => {
  //   setDocumentComments(e.target.value);
  // };

  return {
    // onChangeComments,
    // documentComments,
    // t,
  };
};

export { useWriteComment };
