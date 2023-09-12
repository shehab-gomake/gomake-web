import {ProfileAvatar} from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import {GoMakeModal} from "@/components";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {
    ChangePasswordComponent
} from "@/widgets/settings-profile-widget/components/change-password/change-password-component";
import Stack from "@mui/material/Stack";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useStyle} from "@/widgets/settings-profile-widget/components/profiles/style";
import {SecondaryButton} from "@/components/button/secondary-button";
import {IUserProfile, userProfileState} from "@/store/user-profile";
import {useRecoilState} from "recoil";
import {
    companyContactsInputs
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-contacts-inputs";
import {
    companyProfileInputs
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-profile-inputs";
import {
    companyLocationInputs
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-location-inputs";
import {
    companyFinancialInputs
} from "@/widgets/settings-profile-widget/components/profiles/inputs/company-financial-inputs";
import {FormInput} from "@/components/form-inputs/form-input";
import {FormInputsSectionComponent} from "@/components/form-inputs/form-inputs-section";


const CompanyProfileComponent = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [state, setState] = useRecoilState<IUserProfile>(userProfileState);
    const {classes} = useStyle();
    const changeState = (key, value) => {
        setState({
            ...state,
            [key]: value,
        })
    }
    const {t} = useTranslation();
    const formSections: { inputs: any[], title: string }[] = [
        {inputs: companyProfileInputs(state), title: 'profileSettings.company'},
        {inputs: companyContactsInputs(state), title: 'profileSettings.contacts'},
        {inputs: companyLocationInputs(state), title: 'profileSettings.location'},
        {inputs: companyFinancialInputs(state), title: 'profileSettings.financial'},
    ];
    return (
        <div style={{paddingBottom: 2, paddingTop: '40px', position: 'relative'}}>
            <Stack direction={'row'} gap={'57px'}>
                <div>
                    <ProfileAvatar title={'login logo'}/>
                </div>
                <div>
                    <ProfileAvatar title={'company logo'}/>
                </div>
            </Stack>
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
    export {CompanyProfileComponent};