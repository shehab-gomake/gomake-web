import { ReactNode } from "react";
export type TABLE_TYPE =
  | "PrimaryTable "
  | "ClassicTable"
  | "OddEvenTable"
  | "RoundTable";

export interface ITableProps {
  rows: ReactNode[][];
  headers: any;
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: any;
  variant?: TABLE_TYPE;
  withoutShadow?: boolean;
  dataTour?: string;
  isLastItemTotal?: boolean;
  columnWidths?: string[];
  onDragEnd?: any;
  withSort?: boolean;
  withSortBE?: boolean;
  onSelectionChange?: (selectedRows: Set<number>) => void;
  enableCheckboxes?: boolean;
  rowCheckboxCondition?: (any) => boolean;
  isAgingeport?: boolean;
  handleSortAgingReport?: (key: string) => void;
  isAgingDetailedReport?: boolean;
  isDescOrder?: boolean;
  onClickSortBE?: (key: any) => void;
  isDescOrderBE?: boolean;
  isHeaderSortable?: any;
  docType?: any;
  customSortFns?: {
    [key: number]: (a: any, b: any) => number;
  };
  /**
   * Optional controlled sorting configuration. When provided, sorting is controlled by the parent
   * component and header clicks will invoke onSortChange instead of changing internal state.
   */
  sortConfig?: {
    key: number;
    direction: "asc" | "desc";
  };
  /**
   * Called when a sortable header is clicked and sorting is controlled by the parent.
   */
  onSortChange?: (config: { key: number; direction: "asc" | "desc" }) => void;
  /**
   * Optional default sort configuration for client-side sorting.
   * When provided with withSort=true, the table initializes sorted
   * by the given column index and direction.
   */
  defaultSortIndex?: number;
  defaultSortDirection?: "asc" | "desc";
}

export interface ISecondaryTableProps {
  rows: (string | number | JSX.Element)[][];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: any;
  onScrolledBottom?: () => void;
  children?: any;
}

export interface IAccordionTable {
  title: string;
  isDefault?: boolean;
  children: React.ReactNode;
  onclickOpenMenu: (e) => void;
}

interface TableHeader {
  key: string;
  fontColor: string;
  fontStyle: number;
}

interface TableRowCell {
  values: string[];
  addionalNote: string | null;
  fontColor: string;
  fontStyle: number;
}

export interface ITableForOutputsProps {
  headers: TableHeader[];
  rows: TableRowCell[][];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: any;
  variant?: TABLE_TYPE;
  withoutShadow?: boolean;
  dataTour?: string;
  isLastItemTotal?: boolean;
  columnWidths?: string[];
}
