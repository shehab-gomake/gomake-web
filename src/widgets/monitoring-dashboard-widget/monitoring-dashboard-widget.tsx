import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DashboardFilters } from "./filters";
import { ChartsWidget } from "./charts/charts-widget";

const MonitoringDashboardWidget = () => {
  const { classes } = useStyle();
  const {
    t,
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
            {new Array(4).fill(null).map((_) => (
              <Skeleton
                variant="rectangular"
                width={"24%"}
                height={80}
                style={{ borderRadius: 16 }}
              />
            ))}
          </Stack>
        </Stack>
      )}
      {/* !here */}
      <ChartsWidget
        salesItems={salesItems}
        productTypeChartData={productTypeChartData}
        agentChartData={agentChartData}
        getSalesChartRoute={getSalesChartRoute}
        filters={filters}
      />
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
