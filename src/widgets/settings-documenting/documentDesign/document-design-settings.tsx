
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";
import { documentDesignState, documentDesignURLState } from "../state/documents-state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { IDocumentDesign } from "./interface";

const DocumentDesignSetting = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const [documentdesign , setDocumentDesign] = useRecoilState(documentDesignState);
    const [documentDesignURL, setdocumentDesignURL] = useRecoilState(documentDesignURLState);
  
    
    const setdocumentDesign = (documentdesign : IDocumentDesign) =>{
        setDocumentDesign(documentdesign);
    }
    console.log("document url is the index page is  : " , documentDesignURL);
    return (
        <div style={{ ...classes.container, overflow: "hidden" }}>
            <div> 
                <div  style={{ borderRadius: 10, overflowY: "scroll", marginBottom: 25}}>
                    <DocumentDesign documentDesign={documentdesign} setdocumentDesign={setdocumentDesign} />
                </div>
            </div>

           
           <div style={classes.containerIframeComponent}>
                <IframeDocumentDesign src={`${documentDesignURL}`} />
           </div>
            
        </div>
    );
};

export {DocumentDesignSetting};


