import { useTranslation } from "react-i18next";
import { ITab } from "@/components/tabs/interface";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { GeneralSettingsComponent } from "./general-settings/general-settings";

//!here
const SettingsPreferencesWidget = () => {
  const { t } = useTranslation();

  const tabs: ITab[] = [
    {
      title: t("preferences.generalSettings"),
      component: <GeneralSettingsComponent />,
    },
  ];

  return <PrimaryTabsComponent tabs={tabs} />;
};

export { SettingsPreferencesWidget };
