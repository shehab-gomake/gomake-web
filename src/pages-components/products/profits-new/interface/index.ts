export interface SelectedPricingByType {
  label: string;
  value: number;
}

export interface SelectedTransition {
  label: string;
  value: number;
}

export type ActionProfit = {
  id: string;
  printingActionId: string;
  pricingBy: number;
  transitionType: number;
  minPrice: number | null;
  actionProfitRows: any[];
  actionExpections: any[];
  recordID: number;
};

export type ActionProfitRowChartData = {
  costAxis: number[];
  quantityAxis: number[];
  profitAxis: number[];
};
