import { useCallback, useEffect } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";

import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { stripePaymentSuccess } from "@/services/api-service/print-houses/connect-to-stripe-api";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Zoom,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HomeIcon from "@mui/icons-material/Home";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

export default function StripePaymentSuccessWidget() {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { classes } = useStyle();
  const { t } = useTranslation();
  const connectToStipe = async () => {
    if (!router.isReady) return;
    const recordId = router?.query?.recordId;
    const callBack = (res) => {
      if (res?.success) {
        debugger;
        const response = res?.data;
        if (response) {
          navigate(`/orders?finalPatternSearch=${response.number}`);
        }
      }
    };
    await stripePaymentSuccess(callApi, callBack, recordId);
  };

  useEffect(() => {
    connectToStipe().then();
  }, [router]);

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <Box sx={classes.mainBox}>
      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
        <Card sx={classes.cardStyle}>
          {/* <CelebrationIcon
            sx={{
              fontSize: 90,
              color: "#ed028c",
              animation: "bounce 2s infinite",
            }}
          /> */}
          <CheckCircleIcon sx={{ fontSize: 50, color: "#2e3092ab" }} />

          <Typography variant="h4" sx={classes.title}>
            {t("modal.paymentSuccessful")}
          </Typography>
          <Typography variant="body1" sx={classes.subTitle}>
            {t("modal.processedSuccessfully")}
          </Typography>
          <Box sx={classes.boxIcon}>
            <Button
              variant="outlined"
              sx={classes.homeBtn}
              onClick={handleGoHome}
              startIcon={<HomeIcon />}
            >
              {t("tabs.home")}
            </Button>
          </Box>
        </Card>
      </Zoom>
    </Box>
  );
}
