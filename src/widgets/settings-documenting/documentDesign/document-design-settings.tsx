
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";
import { documentDesignState, documentDesignURLState } from "../state/documents-state";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { IDocumentDesign } from "./interface";
import { Stack } from "@mui/material";

const DocumentDesignSetting = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const [documentDesignURL, setdocumentDesignURL] = useRecoilState(documentDesignURLState);
    return (
        <div style={{ ...classes.container , height: "100%"  }}>
                <div   style={{ flex: 5 }}>
                    <DocumentDesign />
                </div>
                <div style={{ flex: 5 , height: "100%" , backgroundColor:"#FFFFFF" ,boxShadow:"0px 4px 40px 0px rgba(0, 0, 0, 0.08)", position:"relative" , padding:20,minHeight:"690px"}}>
                    <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.IframeDocument.Document")}</span> <span  style={classes.subTitleStyle} >  - Document Type </span>
                    </Stack>
                    <div style={{position:"relative",height:"100%"}}>
                         <IframeDocumentDesign src={`${documentDesignURL}`} />
                    </div>
                   
                </div>
              
          
            
        </div>
    );
};

export {DocumentDesignSetting};


