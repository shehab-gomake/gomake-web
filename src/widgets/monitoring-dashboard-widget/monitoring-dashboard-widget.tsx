import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PieChartComponent } from "@/components/charts/pie-chart";
import SalesLineChart from "./charts/sales-line-chart";
import { startOfMonth, endOfToday } from "date-fns";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DashboardDates } from "./dates";
import { BarChartComponent } from "@/components/charts/bar-chart";

const MonitoringDashboardWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    dates,
    salesItems,
    statistics,
    agentChartData,
    productTypeChartData,
    getSalesChartRoute,
    getPieAgentChart,
    getPieProductTypeChart,
    getProductPerformanceChart,
    getAgentPerformanceChart,
    getClientPerformanceChart,
    productsRow,
    productTableHeaders,
    clientsRow,
    clientTableHeaders,
    agentsRow,
    agentTableHeaders,
  } = useMonitoringDashboard();

  useEffect(() => {
    getPieProductTypeChart();
    getPieAgentChart();
    getProductPerformanceChart();
    getAgentPerformanceChart();
    getClientPerformanceChart();
  }, []);

  useEffect(() => {
    if (dates?.startDate && dates?.endDate) {
      getSalesChartRoute(dates?.startDate, dates.endDate);
    } else {
      const defaultStart = startOfMonth(new Date());
      const defaultEnd = endOfToday();
      getSalesChartRoute(defaultStart, defaultEnd);
    }
  }, [dates?.startDate?.toISOString(), dates?.endDate?.toISOString()]);

  return (
    <div style={classes.container}>
      <div style={classes.subContainer}>
        <DashboardDates />
      </div>
      {statistics ? (
        <Cards data={statistics} />
      ) : (
        <Stack style={classes.SkeletonCardsContainer} gap={"15px"}>
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

      <div style={classes.secSubContainer}>
        {salesItems?.length > 0 ? (
          <Stack
            direction="column"
            spacing={2}
            sx={{ flex: 2, minWidth: "300px", maxWidth: "65vw" }}
          >
            <h3 style={classes.labelStyle}>{t("dashboard.salesChartTitle")}</h3>
            <SalesLineChart
              salesItems={salesItems}
              yKeys={["totalPrice", "totalCost", "avgTotalPrice"]}
            />
          </Stack>
        ) : (
          <Skeleton width={"66%"} height={"100%"} variant="rectangular" />
        )}

        <div style={classes.piesContainer}>
          {productTypeChartData?.length > 0 ? (
            <BarChartComponent
              chartData={productTypeChartData}
              chartTitle={t("products.profits.exceptions.productType")}
            />
          ) : (
            <Skeleton
              variant="circular"
              width={200}
              height={200}
              style={{ marginBottom: 16 }}
            />
          )}

          {agentChartData?.length > 0 ? (
            <PieChartComponent
              chartData={agentChartData}
              chartTitle={t("dashboard.agents")}
            />
          ) : (
            <Skeleton variant="circular" width={200} height={200} />
          )}
        </div>
      </div>

      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>
          {t("dashboard.productPerformanceTitle")}
        </h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={productsRow}
          headers={productTableHeaders}
          // variant={"OddEvenTable"}
          variant={"RoundTable"}
        />
      </div>

      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>
          {t("dashboard.clientPerformanceTitle")}
        </h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={clientsRow}
          headers={clientTableHeaders}
          // variant={"OddEvenTable"}
          variant={"RoundTable"}
        />
      </div>

      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>
          {t("dashboard.agentPerformanceTitle")}
        </h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={agentsRow}
          headers={agentTableHeaders}
          variant={"RoundTable"}
        />
      </div>
    </div>
  );
};
export { MonitoringDashboardWidget };
