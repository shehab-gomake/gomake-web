import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useEffect, useState } from 'react';
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { filterInput, switchInputs } from "./inputs";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { SMSTemplateGroup } from "../../interfaces/interface";
import { templateGroupState } from "@/widgets/settings-mailing/states/state";

const TableFilter = () => {
    const { classes } = useStyle();

    //should be fix
    const [state, setState] = useState(null);
    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
    const onChangeInputs2 = (key, value) => {
        setTemplateGroup({ ...state, [key]: value })
    }

    return (

        <Stack direction={'row'} style={classes.header}>
            {
                filterInput(templateGroup).map(item => <FormInput input={item as IInput} changeState={onChangeInputs2} error={false} readonly={false} />)
            }
            <Stack direction={'row'} gap={"16px"}>
                {
                    switchInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
        </Stack>
    );
}

export { TableFilter }