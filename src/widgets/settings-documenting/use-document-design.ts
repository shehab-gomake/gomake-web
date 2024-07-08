import { useGomakeAxios, useSnackBar } from "@/hooks";
import { AddOrUpdateDocumentDesignDocApi, ResetDocumentDesigningApi, getAllDocumentDesigningApi, getDocumentDesignByCreationDocApi } from "@/services/api-service/documenting/document-design";
import { useTranslation } from "react-i18next";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { documentDesignState, documentDesignURLState, documentTypeState } from "./state/documents-state";
import { AdditionalOptionsInputs,AdditionalOptionsInputs2, creationDocumentInputs, FooterInputs1, FooterInputs2, TableSettingInputs, TableSettingInputs2, TitleDefinitionCustomLogoInputs } from "./documentDesign/inputs/document-creation-inputs";

const UseDocumentDesign = () => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const { alertFaultUpdate, alertSuccessUpdate, alertFault } = useSnackBar();
    const [documentDesign, setDocumentDesign] = useRecoilState(documentDesignState);
    const resetDocumentDesign = useResetRecoilState(documentDesignState);
    const setDocumentTypes = useSetRecoilState(documentTypeState);
    const setDocumentDesignURL = useSetRecoilState(documentDesignURLState);

    const DocumentDesignSection1: { inputs: any[], title: string }[] = [
        { inputs: creationDocumentInputs(documentDesign), title: 'documentingDesign.documnetCreation.documentinCreation' },
        // { inputs: TitleDefinitionInputs(documentDesign), title: 'documentingDesign.TitleDefinition.TitleDefinition' },
        { inputs: TitleDefinitionCustomLogoInputs(documentDesign), title: 'documentingDesign.documnetCreation.logo' },
        { inputs: TableSettingInputs(documentDesign), title: 'documentingDesign.TableSetting.TableSetting' },
        { inputs: TableSettingInputs2(documentDesign), title: '' },
    ];

    const DocumentDesignSection2: { inputs: any[], title: string }[] = [
        { inputs: AdditionalOptionsInputs(documentDesign), title: 'documentingDesign.Additional.Options' },
        { inputs: AdditionalOptionsInputs2(documentDesign), title: '' },
        { inputs: FooterInputs1(documentDesign), title: 'documentingDesign.Footer.Footer' },
        { inputs: FooterInputs2(documentDesign), title: '' },
    ];


    const getDocumentTypes = async () => {
        const callBack = (res) => {
            if (res.success) {
                const documentType = res.data.map(doc => ({
                    value: doc.key,
                    text: t(`documentType.${doc.value}`)
                }));
                setDocumentTypes(documentType);
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
        await AddOrUpdateDocumentDesignDocApi(callApi, callBack, { ...documentDesign, pdfLogo: null, pdfHeader: null, pdfFooter: null })
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

    // const onChangeInput = (key, value) => {
    //     if (key === "pdfLogo") {
    //         setDocumentDesign({ ...documentDesign, pdfLogoBase64: value, pdfLogo: value });
    //     } else if (key === "pdfHeader") {
    //         setDocumentDesign({ ...documentDesign, pdfHeaderBase64: value, pdfHeader: value });
    //     } else if (key === "pdfFooter") {
    //         setDocumentDesign({ ...documentDesign, pdfFooterBase64: value, pdfFooter: value });
    //     } else {
    //         setDocumentDesign({ ...documentDesign, [key]: value });
    //     }
    // }

    const validateImageSize = (img, maxWidth, maxHeight) => {
        return img.width <= maxWidth && img.height <= maxHeight;
    };

    const decodeBase64Image = (base64) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    const handleImageValidation = async (base64, maxWidth, maxHeight) => {
        try {
            const img = await decodeBase64Image(base64);
            if (!validateImageSize(img, maxWidth, maxHeight)) {
                alertFault(`${t("alerts.imageSizeExceedsDimensions")} (${maxWidth}x${maxHeight}).`);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error loading image:", error);
            return false;
        }
    };

    const updateDocumentDesign = async (key, value, maxWidth, maxHeight) => {
        const isValid = await handleImageValidation(value, maxWidth, maxHeight);
        if (!isValid) {
            return;
        }

        let updatedDesign = { ...documentDesign };

        if (key === "pdfLogo") {
            updatedDesign = { ...updatedDesign, pdfLogoBase64: value, pdfLogo: value };
        } else if (key === "pdfHeader") {
            updatedDesign = { ...updatedDesign, pdfHeaderBase64: value, pdfHeader: value };
        } else if (key === "pdfFooter") {
            updatedDesign = { ...updatedDesign, pdfFooterBase64: value, pdfFooter: value };
        } else {
            updatedDesign = { ...updatedDesign, [key]: value };
        }

        setDocumentDesign(updatedDesign);
    };

    const onChangeInputs = (key, value) => {
        if (key === "pdfLogo") {
            updateDocumentDesign(key, value, 100, 100);
        } else if (key === "pdfHeader") {
            updateDocumentDesign(key, value, 900, 80);
        } else if (key === "pdfFooter") {
            updateDocumentDesign(key, value, 900, 50);
        } else {
            setDocumentDesign({ ...documentDesign, [key]: value });
        }
    };

    const addDocumentDesign = async () => {
        await AddOrUpdateDocumentDesign(documentDesign);
    };

    const ResetDefaultDocumentDesign = async () => {
        await ResetDocumentDesign(documentDesign);
    };
    return {
        DocumentDesignSection1,
        DocumentDesignSection2,
        getDocumentTypes,
        getDocumentDesignByCreationDoc,
        AddOrUpdateDocumentDesign,
        ResetDocumentDesign,
        documentDesign,
        setDocumentDesign,
        handleChangeComments,
        resetDocumentDesign,
        updateDocumentDesign,
        onChangeInputs,
        addDocumentDesign,
        ResetDefaultDocumentDesign
    };

};

export { UseDocumentDesign };