import { useTranslation } from "react-i18next";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { UserProfile } from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import { CompanyProfileComponent } from "@/widgets/settings-profile-widget/components/profiles/company-profile";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { Permissions } from "@/components/CheckPermission/enum";
import { usePermission } from "@/hooks/use-permission";

const SettingsProfileWidget = () => {
  const { t } = useTranslation();
  const { CheckPermission } = usePermission();
  const { openModal, setOpenModal } = useEmployee();

  const tabs: ITab[] = [
    { title: t("profileSettings.profileTab"), component: <UserProfile /> },
    CheckPermission(Permissions.SHOW_PROFILE_COMPANY) && {
      title: t("profileSettings.companyProfile"),
      component: <CompanyProfileComponent />,
    },
  ];
  return <PrimaryTabsComponent tabs={tabs} />;
};

export { SettingsProfileWidget };
