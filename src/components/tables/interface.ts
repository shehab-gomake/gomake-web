import { ReactNode } from "react";
export type TABLE_TYPE = "PrimaryTable " | "ClassicTable";

export interface ITableProps {
  rows: ReactNode[][];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: number;
  variant?: TABLE_TYPE;
  withoutShadow?: boolean;
  dataTour?: string;
  isLastItemTotal?: boolean;
  columnWidths?:string[];
}

export interface ISecondaryTableProps {
  rows: (string | number | JSX.Element)[][];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: number;
  onScrolledBottom?: () => void;
  children?: any
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
  maxHeight?: number;
  variant?: TABLE_TYPE;
  withoutShadow?: boolean;
  dataTour?: string;
  isLastItemTotal?: boolean;
  columnWidths?:string[];
}
