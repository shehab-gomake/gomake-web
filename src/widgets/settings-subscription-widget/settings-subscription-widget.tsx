import React from "react";
import { useTranslation } from "react-i18next";
import { StripePricingTable } from "@/components";
import { useStyle } from "@/widgets/settings-subscription-widget/style";
import Head from "next/head";
import { userProfileState } from "@/store/user-profile";
import { useRecoilValue } from "recoil";

const SettingsSubscriptionWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const userProfile = useRecoilValue(userProfileState);

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
            pricingTableId="prctbl_1SA9FgP444riBeBrGcuI4KD7"
            publishableKey="pk_live_51RFtGmP444riBeBr18hRSoV5hPgPKmshvZYSHyfA3BiJTnWYR13qBa142UCJdlOMnwAyfAO1LhqO8tbW7nECanx4008dAKXic0"
            clientReferenceId={userProfile?.stripeCustomerId}
            className="custom-scrollbar"
            style={classes.pricingTable}
          />
        </div>
      </div>
    </>
  );
};

export { SettingsSubscriptionWidget };
