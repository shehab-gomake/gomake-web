import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PieChartComponent } from "@/components/charts/pie-chart";
import DashboardChart from "./charts/dashboard-chart";

const MonitoringDashboardWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    statistics,
    getSalesChartRoute,
    getPieProductTypeChart,
    productTypeChartData,
    getProductPerformanceChart,
    getAgentPerformanceChart,
    getPieAgentChart,
    agentChartData,
  } = useMonitoringDashboard();

  useEffect(() => {
    getSalesChartRoute();
    getPieProductTypeChart();
    getPieAgentChart();
    // getProductPerformanceChart();
    // getAgentPerformanceChart();
  }, []);

  return (
    <div style={classes.container}>
      {statistics ? (
        <Cards data={statistics} />
      ) : (
        <Stack style={{ ...classes.SkeletonCardsContainer }} gap={"15px"}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {new Array(3).fill(null).map((_) => (
              <Skeleton
                variant="rectangular"
                width={"33%"}
                height={80}
                style={{ borderRadius: 16 }}
              />
            ))}
          </Stack>
        </Stack>
      )}
      <div style={classes.subContainer}>
        {/* <DashboardChart /> */}
        <DashboardChart
          salesItems={[
            {
              date: "2025-04-01",
              totalCost: 3700.46,
              totalPrice: 17723.04,
              avgTotalPrice: 17683.04,
            },
            {
              date: "2025-04-02",
              totalCost: 1026.93,
              totalPrice: 2637.32,
              avgTotalPrice: 2637.32,
            },
            {
              date: "2025-04-03",
              totalCost: 356.36,
              totalPrice: 13000.88,
              avgTotalPrice: 13000.88,
            },
            {
              date: "2025-04-04",
              totalCost: 130.45,
              totalPrice: 1886.13,
              avgTotalPrice: 1886.13,
            },
          ]}
          yKeys={["totalCost", "totalPrice", "avgTotalPrice"]}
        />
      </div>
      <div style={classes.piesContainer}>
        {productTypeChartData?.length > 0 && (
          <PieChartComponent
            chartData={productTypeChartData}
            chartTitle={t("products.profits.exceptions.productType")}
          />
        )}
        {agentChartData?.length > 0 && (
          <PieChartComponent
            chartData={agentChartData}
            chartTitle={t("dashboard.agents")}
          />
        )}
      </div>
    </div>
  );
};
export { MonitoringDashboardWidget };
