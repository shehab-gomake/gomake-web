
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { useStyle } from "../../style";
import { TitleDefinitionInputs } from "../../inputs/document-creation-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { LogoUploadComponent } from "../uplod-logo/upload-logo-component";
import { ChangeEvent } from "react";
interface IProps {
    documentCreation:any;
    setdocumentCreation: any;

}
const TitleDefinition = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
    }
  
  
    return (
        <>
            <div>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleStyle} >{t("documentingDesign.TitleDefinition.TitleDefinition")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleSpanStyle} >{t("documentingDesign.TitleDefinition.defaultFormat")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"30px"} >
                {
                    TitleDefinitionInputs(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
            
                

            </div>
            
        </>
    );
}

export {TitleDefinition}