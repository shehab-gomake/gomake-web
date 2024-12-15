import { styled } from "@mui/material/styles";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { ITableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { PrimaryCheckbox } from "../check-box/primary-check-box";
import { useMemo, useState } from "react";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"; // Import the icons
import { adaptMarginRight } from "@/utils/adapter";

const PrimaryTableCell = styled(TableCell)(() => {
  const { primaryColor } = useGomakeTheme();
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: primaryColor(50),
      color: primaryColor(900),
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px 5px",
      height: 47,
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color: primaryColor(500),
      padding: "3px 0",
      height: 47,
    },
  };
});

const PrimaryTableRow = styled(TableRow)(() => {
  return {
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const OddEvenTableRow = styled(TableRow)(() => {
  return {
    "&:nth-of-type(even)": {
      backgroundColor: `#ececec8a !important`,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const ClassicTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      color: "#B5B7C0",
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px 5px",
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color: "#292D32",
      padding: "3px 0",
    },
  };
});

const ClassicTableRow = styled(TableRow)(() => {
  return {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:first-child td, &:first-child th": {
      borderBottom: "1px solid #e0e0e0",
    },
  };
});

const RoundTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      ...FONT_FAMILY.Lexend(500, 13),
      backgroundColor: "#F9FAFB",
      borderBottom: "1px solid #EAECF0 !important",
      color: "#475467",
      padding: "5px 5px",
      height: "40px !important",
    },
    [`&.${tableCellClasses.body}`]: {
      color: "#292D32",
      // padding: "3px 0",
      padding: "5px 5px",

      height: 47,
      ...FONT_FAMILY.Lexend(400, 14),
    },
  };
});

