
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { useStyle } from "../../style";
import { TitleDefinitionCustomLogoInputs, TitleDefinitionInputs } from "../../inputs/document-creation-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { IDocumentDesign, IDocumentDesignProps } from "../../interface";

const TitleDefinition = ({documentDesign, setdocumentDesign }: IDocumentDesignProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentDesign({ ...documentDesign, [key]: value })
    }
  
  
    return (
        <>
            <div>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleStyle} >{t("documentingDesign.TitleDefinition.TitleDefinition")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"16px"}  >
                {
                    TitleDefinitionInputs(documentDesign).map(item => <FormInput  input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                    
                }
                </Stack>
                
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"16px"} >
                {
                    TitleDefinitionCustomLogoInputs(documentDesign).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput  input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                
            
                

            </div>
            
        </>
    );
}

export {TitleDefinition}