import React from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import {
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useStyle } from "../style";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  DepartmentPerformanceDTO,
  StationPerformanceDTO,
  BoardMissionsStatusFilterItem,
  DepartmentSummaryDTO,
} from "./interfaces";
import { useMainProductionReport } from "./use-main-production-report";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { exportProductionDashboardToExcel } from "../production-dashboard-export-utils";

const MainProductionReportTable = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  // Use custom hook for all state and functions
  const {
    loading,
    data,
    error,
    expandedDepartments,
    toggleDepartment,
    toggleAllDepartments,
    formatTime,
    formatPercentage,
    formatCurrency,
  } = useMainProductionReport();

  // Helper function to extract boardMissionIds and apply filter
  const handleBoardMissionIdsClick = (boardMissionIds: string[]) => {
    if (!boardMissionIds || boardMissionIds.length === 0) {
      return;
    }

    // Store boardMissionIds in sessionStorage for the new tab to read
    const filterKey = "boardMissionsFilterFromDashboard";
    sessionStorage.setItem(
      filterKey,
      JSON.stringify({
        boardMissionsIds: boardMissionIds,
        pageNumber: 1,
        pageSize: 50,
        timestamp: Date.now(),
      })
    );

    // Open /jobs page in a new tab
    window.open("/jobs?applyBoardMissionsFilter=1", "_blank");
  };

  // Handler for clicking on totalJobs (status 0 + 1 combined)
  const handleTotalJobsClick = (summary: DepartmentSummaryDTO) => {
    if (!summary.boardMissionsStatusFilter) {
      return;
    }

    // Extract IDs from status 0 (inprocess) and status 1 (done)
    const inProcessFilter = summary.boardMissionsStatusFilter.find(
      (item) => item.status === 0
    );
    const doneFilter = summary.boardMissionsStatusFilter.find(
      (item) => item.status === 1
    );

    // Combine IDs from both statuses
    const combinedIds = [
      ...(inProcessFilter?.boardMissionIds || []),
      ...(doneFilter?.boardMissionIds || []),
    ];

    if (combinedIds.length === 0) {
      return;
    }

    handleBoardMissionIdsClick(combinedIds);
  };

  // Handler for clicking on totalDoneJobs (status 1)
  const handleTotalDoneJobsClick = (summary: DepartmentSummaryDTO) => {
    if (!summary.boardMissionsStatusFilter) {
      return;
    }

    const doneFilter = summary.boardMissionsStatusFilter.find(
      (item) => item.status === 1
    );

    if (!doneFilter || doneFilter.boardMissionIds.length === 0) {
      return;
    }

    handleBoardMissionIdsClick(doneFilter.boardMissionIds);
  };

  // Handler for clicking on totalInProcessJobs (status 0)
  const handleTotalInProcessJobsClick = (summary: DepartmentSummaryDTO) => {
    if (!summary.boardMissionsStatusFilter) {
      return;
    }

    const inProcessFilter = summary.boardMissionsStatusFilter.find(
      (item) => item.status === 0
    );

    if (!inProcessFilter || inProcessFilter.boardMissionIds.length === 0) {
      return;
    }

    handleBoardMissionIdsClick(inProcessFilter.boardMissionIds);
  };

  // Handler for clicking on totalReportedJobs (status 2)
  const handleTotalReportedJobsClick = (summary: DepartmentSummaryDTO) => {
    if (!summary.boardMissionsStatusFilter) {
      return;
    }

    const reportedFilter = summary.boardMissionsStatusFilter.find(
      (item) => item.status === 2
    );

    if (!reportedFilter || reportedFilter.boardMissionIds.length === 0) {
      return;
    }

    handleBoardMissionIdsClick(reportedFilter.boardMissionIds);
  };

  // Helper function to render growth with trending icons
  const renderGrowthWithIcon = (
    growthValue: number | null,
    isSummary: boolean = false
  ) => {
    if (growthValue === null) {
      return <span style={{ fontWeight: "bold" }}>-</span>;
    }

    const isPositive = growthValue > 0;
    const isNegative = growthValue < 0;
    const color = isPositive ? "#4CAF50" : isNegative ? "#F44336" : "#757575";

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          color,
          justifyContent: "center",
        }}
      >
        {isPositive && <TrendingUpIcon fontSize="small" />}
        {isNegative && <TrendingDownIcon fontSize="small" />}
        <span style={{ fontWeight: isSummary ? "bold" : "normal" }}>
          {formatPercentage(Math.abs(growthValue))}
        </span>
      </Box>
    );
  };

  // Generate flat table data with expand/collapse functionality
  const generateTableData = () => {
    if (!data?.departments) return [];

    const tableData: any[] = [];

    data.departments.forEach((department: DepartmentPerformanceDTO) => {
      const isExpanded = expandedDepartments.has(department.departmentId);
      const expandIcon = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;

      // Department header row with expand/collapse button and summary values
      tableData.push([
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: 1,
          }}
          onClick={() => toggleDepartment(department.departmentId)}
        >
          <IconButton size="small" sx={{ mr: 1 }}>
            {expandIcon}
          </IconButton>
          <span style={{ fontWeight: "bold" }}>
            {department.departmentName}
          </span>
          <Chip
            label={`${department.summary.totalStations} ${t(
              "productionReport.stations"
            )}`}
            size="small"
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: "bold",
              fontSize: "0.75rem",
              height: "24px",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalEstimatedWorkingHours)}
        </span>,
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {formatTime(department.summary.totalEstimatedHours)} /{" "}
          </span>
          <span
            style={{
              fontWeight: "bold",
              cursor:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.length > 0
                  ? "pointer"
                  : "default",
              color:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.length > 0
                  ? primaryColor(500)
                  : "inherit",
              textDecoration:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.length > 0
                  ? "underline"
                  : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTotalJobsClick(department.summary);
            }}
          >
            {department.summary.totalJobs}
          </span>
        </Box>,
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {formatTime(department.summary.totalDoneHours)} /{" "}
          </span>
          <span
            style={{
              fontWeight: "bold",
              cursor:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 1 && item.boardMissionIds.length > 0
                )
                  ? "pointer"
                  : "default",
              color:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 1 && item.boardMissionIds.length > 0
                )
                  ? primaryColor(500)
                  : "inherit",
              textDecoration:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 1 && item.boardMissionIds.length > 0
                )
                  ? "underline"
                  : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTotalDoneJobsClick(department.summary);
            }}
          >
            {department.summary.totalDoneJobs}
          </span>
        </Box>,
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {formatTime(department.summary.totalInProcessHours)} /{" "}
          </span>
          <span
            style={{
              fontWeight: "bold",
              cursor:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 0 && item.boardMissionIds.length > 0
                )
                  ? "pointer"
                  : "default",
              color:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 0 && item.boardMissionIds.length > 0
                )
                  ? primaryColor(500)
                  : "inherit",
              textDecoration:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 0 && item.boardMissionIds.length > 0
                )
                  ? "underline"
                  : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTotalInProcessJobsClick(department.summary);
            }}
          >
            {department.summary.totalInProcessJobs}
          </span>
        </Box>,
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <span style={{ fontWeight: "bold" }}>
            {formatTime(department.summary.totalReportedHours)} /{" "}
          </span>
          <span
            style={{
              fontWeight: "bold",
              cursor:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 2 && item.boardMissionIds.length > 0
                )
                  ? "pointer"
                  : "default",
              color:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 2 && item.boardMissionIds.length > 0
                )
                  ? primaryColor(500)
                  : "inherit",
              textDecoration:
                department.summary.boardMissionsStatusFilter &&
                department.summary.boardMissionsStatusFilter.some(
                  (item) => item.status === 2 && item.boardMissionIds.length > 0
                )
                  ? "underline"
                  : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleTotalReportedJobsClick(department.summary);
            }}
          >
            {department.summary.totalReportedJobs}
          </span>
        </Box>,
        <Box>
          {department.summary.averageCapacity !== null && (
            <>
              <span style={{ fontWeight: "bold" }}>
                {formatPercentage(department.summary.averageCapacity)}
              </span>
              <br />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                {renderGrowthWithIcon(
                  department.summary.averageCapacityGrowth,
                  true
                )}
              </Box>
            </>
          )}
          {department.summary.averageCapacity === null && (
            <span style={{ fontWeight: "bold" }}>-</span>
          )}
        </Box>,
        <Box>
          {department.summary.averagePerformance !== null && (
            <>
              <span style={{ fontWeight: "bold" }}>
                {formatPercentage(department.summary.averagePerformance)}
              </span>
              <br />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                {renderGrowthWithIcon(
                  department.summary.averagePerformanceGrowth,
                  true
                )}
              </Box>
            </>
          )}
          {department.summary.averagePerformance === null && (
            <span style={{ fontWeight: "bold" }}>-</span>
          )}
        </Box>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalWorkingHours)}
        </span>,
        <Box>
          <span style={{ fontWeight: "bold" }}>
            {formatCurrency(department.summary.jobsTotalEstimatedCost)}
          </span>
          <br />
          <Typography variant="caption" color="textSecondary">
            {formatCurrency(department.summary.jobsEstimatedPrice)}
          </Typography>
        </Box>,
      ]);

      // Station rows (only if expanded)
      if (isExpanded) {
        department.stations.forEach((station: StationPerformanceDTO) => {
          tableData.push([
            <Box sx={{ pl: 4 }}>{station.stationName}</Box>,
            formatTime(station.totalEstimatedWorkingHours),
            `${formatTime(station.totalEstimated.time)} / ${
              station.totalEstimated.jobs
            }`,
            `${formatTime(station.done.time)} / ${station.done.jobs}`,
            `${formatTime(station.inProcess.time)} / ${station.inProcess.jobs}`,
            <Box>
              {formatTime(station.reported.time)} / {station.reported.jobs}
              <br />
              <Typography variant="caption" color="textSecondary">
                (
                {station.totalEstimated.jobs > 0
                  ? formatPercentage(
                      (station.reported.jobs / station.totalEstimated.jobs) *
                        100
                    )
                  : "N/A"}
                )
              </Typography>
            </Box>,
            <Box>
              {formatPercentage(station.capacity.capacity)}
              <br />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                {renderGrowthWithIcon(station.capacity.growth)}
              </Box>
            </Box>,
            <Box>
              {formatPercentage(station.performance.productivity)}
              <br />
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                {renderGrowthWithIcon(station.performance.growth)}
              </Box>
            </Box>,
            formatTime(station.averageProductionTime),
            <Box>
              {formatCurrency(station.jobAnalytics.jobsTotalEstimatedCost)}
              <br />
              <Typography variant="caption" color="textSecondary">
                {formatCurrency(station.jobAnalytics.jobsEstimatedPrice)}
              </Typography>
            </Box>,
          ]);
        });
      }
    });

    return tableData;
  };

  const tableData = generateTableData();

  const tableHeaders = [
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.stationDetails")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.departmentStation")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.totalEstimatedWorkingHours")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.hoursPerDay")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.totalEstimated")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.done")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.inProcess")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.reported")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobsPercentage")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.capacity")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.capacityGrowth") || "Capacity/Growth"}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.performance")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.productivityGrowth")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.avgTime")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.dailyProductivity")}
      </Typography>
    </Box>,
    <Box>
      <Typography variant="body2" fontWeight="bold">
        {t("productionReport.jobAnalytics")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.costPrice")}
      </Typography>
    </Box>,
  ];

  // Export to Excel handler
  const handleExportToExcel = () => {
    if (!data?.departments) return;
    exportProductionDashboardToExcel(data.departments, t);
  };

  if (loading) {
    return (
      <Box style={classes.subContainer}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={classes.subContainer}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data || tableData.length === 0) {
    return (
      <Box style={classes.subContainer}>
        <Typography align="center">
          {t("productionReport.noDataAvailable")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={classes.subContainer}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Box>
          <Typography variant="h6">
            {t("productionReport.mainProductionReport")}
          </Typography>
          {data.reportGeneratedAt && (
            <Typography variant="caption" display="block" color="textSecondary">
              {t("productionReport.generatedAt")}:{" "}
              {format(new Date(data.reportGeneratedAt), "MMM d, yyyy HH:mm")}
            </Typography>
          )}
          {data.sla !== undefined && (
            <Box sx={{ mt: 1.5 }}>
              <Chip
                label={`SLA: ${formatPercentage(data.sla)}`}
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#495057",
                  fontSize: "0.9rem",
                  height: "28px",
                  px: 1,
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                }}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportToExcel}
            size="small"
            sx={{
              backgroundColor: primaryColor(500),
              "&:hover": { backgroundColor: primaryColor(200) },
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {t("materialsActions.DownLoadExcel") || "Download Excel"}
          </Button>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              onClick={toggleAllDepartments}
              size="small"
              sx={{
                backgroundColor: "#e3f2fd",
                "&:hover": { backgroundColor: "#bbdefb" },
              }}
            >
              {expandedDepartments.size === data?.departments?.length ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ alignSelf: "center" }}
            >
              {expandedDepartments.size === data?.departments?.length
                ? t("productionReport.collapseAll")
                : t("productionReport.expandAll")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        rows={tableData}
        headers={tableHeaders}
        variant="RoundTable"
        maxHeight={"60vh"}
      />
    </Box>
  );
};

export { MainProductionReportTable };