const RoundTableRow = styled(TableRow)(() => {
  return {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const StyledTableContainer = styled(TableContainer)(() => ({
  // Enable horizontal scrolling
  overflowX: "auto",

  "&::-webkit-scrollbar": {
    width: "10px",
    height: "10px", // For horizontal scrollbar height
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#CCCDCF",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    cursor: "pointer",
  },
}));

const PrimaryTable = ({
  rows,
  headers,
  stickyHeader,
  stickyFirstCol,
  maxHeight,
  variant,
  withoutShadow,
  columnWidths,
  dataTour,
  isLastItemTotal = false,
  withSort = false, // New prop for enabling sorting
  enableCheckboxes = false,
  onSelectionChange,
  rowCheckboxCondition = () => true,
}: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleRowSelection = (rowIndex: number) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowIndex)) {
        newSelectedRows.delete(rowIndex);
      } else {
        newSelectedRows.add(rowIndex);
      }
      // Trigger the onSelectionChange callback
      onSelectionChange?.(newSelectedRows);
      return newSelectedRows;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows?.size === rows?.filter(rowCheckboxCondition).length) {
      setSelectedRows(new Set());
      onSelectionChange?.(new Set());
    } else {
      const allSelected = new Set<number>();
      rows.forEach((_, index) => {
        if (rowCheckboxCondition(rows[index])) allSelected.add(index);
      });
      setSelectedRows(allSelected);
      onSelectionChange?.(allSelected);
    }
  };

  const TableCell =
    variant === "ClassicTable"
      ? ClassicTableCell
      : variant === "RoundTable"
      ? RoundTableCell
      : PrimaryTableCell;

  const TableRow =
    variant === "ClassicTable"
      ? ClassicTableRow
      : variant === "OddEvenTable"
      ? OddEvenTableRow
      : variant === "RoundTable"
      ? RoundTableRow
      : PrimaryTableRow;

  // State for sorting
  const [sortConfig, setSortConfig] = useState<{
    key: number;
    direction: "asc" | "desc";
  } | null>(null);

  // Sorting logic
  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);

  const handleSort = (index: number) => {
    setSortConfig((prev) => {
      if (prev?.key === index) {
        // Toggle direction
        return {
          key: index,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      // New sort column
      return { key: index, direction: "asc" };
    });
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: withoutShadow && "none",
        height: "100%",
        ...(variant === "RoundTable" && {
          borderRadius: "12px",
          border: "1px solid #EAECF0 !important",
        }),
      }}
    >
      <StyledTableContainer style={classes.tableContainer}>
        <Table data-tour={dataTour} stickyHeader={stickyHeader}>
            {/*old*/}
          {/*<TableHead>*/}
          {/*  <TableRow>*/}
          {/*    {headers?.map((header, index) => {*/}
          {/*      if (index === 0 && stickyHeader) {*/}
          {/*        return <TableCell align={"center"}>{header}</TableCell>;*/}
          {/*      } else {*/}
          {/*        return <TableCell align={"center"}>{header}</TableCell>;*/}
          {/*      }*/}
          {/*    })}*/}
          {/*  </TableRow>*/}
          {/*</TableHead>*/}



            {/*braanch 2496*/}
            {/*<TableHead>*/}
            {/*    <TableRow>*/}
            {/*        /!* Header Checkbox *!/*/}
            {/*        {enableCheckboxes && (*/}
            {/*            <TableCell padding="checkbox">*/}
            {/*                <PrimaryCheckbox*/}
            {/*                    checked={*/}
            {/*                        selectedRows?.size ===*/}
            {/*                        rows?.filter(rowCheckboxCondition).length*/}
            {/*                    }*/}
            {/*                    onChange={handleSelectAll}*/}
            {/*                    inputProps={{ "aria-label": "select all" }}*/}
            {/*                />*/}
            {/*            </TableCell>*/}
            {/*        )}*/}
            {/*        {headers?.map((header, index) => (*/}
            {/*            <TableCell key={index} align="center">*/}
            {/*                {header}*/}
            {/*            </TableCell>*/}
            {/*        ))}*/}
            {/*    </TableRow>*/}
            {/*</TableHead>*/}


{/*main*/}

            {/*<TableHead>*/}
            {/*    <TableRow>*/}
            {/*        {headers?.map((header, index) => (*/}
            {/*            <TableCell*/}
            {/*                align="center"*/}
            {/*                key={`header_${index}`}*/}
            {/*                style={{*/}
            {/*                    cursor: withSort ? "pointer" : "default",*/}
            {/*                    userSelect: "none",*/}
            {/*                }}*/}
            {/*                onClick={() => withSort && handleSort(index)} // Only activate sort if withSort is true*/}
            {/*            >*/}
            {/*                <div*/}
            {/*                    style={{*/}
            {/*                        display: "flex",*/}
            {/*                        justifyContent: "center",*/}
            {/*                        alignItems: "center",*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    {header}*/}
            {/*                    /!* Show sorting icon only when it's the sorted header *!/*/}
            {/*                    {withSort && header !== "" && sortConfig?.key === index && (*/}
            {/*                        <IconButton*/}
            {/*                            size="small"*/}
            {/*                            style={{ ...adaptMarginRight(dir, 4) }}*/}
            {/*                        >*/}
            {/*                            {sortConfig.direction === "asc" ? (*/}
            {/*                                <ArrowUpward sx={{ fontSize: "18px" }} />*/}
            {/*                            ) : (*/}
            {/*                                <ArrowDownward sx={{ fontSize: "18px" }} />*/}
            {/*                            )}*/}
            {/*                        </IconButton>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </TableCell>*/}
            {/*        ))}*/}
            {/*    </TableRow>*/}
            {/*</TableHead>*/}


            <TableHead>
                <TableRow>
                    {/* Checkbox column (from old branch) */}
                    {enableCheckboxes && (
                        <TableCell padding="checkbox">
                            <PrimaryCheckbox
                                checked={
                                    selectedRows?.size ===
                                    rows?.filter(rowCheckboxCondition).length
                                }
                                onChange={handleSelectAll}
                                inputProps={{ "aria-label": "select all" }}
                            />
                        </TableCell>
                    )}

                    {/* Headers */}
                    {headers?.map((header, index) => (
                        <TableCell
                            key={`header_${index}`}
                            align="center"
                            style={{
                                cursor: withSort ? "pointer" : "default",
                                userSelect: "none",
                                ...(index === 0 && stickyHeader ? { position: "sticky", top: 0 } : {}),
                            }}
                            onClick={() => withSort && handleSort(index)} // Only activate sort if withSort is true
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {header}
                                {/* Show sorting icon only when it's the sorted header */}
                                {withSort && header !== "" && sortConfig?.key === index && (
                                    <IconButton
                                        size="small"
                                        style={{ ...adaptMarginRight(dir, 4) }}
                                    >
                                        {sortConfig.direction === "asc" ? (
                                            <ArrowUpward sx={{ fontSize: "18px" }} />
                                        ) : (
                                            <ArrowDownward sx={{ fontSize: "18px" }} />
                                        )}
                                    </IconButton>
                                )}
                            </div>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            
            
            
          <TableBody>
              {/* Row Checkbox */}
              {sortedRows?.map((row, rowIndex) => (
              <TableRow
                key={`row_${rowIndex}`}
                style={{
                  backgroundColor:
                    isLastItemTotal && rowIndex === rows.length - 1
                      ? "#EFDDFF"
                      : "inherit",
                }}
              >
                {enableCheckboxes && (
                  <TableCell padding="checkbox">
                    {rowCheckboxCondition(row) ? (
                      <PrimaryCheckbox
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowSelection(rowIndex)}
                        inputProps={{ "aria-label": `select row ${rowIndex}` }}
                      />
                    ) : null}
                  </TableCell>
                )}
                {row.map((cell, cellIndex) => {
                  const cellStyle = columnWidths
                    ? { width: columnWidths[cellIndex] }
                    : {};
                  if (cellIndex === 0 && stickyFirstCol) {
                    return <TableCell style={classes.sticky}>{cell}</TableCell>;
                  } else {
                    return (
                      <TableCell
                        align="center"
                        style={cellStyle}
                        key={cellIndex}
                      >
                        {cell}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
};

export { TableCell, TableRow, PrimaryTable, PrimaryTableCell, PrimaryTableRow };
