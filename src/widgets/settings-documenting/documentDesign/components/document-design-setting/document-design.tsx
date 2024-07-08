
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect } from "react";
import { Stack, TextareaAutosize } from "@mui/material";
import { FormInputsSectionComponent } from "@/components/form-inputs/form-inputs-section";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { AdditionalOptionsInputs, AdditionalOptionsInputs2, FooterInputs1, FooterInputs2, TableSettingInputs, TableSettingInputs2, TitleDefinitionCustomLogoInputs, TitleDefinitionInputs, creationDocumentInputs } from "../../inputs/document-creation-inputs";
import { QRCodes } from "./QRCodes/QRCodes";

const DocumentDesign = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const { AddOrUpdateDocumentDesign, ResetDocumentDesign, getDocumentTypes, documentDesign, getDocumentDesignByCreationDoc, handleChangeComments, setDocumentDesign } = UseDocumentDesign();
    const addDocumentDesign = async () => {
        await AddOrUpdateDocumentDesign(documentDesign);
    };

    const ResetDefaultDocumentDesign = async () => {
        await ResetDocumentDesign(documentDesign);
    };

    const onChangeInputs = (key, value) => {
        if (key === "pdfLogo") {
            setDocumentDesign({ ...documentDesign, pdfLogoBase64: value, pdfLogo: value });
        } else if (key === "pdfHeader") {
            setDocumentDesign({ ...documentDesign, pdfHeaderBase64: value, pdfHeader: value });
        } else if (key === "pdfFooter") {
            setDocumentDesign({ ...documentDesign, pdfFooterBase64: value, pdfFooter: value });
        } else {
            setDocumentDesign({ ...documentDesign, [key]: value });
        }
    }

    // const onChangeInputs = (key, value) => {
    //     setDocumentDesign({ ...documentDesign, [key]: value });
    // }


    useEffect(() => {
        getDocumentTypes();
    }, []);

    useEffect(() => {
        getDocumentDesignByCreationDoc(documentDesign?.docType, documentDesign?.agentId);
    }, [documentDesign?.docType, documentDesign?.agentId]);

    const DocumentDesignSection1: { inputs: any[], title: string }[] = [
        { inputs: creationDocumentInputs(documentDesign), title: 'documentingDesign.documnetCreation.documentinCreation' },
        // { inputs: TitleDefinitionInputs(documentDesign), title: 'documentingDesign.TitleDefinition.TitleDefinition' },
        { inputs: TitleDefinitionCustomLogoInputs(documentDesign), title: 'Logo' },
        { inputs: TableSettingInputs(documentDesign), title: 'documentingDesign.TableSetting.TableSetting' },
        { inputs: TableSettingInputs2(documentDesign), title: '' },
    ];

    const DocumentDesignSection2: { inputs: any[], title: string }[] = [
        { inputs: AdditionalOptionsInputs(documentDesign), title: 'documentingDesign.Additional.Options' },
        { inputs: AdditionalOptionsInputs2(documentDesign), title: '' },
        { inputs: FooterInputs1(documentDesign), title: 'documentingDesign.Footer.Footer' },
        { inputs: FooterInputs2(documentDesign), title: '' },
    ];

    return (
        <div style={classes.container}>
            <Stack direction={'column'} gap={'24px'}>
                {
                    DocumentDesignSection1.map(section => {
                        return (
                            <FormInputsSectionComponent sectionTitle={section.title}>
                                {
                                    section.inputs.map(companyInput => <FormInput key={companyInput.parameterKey}
                                        input={companyInput as IInput}
                                        changeState={onChangeInputs}
                                        error={false} />)
                                }
                            </FormInputsSectionComponent>
                        );
                    })
                }
            </Stack>
            <Stack direction={'row'} marginTop={"24px"} >
                <span style={classes.subTitleStyle} >{t("documentingDesign.Additional.Additional")}</span>
            </Stack>
            <Stack direction={'row'} marginTop={"24px"}>
                <span style={classes.subTitleSpanStyle} >{t("documentingDesign.Additional.Remarks")}</span>
            </Stack>
            <Stack direction={'row'} marginTop={"24px"}>
                <TextareaAutosize style={classes.textAreaStyle} value={documentDesign?.notes} onChange={handleChangeComments}></TextareaAutosize>
            </Stack>
            <Stack direction={'column'} gap={'32px'} paddingTop={'44px'}>
                {
                    DocumentDesignSection2.map(section => {
                        return (
                            <FormInputsSectionComponent sectionTitle={section.title}>
                                {
                                    section.inputs.map(companyInput => <FormInput key={companyInput.parameterKey}
                                        input={companyInput as IInput}
                                        changeState={onChangeInputs}
                                        error={false} />)
                                }
                            </FormInputsSectionComponent>
                        );
                    })
                }
            </Stack>
            <QRCodes />
            <div style={{ ...classes.footerStyle, marginRight: dir == "ltr" ? '10px' : '0px', marginLeft: dir == "rtl" ? '10px' : '0px', }}>
                <SecondaryButton onClick={ResetDefaultDocumentDesign} variant="outlined" >{t("documentingDesign.Reset")}</SecondaryButton>
                <SecondaryButton onClick={addDocumentDesign} variant="contained">{t('documentingDesign.Save')}</SecondaryButton>
            </div>
        </div>
    );
};

export { DocumentDesign };