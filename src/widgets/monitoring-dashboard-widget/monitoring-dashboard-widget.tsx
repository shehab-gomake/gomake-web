import { useEffect, useMemo } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PieChartComponent } from "@/components/charts/pie-chart";
import SalesLineChart from "./charts/sales-line-chart";
import { startOfMonth, endOfToday } from "date-fns";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DashboardFilters } from "./filters";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { agentsState } from "@/store/agents-state";
import { useRecoilValue } from "recoil";

const MonitoringDashboardWidget = () => {
  const { classes } = useStyle();
  const defaultStart = useMemo(() => startOfMonth(new Date()), []);
  const defaultEnd = useMemo(() => endOfToday(), []);

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
    filters,
    currUnit,
  } = useMonitoringDashboard();

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        getSalesChartRoute(filters),
        getPieProductTypeChart(filters),
        getPieAgentChart(filters),
        getProductPerformanceChart(filters),
        getAgentPerformanceChart(filters),
        getClientPerformanceChart(filters),
      ]);
    };

    fetchAllData();
  }, [filters]);

  const renderTableSection = (title: string, rows: any[], headers: any[]) => (
    <div style={classes.subContainer}>
      <h3 style={classes.labelStyle}>{t(title)}</h3>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={rows}
        headers={headers}
        variant="RoundTable"
      />
    </div>
  );

  return (
    <div style={classes.container}>
      <div style={classes.subContainer}>
        <DashboardFilters />
      </div>
      {statistics ? (
        <Cards data={statistics} currUnit={currUnit} />
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
              yKeys={["totalPrice", "totalCost"]}
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

      {renderTableSection(
        "dashboard.productPerformanceTitle",
        productsRow,
        productTableHeaders
      )}
      {renderTableSection(
        "dashboard.clientPerformanceTitle",
        clientsRow,
        clientTableHeaders
      )}
      {renderTableSection(
        "dashboard.agentPerformanceTitle",
        agentsRow,
        agentTableHeaders
      )}
    </div>
  );
};
export { MonitoringDashboardWidget };
