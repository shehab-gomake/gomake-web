import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { useStyle } from "../../style";
import { TextareaAutosize } from "@mui/material";
import { AdditionalOptionsInputs , AdditionalOptionsInputs2 } from "../../inputs/document-creation-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
interface IProps {
    documentCreation:any;
    setdocumentCreation: any;

}

const Additional = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
    }
  
  
  
    return (
        <>
             <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.Additional.Additional")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleSpanStyle} >{t("documentingDesign.Additional.Remarks")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                     <TextareaAutosize style={classes.textAreaStyle}></TextareaAutosize>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleSpanStyle} >{t("documentingDesign.Additional.Options")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"30px"} >
                {
                    AdditionalOptionsInputs(documentCreation).map(item => <Stack direction={'column'}  width={"200px"} >
                    <FormInput input={item as IInput}  changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"30px"} >
                {
                    AdditionalOptionsInputs2(documentCreation).map(item => <Stack direction={'column'}  width={"200px"} >
                    <FormInput  input={item as IInput}  changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                
           
                
            </div>
        </>
    );
}

export {Additional}