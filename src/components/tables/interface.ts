import { ReactNode } from "react";

export interface ITableProps {
  rows: ReactNode[][];
  headers: (string | JSX.Element)[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: number;
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
