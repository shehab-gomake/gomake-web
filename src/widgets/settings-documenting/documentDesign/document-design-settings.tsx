
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";
import { documentDesignTypeTextState, documentDesignURLState } from "../state/documents-state";
import { useRecoilValue } from "recoil";

const DocumentDesignSetting = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const documentDesignURL = useRecoilValue(documentDesignURLState);
    const documentTypeText = useRecoilValue(documentDesignTypeTextState);
    return (
        <div style={classes.mainContainer}>
            <DocumentDesign/>
            <div style={classes.documentContainerStyle}>
                <span style={classes.subTitleStyleDocumentType} >{t("documentingDesign.IframeDocument.Document") + "-" + t(`${documentTypeText}`)}</span>
                <IframeDocumentDesign src={`${documentDesignURL}`} />
            </div>
        </div>
    );
};

export { DocumentDesignSetting };