
import { useTranslation } from "react-i18next";
import { Stack } from "@mui/material";
import { useStyle } from "../../../style";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { QRCodesInputs1, QRCodesInputs2, QRCodesInputs3 } from "../../../inputs/document-creation-inputs";
import { UseDocumentDesign } from "@/widgets/settings-documenting/use-document-design";

const QRCodes = () => {
    const {classes} = useStyle();
    const { t } = useTranslation();
    const { documentDesign, documentDesignChange} = UseDocumentDesign();
    const onChangeInputs = (key, value) => {
        documentDesignChange({ ...documentDesign, [key]: value })

    }
    return (
        <>
          <Stack direction={'column'} marginTop={"24px"} gap={"24px"}>
                    <span style={classes.subTitleStyle} >{t("documentingDesign.QRCodes.QRCodes")}</span>
            <Stack direction={'row'} width={"90%"} gap={"16px"}>
                {
                    QRCodesInputs1(documentDesign).map(item => <Stack direction={'column'}     >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                }
            </Stack>
            <Stack direction={'row'} width={"90%"} gap={"16px"} >
                {
                    QRCodesInputs2(documentDesign).map(item => <Stack direction={'column'}  >
                    <FormInput  input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
            </Stack>
            <Stack direction={'row'} width={"90%"} gap={"16px"}>
                {
                    QRCodesInputs3(documentDesign).map(item => <Stack direction={'column'}   >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                }
            </Stack>
            </Stack>

        </>
      
    );
};

export {QRCodes};