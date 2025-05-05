import { useTranslation } from "react-i18next";
import { useEmployee } from "@/widgets/settings-users/users/use-employee";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { useEffect } from "react";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { CompanyBasicInfoComponent } from "./components/tabs-components/company-basic-info-component";
import { CompanyAddressComponent } from "./components/tabs-components/company-address-component";
import { CompanyWorkingDaysComponent } from "./components/tabs-components/company-working-days-component";
import { CompanyFinancialComponent } from "./components/tabs-components/company-financial-component";
import { CompanyCommunicationComponent } from "./components/tabs-components/company-communication-component";
import { CompanyProfileComponent } from "./components/profiles/company-profile";

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
      component: <CompanyBasicInfoComponent />,
    },
    {
      title: t("profileSettings.hours"),
      component: <CompanyWorkingDaysComponent />,
    },
    {
      title: t("customers.modal.addresses"),
      component: <CompanyAddressComponent />,
    },
    {
      title: t("profileSettings.financial"),
      component: (
        <CompanyFinancialComponent
          taxLoginInfo={taxLoginInfo}
          printHouseTaxLogout={printHouseTaxLogout}
        />
      ),
    },
    {
      title: t("profileSettings.smsAndEmails"),
      component: <CompanyCommunicationComponent />,
    },
  ];

  return (
    <div data-tour={"profileSettings"}>
      <PrimaryTabsComponent tabs={tabs} />
    </div>
  );
};

export { SettingsCompanyProfileWidget };
