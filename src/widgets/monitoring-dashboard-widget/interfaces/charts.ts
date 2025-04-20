export interface ISalesChart {
  salesItems: ISalesItem[];
  totalPrice: number;
  totalCost: number;
  totalProfit: number;
}

export interface ISalesItem {
  totalCost: number;
  totalPrice: number;
  avgTotalPrice: number;
}
