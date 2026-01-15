import { useRouter } from "next/router";
import { useMemo, useEffect } from "react";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { CompanyBasicInfoComponent } from "./components/tabs-components/company-basic-info-component";
import { CompanyWorkingDaysComponent } from "./components/tabs-components/company-working-days-component";
import { CompanyAddressComponent } from "./components/tabs-components/company-address-component";
import { CompanyFinancialComponent } from "./components/tabs-components/company-financial-component";
import { CompanyCommunicationComponent } from "./components/tabs-components/company-communication-component";
import { CompanyPrintNodeComponent } from "./components/tabs-components/company-print-node-component";
import { CompanyIntegrationsComponent } from "./components/tabs-components/company-integrations-component";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { printHouseUsePrintNode } from "@/store/print-house-profile";
import Head from "next/head";

const SettingsCompanyProfileWidget = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const tabQuery = router.query.tab as string;
  const isPrintHouseUsePrintNode = useRecoilValue(printHouseUsePrintNode);

  const {
    profile,
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

  const tabs: ITab[] = useMemo(
    () => {
      const baseTabs: ITab[] = [
        {
          title: t("profileSettings.company"),
          component: <CompanyBasicInfoComponent />,
          id: "company",
        },
        {
          title: t("profileSettings.hours"),
          component: <CompanyWorkingDaysComponent />,
          id: "hours",
        },
        {
          title: t("customers.modal.addresses"),
          component: <CompanyAddressComponent />,
          id: "addresses",
        },
        {
          title: t("profileSettings.financial"),
          component: (
            <CompanyFinancialComponent
              taxLoginInfo={taxLoginInfo}
              printHouseTaxLogout={printHouseTaxLogout}
            />
          ),
          id: "financial",
        },
        {
          title: t("profileSettings.smsAndEmails"),
          component: <CompanyCommunicationComponent />,
          id: "communication",
        },
        {
          title: t("profileSettings.integrations"),
          component: <CompanyIntegrationsComponent />,
          id: "integrations",
        },
      ];

      // Add Print Node tab only if the print house has PrintNode feature
      if (isPrintHouseUsePrintNode) {
        baseTabs.push({
          title: t("profileSettings.printNode"),
          component: <CompanyPrintNodeComponent />,
          id: "printNode",
        });
      }

      return baseTabs;
    },
    [t, taxLoginInfo, printHouseTaxLogout, isPrintHouseUsePrintNode]
  );

  const tabIndex = useMemo(() => {
    const foundIndex = tabs.findIndex((tab) => tab?.id === tabQuery);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [tabQuery, tabs]);

  const handleTabChange = (index: number) => {
    const selectedTab = tabs[index];
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: selectedTab.id },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div data-tour="profileSettings">
      <Head>
        <title>{t("profileSettings.businessProfile")}</title>
      </Head>
      <PrimaryTabsComponent
        tabs={tabs}
        selectedTabIndex={tabIndex}
        onSelectTab={handleTabChange}
      />
    </div>
  );
};

export { SettingsCompanyProfileWidget };
