import { useGomakeAxios } from "@/hooks";
import { getAllDocumentDesigningApi } from "@/services/api-service/documenting/document-design";
import { useTranslation } from "react-i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  documentDesignTypeTextState,
  documentDesignURLState,
  documentTypeState,
} from "../state/documents-state";

const UseDocumentDesignSettings = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const documentDesignURL = useRecoilValue(documentDesignURLState);
  const documentTypeText = useRecoilValue(documentDesignTypeTextState);
  const setDocumentTypes = useSetRecoilState(documentTypeState);

  const getDocumentTypes = async () => {
    const callBack = (res) => {
      if (res.success) {
        const documentType = res.data.map((doc) => ({
          value: doc.key,
          text: t(`documentType.${doc.value}`),
        }));
        setDocumentTypes(documentType);
      }
    };
    await getAllDocumentDesigningApi(callApi, callBack);
  };

  return { documentTypeText, documentDesignURL, getDocumentTypes };
};

export { UseDocumentDesignSettings };
