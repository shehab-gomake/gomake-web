
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
    const [documentDesignURL, setdocumentDesignURL] = useRecoilState(documentDesignURLState);
    return (
        <div style={{ ...classes.container , height: "100%"  }}>
                <div   style={{ flex: 6 }}>
                    <DocumentDesign />
                </div>
                <div style={{ flex: 4 }}>
                     <IframeDocumentDesign src={`${documentDesignURL}`} />
                </div>
              
          
            
        </div>
    );
};

export {DocumentDesignSetting};


