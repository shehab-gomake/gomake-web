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
import { useStyle } from "../style";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { DepartmentPerformanceDTO, StationPerformanceDTO } from "./interfaces";
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
          {formatTime(department.summary.totalEstimatedHours)} /{" "}
          {department.summary.totalJobs}
        </span>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalDoneHours)} /{" "}
          {department.summary.totalDoneJobs}
        </span>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalInProcessHours)} /{" "}
          {department.summary.totalInProcessJobs}
        </span>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalReportedHours)} /{" "}
          {department.summary.totalReportedJobs}
        </span>,
        <Box>
          {department.summary.averageGrowth !== null && (
            <span style={{ fontWeight: "bold" }}>
              {formatPercentage(department.summary.averageGrowth)}
            </span>
          )}
          {department.summary.averageGrowth === null && (
            <span style={{ fontWeight: "bold" }}>-</span>
          )}
        </Box>,
        <Box>
          {department.summary.averagePerformance !== null && (
            <span style={{ fontWeight: "bold" }}>
              {formatPercentage(department.summary.averagePerformance)}
            </span>
          )}
          {department.summary.averagePerformance === null && (
            <span style={{ fontWeight: "bold" }}>-</span>
          )}
        </Box>,
        <Box>
          <span style={{ fontWeight: "bold" }}>
            {formatCurrency(department.summary.jobsTotalEstimatedCost)}
          </span>
          <br />
          <Typography variant="caption" color="textSecondary">
            {formatCurrency(department.summary.jobsEstimatedPrice)}
          </Typography>
        </Box>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalEstimatedWorkingHours)}
        </span>,
        <span style={{ fontWeight: "bold" }}>
          {formatTime(department.summary.totalWorkingHours)}
        </span>,
      ]);

      // Station rows (only if expanded)
      if (isExpanded) {
        department.stations.forEach((station: StationPerformanceDTO) => {
          tableData.push([
            <Box sx={{ pl: 4 }}>{station.stationName}</Box>,
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
              <Typography variant="caption" color="textSecondary">
                ({formatPercentage(station.capacity.growth)})
              </Typography>
            </Box>,
            <Box>
              {formatPercentage(station.performance.productivity)}
              <br />
              <Typography variant="caption" color="textSecondary">
                ({formatPercentage(station.performance.growth)})
              </Typography>
            </Box>,
            <Box>
              {formatCurrency(station.jobAnalytics.jobsTotalEstimatedCost)}
              <br />
              <Typography variant="caption" color="textSecondary">
                {formatCurrency(station.jobAnalytics.jobsEstimatedPrice)}
              </Typography>
            </Box>,
            formatTime(station.totalEstimatedWorkingHours),
            formatTime(station.averageProductionTime),
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
        {t("productionReport.percentageGrowth")}
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
        {t("productionReport.jobAnalytics")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.costPrice")}
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
        {t("productionReport.avgTime")}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.dailyProductivity")}
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
