import { useEffect, useState } from "react";
import { Box, Button, Skeleton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
import { RoundTableCell, RoundTableRow } from "@/components/tables/primary-table";
import { INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID } from "@/enums/document-type-enum";

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
    if (typeof cell === "string")
      return cell === "-" ? -Infinity : parsePercent(cell);
    try {
      const value = cell?.props?.value;
      return typeof value === "number" ? value : -Infinity;
    } catch (e) {
      return -Infinity;
    }
  };

  const formatGrowthExport = (cell: any): string => {
    const value = growthValue(cell);
    if (!Number.isFinite(value)) return "-";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const normalizeRowsForExport = (rows: any[]) =>
    rows.map((row) =>
      row.map((cell, index) =>
        index === row.length - 1 ? formatGrowthExport(cell) : cell
      )
    );
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
    getDailyDocumentsSummary,
    dailyDocumentsSummary,
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

  // Controlled sort state per table (default: Final Price desc at column index 3)
  const [agentSort, setAgentSort] = useState<{
    key: number;
    direction: "asc" | "desc";
  }>({ key: 3, direction: "desc" });
  const [productSort, setProductSort] = useState<{
    key: number;
    direction: "asc" | "desc";
  }>({ key: 3, direction: "desc" });
  const [clientSort, setClientSort] = useState<{
    key: number;
    direction: "asc" | "desc";
  }>({ key: 3, direction: "desc" });
  const [visibleDailyDocumentsRows, setVisibleDailyDocumentsRows] =
    useState<number>(10);

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        getSalesChartRoute(filters),
        getPieProductTypeChart(filters),
        getPieAgentChart(filters),
        getProductPerformanceChart(filters),
        getAgentPerformanceChart(filters),
        getClientPerformanceChart(filters),
        getDailyDocumentsSummary(filters),
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
    // Check if special filter is active
    const isSpecialFilter =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    // Prepare Daily Documents Summary data for export
    const dailyDocumentsRows =
      dailyDocumentsSummary && dailyDocumentsSummary.length > 0
        ? dailyDocumentsSummary.map((item) => {
          const date = new Date(item.date);
          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return [
            formattedDate,
            item.ordersUnits?.toLocaleString("en-US") || "0",
            item.ordersTotal != null
              ? `${currUnit} ${item.ordersTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
              : `${currUnit} 0.00`,
            item.deliveryNotesTotal != null
              ? `${currUnit} ${item.deliveryNotesTotal.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`
              : `${currUnit} 0.00`,
            item.invoiceTotal != null
              ? `${currUnit} ${item.invoiceTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
              : `${currUnit} 0.00`,
            item.total != null
              ? `${currUnit} ${item.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
              : `${currUnit} 0.00`,
          ];
        })
        : [];

    // Calculate totals for each column
    const totals =
      dailyDocumentsSummary && dailyDocumentsSummary.length > 0
        ? dailyDocumentsSummary.reduce(
          (acc, item) => {
            acc.ordersUnits += item.ordersUnits || 0;
            acc.ordersTotal += item.ordersTotal || 0;
            acc.deliveryNotesTotal += item.deliveryNotesTotal || 0;
            acc.invoiceTotal += item.invoiceTotal || 0;
            acc.total += item.total || 0;
            return acc;
          },
          {
            ordersUnits: 0,
            ordersTotal: 0,
            deliveryNotesTotal: 0,
            invoiceTotal: 0,
            total: 0,
          }
        )
        : null;

    // Add totals row to the data if totals exist
    const dailyDocumentsRowsWithTotals =
      dailyDocumentsRows.length > 0 && totals
        ? [
          ...dailyDocumentsRows,
          [
            isSpecialFilter ? t("dashboard.totalSales") : t("dashboard.totalSales"),
            totals.ordersUnits.toLocaleString("en-US"),
            `${currUnit} ${totals.ordersTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.deliveryNotesTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.invoiceTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          ],
        ]
        : dailyDocumentsRows;

    // Conditionally set headers based on filter
    const dailyDocumentsHeaders = isSpecialFilter
      ? [
        t("dashboard.date"),
        t("dashboard.openAndReadyOrder"),
        `${t("dashboard.ordersTotal")} (${currUnit})`,
        `${t("dashboard.openDeliveryNotes")} (${currUnit})`,
        `${t("dashboard.invoiceTotal")} (${currUnit})`,
        `${t("dashboard.totalSales")} (${currUnit})`,
      ]
      : [
        t("dashboard.date"),
        t("dashboard.ordersUnits"),
        `${t("dashboard.ordersTotal")} (${currUnit})`,
        `${t("dashboard.deliveryNotesTotal")} (${currUnit})`,
        `${t("dashboard.invoiceTotal")} (${currUnit})`,
        `${t("dashboard.totalSales")} (${currUnit})`,
      ];

    const productTypeHeaders = [
      t("products.profits.exceptions.productType"),
      `${t("dashboard.totalSales")} (${currUnit})`,
    ];

    const productTypeRows = (productTypeChartData || []).map((item) => [
      item?.label ?? "-",
      item?.value != null
        ? `${currUnit} ${Number(item.value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
        : "-",
    ]);

    const exportData = {
      agentsData: normalizeRowsForExport(agentsRow || []),
      productsData: normalizeRowsForExport(productsRow || []),
      clientsData: normalizeRowsForExport(clientsRow || []),
      productTypeData: productTypeRows,
      agentHeaders: agentTableHeaders || [],
      productHeaders: productTableHeaders || [],
      clientHeaders: clientTableHeaders || [],
      productTypeHeaders,
      statistics,
      salesItems: salesItems || [],
      dailyDocumentsSummary:
        dailyDocumentsRowsWithTotals.length > 0
          ? {
            data: dailyDocumentsRowsWithTotals,
            headers: dailyDocumentsHeaders,
          }
          : undefined,
    };

    exportDashboardToExcel(exportData, "monitoring-dashboard");
  };

  const renderTableSection = (
    title: string,
    rows: any[],
    headers: any[],
    visibleCount: number,
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>,
    sortConfig: { key: number; direction: "asc" | "desc" },
    onSortChange: (config: { key: number; direction: "asc" | "desc" }) => void
  ) => {
    const hasMore = rows.length > visibleCount;

    const handleToggle = () => {
      if (hasMore) {
        setVisibleCount((prev) => prev + 10);
      } else {
        setVisibleCount(10);
      }
    };

    // Sort all rows according to current sort config before slicing
    const sortFns: { [key: number]: (a: any, b: any) => number } = {
      1: (a, b) => Number(a[1] ?? 0) - Number(b[1] ?? 0),
      2: (a, b) => Number(a[2] ?? 0) - Number(b[2] ?? 0),
      3: (a, b) => parseCurrency(a[3]) - parseCurrency(b[3]),
      4: (a, b) => parseCurrency(a[4]) - parseCurrency(b[4]),
      5: (a, b) => parseCurrency(a[5]) - parseCurrency(b[5]),
      6: (a, b) => parseCurrency(a[6]) - parseCurrency(b[6]),
      7: (a, b) => parseCurrency(a[7]) - parseCurrency(b[7]),
      8: (a, b) => parsePercent(a[8]) - parsePercent(b[8]),
      9: (a, b) => Number(a[9] ?? 0) - Number(b[9] ?? 0),
      10: (a, b) => parsePercent(a[10]) - parsePercent(b[10]),
      11: (a, b) => parsePercent(a[11]) - parsePercent(b[11]),
      12: (a, b) => growthValue(a[12]) - growthValue(b[12]),
    };
    const fullSorted = (() => {
      if (!sortConfig) return rows;
      const fn = sortFns[sortConfig.key];
      const sorted = [...rows].sort((a, b) => {
        const result = fn
          ? fn(a, b)
          : a[sortConfig.key] < b[sortConfig.key]
            ? -1
            : a[sortConfig.key] > b[sortConfig.key]
              ? 1
              : 0;
        return sortConfig.direction === "asc" ? result : -result;
      });
      return sorted;
    })();

    return (
      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>{t(title)}</h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={fullSorted.slice(0, visibleCount)}
          headers={headers}
          withSort
          sortConfig={sortConfig}
          onSortChange={onSortChange}
          defaultSortIndex={sortConfig?.key ?? 3}
          defaultSortDirection={sortConfig?.direction ?? "desc"}
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
          columnWidths={[
            "10%",
            "5%",
            "7%",
            "8%",
            "10%",
            "7%",
            "7%",
            "8%",
            "8%",
            "8%",
            "5%",
            "10%",
            "10%",
          ]}
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
        setVisibleAgentRows,
        agentSort,
        setAgentSort
      )}
      {renderTableSection(
        "dashboard.productPerformanceTitle",
        productsRow,
        productTableHeaders,
        visibleProductRows,
        setVisibleProductRows,
        productSort,
        setProductSort
      )}
      {renderTableSection(
        "dashboard.clientPerformanceTitle",
        clientsRow,
        clientTableHeaders,
        visibleClientRows,
        setVisibleClientRows,
        clientSort,
        setClientSort
      )}
      {dailyDocumentsSummary &&
        dailyDocumentsSummary.length > 0 &&
        (() => {
          // Check if special filter is active
          const isSpecialFilter =
            filters?.selectedDocumentType ===
            INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

          const dailyDocumentsRows = dailyDocumentsSummary.map((item) => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return [
              formattedDate,
              item.ordersUnits?.toLocaleString("en-US") || "0",
              item.ordersTotal != null
                ? `${currUnit} ${item.ordersTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
                : `${currUnit} 0.00`,
              item.deliveryNotesTotal != null
                ? `${currUnit} ${item.deliveryNotesTotal.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
                : `${currUnit} 0.00`,
              item.invoiceTotal != null
                ? `${currUnit} ${item.invoiceTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
                : `${currUnit} 0.00`,
              item.total != null
                ? `${currUnit} ${item.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
                : `${currUnit} 0.00`,
            ];
          });

          // Calculate totals for each column
          const totals = dailyDocumentsSummary.reduce(
            (acc, item) => {
              acc.ordersUnits += item.ordersUnits || 0;
              acc.ordersTotal += item.ordersTotal || 0;
              acc.deliveryNotesTotal += item.deliveryNotesTotal || 0;
              acc.invoiceTotal += item.invoiceTotal || 0;
              acc.total += item.total || 0;
              return acc;
            },
            {
              ordersUnits: 0,
              ordersTotal: 0,
              deliveryNotesTotal: 0,
              invoiceTotal: 0,
              total: 0,
            }
          );

          // Conditionally set headers based on filter
          const headers = isSpecialFilter
            ? [
              t("dashboard.date"),
              t("dashboard.openAndReadyOrder"),
              `${t("dashboard.ordersTotal")} (${currUnit})`,
              `${t("dashboard.openDeliveryNotes")} (${currUnit})`,
              `${t("dashboard.invoiceTotal")} (${currUnit})`,
              `${t("dashboard.totalSales")} (${currUnit})`,
            ]
            : [
              t("dashboard.date"),
              t("dashboard.ordersUnits"),
              `${t("dashboard.ordersTotal")} (${currUnit})`,
              `${t("dashboard.deliveryNotesTotal")} (${currUnit})`,
              `${t("dashboard.invoiceTotal")} (${currUnit})`,
              `${t("dashboard.totalSales")} (${currUnit})`,
            ];

          const totalRow = [
            isSpecialFilter ? t("dashboard.totalSales") : t("dashboard.totalSales"),
            totals.ordersUnits.toLocaleString("en-US"),
            `${currUnit} ${totals.ordersTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.deliveryNotesTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.invoiceTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            `${currUnit} ${totals.total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
          ];

          const hasMore = dailyDocumentsRows.length > visibleDailyDocumentsRows;
          const handleToggle = () => {
            if (hasMore) {
              setVisibleDailyDocumentsRows((prev) => prev + 10);
            } else {
              setVisibleDailyDocumentsRows(10);
            }
          };

          return (
            <div style={classes.subContainer}>
              <h3 style={classes.labelStyle}>
                {t("dashboard.dailyDocumentsSummary")}
              </h3>
              <Paper
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "var(--theme-radius-lg, 12px)",
                  border:
                    "1px solid var(--theme-table-border-color, var(--theme-border-color, #EAECF0)) !important",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <RoundTableRow>
                        {headers.map((header, index) => (
                          <RoundTableCell key={index} align="center">
                            {header}
                          </RoundTableCell>
                        ))}
                      </RoundTableRow>
                    </TableHead>
                    <TableBody>
                      {dailyDocumentsRows
                        .slice(0, visibleDailyDocumentsRows)
                        .map((row, rowIndex) => (
                          <RoundTableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <RoundTableCell key={cellIndex} align="center">
                                {cell}
                              </RoundTableCell>
                            ))}
                          </RoundTableRow>
                        ))}
                      {/* Totals row at the bottom */}
                      <RoundTableRow>
                        {totalRow.map((total, index) => (
                          <RoundTableCell
                            key={index}
                            align="center"
                            sx={{
                              fontWeight: 600,
                              backgroundColor:
                                "var(--theme-table-round-head-bg, var(--theme-bg-secondary, #F9FAFB))",
                              borderTop:
                                "2px solid var(--theme-table-border-color, var(--theme-border-color, #EAECF0))",
                            }}
                          >
                            {total}
                          </RoundTableCell>
                        ))}
                      </RoundTableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
              {dailyDocumentsRows.length > 10 && (
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
        })()}
    </div>
  );
};
export { MonitoringDashboardWidget };
