import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import { useStyle } from "../../style";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { TableSettingInputs, TableSettingInputs2 } from "../../inputs/document-creation-inputs";
interface IProps {
    documentCreation:any;
    setdocumentCreation: any;

}

const TableSetting = ({documentCreation, setdocumentCreation }: IProps) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const onChangeInputs = (key, value) => {
        setdocumentCreation({ ...documentCreation, [key]: value })
    }
  
  
  
    return (
        <>
             <div>
                <Stack direction={'row'}  marginTop={"24px"}>
                        <span style={classes.subTitleStyle} >{t("documentingDesign.TableSetting.TableSetting")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"} marginTop={"24px"}>
                    <span style={classes.subTitleSpanStyle} >{t("documentingDesign.TableSetting.defaultFormat")}</span>
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"16px"} >
                {
                    TableSettingInputs(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput input={item as IInput}  changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                <Stack direction={'row'} marginBottom={"24px"}  marginTop={"24px"} width={"90%"} gap={"16px"} >
                {
                    TableSettingInputs2(documentCreation).map(item => <Stack direction={'column'}  width={"180px"} >
                    <FormInput input={item as IInput}  changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    
                }
                </Stack>
                
            </div>
        </>
    );
}

export {TableSetting}