import { useTranslation } from "react-i18next";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { CompanyProfileComponent } from "@/widgets/settings-profile-widget/components/profiles/company-profile";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";

//!here
const SettingsCompanyProfileWidget = () => {
  const { t } = useTranslation();
  const {} = useEmployee();
  const {
    getCurrenciesApi,
    getProfile,
    checkPrintHouseTaxLogin,
    taxLoginInfo,
    printHouseTaxLogout,
  } = useCompanyProfile();

  useEffect(() => {
    checkPrintHouseTaxLogin();
    getCurrenciesApi().then(() => {
      getProfile();
    });
  }, []);

  const tabs: ITab[] = [
    {
      title: t("profileSettings.company"),
      component: (
        <CompanyProfileComponent
          taxLoginInfo={taxLoginInfo}
          printHouseTaxLogout={printHouseTaxLogout}
        />
      ),
    },
    {
      title: t("profileSettings.hours"),
      component: <div>soon...</div>,
    },
    {
      title: t("customers.modal.addresses"),
      component: <div>soon...</div>,
    },
    {
      title: t("profileSettings.financial"),
      component: <div>soon...</div>,
    },
    {
      title: t("profileSettings.smsAndEmails"),
      component: <div>soon...</div>,
    },
  ];

  return (
    <div data-tour={"profileSettings"}>
      <PrimaryTabsComponent tabs={tabs} />
    </div>
  );
};

export { SettingsCompanyProfileWidget };
