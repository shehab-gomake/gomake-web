import { ReactNode } from "react";
export type TABLE_TYPE = "PrimaryTable " | "ClassicTable";

export interface ITableProps {
  rows: ReactNode[][];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: number;
  variant?: TABLE_TYPE;
}

export interface ISecondaryTableProps {
  rows: ITableRow[];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: number;
  onScrolledBottom?: () => void;
}

interface ITableRow {
  values: (string | number | JSX.Element)[];
  checked: boolean;
}

export interface IAccordionTable {
  title: string;
  isDefault?: boolean;
  children: React.ReactNode;
  onclickOpenMenu: (e) => void;
}
