import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { useRecoilState } from "recoil";
import { SMSTemplateGroup } from "../../interfaces/interface";
import { templateGroupState } from "@/widgets/settings-mailing/states/state";
import { SecondaryButton } from "@/components/button/secondary-button";


const UploadFileInput = () => {
    const { t } = useTranslation();
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
    const onChangeInputs = (key, value) => {
        setTemplateGroup({ ...templateGroup, [key]: value })
    }

    return (
       
            <Stack direction={'row'}>
                {
                    <input type="file" style={{display:"none"}}/>
                }
            </Stack>
      
    );
}

export { UploadFileInput }