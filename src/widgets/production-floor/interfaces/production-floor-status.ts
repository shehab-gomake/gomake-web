export interface IProductionStatus {
  id: string;
  name: string;
  key: string;
  index: number;
  kanbanIndex: number;
  textColor: string;
  backgroundColor: string;
  darkModeTextColor?: string;
  darkModeBackgroundColor?: string;
  checked?: boolean;
  count?: number;
  isGroup?: boolean;
  recordID?: number
}
