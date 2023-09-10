import Stack from "@mui/material/Stack";
import {GomakeTextInput} from "@/components";
import {useTranslation} from "react-i18next";
import {SecondaryButton} from "@/components/button/secondary-button";

const ChangePasswordComponent = () => {
   const {t} = useTranslation();
    return (
        <div>
            <Stack direction={'column'} gap={'20px'} padding={'20px'}>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.currentPassword')}</span>
                    <GomakeTextInput type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.newPassword')}</span>
                    <GomakeTextInput type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.confirmNewPassword')}</span>
                    <GomakeTextInput type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-end'}>
                    <SecondaryButton variant={'contained'}>change</SecondaryButton>
                </Stack>
            </Stack>
        </div>
    )
}
export {ChangePasswordComponent}