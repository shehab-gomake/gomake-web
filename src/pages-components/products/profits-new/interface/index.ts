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

export type ActionProfitRow = {
  actionProfitId: string;
  id: string;
  pricingBy: number;
  totalPrice: number;
  value: number;
};

export type ProfitsPricingTables = {
  description: string;
  exceptionType: number;
  name: string;
  id: string;
  index: number;
  profitValue: number;
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
  anchorElMorePriceTable?: null | HTMLElement;
  openMorePriceTable?: boolean;
  handleClickMorePriceTable?: (e) => void;
  handleCloseMorePriceTable?: () => void;
  selectedActionProfitRow: ActionProfitRow;
  setSelectedActionProfit?: (value: any) => void;
  deleteActionProfitRow?: (id: string) => void;
  selectedAdditionalProfitRow?: ProfitsPricingTables;
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
  anchorElMorePriceTable?: null | HTMLElement;
  openMorePriceTable?: boolean;
  handleClickMorePriceTable?: (e) => void;
  handleCloseMorePriceTable?: () => void;
  selectedActionProfitRow: ActionProfitRow;
  setSelectedActionProfit?: (value: any) => void;
  deleteActionProfitRow?: (id: string) => void;
  selectedAdditionalProfitRow?: ProfitsPricingTables;
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
  anchorElMorePriceTable?: null | HTMLElement;
  openMorePriceTable?: boolean;
  handleClickMorePriceTable?: (e) => void;
  handleCloseMorePriceTable?: () => void;
  setSelectedActionProfit?: (value: any) => void;
  selectedAdditionalProfitRow?: ProfitsPricingTables;
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
  anchorElAdditionalProfitMenu?: null | HTMLElement;
  openAdditionalProfitMenu?: boolean;
  handleCloseAdditionalProfitMenu?: () => void;
  handleClickAdditionalProfitMenu?: (e) => void;
  selectedPricingTableItems?: any;
  setSelectedPricingTableItems?: (value: any) => void;
  dataForExceptions?: ProfitsPricingTables[];
  dataForPricing?: ProfitsPricingTables[];
  onDragEnd?: (res) => void;
  deleteExceptionProfit?: (id: string) => void;
  selectedPricingBy?: SelectedPricingByType;
  actionProfitByActionId?: any;
  getProfitsPricingTables?: () => void;
  typeExceptionSelected?: number;
  setTypeExceptionSelected?: (value: any) => void;
  selectedAdditionalProfitRow?: ProfitsPricingTables;
  setSelectedActionProfitRow?: (value: any) => void;
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
  anchorElMorePriceTable?: null | HTMLElement;
  openMorePriceTable?: boolean;
  handleClickMorePriceTable?: (e) => void;
  handleCloseMorePriceTable?: () => void;
  selectedActionProfitRow: ActionProfitRow;
  setSelectedActionProfit?: (value: any) => void;
  deleteActionProfitRow?: (id: string) => void;
  selectedAdditionalProfitRow?: ProfitsPricingTables;
};

export type selectedOutputsProps = {
  id?: string;
  name?: string;
  valueType?: number;
};
export type selectedParametersProps = {
  id?: string;
  name?: string;
  type?: number;
  values?: any[];
};
