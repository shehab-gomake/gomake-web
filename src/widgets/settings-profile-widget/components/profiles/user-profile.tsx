import {ProfileAvatar} from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import {GoMakeModal} from "@/components";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    ChangePasswordComponent
} from "@/widgets/settings-profile-widget/components/change-password/change-password-component";
import Stack from "@mui/material/Stack";
import {IUserProfile} from "@/widgets/settings-profile-widget/components/profiles/interface";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {personalInputs} from "@/widgets/settings-profile-widget/components/profiles/inputs/personal-inputs";
import {contactsInputs} from "@/widgets/settings-profile-widget/components/profiles/inputs/contacts-inputs";
import {useStyle} from "@/widgets/settings-profile-widget/components/profiles/style";
import Button from "@mui/material/Button";
import {SecondaryButton} from "@/components/button/secondary-button";
import {FormInput} from "@/components/form-inputs/form-input";
import {FormInputsSectionComponent} from "@/components/form-inputs/form-inputs-section";

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
                            <FormInputsSectionComponent sectionTitle={section.title}>
                                    {
                                        section.inputs.map(companyInput => <FormInput key={companyInput.parameterKey}
                                                                                         input={companyInput as IInput}
                                                                                         changeState={changeState}
                                                                                         error={false}/>)
                                    }
                            </FormInputsSectionComponent>
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