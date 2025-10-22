import React, { useEffect } from "react";
import Head from "next/head";
import { StripePricingTable } from "@/components";
import { Box, Container, Typography, Stack } from "@mui/material";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";
import { useStyle } from "./style";
import { updateTokenStorage } from "@/services/storage-data";
import { useRouter } from "next/router";

const GoMakeAIBillingPage = () => {
  const { classes } = useStyle();
  const printHouseProfileState = useRecoilValue(printHouseProfile);
  const router = useRouter();

  // Extract and update token from URL on component mount

  useEffect(() => {
    if (router.isReady) {
      const { token } = router.query;

      if (token && typeof token === "string") {
        // Update token in storage
        updateTokenStorage(token);

        // Clean up URL by removing token parameter
        const newQuery = { ...router.query };
        delete newQuery.token;

        router.replace(
          {
            pathname: router.pathname,
            query: newQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <Head>
        <title>GoMake AI - Billing & Subscription</title>
        <meta
          name="description"
          content="Upgrade your GoMake AI subscription"
        />
      </Head>

      <Box style={classes.pageContainer}>
        <Container maxWidth="lg">
          <Stack spacing={4} alignItems="center">
            {/* Header Section */}
            <Box style={classes.headerSection}>
              <Typography variant="h3" style={classes.title}>
                Upgrade Your GoMake AI
              </Typography>
              <Typography variant="subtitle1" style={classes.subtitle}>
                Choose the perfect plan for your business needs
              </Typography>
            </Box>

            {/* Features Section */}
            <Box style={classes.featuresGrid}>
              <Box style={classes.featureCard}>
                <Box style={classes.featureIcon}>🚀</Box>
                <Typography variant="h6" style={classes.featureTitle}>
                  Unlimited AI Conversations
                </Typography>
                <Typography variant="body2" style={classes.featureDescription}>
                  Never run out of AI interactions
                </Typography>
              </Box>

              <Box style={classes.featureCard}>
                <Box style={classes.featureIcon}>⚡</Box>
                <Typography variant="h6" style={classes.featureTitle}>
                  Priority Processing
                </Typography>
                <Typography variant="body2" style={classes.featureDescription}>
                  Get faster response times
                </Typography>
              </Box>

              <Box style={classes.featureCard}>
                <Box style={classes.featureIcon}>🎯</Box>
                <Typography variant="h6" style={classes.featureTitle}>
                  Advanced Features
                </Typography>
                <Typography variant="body2" style={classes.featureDescription}>
                  Access to premium capabilities
                </Typography>
              </Box>

              <Box style={classes.featureCard}>
                <Box style={classes.featureIcon}>💎</Box>
                <Typography variant="h6" style={classes.featureTitle}>
                  Premium Support
                </Typography>
                <Typography variant="body2" style={classes.featureDescription}>
                  Get help when you need it
                </Typography>
              </Box>
            </Box>

            {/* Pricing Table Section */}
            <Box style={classes.pricingSection}>
              <StripePricingTable
                pricingTableId="prctbl_1SK1G4P444riBeBr1aSlLKNn"
                publishableKey="pk_live_51RFtGmP444riBeBr18hRSoV5hPgPKmshvZYSHyfA3BiJTnWYR13qBa142UCJdlOMnwAyfAO1LhqO8tbW7nECanx4008dAKXic0"
                clientReferenceId={printHouseProfileState?.stripeCustomerId}
                className="custom-scrollbar"
                style={classes.pricingTable}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export { GoMakeAIBillingPage };
