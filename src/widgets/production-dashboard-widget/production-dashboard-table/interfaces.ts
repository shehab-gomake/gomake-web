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
  supplierName?: string;
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

export interface DepartmentSummaryDTO {
  totalStations: number;
  totalJobs: number;
  totalEstimatedHours: number;
  totalWorkingHours: number;
  averageSLA: number;
  averageGrowth: number | null;
  jobsTotalEstimatedCost: number;
  jobsEstimatedPrice: number;
}
