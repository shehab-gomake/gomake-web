export interface IProductionStatus {
  id: string;
  name: string;
  key: string;
  index: number;
  kanbanIndex: number;
  textColor: string;
  backgroundColor: string;
  checked?: boolean;
  count?: number;
}
