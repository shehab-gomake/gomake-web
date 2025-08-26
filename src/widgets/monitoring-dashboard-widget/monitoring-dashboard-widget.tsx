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
import { exportDashboardToExcel } from "./utils/export-to-excel";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { ReportActionsMenu } from "@/pages-components/transaction-journal-report/widgets/button-widget/report-actions-menu/report-actions-menu";

const MonitoringDashboardWidget = () => {
  const { classes } = useStyle();
  const parseCurrency = (val: any): number => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const parsePercent = (val: any): number => {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const growthValue = (cell: any): number => {
    if (cell == null) return -Infinity;
    if (typeof cell === "string") return cell === "-" ? -Infinity : parsePercent(cell);
    try {
      const value = cell?.props?.value;
      return typeof value === "number" ? value : -Infinity;
    } catch (e) {
      return -Infinity;
    }
  };
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
    primaryColor,
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

  // Reset visible rows when filters change for a cleaner view
  useEffect(() => {
    setVisibleAgentRows(10);
    setVisibleProductRows(10);
    setVisibleClientRows(10);
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

    // Ensure default order is by Final Price (column index 3) descending
    const sortedAllRows = [...rows].sort(
      (a, b) => parseCurrency(b[3]) - parseCurrency(a[3])
    );

    return (
      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>{t(title)}</h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={sortedAllRows.slice(0, visibleCount)}
          headers={headers}
          withSort
          defaultSortIndex={3}
          defaultSortDirection={"desc"}
          customSortFns={{
            // 0: name (default string compare)
            1: (a, b) => Number(a[1] ?? 0) - Number(b[1] ?? 0), // jobs
            2: (a, b) => Number(a[2] ?? 0) - Number(b[2] ?? 0), // quantity
            3: (a, b) => parseCurrency(a[3]) - parseCurrency(b[3]), // finalPrice
            4: (a, b) => parseCurrency(a[4]) - parseCurrency(b[4]), // calculatedPrice
            5: (a, b) => parseCurrency(a[5]) - parseCurrency(b[5]), // cost
            6: (a, b) => parseCurrency(a[6]) - parseCurrency(b[6]), // profit
            7: (a, b) => parseCurrency(a[7]) - parseCurrency(b[7]), // avgProfit
            8: (a, b) => parsePercent(a[8]) - parsePercent(b[8]), // profitMargin
            9: (a, b) => Number(a[9] ?? 0) - Number(b[9] ?? 0), // avgPerOrder
            10: (a, b) => parsePercent(a[10]) - parsePercent(b[10]), // os
            11: (a, b) => parsePercent(a[11]) - parsePercent(b[11]), // successRate
            12: (a, b) => growthValue(a[12]) - growthValue(b[12]), // growth badge
          }}
          columnWidths={["10%", "5%", "7%", "8%", "10%", "7%", "7%", "8%", "8%", "8%", "5%", "10%", "10%"]}
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

  const menuActions = [
    {
      name: t("dashboard.exportToExcel"),
      onclick: handleExportToExcel,
      icon: <FileDownloadOutlinedIcon style={{ color: primaryColor(300) }} />,
    },
  ];

  return (
    <div style={classes.container}>
      <div style={classes.subContainer}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <DashboardFilters />
          <ReportActionsMenu
            actions={menuActions.map((action) => ({
              name: action.name,
              icon: action.icon,
              onClick: action.onclick,
            }))}
          />
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
