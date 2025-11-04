export interface MainProductionReportResponseDTO {
  reportGeneratedAt: string;
  departments: DepartmentPerformanceDTO[];
  sla: number;
}

export interface DepartmentPerformanceDTO {
  departmentId: string;
  departmentName: string;
  stations: StationPerformanceDTO[];
  summary: DepartmentSummaryDTO;
}

export interface StationPerformanceDTO {
  stationId: string;
  stationName: string;
  supplierName?: string;
  totalEstimated: StationMetrics;
  done: StationMetrics;
  inProcess: StationMetrics;
  reported: StationMetrics;
  capacity: CapacityMetricsDTO;
  performance: PerformanceMetricsDTO;
  jobAnalytics: JobAnalytics;
  sla?: DDP;
  averageProductionTime: number;
  totalEstimatedWorkingHours: number;
}

export interface StationMetrics {
  time: number;
  jobs: number;
  percentageReported?: number;
}

export interface CapacityMetricsDTO {
  capacity: number;
  growth: number;
}

export interface PerformanceMetricsDTO {
  productivity: number;
  growth: number;
}

export interface DDP {
  sla: number;
  growth: number;
}

export interface JobAnalytics {
  jobsTotalEstimatedCost: number;
  jobsEstimatedPrice: number;
}

export interface BoardMissionsStatusFilterItem {
  boardMissionIds: string[];
  status: number; // 0 = inProcess, 1 = done, 2 = reported
}

export interface DepartmentSummaryDTO {
  totalStations: number;
  totalJobs: number;
  totalEstimatedHours: number;
  totalWorkingHours: number;
  totalEstimatedWorkingHours: number;
  averageSLA?: number;
  averageCapacity: number | null;
  averageCapacityGrowth: number | null;
  jobsTotalEstimatedCost: number;
  jobsEstimatedPrice: number;
  totalDoneJobs: number;
  totalDoneHours: number;
  totalInProcessJobs: number;
  totalInProcessHours: number;
  totalReportedJobs: number;
  totalReportedHours: number;
  averagePerformance: number | null;
  averagePerformanceGrowth: number | null;
  boardMissionsStatusFilter?: BoardMissionsStatusFilterItem[];
}
