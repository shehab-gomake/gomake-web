export interface ITableProps {
    rows: (string | number | JSX.Element | Date)[][];
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
    onScrolledBottom?: () => void

}

interface ITableRow {
    values: (string | number | JSX.Element)[]
    checked: boolean;
}
