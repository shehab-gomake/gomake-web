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
  totalPoints: number;
  totalAbnormalPoints: number;
  totalCalculatedPrice: number;
  totalUserInputPrice: number;
  totalFixedPrice: number;
}

interface SummaryWidgetProps {
  summaryData: SummaryData | null;
}

// Utilities outside component (avoids re-creation on each render)
const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatNumber = (value: number) => numberFormatter.format(value);
const formatPercentage = (value: number) => `${formatNumber(value)}%`;

const SummaryWidget = ({ summaryData }: SummaryWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const currenciesUnits = useRecoilValue<any[]>(currencyUnitState);

  // Don't show summary if no data or if totalFixedPrice is zero/null
  if (
    !summaryData ||
    summaryData.totalFixedPrice === 0 ||
    summaryData.totalFixedPrice === null
  )
    return null;

  const getCurrencyUnitText = (currency: string) =>
    currenciesUnits.find((c) => c.value === currency)?.text || "";

  const formatNumberWithCurrency = (value: number) => {
    const currencyText = getCurrencyUnitText(systemCurrency);
    return currencyText
      ? `${formatNumber(value)} ${currencyText}`
      : formatNumber(value);
  };

  const metrics = [
    {
      key: "totalUserInputPrice",
      label: t("priceProfit.totalUserInputPrice"),
      value: formatNumberWithCurrency(summaryData.totalUserInputPrice),
    },
    {
      key: "totalCalculatedPrice",
      label: t("priceProfit.totalCalculatedPrice"),
      value: formatNumberWithCurrency(summaryData.totalCalculatedPrice),
    },
    {
      key: "totalFixedPrice",
      label: t("priceProfit.totalFixedPrice"),
      value: formatNumberWithCurrency(summaryData.totalFixedPrice),
    },
    {
      key: "diffBeforeOptimization",
      label: t("priceProfit.diffBeforeOptimization"),
      value: formatNumberWithCurrency(summaryData.diffBeforeOptimization),
    },
    {
      key: "diffAfterOptimization",
      label: t("priceProfit.diffAfterOptimization"),
      value: formatNumberWithCurrency(summaryData.diffAfterOptimization),
    },
    {
      key: "accuracyBeforeOptimization",
      label: t("priceProfit.accuracyBeforeOptimization"),
      value: formatPercentage(summaryData.accuracyBeforeOptimization),
      color:
        summaryData.accuracyAfterOptimization <
        summaryData.accuracyBeforeOptimization
          ? "#4caf50"
          : "#f44336",
    },
    {
      key: "accuracyAfterOptimization",
      label: t("priceProfit.accuracyAfterOptimization"),
      value: formatPercentage(summaryData.accuracyAfterOptimization),
      color:
        summaryData.accuracyAfterOptimization >
        summaryData.accuracyBeforeOptimization
          ? "#4caf50"
          : "#f44336",
    },
  ];

  return (
    <Box style={classes.container}>
      <Card style={classes.card}>
        <CardContent style={classes.cardContent}>
          <Grid container spacing={1} alignItems="stretch">
            {metrics.map(({ key, label, value, color }) => (
              <Grid
                item
                xs={12 / 7}
                md={12 / 7}
                key={key}
                style={{ display: "flex" }}
              >
                <Box style={{ ...classes.metricContainer, flex: 1 }}>
                  <Typography variant="body2" style={classes.metricLabel}>
                    {label}
                  </Typography>
                  <Typography
                    variant="h6"
                    style={{
                      ...classes.metricValue,
                      ...(color ? { color } : {}),
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export { SummaryWidget };
