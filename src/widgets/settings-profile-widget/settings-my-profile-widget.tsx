import { useTranslation } from "react-i18next";
import { UserProfile } from "@/widgets/settings-profile-widget/components/profiles/user-profile";
import { HeaderTitle } from "../header-title";
import { useStyle } from "./style";
import { useCompanyProfile } from "@/hooks/use-company-profile";
import { useEffect } from "react";
import Head from "next/head";

const SettingsMyProfileWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { getCurrenciesApi, getProfile } = useCompanyProfile();

  useEffect(() => {
    getCurrenciesApi().then(() => {
      getProfile();
    });
  }, []);

  return (
    <div style={classes.mainContainer}>
      <Head>
        <title>{t("profileSettings.profileTab")}</title>
      </Head>
      <HeaderTitle marginTop={"0px"} title={t("profileSettings.profileTab")} />
      <UserProfile />
    </div>
  );
};

export { SettingsMyProfileWidget };
