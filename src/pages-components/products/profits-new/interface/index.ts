export type SelectedPricingByType = {
  label: string;
  value: number;
};

export type SelectedTransition = {
  label: string;
  value: number;
};

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

export type ProfitsPricingTables = {
  description: string;
  exceptionType: number;
  name: string;
};

export type ActionProfitRowChartData = {
  costAxis: number[];
  quantityAxis: number[];
  profitAxis: number[];
};

export type PricingListProps = {
  tableHeaders: string[];
  tableBodyList: any[];
  PricingBy: SelectedPricingByType[];
  Transition: SelectedTransition[];
  actionProfitRowChartData: ActionProfitRowChartData;
  setSelectedTransition: (value: any) => void;
  selectedTransition: SelectedTransition;
  selectedPricingBy: SelectedPricingByType;
  updatePricingByForAction: (value: any) => void;
  changeactionProfitRowsItems: (
    index: number,
    filedName: string,
    value: number
  ) => void;
  onOpenAddStepModal: () => void;
  updateActionProfitRow: (data: any) => void;
};
export type PricingListTableProps = {
  tableHeaders: string[];
  tableBodyList: any[];
  changeactionProfitRowsItems: (
    index: number,
    filedName: string,
    value: number
  ) => void;
  onOpenAddStepModal: () => void;
  updateActionProfitRow: (data: any) => void;
  selectedPricingBy: SelectedPricingByType;
};
export type PricingListTableRowProps = {
  item: any;
  index: number;
  changeactionProfitRowsItems: (
    index: number,
    filedName: string,
    value: number
  ) => void;
  updateActionProfitRow: (data: any) => void;
  selectedPricingBy: SelectedPricingByType;
};
export type LineChartProps = {
  actionProfitRowChartData: ActionProfitRowChartData;
};
export type AddStepModalProps = {
  openModal: boolean;
  onCloseModal: () => void;
  selectedPricingBy: SelectedPricingByType;
  addNewStepForActionProfitRow: (value: number, totalPrice: number) => void;
};

export type ProfitRightSideProps = {
  minimumValue: number;
  isUpdateMinimumValue: number;
  onBlurMinimumValue: () => void;
  setIsUpdateMinimumValue: (value: any) => void;
  onInputChangeMinimumValue: (type: any) => void;
  profitsPricingTables?: ProfitsPricingTables[];
  anchorElPricingTables?: null | HTMLElement;
  openPricingTables?: boolean;
  handleClickPricingTables?: (e) => void;
  handleClosePricingTables?: () => void;
  anchorElPricingTablesMapping?: null | HTMLElement;
  openPricingTablesMapping?: boolean;
  handleClickPricingTablesMapping?: (e) => void;
  handleClosePricingTablesMapping?: () => void;
  selectedPricingTableItems?: any;
  setSelectedPricingTableItems?: (value: any) => void;
};

export type ProfitLeftSideProps = {
  tableHeaders: string[];
  actionProfitRowsList: any[];
  PricingBy: SelectedPricingByType[];
  Transition: SelectedTransition[];
  actionProfitRowChartData: ActionProfitRowChartData;
  setSelectedTransition: (value: any) => void;
  selectedTransition: SelectedTransition;
  selectedPricingBy: SelectedPricingByType;
  updatePricingByForAction: (value: any) => void;
  changeactionProfitRowsItems: (
    index: number,
    filedName: string,
    value: number
  ) => void;
  onOpenAddStepModal: () => void;
  updateActionProfitRow: (data: any) => void;
  addNewStepForActionProfitRow: (value: number, totalPrice: number) => void;
  openAddStepModal: boolean;
  onCloseAddStepModal: () => void;
};
