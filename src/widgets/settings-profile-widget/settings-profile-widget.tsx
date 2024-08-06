import { useTranslation } from "react-i18next";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { UserProfile } from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import { CompanyProfileComponent } from "@/widgets/settings-profile-widget/components/profiles/company-profile";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";

const SettingsProfileWidget = () => {
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const {} = useEmployee();
  const {
    getCurrenciesApi,
    getProfile
  } = useCompanyProfile();

  
  useEffect(() => {
    getCurrenciesApi().then(() => {
      getProfile();
    });
  }, []);

  const tabs: ITab[] = [
    { title: t("profileSettings.profileTab"), component: <UserProfile /> },
    CheckPermission(Permissions.SHOW_PROFILE_COMPANY) && {
      title: t("profileSettings.companyProfile"),
      component: <CompanyProfileComponent />,
    },
  ];
  return <div data-tour={'profileSettings'}><PrimaryTabsComponent tabs={tabs} /></div>;
};

export { SettingsProfileWidget };
