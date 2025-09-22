import React from "react";
import { useTranslation } from "react-i18next";
import { StripePricingTable } from "@/components";
import { useStyle } from "@/widgets/settings-subscription-widget/style";
import Head from "next/head";

const SettingsSubscriptionWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <>
      <Head>
        <title>{t("settings.subscriptions")}</title>
      </Head>
      <div style={classes.container}>
        <div style={classes.header}>
          <h1 style={classes.title}>{t("settings.manageSubscriptions")}</h1>
          <p style={classes.subtitle}>
            {t("settings.subscriptionDescription")}
          </p>
        </div>

        <div style={classes.pricingContainer}>
          <StripePricingTable
            pricingTableId="prctbl_1RQwSqP05M77HWgukWNMDKWZ"
            publishableKey="pk_test_51RFtGyP05M77HWgu5OIZ9lwCyQypUn0aIjzgIMSMnNprMc7utXNQ7n55rnxoTEBirdJHbp72icj1VddYQeNz60Js00zgVNmZl3"
            className="custom-scrollbar"
            style={classes.pricingTable}
          />
        </div>
      </div>
    </>
  );
};

export { SettingsSubscriptionWidget };
