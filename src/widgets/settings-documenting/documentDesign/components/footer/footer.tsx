import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import Stack from "@mui/material/Stack";
import {FooterInputs1, FooterInputs2 } from "../../inputs/document-creation-inputs";
import {useTranslation} from "react-i18next";
import { useStyle } from "../../style";
interface IProps {
    documentCreation:any;
    setdocumentCreation: any;

}

const Footer = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
    }
  
    return (
        <>
            <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.Footer.Footer")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleSpanStyle} >{t("documentingDesign.Footer.Manualfooter")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"30px"} >
                {
                    FooterInputs1(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"30px"} >
                {
                    FooterInputs2(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                
                
            </div>
        </>
    );
}

export {Footer}