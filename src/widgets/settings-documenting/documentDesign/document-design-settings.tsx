
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";

const DocumentDesignSetting = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    return (
        <div style={{ ...classes.container, overflow: "hidden" }}>
            <div> 
                <div  style={{ borderRadius: 10, overflowY: "scroll", marginBottom: 25}}>
                    <DocumentDesign/>
                </div>
            </div>
           
           <div>
                <IframeDocumentDesign src={"https://qa.gomake.co.il/Invoices/ExportToPDF/2491?key=2147b767-2c7f-43d7-909f-da2c9f41c036"} width={"90%"} height={"740px"}/>
           </div>
            
        </div>
    );
};

export {DocumentDesignSetting};
