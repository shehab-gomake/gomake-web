export interface HpComparisonResponseDto {
  meta: {
    printHouseId: string;
    printHouseName: string;
    generatedAtUtc: string;
    currency: string;
    jobsSource: string;
    lastMonths: number;
    hpMachinesIncluded: string[];
  };
  totals: {
    totalJobs: number;
    jobsWithHpAlternative: number;
    jobsWhereHpFullFlowCheaper: number;
    jobsWhereHpFullFlowFaster: number;
    jobsWhereHpPrintingCheaper: number;
    jobsWhereHpPrintingFaster: number;
  };
  fullWorkflowSummary: {
    totalCostSavingsIfHpChosen: number;
    totalTimeSavingsIfHpChosenMinutes: number;
    averageWastePercentClient: number;
    averageWastePercentHp: number;
  };
  printingOnlySummary: {
    totalPrintingCostSavingsIfHpChosen: number;
    totalPrintingTimeSavingsIfHpChosenMinutes: number;
  };
  jobs: HpJobComparisonDto[];
  printingMachines: HpPrintingMachineAggregateDto[];
  workflows?: HpWorkflowDto[];
}

export interface HpJobComparisonDto {
  jobId: string;
  jobName: string;
  segment: string | null;
  clientBest?: HpWorkflowLiteDto;
  hpBest?: HpWorkflowLiteDto;
  fullFlowCostDiff?: number | null; // client - HP (positive => HP cheaper)
  fullFlowTimeDiffMinutes?: number | null; // client - HP (positive => HP faster)
  printingCostDiff?: number | null;
  printingTimeDiffMinutes?: number | null;
}

export interface HpWorkflowLiteDto {
  workflowId: string;
  printingMachineId: string;
  printingMachineName: string;
  isHpIndigo: boolean;
  totalCost: number;
  totalTimeMinutes: number;
  wastePercent: number;
  printingTotalCost: number;
  printingTotalTimeMinutes: number;
}

export interface HpPrintingMachineAggregateDto {
  machineId: string;
  machineName: string;
  isHpIndigo: boolean;
  jobsCount: number;
  totalPrintingCost: number;
  totalPrintingTimeMinutes: number;
}

export interface HpWorkflowDto {
  jobId: string;
  jobName: string;
  segment: string | null;
  workflowId: string;
  printingMachineId: string;
  printingMachineName: string;
  isHpIndigo: boolean;
  totalSetupTimeMinutes: number;
  totalRunningTimeMinutes: number;
  totalTimeMinutes: number;
  totalSetupCost: number;
  totalRunningCost: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalCost: number;
  wastePercent: number;
  printingSetupTimeMinutes: number;
  printingRunningTimeMinutes: number;
  printingTotalTimeMinutes: number;
  printingSetupCost: number;
  printingRunningCost: number;
  printingMaterialCost: number;
  printingLaborCost: number;
  printingTotalCost: number;
}

