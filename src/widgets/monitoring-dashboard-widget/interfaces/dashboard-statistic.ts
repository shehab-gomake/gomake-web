export interface IStatisticValue {
  totalPrice: number;
  totalCost: number;
  totalProfit: number;
  successRate: number;
  totalActualCost: number | null;
  profitMargin: number | null;
  salesGrowth?: number | null;
  costGrowth?: number | null;
  profitGrowth?: number | null;
  successRateGrowth?: number | null;
}
