import { useTranslation } from "react-i18next";
import Head from "next/head";
import { ApiTokensList } from "./components/api-tokens-list";
import { useStyle } from "./style";

const SettingsApiTokensWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <>
      <Head>
        <title>{t("settings.apiTokens")}</title>
      </Head>
      <div style={classes.mainContainer}>
        <h2 style={classes.pageTitle}>{t("settings.apiTokens")}</h2>
        <ApiTokensList />
      </div>
    </>
  );
};

export { SettingsApiTokensWidget };
