import Stack from "@mui/material/Stack";
import {FormInput} from "@/components/form-inputs/form-input";
import {PrimaryButton} from "@/components/button/primary-button";
import {useAddGroup} from "@/widgets/production-floor/add-group/use-add-group";
import {useTranslation} from "react-i18next";

interface IProps {
    afterAddGroup: () => void;
}
const AddGroup = ({afterAddGroup}: IProps) => {
    const {addNewGroup, inputs, onFormChange} = useAddGroup();
    const {t} = useTranslation();
    return (
        <Stack padding={'5px 0'} gap={'50px'}>
            <Stack direction={'row'} gap={'10px'}>
                {
                    inputs.map(input => <FormInput input={input} changeState={onFormChange} error={false}/>)
                }
            </Stack>
            <PrimaryButton onClick={() => addNewGroup(afterAddGroup)} variant={'contained'}>{t('productionFloor.addGroup')}</PrimaryButton>
        </Stack>
    );
}

export {AddGroup}