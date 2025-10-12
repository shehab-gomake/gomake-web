export interface MainProductionReportResponseDTO {
  reportGeneratedAt: string;
  departments: DepartmentPerformanceDTO[];
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
  supplierName?: string; //?should be visible ?
  totalEstimated: StationMetrics;
  done: StationMetrics;
  inProcess: StationMetrics;
  reported: StationMetrics;
  capacity: CapacityMetricsDTO;
  performance: PerformanceMetricsDTO;
  jobAnalytics: JobAnalytics;
  sla: DDP;
  averageProductionTime: number;
}

export interface StationMetrics {
  time: number;
  jobs: number;
  percentageReported?: number; //!here new how to show
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

//!here we can ignore it because it is not used
export interface DepartmentSummaryDTO {
  totalStations: number;
  totalJobs: number;
  totalEstimatedHours: number;
  totalWorkingHours: number;
  averagePerformance: number;
  averageSLA: number;
  overallGrowth: number | null;
}
