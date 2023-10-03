import { useGomakeAxios } from "@/hooks";
import { getAllDocumentDesigningApi, getDocumentDesignByCreationDocingApi } from "@/services/api-service/documenting/document-design";
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

        console.log(documentDesign);
        await getDocumentDesignByCreationDocingApi(callApi, callBack,docmentCreation)
    }



    return {
        getDocumentTypes,
        getDocumentDesignByCreationDoc
    };

};

export { UseDocumentDesign };