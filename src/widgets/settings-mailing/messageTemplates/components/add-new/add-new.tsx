import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { groupNameInput } from "./inputs";
import { useRecoilState } from "recoil";
import { templateGroupStateNew } from "@/widgets/settings-mailing/states/state";
import { SecondaryButton } from "@/components/button/secondary-button";
import { SMSTemplateGroup } from "../../interfaces/interface"; 

interface IProps {
    onClickAdd: (value : SMSTemplateGroup) => void;
}

const AddNewSMSTemplateGroup = ({ onClickAdd }: IProps) => {
    const { t } = useTranslation();
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupStateNew);
    const onChangeInputs = (key, value) => {
        setTemplateGroup({ ...templateGroup, [key]: value })
    }

    return (
        <Stack direction={'column'} gap={"40px"}> 
            <Stack direction={'row'}>
                {
                    groupNameInput(templateGroup).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'}  justifyContent={"flex-end"}>
            <SecondaryButton onClick={()=>onClickAdd(templateGroup)} variant={"contained"}>{t("mailingSettings.add")}</SecondaryButton>
        </Stack>
        </Stack>

    );
}

export { AddNewSMSTemplateGroup }