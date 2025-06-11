import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { GeneralSettingsComponent } from "./general-settings/general-settings";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import Head from "next/head";
const SettingsPreferencesWidget = () => {
  const { t } = useTranslation();

  const tabs: ITab[] = [
    {
      title: t("preferences.generalSettings"),
      component: <GeneralSettingsComponent />,
    },
  ];

  return (
    <PermissionCheck userPermission={Permissions.SHOW_PREFERENCES}>
      <Head>
        <title>{t("settings.preferences")}</title>
      </Head>
      <PrimaryTabsComponent tabs={tabs} />
    </PermissionCheck>
  );
};

export { SettingsPreferencesWidget };
