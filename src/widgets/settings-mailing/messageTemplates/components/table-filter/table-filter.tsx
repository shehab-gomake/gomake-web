import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { filterInput} from "./inputs";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { SMSTemplateGroup } from "../../interfaces/interface";
import { templateGroupState } from "@/widgets/settings-mailing/states/state";

const TableFilter = () => {
    const { classes } = useStyle();
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
    const onChangeInputs = (key, value) => {
        setTemplateGroup({ ...templateGroup, [key]: value })

    }
 
    return (
        <Stack direction={'row'} style={classes.header}>
            {
                filterInput(templateGroup).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
            }
        </Stack>
    );
}

export { TableFilter }