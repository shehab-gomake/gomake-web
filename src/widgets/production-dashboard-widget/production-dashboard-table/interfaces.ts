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
  dueDatePerformance: DDP;
  jobAnalytics: JobAnalytics;
  sla?: number;
  averageProductionTime: number;
}

export interface StationMetrics {
  time: number;
  jobs: number;
}

export interface CapacityMetricsDTO {
  totalEstimated: number;
  totalWorkingHours: number;
  growth: number;
}

export interface PerformanceMetricsDTO {
  productivity: number;
  growth: number;
}

export interface DDP {
  percentage: number;
  growth: number;
}

export interface JobAnalytics {
  estimatedCost: number;
  estimatedPrice: number;
}

//!here from ibrahem
// export interface CapacityMetricsDTO{
//   capacity: number;
//   growth: number;
// }

//!here from ibrahem
// export interface DDP {
//   dueDatePerformance : number;
//   growth: number;
// }

//!here from ibrahem
// export interface JobAnalytics {
//   jobsTotalEstimatedCost : number;
//   jobsEstimatedPrice : number;
// }

//!here we can ignore it because it is not used
export interface DepartmentSummaryDTO {
  totalEstimated: StationMetrics;
  done: StationMetrics;
  inProcess: StationMetrics;
  reported: StationMetrics;
  capacity: CapacityMetricsDTO;
  performance: PerformanceMetricsDTO;
  dueDatePerformance: DDP;
  jobAnalytics: JobAnalytics;
  sla?: number;
  averageProductionTime: number;
}
