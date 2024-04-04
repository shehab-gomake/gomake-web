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
