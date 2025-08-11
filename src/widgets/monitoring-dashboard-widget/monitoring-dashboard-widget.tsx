import { useEffect } from "react";
import { Box, Button, Skeleton } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStyle } from "./style";
import { Cards } from "./cards/cards";
import { useMonitoringDashboard } from "./use-monitoring-dashboard";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DashboardFilters } from "./filters";
import { ChartsWidget } from "@/widgets/monitoring-dashboard-widget/dashboard-charts/charts-widget";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { exportDashboardToExcel } from "./utils/export-to-excel";

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
    visibleAgentRows,
    setVisibleAgentRows,
    visibleProductRows,
    setVisibleProductRows,
    visibleClientRows,
    setVisibleClientRows,
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

  const handleExportToExcel = () => {
    const exportData = {
      agentsData: agentsRow || [],
      productsData: productsRow || [],
      clientsData: clientsRow || [],
      agentHeaders: agentTableHeaders || [],
      productHeaders: productTableHeaders || [],
      clientHeaders: clientTableHeaders || [],
      statistics,
      salesItems: salesItems || [],
    };

    exportDashboardToExcel(exportData, "monitoring-dashboard");
  };

  const renderTableSection = (
    title: string,
    rows: any[],
    headers: any[],
    visibleCount: number,
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const hasMore = rows.length > visibleCount;

    const handleToggle = () => {
      if (hasMore) {
        setVisibleCount((prev) => prev + 10);
      } else {
        setVisibleCount(10);
      }
    };

    return (
      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>{t(title)}</h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={rows.slice(0, visibleCount)}
          headers={headers}
          variant="RoundTable"
        />
        {rows.length > 10 && (
          <Button
            onClick={handleToggle}
            style={classes.showMoreButton}
            endIcon={
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  transition: "transform 0.3s ease",
                  transform: hasMore ? "rotate(0deg)" : "rotate(180deg)",
                }}
              >
                <SouthRoundedIcon fontSize="small" />
              </Box>
            }
          >
            {t(hasMore ? "sales.quote.showMore" : "sales.quote.showLess")}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div style={classes.container}>
      <div style={classes.subContainer}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <DashboardFilters />
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportToExcel}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
              minWidth: "180px",
              height: "40px",
            }}
          >
            {t("dashboard.exportToExcel")}
          </Button>
        </Box>
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
      <ChartsWidget
        salesItems={salesItems}
        productTypeChartData={productTypeChartData}
        agentChartData={agentChartData}
        getSalesChartRoute={getSalesChartRoute}
        filters={filters}
      />
      {renderTableSection(
        "dashboard.agentPerformanceTitle",
        agentsRow,
        agentTableHeaders,
        visibleAgentRows,
        setVisibleAgentRows
      )}
      {renderTableSection(
        "dashboard.productPerformanceTitle",
        productsRow,
        productTableHeaders,
        visibleProductRows,
        setVisibleProductRows
      )}
      {renderTableSection(
        "dashboard.clientPerformanceTitle",
        clientsRow,
        clientTableHeaders,
        visibleClientRows,
        setVisibleClientRows
      )}
    </div>
  );
};
export { MonitoringDashboardWidget };
