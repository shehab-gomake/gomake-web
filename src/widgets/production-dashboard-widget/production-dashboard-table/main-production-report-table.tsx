import React from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import {
  CircularProgress,
  Box,
  Typography,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useStyle } from "../style";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { DepartmentPerformanceDTO, StationPerformanceDTO } from "./interfaces";
import { useMainProductionReport } from "./use-main-production-report";

const MainProductionReportTable = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();

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

  const CollapsibleTable = () => {
    if (!data?.departments) return null;

    return (
      <TableContainer
        component={Paper}
        //sx={{ maxHeight: "70vh" }}
      >
        <Table stickyHeader sx={classes.collapsibleTable}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                {t("productionReport.department")}
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                {t("productionReport.supplier")}
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.totalEstimated")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.timeJobs")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.done")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.timeJobs")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.inProcess")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.timeJobs")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.reported")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.timeJobsPercent")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.capacity")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.percentGrowth")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.performance")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.percentGrowth")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.ddp")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.percentGrowth")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.jobAnalytics")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.costPrice")}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                {t("productionReport.sla")}
              </TableCell>
              <TableCell
                sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {t("productionReport.avgProductionTime")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t("productionReport.dailyProductivity")}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.departments.map((department: DepartmentPerformanceDTO) => (
              <React.Fragment key={department.departmentId}>
                {/* Department Row */}
                <TableRow sx={classes.departmentRow}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          toggleDepartment(department.departmentId)
                        }
                        sx={{ mr: 1 }}
                      >
                        {expandedDepartments.has(department.departmentId) ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {department.departmentName}
                      </Typography>
                      <Chip
                        label={`${department.stations.length} ${t(
                          "productionReport.stations"
                        )}`}
                        size="small"
                        sx={{
                          ml: 1,
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
                    </Box>
                  </TableCell>
                  <TableCell colSpan={11}>
                    <Typography variant="body2" color="textSecondary">
                      {t("productionReport.departmentSummary")}
                    </Typography>
                  </TableCell>
                </TableRow>

                {/* Station Rows - Collapsible */}
                <TableRow>
                  <TableCell colSpan={12} sx={{ padding: 0 }}>
                    <Collapse
                      in={expandedDepartments.has(department.departmentId)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.stationDetails")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.supplier")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.totalEstimated")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.done")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.inProcess")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.reported")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.capacity")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.performance")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.ddp")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.jobAnalytics")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.sla")}
                              </TableCell>
                              <TableCell sx={{ backgroundColor: "#e3f2fd" }}>
                                {t("productionReport.avgTime")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {department.stations.map(
                              (station: StationPerformanceDTO) => (
                                <TableRow
                                  key={station.stationId}
                                  sx={classes.stationRow}
                                >
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {station.stationName}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {station.supplierName || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatTime(station.totalEstimated.time)}{" "}
                                      / {station.totalEstimated.jobs}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatTime(station.done.time)} /{" "}
                                      {station.done.jobs}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatTime(station.inProcess.time)} /{" "}
                                      {station.inProcess.jobs}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatTime(station.reported.time)} /{" "}
                                      {station.reported.jobs}
                                      <br />
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        (
                                        {formatPercentage(
                                          (station.reported.jobs /
                                            station.totalEstimated.jobs) *
                                            100
                                        )}
                                        )
                                      </Typography>
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatPercentage(
                                        (station.capacity.totalEstimated /
                                          station.capacity.totalWorkingHours) *
                                          100
                                      )}
                                      <br />
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        (
                                        {formatPercentage(
                                          station.capacity.growth
                                        )}
                                        )
                                      </Typography>
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatPercentage(
                                        station.performance.productivity
                                      )}
                                      <br />
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        (
                                        {formatPercentage(
                                          station.performance.growth
                                        )}
                                        )
                                      </Typography>
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatPercentage(
                                        station.dueDatePerformance.percentage
                                      )}
                                      <br />
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        (
                                        {formatPercentage(
                                          station.dueDatePerformance.growth
                                        )}
                                        )
                                      </Typography>
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatCurrency(
                                        station.jobAnalytics.estimatedCost
                                      )}
                                      <br />
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                      >
                                        {formatCurrency(
                                          station.jobAnalytics.estimatedPrice
                                        )}
                                      </Typography>
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {station.sla
                                        ? formatPercentage(station.sla)
                                        : "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatTime(
                                        station.averageProductionTime
                                      )}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
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

  if (!data) {
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
        <Typography variant="h6">
          {t("productionReport.mainProductionReport")}
          {data.reportGeneratedAt && (
            <Typography variant="caption" display="block" color="textSecondary">
              {t("productionReport.generatedAt")}:{" "}
              {format(new Date(data.reportGeneratedAt), "MMM d, yyyy HH:mm")}
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={toggleAllDepartments}
            size="small"
            sx={{
              backgroundColor: "#e3f2fd",
              "&:hover": { backgroundColor: "#bbdefb" },
            }}
          >
            {expandedDepartments.size === data?.departments?.length ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
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
      <CollapsibleTable />
    </Box>
  );
};

export { MainProductionReportTable };
