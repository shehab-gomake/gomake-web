import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store/user";
import { currencyUnitState } from "@/store/currency-units";
import { useStyle } from "./style";

interface SummaryData {
  diffAfterOptimization: number;
  diffBeforeOptimization: number;
  accuracyBeforeOptimization: number;
  accuracyAfterOptimization: number;
}

interface SummaryWidgetProps {
  summaryData: SummaryData | null;
  isFixed: boolean;
}

//!here fix
const SummaryWidget = ({ summaryData, isFixed }: SummaryWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const currenciesUnits = useRecoilValue<any>(currencyUnitState);

  if (!isFixed || !summaryData) {
    return null;
  }

  const getCurrencyUnitText = (currency) => {
    const foundCurrency = currenciesUnits.find((c) => c.value === currency);
    if (foundCurrency) {
      return foundCurrency.text;
    } else {
      return "";
    }
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumberWithCurrency = (value: number) => {
    const formattedNumber = formatNumber(value);
    const currencyText = getCurrencyUnitText(systemCurrency);
    return currencyText
      ? `${formattedNumber} ${currencyText}`
      : formattedNumber;
  };

  const formatPercentage = (value: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value) + "%"
    );
  };

  return (
    <Box style={classes.container}>
      <Card style={classes.card}>
        <CardContent style={classes.cardContent}>
          {/* <Typography variant="h6" style={classes.title}>
            {t("priceProfit.optimizationSummary")}
          </Typography> */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.diffBeforeOptimization")}
                </Typography>
                <Typography variant="h6" style={classes.metricValue}>
                  {formatNumberWithCurrency(summaryData.diffBeforeOptimization)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.diffAfterOptimization")}
                </Typography>
                <Typography variant="h6" style={classes.metricValue}>
                  {formatNumberWithCurrency(summaryData.diffAfterOptimization)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.accuracyBeforeOptimization")}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    ...classes.metricValue,
                    color:
                      summaryData.accuracyBeforeOptimization >= 0
                        ? "#4caf50"
                        : "#f44336",
                  }}
                >
                  {formatPercentage(summaryData.accuracyBeforeOptimization)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.accuracyAfterOptimization")}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    ...classes.metricValue,
                    color:
                      summaryData.accuracyAfterOptimization >= 0
                        ? "#4caf50"
                        : "#f44336",
                  }}
                >
                  {formatPercentage(summaryData.accuracyAfterOptimization)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export { SummaryWidget };
