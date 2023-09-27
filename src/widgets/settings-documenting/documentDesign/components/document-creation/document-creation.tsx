import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { creationDocumetInputs } from "../../inputs/document-creation-inputs";
import { useStyle } from "../../style";
interface IProps {
    documentCreation:any;
    setdocumentCreation: any;

}

const DocumentCreation = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
    }
  
    return (
        <>
            <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.documnetCreation.documentinCreation")}</span>
                </Stack>
                <Stack direction={'row'}  marginTop={"24px"} width={"90%"} gap={"30px"} >

                    {
                        creationDocumetInputs(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                </Stack>
            </div>
        </>
    );
}

export {DocumentCreation}