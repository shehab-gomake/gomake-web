import {ProfileAvatar} from "@/widgets/settings-profile-widget/components/avatar/profile-avatar";
import {GoMakeModal} from "@/components";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {
    ChangePasswordComponent
} from "@/widgets/settings-profile-widget/components/change-password/change-password-component";
import Stack from "@mui/material/Stack";
import {IInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";
import {useStyle} from "@/widgets/settings-profile-widget/components/profiles/style";
import {SecondaryButton} from "@/components/button/secondary-button";

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
import {useCompanyProfile} from "@/hooks/use-company-profile";


const CompanyProfileComponent = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {profile, getProfile, profileChange, updateProfileChanges, setProfile} = useCompanyProfile();
    const {classes} = useStyle();

    useEffect(() => {
        getProfile().then();
    }, [])
    const changeState = (key, value) => {
        setProfile({
            ...profile,
            [key]: value,
        })
    }
    const {t} = useTranslation();
    const formSections: { inputs: any[], title: string }[] = [
        {inputs: companyProfileInputs(profile), title: 'profileSettings.company'},
        {inputs: companyContactsInputs(profile), title: 'profileSettings.contacts'},
        {inputs: companyLocationInputs(profile), title: 'profileSettings.location'},
        {inputs: companyFinancialInputs(profile), title: 'profileSettings.financial'},
    ];
    return (
        <div style={{paddingBottom: 2, paddingTop: '40px', position: 'relative'}}>
            <Stack direction={'row'} gap={'57px'}>
                <div>
                    <ProfileAvatar src={profile.loginLogo} title={'login logo'}/>
                </div>
                <div>
                    <ProfileAvatar src={profile.logo} title={'company logo'}/>
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
                <SecondaryButton onClick={updateProfileChanges} variant={'contained'}>update</SecondaryButton>
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