import {useTranslation} from "react-i18next";
import {useEmployee} from "@/widgets/settings-users/users/use-employee";
import {UserProfile} from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import {CompanyProfileComponent} from "@/widgets/settings-profile-widget/components/profiles/company-profile";
import {ITab} from "@/components/tabs/interface";
import {PrimaryTabsComponent} from "@/components/tabs/primary-tabs";



const SettingsProfileWidget = () => {
    const {t} = useTranslation();
    const {
        openModal,
        setOpenModal,
    } = useEmployee();

    const tabs: ITab[] = [
        {title: t("profileSettings.profileTab"), component: <UserProfile/>},
        {title: t("profileSettings.companyProfile"), component: <CompanyProfileComponent/>}
    ];
    return (
        <PrimaryTabsComponent tabs={tabs}/>
    );
}

export {SettingsProfileWidget}