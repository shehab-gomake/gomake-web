import {CustomTabPanel, UsersSettingsTab, UsersSettingsTabs} from "@/widgets/settings-users/tabs";
import {useStyle} from "@/widgets/settings-profile-widget/style";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {useEmployee} from "@/widgets/settings-users/users/use-employee";
import {UserProfile} from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import {CompanyProfileComponent} from "@/widgets/settings-profile-widget/components/profiles/company-profile";


const SettingsProfileWidget = () => {
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const { classes } = useStyle();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {
        openModal,
        setOpenModal,
    } = useEmployee();

    return (
        <div>
            <div style={classes.tabsContainer}>
                <UsersSettingsTabs
                    value={value}
                    onChange={handleChange}
                >
                    <UsersSettingsTab label={t("profileSettings.profileTab")} />
                    <UsersSettingsTab label={t("profileSettings.companyProfile")} />
                </UsersSettingsTabs>
            </div>
            <CustomTabPanel value={value} index={0}>
                <UserProfile/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <CompanyProfileComponent/>
            </CustomTabPanel>
        </div>
    );
}

export {SettingsProfileWidget}