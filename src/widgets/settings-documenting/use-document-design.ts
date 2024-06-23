import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddOrUpdateDocumentDesignDocApi, ResetDocumentDesigningApi, getAllDocumentDesigningApi, getDocumentDesignByCreationDocApi } from "@/services/api-service/documenting/document-design";
import { useTranslation } from "react-i18next";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { documentDesignState, documentDesignURLState, documentTypeState } from "./state/documents-state";
import { IDocumentDesign } from "./documentDesign/interface";

const UseDocumentDesign = () => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
    const [documentDesign, setDocumentDesign] = useRecoilState(documentDesignState);
    const resetDocumentDesign = useResetRecoilState(documentDesignState);
    const setDocumentTypes = useSetRecoilState(documentTypeState);
    const setDocumentDesignURL = useSetRecoilState(documentDesignURLState);

    const documentDesignChange = (documentDesign: IDocumentDesign) => {
        setDocumentDesign(documentDesign);
    }

    const getDocumentTypes = async () => {
        const callBack = (res) => {
            if (res.success) {
                const doumentType = res.data.map(doc => ({
                    value: doc.key,
                    text: t(`documentType.${doc.value}`)
                }));
                setDocumentTypes(doumentType);
            }
        }
        await getAllDocumentDesigningApi(callApi, callBack)
    }

    const getDocumentDesignByCreationDoc = async (documentCreationDocType, documentCreationAgentId) => {

        const callBack = (res) => {
            if (res.success) {
                setDocumentDesign(res.data);
                setDocumentDesignURL(res.data.previewUrl);
            }
        }
        await getDocumentDesignByCreationDocApi(callApi, callBack, { docType: documentCreationDocType, agentId: documentCreationAgentId })
    }

    const AddOrUpdateDocumentDesign = async (documentDesign) => {
        const callBack = (res) => {
            if (res.success) {
                setDocumentDesignURL(res.data.previewUrl);
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await AddOrUpdateDocumentDesignDocApi(callApi, callBack, documentDesign)

    };

    const ResetDocumentDesign = async (documentDesign) => {
        const callBack = (res) => {
            if (res.success) {
                setDocumentDesign(res.data);
                alertSuccessUpdate();
            }
            else {
                alertFaultUpdate();
            }
        }
        await ResetDocumentDesigningApi(callApi, callBack, documentDesign)
    };

    const handleChangeComments = (event) => {
        setDocumentDesign({
            ...documentDesign,
            notes: event.target.value,
        });
    };

    return {
        getDocumentTypes,
        getDocumentDesignByCreationDoc,
        AddOrUpdateDocumentDesign,
        ResetDocumentDesign,
        documentDesign,
        documentDesignChange,
        handleChangeComments,
        resetDocumentDesign
    };

};

export { UseDocumentDesign };