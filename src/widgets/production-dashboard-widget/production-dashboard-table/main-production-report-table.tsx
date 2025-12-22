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
import { InfoTooltip } from "@/components/info-tooltip/info-tooltip";

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
    downloadExcel,
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

  // Type for objects with boardMissionsStatusFilter (works for both department and station)
  type HasBoardMissionsStatusFilter = {
    boardMissionsStatusFilter?: BoardMissionsStatusFilterItem[];
  };

  // Consolidated handler for job count clicks
  const handleJobCountClick = (
    item: HasBoardMissionsStatusFilter,
    statuses: number[] // Array of statuses to include (e.g., [0, 1] for totalJobs, [1] for done)
  ) => {
    if (!item.boardMissionsStatusFilter) {
      return;
    }

    // Extract IDs from specified statuses
    const ids: string[] = [];
    statuses.forEach((status) => {
      const filter = item.boardMissionsStatusFilter?.find(
        (filterItem) => filterItem.status === status
      );
      if (filter?.boardMissionIds) {
        ids.push(...filter.boardMissionIds);
      }
    });

    if (ids.length === 0) {
      return;
    }

    handleBoardMissionIdsClick(ids);
  };

  // Helper to check if a status has IDs available for clicking
  const hasStatusIds = (
    boardMissionsStatusFilter: BoardMissionsStatusFilterItem[] | undefined,
    statuses: number[]
  ): boolean => {
    if (!boardMissionsStatusFilter) return false;
    return statuses.some((status) => {
      const filter = boardMissionsStatusFilter.find(
        (item) => item.status === status
      );
      return filter?.boardMissionIds.length > 0;
    });
  };

  // Helper to get clickable span styles
  const getClickableSpanStyles = (isClickable: boolean) => ({
    cursor: isClickable ? "pointer" : "default",
    color: isClickable ? primaryColor(500) : "inherit",
    textDecoration: isClickable ? "underline" : "none",
  });

  // Helper component for clickable job count
  const ClickableJobCount = ({
    timeValue,
    jobCount,
    boardMissionsStatusFilter,
    statuses,
    fontWeight = "bold",
  }: {
    timeValue: string;
    jobCount: number;
    boardMissionsStatusFilter?: BoardMissionsStatusFilterItem[];
    statuses: number[];
    fontWeight?: "bold" | "normal";
  }) => {
    const isClickable = hasStatusIds(boardMissionsStatusFilter, statuses);
    const item = { boardMissionsStatusFilter };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.4,
          py: 0.4,
        }}
      >
        <span style={{ fontWeight, lineHeight: 1.2 }}>{timeValue} / </span>
        <span
          style={{
            fontWeight,
            lineHeight: 1.2,
            ...getClickableSpanStyles(isClickable),
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isClickable) {
              handleJobCountClick(item, statuses);
            }
          }}
        >
          {jobCount}
        </span>
      </Box>
    );
  };

  // Helper component for reported jobs (has extra percentage display)
  const ClickableReportedJobCount = ({
    timeValue,
    jobCount,
    totalEstimatedJobs,
    boardMissionsStatusFilter,
    statuses,
    fontWeight = "bold",
  }: {
    timeValue: string;
    jobCount: number;
    totalEstimatedJobs: number;
    boardMissionsStatusFilter?: BoardMissionsStatusFilterItem[];
    statuses: number[];
    fontWeight?: "bold" | "normal";
  }) => {
    const isClickable = hasStatusIds(boardMissionsStatusFilter, statuses);
    const item = { boardMissionsStatusFilter };

    return (
      <Box sx={{ py: 0.4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.4,
          }}
        >
          <span style={{ fontWeight, lineHeight: 1.2 }}>{timeValue} / </span>
          <span
            style={{
              fontWeight,
              lineHeight: 1.2,
              ...getClickableSpanStyles(isClickable),
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isClickable) {
                handleJobCountClick(item, statuses);
              }
            }}
          >
            {jobCount}
          </span>
        </Box>
        {totalEstimatedJobs > 0 && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: "block",
              textAlign: "center",
              lineHeight: 1,
              mt: 0.4,
              fontSize: "0.7rem",
            }}
          >
            ({formatPercentage((jobCount / totalEstimatedJobs) * 100)})
          </Typography>
        )}
      </Box>
    );
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
          gap: 0.4,
          color,
          justifyContent: "center",
          lineHeight: 1.2,
        }}
      >
        {isPositive && <TrendingUpIcon fontSize="small" />}
        {isNegative && <TrendingDownIcon fontSize="small" />}
        <span
          style={{ fontWeight: isSummary ? "bold" : "normal", lineHeight: 1.2 }}
        >
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
        <ClickableJobCount
          timeValue={formatTime(department.summary.totalEstimatedHours)}
          jobCount={department.summary.totalJobs}
          boardMissionsStatusFilter={
            department.summary.boardMissionsStatusFilter
          }
          statuses={[0, 1]} // totalJobs = inProcess + done
        />,
        <ClickableJobCount
          timeValue={formatTime(department.summary.totalDoneHours)}
          jobCount={department.summary.totalDoneJobs}
          boardMissionsStatusFilter={
            department.summary.boardMissionsStatusFilter
          }
          statuses={[1]} // done
        />,
        <ClickableJobCount
          timeValue={formatTime(department.summary.totalInProcessHours)}
          jobCount={department.summary.totalInProcessJobs}
          boardMissionsStatusFilter={
            department.summary.boardMissionsStatusFilter
          }
          statuses={[0]} // inProcess
        />,
        <ClickableReportedJobCount
          timeValue={formatTime(department.summary.totalReportedHours)}
          jobCount={department.summary.totalReportedJobs}
          totalEstimatedJobs={department.summary.totalJobs}
          boardMissionsStatusFilter={
            department.summary.boardMissionsStatusFilter
          }
          statuses={[2]} // reported
        />,
        <Box sx={{ py: 0.4 }}>
          {department.summary.averageCapacity !== null && (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {formatPercentage(department.summary.averageCapacity)}
              </span>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.4 }}>
                {renderGrowthWithIcon(
                  department.summary.averageCapacityGrowth,
                  true
                )}
              </Box>
            </>
          )}
          {department.summary.averageCapacity === null && (
            <span style={{ fontWeight: "bold", lineHeight: 1.2 }}>-</span>
          )}
        </Box>,
        <Box sx={{ py: 0.4 }}>
          {department.summary.averagePerformance !== null && (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  display: "block",
                }}
              >
                {formatPercentage(department.summary.averagePerformance)}
              </span>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.4 }}>
                {renderGrowthWithIcon(
                  department.summary.averagePerformanceGrowth,
                  true
                )}
              </Box>
            </>
          )}
          {department.summary.averagePerformance === null && (
            <span style={{ fontWeight: "bold", lineHeight: 1.2 }}>-</span>
          )}
        </Box>,
        <span style={{ fontWeight: "bold", lineHeight: 1.2 }}>
          {formatTime(department.summary.totalWorkingHours)}
        </span>,
        <Box sx={{ py: 0.4 }}>
          <span
            style={{ fontWeight: "bold", lineHeight: 1.2, display: "block" }}
          >
            {formatCurrency(department.summary.jobsTotalEstimatedCost)}
          </span>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 1, mt: 0.4, fontSize: "0.7rem" }}
          >
            {formatCurrency(department.summary.jobsEstimatedPrice)}
          </Typography>
        </Box>,
      ]);

      // Station rows (only if expanded)
      if (isExpanded) {
        department.stations.forEach((station: StationPerformanceDTO) => {
          tableData.push([
            <Box sx={{ pl: 4, py: 0.4 }}>
              <span style={{ lineHeight: 1.2 }}>{station.stationName}</span>
            </Box>,
            <span style={{ lineHeight: 1.2 }}>
              {formatTime(station.totalEstimatedWorkingHours)}
            </span>,
            <ClickableJobCount
              timeValue={formatTime(station.totalEstimated.time)}
              jobCount={station.totalEstimated.jobs}
              boardMissionsStatusFilter={station.boardMissionsStatusFilter}
              statuses={[0, 1]} // totalJobs = inProcess + done
              fontWeight="normal"
            />,
            <ClickableJobCount
              timeValue={formatTime(station.done.time)}
              jobCount={station.done.jobs}
              boardMissionsStatusFilter={station.boardMissionsStatusFilter}
              statuses={[1]} // done
              fontWeight="normal"
            />,
            <ClickableJobCount
              timeValue={formatTime(station.inProcess.time)}
              jobCount={station.inProcess.jobs}
              boardMissionsStatusFilter={station.boardMissionsStatusFilter}
              statuses={[0]} // inProcess
              fontWeight="normal"
            />,
            <ClickableReportedJobCount
              timeValue={formatTime(station.reported.time)}
              jobCount={station.reported.jobs}
              totalEstimatedJobs={station.totalEstimated.jobs}
              boardMissionsStatusFilter={station.boardMissionsStatusFilter}
              statuses={[2]} // reported
              fontWeight="normal"
            />,
            <Box sx={{ py: 0.4 }}>
              <span style={{ lineHeight: 1.2, display: "block" }}>
                {formatPercentage(station.capacity.capacity)}
              </span>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.4 }}>
                {renderGrowthWithIcon(station.capacity.growth)}
              </Box>
            </Box>,
            <Box sx={{ py: 0.4 }}>
              <span style={{ lineHeight: 1.2, display: "block" }}>
                {formatPercentage(station.performance.productivity)}
              </span>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 0.4 }}>
                {renderGrowthWithIcon(station.performance.growth)}
              </Box>
            </Box>,
            <span style={{ lineHeight: 1.2 }}>
              {formatTime(station.averageProductionTime)}
            </span>,
            <Box sx={{ py: 0.4 }}>
              <span style={{ lineHeight: 1.2, display: "block" }}>
                {formatCurrency(station.jobAnalytics.jobsTotalEstimatedCost)}
              </span>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ lineHeight: 1, mt: 0.4, fontSize: "0.7rem" }}
              >
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
      <InfoTooltip content={t("productionReport.stationDetailsTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.stationDetails")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.departmentStation")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip
        content={t("productionReport.totalEstimatedWorkingHoursTooltip")}
      >
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.totalEstimatedWorkingHours")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.hoursPerDay")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.totalEstimatedTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.totalEstimated")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.doneTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.done")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.inProcessTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.inProcess")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobs")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.reportedTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.reported")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.timeJobsPercentage")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.capacityTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.capacity")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.capacityGrowth") || "Capacity/Growth"}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.performanceTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.performance")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.productivityGrowth")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.avgTimeTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.avgTime")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.dailyProductivity")}
      </Typography>
    </Box>,
    <Box>
      <InfoTooltip content={t("productionReport.jobAnalyticsTooltip")}>
        <Typography variant="body2" fontWeight="bold">
          {t("productionReport.jobAnalytics")}
        </Typography>
      </InfoTooltip>
      <Typography variant="caption" color="textSecondary">
        {t("productionReport.costPrice")}
      </Typography>
    </Box>,
  ];

  // Export to Excel handler
  const handleExportToExcel = () => {
    downloadExcel();
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
          {(data.otd !== undefined || data.tB_OTD !== undefined) && (
            <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {data.otd !== undefined && (
                <InfoTooltip content={t("productionReport.otdTooltip")}>
                  <Chip
                    label={`${t(
                      "productionReport.onTimeDelivery"
                    )}: ${formatPercentage(data.otd)} (${parseFloat(
                      Number(data.jobsDoneOnTimeCount || 0).toFixed(2)
                    )} / ${parseFloat(
                      Number(data.allJobsCount || 0).toFixed(2)
                    )})`}
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
                </InfoTooltip>
              )}
              {data.tB_OTD !== undefined && (
                <InfoTooltip content={t("productionReport.tB_OTDTooltip")}>
                  <Chip
                    label={`${t(
                      "productionReport.timeBasedOnTimeDelivery"
                    )}: ${formatPercentage(data.tB_OTD)} (${parseFloat(
                      Number(data.jobsDoneBasedTime || 0).toFixed(2)
                    )} / ${parseFloat(
                      Number(data.allJobsBasedTime || 0).toFixed(2)
                    )})`}
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
                </InfoTooltip>
              )}
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
