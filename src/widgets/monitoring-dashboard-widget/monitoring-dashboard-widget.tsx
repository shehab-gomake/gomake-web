import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { IDashboardWidget } from "./interfaces";
import { DashboardDates } from "./dates";
import { PieChartComponent } from "@/components/charts/pie-chart";

const MonitoringDashboardWidget = ({}: IDashboardWidget) => {
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
      <DashboardDates />
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
      {/* <Stack style={{ height: "100%" }}>
        {true ? (
          <GaussianChart />
        ) : (
          // <DashboardChart />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={400}
            style={{ borderRadius: 16 }}
          />
        )}
      </Stack> */}
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
            chartTitle={t("dashboard-widget.agents")}
          />
        )}
      </div>
    </div>
  );
};
export { MonitoringDashboardWidget };
