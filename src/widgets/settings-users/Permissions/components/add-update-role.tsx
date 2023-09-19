import {useTranslation} from "react-i18next";
import {GomakeTextInput,} from "@/components";
import {SecondaryButton} from "@/components/button/secondary-button";
import {EActions} from "@/widgets/settings-users/Permissions/enum/actions";
import Stack from "@mui/material/Stack";

interface IAddUpdateRoleProps {
    onChange: (v: string) => void;
    value: string;
    onActionClick: () => void;
    action: EActions;
}
const AddUpdateRole = ({onChange, value, onActionClick, action}: IAddUpdateRoleProps) => {
    const {t} = useTranslation();
    return (
            <Stack padding={2} direction={'column'} gap={2}>
                <Stack width={'80%'}>
                    <GomakeTextInput
                        value={value}
                        placeholder={t("permissionsSettings.Role name")}
                        onChange={(e: any) => {onChange(e.target.value)}}
                    />
                </Stack>
                <Stack  direction={'row'} justifyContent={'flex-end'}>
                    <SecondaryButton onClick={onActionClick} variant={'contained'}>
                        {t(action === EActions.ADD ? "permissionsSettings.add" : 'permissionsSettings.update')}
                    </SecondaryButton>
                </Stack>
            </Stack>
    );
};
export {AddUpdateRole};
