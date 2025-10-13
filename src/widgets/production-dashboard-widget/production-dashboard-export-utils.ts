import * as XLSX from "xlsx";
import { format } from "date-fns";
import {
  DepartmentPerformanceDTO,
  StationPerformanceDTO,
} from "./production-dashboard-table/interfaces";

const formatTime = (time: number): string => {
  const safeNumber = (value: any): number | null => {
    if (value == null) return null;
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (!isFinite(num) || isNaN(num)) return null;
    return num;
  };

  const safeTime = safeNumber(time);
  if (safeTime == null) return "0h 0m";

  const hours = Math.floor(safeTime);
  const minutes = Math.round((safeTime - hours) * 60);

  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export const exportProductionDashboardToExcel = (
  departments: DepartmentPerformanceDTO[],
  t: (key: string) => string
) => {
  if (!departments || departments.length === 0) return;

  // Prepare data for Excel export
  const excelData: any[] = [];

  // Add headers
  excelData.push([
    t("productionReport.stationDetails"),
    t("productionReport.totalEstimated") + " (Time)",
    t("productionReport.totalEstimated") + " (Jobs)",
    t("productionReport.done") + " (Time)",
    t("productionReport.done") + " (Jobs)",
    t("productionReport.inProcess") + " (Time)",
    t("productionReport.inProcess") + " (Jobs)",
    t("productionReport.reported") + " (Time)",
    t("productionReport.reported") + " (Jobs)",
    t("productionReport.reported") + " (%)",
    t("productionReport.capacity") + " (%)",
    t("productionReport.growth") + " (%)",
    t("productionReport.performance") + " (%)",
    t("productionReport.performance") + " (Growth %)",
    t("productionReport.jobAnalytics") + " (Cost)",
    t("productionReport.jobAnalytics") + " (Price)",
    t("productionReport.totalEstimatedWorkingHours"),
    t("productionReport.avgTime"),
  ]);

  // Add data rows
  departments.forEach((department: DepartmentPerformanceDTO) => {
    // Department summary row
    excelData.push([
      `${department.departmentName} (${department.summary.totalStations} ${t(
        "productionReport.stations"
      )})`,
      formatTime(department.summary.totalEstimatedHours),
      department.summary.totalJobs,
      formatTime(department.summary.totalDoneHours),
      department.summary.totalDoneJobs,
      formatTime(department.summary.totalInProcessHours),
      department.summary.totalInProcessJobs,
      formatTime(department.summary.totalReportedHours),
      department.summary.totalReportedJobs,
      "-",
      department.summary.averageCapacity !== null
        ? department.summary.averageCapacity.toFixed(2)
        : "-",
      department.summary.averageCapacityGrowth !== null
        ? department.summary.averageCapacityGrowth.toFixed(2)
        : "-",
      department.summary.averagePerformance !== null
        ? department.summary.averagePerformance.toFixed(2)
        : "-",
      "-",
      department.summary.jobsTotalEstimatedCost.toFixed(2),
      department.summary.jobsEstimatedPrice.toFixed(2),
      formatTime(department.summary.totalEstimatedWorkingHours),
      formatTime(department.summary.totalWorkingHours),
    ]);

    // Station rows
    department.stations.forEach((station: StationPerformanceDTO) => {
      const reportedPercentage =
        station.totalEstimated.jobs > 0
          ? (
              (station.reported.jobs / station.totalEstimated.jobs) *
              100
            ).toFixed(2)
          : "0";

      excelData.push([
        `  ${station.stationName}`,
        formatTime(station.totalEstimated.time),
        station.totalEstimated.jobs,
        formatTime(station.done.time),
        station.done.jobs,
        formatTime(station.inProcess.time),
        station.inProcess.jobs,
        formatTime(station.reported.time),
        station.reported.jobs,
        reportedPercentage,
        station.capacity.capacity.toFixed(2),
        station.capacity.growth.toFixed(2),
        station.performance.productivity.toFixed(2),
        station.performance.growth.toFixed(2),
        station.jobAnalytics.jobsTotalEstimatedCost.toFixed(2),
        station.jobAnalytics.jobsEstimatedPrice.toFixed(2),
        formatTime(station.totalEstimatedWorkingHours),
        formatTime(station.averageProductionTime),
      ]);
    });

    // Add empty row between departments
    excelData.push([]);
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths
  ws["!cols"] = [
    { wch: 30 }, // Station Details
    { wch: 15 }, // Total Estimated Time
    { wch: 12 }, // Total Estimated Jobs
    { wch: 15 }, // Done Time
    { wch: 12 }, // Done Jobs
    { wch: 15 }, // In Process Time
    { wch: 12 }, // In Process Jobs
    { wch: 15 }, // Reported Time
    { wch: 12 }, // Reported Jobs
    { wch: 12 }, // Reported %
    { wch: 12 }, // Capacity %
    { wch: 15 }, // Capacity Growth %
    { wch: 12 }, // Performance %
    { wch: 15 }, // Performance Growth %
    { wch: 15 }, // Job Analytics Cost
    { wch: 15 }, // Job Analytics Price
    { wch: 20 }, // Total Estimated Working Hours
    { wch: 15 }, // Avg Time
  ];

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Production Report");

  // Generate filename with current date
  const fileName = `Production_Report_${format(
    new Date(),
    "yyyy-MM-dd_HH-mm"
  )}.xlsx`;

  // Save file
  XLSX.writeFile(wb, fileName);
};
