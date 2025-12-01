// types/machineCompare.ts

export interface MachinesCompareResult {
  global: GlobalSummary;
  machines: MachineSummary[];
  jobs: JobCompareSummary[];
}

export interface GlobalSummary {
  totalJobs: number;
  bestMixTotalCost: number;
  bestMixTotalTime: number;
}

export interface MachineSummary {
  machineId: string;
  machineName: string;

  totalJobs: number;
  jobsFeasible: number;
  jobsCheapest: number;
  jobsFastest: number;
  jobsGoodByCost: number;
  jobsGoodByTime: number;

  scenarioTotalCost: number;
  scenarioTotalTime: number;

  deltaCostVsBestMix: number;
  deltaTimeVsBestMix: number;

  jobsNotSupported: number;
}

export interface JobCompareSummary {
  jobId: string;
  jobName: string;
  productType?: string;
  quantity?: number;
  machines: JobMachineCompareItem[];
}

export interface JobMachineCompareItem {
  machineId: string;
  machineName: string;

  totalCost: number;
  totalTimeInMinutes: number;

  isFeasible: boolean;
  isBestCost: boolean;
  isBestTime: boolean;
  isGoodCost: boolean;
  isGoodTime: boolean;
}
