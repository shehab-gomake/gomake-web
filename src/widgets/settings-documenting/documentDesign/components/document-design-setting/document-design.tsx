
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { IDocumentDesign, IDocumentDesignProps } from "../../interface";
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
    const { AddOrUpdateDocumentDesign, ResetDocumentDesign, getDocumentTypes, documentDesign, documentDesignChange, getDocumentDesignByCreationDoc } = UseDocumentDesign();
    const addDocumentDesign = async () => {
        await AddOrUpdateDocumentDesign(documentDesign);
    };

    const ResetDefaultDocumentDesign = async () => {
        await ResetDocumentDesign(documentDesign);
    };

    const onChangeInputs = (key, value) => {
        documentDesignChange({ ...documentDesign, [key]: value })
    }

    useEffect(() => {
        getDocumentTypes();
    }, []);

    useEffect(() => {
        getDocumentDesignByCreationDoc(documentDesign?.docType, documentDesign?.agentId);
    }, [documentDesign?.docType, documentDesign?.agentId]);

    const DocumentDesignSection1: { inputs: any[], title: string }[] = [
        { inputs: creationDocumentInputs(documentDesign), title: 'documentingDesign.documnetCreation.documentinCreation' },
        { inputs: TitleDefinitionInputs(documentDesign), title: 'documentingDesign.TitleDefinition.TitleDefinition' },
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
        <div style={{ ...classes.container, position: 'relative', width: "60%" }}>
            <div style={{width:"100%"}}>
                <Stack direction={'column'} gap={'24px'} paddingTop={'10px'}>
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
                <Stack direction={'row'}  marginTop={"24px"}>
                    <TextareaAutosize style={classes.textAreaStyle}></TextareaAutosize>
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
                <QRCodes/>
                <div style={{ position: 'sticky', bottom: '0', left: '0', backgroundColor: "white", right: '0', padding: '16px' }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 16 }}>
                        <SecondaryButton onClick={ResetDefaultDocumentDesign} variant="outlined" >{t("documentingDesign.Reset")}</SecondaryButton>
                        <SecondaryButton onClick={addDocumentDesign} variant="contained">{t('documentingDesign.Save')}</SecondaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { DocumentDesign };
