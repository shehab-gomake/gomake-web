export interface ITableProps {
    rows: (string | JSX.Element)[][];
    headers: (string | JSX.Element)[];
    stickyHeader: boolean;
    stickyFirstCol: boolean;
    maxHeight?: number;

}
