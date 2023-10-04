import { useGomakeAxios } from "@/hooks";
import { AddOrUpdateDocumentDesignDocingApi, getAllDocumentDesigningApi, getDocumentDesignByCreationDocingApi } from "@/services/api-service/documenting/document-design";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { documentDesignState, documentTypeState } from "./state/documents-state";

const UseDocumentDesign = () => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const [documentTypes, setdocumentTypes] = useRecoilState(documentTypeState);
    const [documentDesign, setdocumentDesign] = useRecoilState(documentDesignState);
    

    const getDocumentTypes = async () => {
        const callBack = (res) => {
            if (res.success) {
                const doumentType = res.data.map(doc => ({
                    value: doc.key,
                    text: t(`documentType.${doc.value}`)
                }));
                setdocumentTypes(doumentType);
            }
        }
        await getAllDocumentDesigningApi(callApi, callBack)
    }
    const getDocumentDesignByCreationDoc = async (docmentCreation) =>{
      
        const callBack = (res) => {
            if (res.success) {
                setdocumentDesign(res.data);
            }
        }

        await getDocumentDesignByCreationDocingApi(callApi, callBack,docmentCreation)
    }

    const AddOrUpdateDocumentDesign = async (documentDesign) =>{
      
        const callBack = (res) => {
            if (res.success) {
                setdocumentDesign(res.result);
            }
            console.log( "this is the ressult of update document design" + res.result)
        }
        await AddOrUpdateDocumentDesignDocingApi(callApi, callBack,documentDesign)

    };
    return {
        getDocumentTypes,
        getDocumentDesignByCreationDoc,
        AddOrUpdateDocumentDesign
    };

};

export { UseDocumentDesign };