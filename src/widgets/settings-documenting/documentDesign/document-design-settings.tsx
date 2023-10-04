
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";
import { documentDesignState } from "../state/documents-state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { IDocumentDesign } from "./interface";

const DocumentDesignSetting = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const [documentdesign , setDocumentDesign] = useRecoilState(documentDesignState);
    const setdocumentDesign = (documentdesign : IDocumentDesign) =>{
        setDocumentDesign(documentdesign);
    }
    return (
        <div style={{ ...classes.container, overflow: "hidden" }}>
            <div> 
                <div  style={{ borderRadius: 10, overflowY: "scroll", marginBottom: 25}}>
                    <DocumentDesign documentDesign={documentdesign} setdocumentDesign={setdocumentDesign} />
                </div>
            </div>

           
           <div>
                <IframeDocumentDesign src={documentdesign?.previewUrl} width={"90%"} height={"740px"}/>
           </div>
            
        </div>
    );
};

export {DocumentDesignSetting};


