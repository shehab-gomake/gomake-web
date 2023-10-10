import { useGomakeAxios } from "@/hooks";
import { AddOrUpdateDocumentDesignDocingApi, ResetDocumentDesigningApi, getAllDocumentDesigningApi, getDocumentDesignByCreationDocingApi } from "@/services/api-service/documenting/document-design";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { documentDesignState, documentDesignURLState, documentTypeState } from "./state/documents-state";
import { createNamedExports } from "typescript";
import { useState } from "react";
import { IDocumentDesign } from "./documentDesign/interface";

const UseDocumentDesign = () => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const [documentTypes, setdocumentTypes] = useRecoilState(documentTypeState);
    const [documentDesign, setdocumentDesign] = useRecoilState(documentDesignState);
    const [documentDesignURL, setdocumentDesignURL] = useRecoilState(documentDesignURLState);
    

    const documentDesignChange = (documentdesign: IDocumentDesign) => {
        setdocumentDesign(documentdesign);
    }

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
    const getDocumentDesignByCreationDoc = async (docmentCreationDocType,docmentCreationAgentId) =>{
  
        const callBack = (res) => {
            if (res.success) {
                setdocumentDesign(res.data);      
                setdocumentDesignURL(res.data.previewUrl);
                
            }
           
        }
       

        await getDocumentDesignByCreationDocingApi(callApi, callBack,{docType : docmentCreationDocType ,agentId : docmentCreationAgentId})
    }

    const AddOrUpdateDocumentDesign = async (documentDesign) =>{
    
        const callBack = (res) => {
            if (res.success) {
                setdocumentDesignURL(res.data.previewUrl);
            }

      
        }
        await AddOrUpdateDocumentDesignDocingApi(callApi, callBack,documentDesign)

    };
    const ResetDocumentDesign = async (documentDesign) =>{
      
        const callBack = (res) => {
            if (res.success) {
                setdocumentDesign(res.data);
            }
          
        }
        await ResetDocumentDesigningApi(callApi, callBack,documentDesign)

    };
    return {
        getDocumentTypes,
        getDocumentDesignByCreationDoc,
        AddOrUpdateDocumentDesign,
        ResetDocumentDesign,
        documentDesign,
        documentDesignChange
    };

};

export { UseDocumentDesign };