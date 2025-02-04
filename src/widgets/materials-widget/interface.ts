import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";

export interface IMaterialCategoryRow {
  id: string;
  isActive: boolean;
  rowData: Record<string, IRowData>;
  checked: boolean;
}

export interface IRowData {
  value?: string | boolean | string[];
  isEditable: boolean;
  type: EDataTypeEnum;
  valueArray?: string[];
  values?: any[];
  parameterKey?: string;
  id?: string;
  isAdmin: boolean;
  onChangeRowCheckBox?: any;
}

export interface IDynamicRowData {
  [key: string]: string | boolean | number | any[] | any;
}
export interface IMaterialsTableFilter {
  key: string;
  values: string[];
}
export interface IMaterialTableFilteringValue {
  key: string;
  value: string;
}
