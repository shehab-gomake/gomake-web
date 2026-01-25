import { useState } from "react";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import { ApiTokensList } from "./components/api-tokens-list";
import { useStyle } from "./style";
import { HeaderTitle } from "../header-title/header-title";
import { AddButton } from "@/components/button/add-button";

const SettingsApiTokensWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  return (
    <>
      <Head>
        <title>{t("settings.apiTokens")}</title>
      </Head>
      <div style={classes.mainContainer}>
        <div style={classes.headerRow}>
          <HeaderTitle marginTop={"0px"} marginBottom={"0px"} title={t("settings.apiTokens")} />
          <AddButton
            label={t("apiTokens.createToken")}
            onClick={() => setOpenCreateModal(true)}
          />
        </div>
        <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
          <ApiTokensList 
            openCreateModal={openCreateModal}
            onCloseCreateModal={() => setOpenCreateModal(false)}
          />
        </div>
      </div>
    </> 
  );
};

export { SettingsApiTokensWidget };
