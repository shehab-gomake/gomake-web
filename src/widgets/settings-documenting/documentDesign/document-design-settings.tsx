import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { DocumentDesign } from "./components/document-design-setting/document-design";
import { IframeDocumentDesign } from "./components/document-design-setting/iframe-document-desgin";
import { UseDocumentDesignSettings } from "./use-document-design-settings";
import { useEffect } from "react";

const DocumentDesignSetting = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { documentTypeText, documentDesignURL, getDocumentTypes } =
    UseDocumentDesignSettings();

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        await getDocumentTypes();
      } catch (error) {
        console.error("Failed to load document types", error);
      }
    };
    fetchDocumentTypes();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <DocumentDesign />
      <div style={classes.documentContainerStyle}>
        <span style={classes.subTitleStyleDocumentType}>
          {t("documentingDesign.IframeDocument.Document") +
            "-" +
            t(`${documentTypeText}`)}
        </span>
        <IframeDocumentDesign src={`${documentDesignURL}`} />
      </div>
    </div>
  );
};

export { DocumentDesignSetting };
