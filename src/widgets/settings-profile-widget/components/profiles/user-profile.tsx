import {ProfileAvatar} from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import {GoMakeModal} from "@/components";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    ChangePasswordComponent
} from "@/widgets/settings-profile-widget/components/change-password/change-password-component";
import Stack from "@mui/material/Stack";
import {IUserProfile} from "@/widgets/settings-profile-widget/components/profiles/interface";
import {MachineInput} from "@/widgets/machines/components/inputs/machine-inputs";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {personalInputs} from "@/widgets/settings-profile-widget/components/profiles/inputs/personal-inputs";
import {contactsInputs} from "@/widgets/settings-profile-widget/components/profiles/inputs/contacts-inputs";
import {useStyle} from "@/widgets/settings-profile-widget/components/profiles/style";
import Button from "@mui/material/Button";
import {SecondaryButton} from "@/widgets/machines/components/buttons/secondary-button";

const initState = {
    fullName: '',
    companyName: '',
    position: '',
    demoCode: '',
    email: '',
    phone: '',
    address: '',
    postalCode: ''
}
const UserProfile = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [state, setState] = useState<IUserProfile>(initState);
    const {classes} = useStyle();
    const changeState = (key, value) => {
        setState({
            ...state,
            [key]: value,
        })
    }
    const {t} = useTranslation();
    const formSections: { inputs: any[], title: string }[] = [
        {inputs: personalInputs(state), title: 'profileSettings.personal'},
        {inputs: contactsInputs(state), title: 'profileSettings.contacts'},
    ];
    return (
        <div style={{paddingBottom: 2, paddingTop: '40px'}}>
            <ProfileAvatar title={'ahmad ali'}/>

            <Stack direction={'column'} gap={'32px'} paddingTop={'44px'}>
                {
                    formSections.map(section => {
                        return (
                            <Stack direction={'column'} gap={'32px'}>
                                <h3 style={classes.subSectionHeader}>{t(section.title)}</h3>
                                <Stack gap={'16px'} direction={'row'} display={'flex'} flexWrap={'wrap'}>
                                    {
                                        section.inputs.map(companyInput => <MachineInput key={companyInput.parameterKey}
                                                                                         input={companyInput as IInput}
                                                                                         changeState={changeState}
                                                                                         error={false}/>)
                                    }
                                </Stack>
                            </Stack>
                        );
                    })
                }
                <div>
                    <Button onClick={() => setOpenModal(true)} variant={'contained'}>change password</Button>
                </div>
            </Stack>
            <div style={{position: 'sticky', bottom: 10, display: 'flex', justifyContent: 'flex-end'}}>
                <SecondaryButton variant={'contained'}>update</SecondaryButton>
            </div>
            <GoMakeModal
                insideStyle={{paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380}}
                headerPadding={20}
                openModal={openModal}
                onClose={() => setOpenModal(false)}
                modalTitle={t('profileSettings.changePassword')}
            >
                <ChangePasswordComponent/>
            </GoMakeModal>
        </div>

    )
}
export {UserProfile};