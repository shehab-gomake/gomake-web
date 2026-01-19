import { useEffect } from "react";
import { useGomakeAxios, useGomakeRouter } from "@/hooks";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { stripePaymentSuccess } from "@/services/api-service/print-houses/connect-to-stripe-api";
import {
  Card,
  Typography,
  Button,
  Box,
  Zoom,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export default function StripePaymentSuccessWidget() {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  // const searchParams = useSearchParams();
  const router = useRouter();
  const { primaryColor } = useGomakeTheme();
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
          <CheckCircleIcon sx={{ fontSize: 50, color: primaryColor(500) }} />
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
