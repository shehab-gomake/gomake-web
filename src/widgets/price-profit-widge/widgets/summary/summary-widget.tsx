import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

interface SummaryData {
  diffAfterOptimization: number;
  diffBeforeOptimization: number;
  overAllImprovement: number;
  overAllImprovementPercentage: number;
}

interface SummaryWidgetProps {
  summaryData: SummaryData | null;
  isFixed: boolean;
}

const SummaryWidget = ({ summaryData, isFixed }: SummaryWidgetProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  if (!isFixed || !summaryData) {
    return null;
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
                  {formatNumber(summaryData.diffBeforeOptimization)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.diffAfterOptimization")}
                </Typography>
                <Typography variant="h6" style={classes.metricValue}>
                  {formatNumber(summaryData.diffAfterOptimization)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.overAllImprovement")}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    ...classes.metricValue,
                    color:
                      summaryData.overAllImprovement >= 0
                        ? "#4caf50"
                        : "#f44336",
                  }}
                >
                  {formatNumber(summaryData.overAllImprovement)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box style={classes.metricContainer}>
                <Typography variant="body2" style={classes.metricLabel}>
                  {t("priceProfit.improvementPercentage")}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    ...classes.metricValue,
                    color:
                      summaryData.overAllImprovementPercentage >= 0
                        ? "#4caf50"
                        : "#f44336",
                  }}
                >
                  {formatPercentage(summaryData.overAllImprovementPercentage)}
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
