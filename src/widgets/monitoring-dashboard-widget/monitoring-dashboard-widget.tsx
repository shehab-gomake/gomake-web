import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PieChartComponent } from "@/components/charts/pie-chart";
import SalesLineChart from "./charts/sales-line-chart";
import { GoMakeDatepicker } from "@/components/datepicker";
import { startOfMonth, endOfToday } from "date-fns";
import { PrimaryTable } from "@/components/tables/primary-table";

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

      <div style={classes.subContainer}>
        {salesItems?.length > 0 && (
          <Stack>
            <Stack
              direction={"column"}
              width={"100%"}
              justifyContent={"space-between"}
            >
              <GoMakeDatepicker />
              <SalesLineChart
                salesItems={salesItems}
                yKeys={["totalCost", "totalPrice", "avgTotalPrice"]}
              />
            </Stack>
          </Stack>
        )}
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

      <div style={classes.subContainer}>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={productsRow}
          headers={productTableHeaders}
          variant={"OddEvenTable"}
        />
      </div>

      <div style={classes.subContainer}>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={clientsRow}
          headers={clientTableHeaders}
          variant={"OddEvenTable"}
        />
      </div>

      <div style={classes.subContainer}>
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
