import Stack from "@mui/material/Stack";
import {GomakeTextInput} from "@/components";
import {useTranslation} from "react-i18next";
import {SecondaryButton} from "@/components/button/secondary-button";
import {useState} from "react";
import { useGomakeUser } from "./use-gomake-user";

interface IProps {
    userId: string;
  }

const ChangePasswordComponent = ({userId} : IProps) => {
   const {t} = useTranslation();
   const [currentPassword, setCurrentPassword] = useState<string>('');
   const [newPassword, setNewPassword] = useState<string>('');
   const [confirmPassword, setConfirmPassword] = useState<string>('');
   const {updateUserPassword} = useGomakeUser();
   const handleClick = () => {
       if (!currentPassword || !newPassword || !confirmPassword) {
           return;
       }
       if (newPassword !== confirmPassword) {
           return;
       }
        updateUserPassword({
            currentPassword,
            newPassword,
            confirmPassword,
        }, userId).then();
   }
    return (
        <div>
            <Stack direction={'column'} gap={'20px'} padding={'20px'}>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.currentPassword')}</span>
                    <GomakeTextInput onChange={(e) => setCurrentPassword(e.target.value)} type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.newPassword')}</span>
                    <GomakeTextInput onChange={(e) => setNewPassword(e.target.value)} type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'column'} gap={'13px'}>
                    <span>{t('profileSettings.confirmNewPassword')}</span>
                    <GomakeTextInput onChange={(e) => setConfirmPassword(e.target.value)} type={'password'} style={{height: 40}}/>
                </Stack>
                <Stack direction={'row'} justifyContent={'flex-end'}>
                    <SecondaryButton onClick={handleClick} variant={'contained'}>change</SecondaryButton>
                </Stack>
            </Stack>
        </div>
    )
}
export {ChangePasswordComponent}