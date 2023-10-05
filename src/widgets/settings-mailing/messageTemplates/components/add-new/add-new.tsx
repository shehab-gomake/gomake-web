import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { groupNameInput } from "./inputs";
import { useRecoilState } from "recoil";
import { SMSTemplateGroup } from "../../interfaces/interface";
import { templateGroupState } from "@/widgets/settings-mailing/states/state";
import { SecondaryButton } from "@/components/button/secondary-button";

const AddNewSMSTemplateGroup = ({ onClickAdd }: any) => {
    const { t } = useTranslation();
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
    const onChangeInputs = (key, value) => {
        setTemplateGroup({ ...templateGroup, [key]: value })
    }

    return (
        <Stack direction={'column'} gap={"16px"}> 

            <Stack direction={'row'}>
                {
                    groupNameInput(templateGroup).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <SecondaryButton onClick={onClickAdd} variant={"contained"}>{t("mailingSettings.add")}</SecondaryButton>
        </Stack>
    );
}

export { AddNewSMSTemplateGroup }