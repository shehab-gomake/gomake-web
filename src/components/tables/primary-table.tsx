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
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { adaptMarginRight } from "@/utils/adapter";
import { useIsMobile } from "@/hooks/use-responsive";

const PrimaryTableCell = styled(TableCell)(() => {
  const { primaryColor } = useGomakeTheme();
  const isMobile = useIsMobile();

  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor:
        "var(--theme-table-head-bg, var(--theme-primary-light, " +
        primaryColor(50) +
        "))",
      color:
        "var(--theme-table-head-color, var(--theme-text-primary, " +
        primaryColor(900) +
        "))",
      ...FONT_FAMILY.Lexend(500, 14),
      padding: isMobile ? "5px 10px" : "5px",

      height: 47,
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color:
        "var(--theme-table-body-color, var(--theme-text-primary, " +
        primaryColor(500) +
        "))",
      padding: isMobile ? "5px 10px" : "3px 0",

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
      backgroundColor: "var(--theme-table-row-even-bg, #ececec) !important",
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

const ClassicTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      color: "var(--theme-table-classic-head-color, #B5B7C0)",
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px 5px",
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color:
        "var(--theme-table-body-color, var(--theme-text-primary, #292D32))",
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
      borderBottom:
        "1px solid var(--theme-table-border-color, var(--theme-border-color, #e0e0e0))",
    },
  };
});

const RoundTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      ...FONT_FAMILY.Lexend(500, 13),
      backgroundColor:
        "var(--theme-table-round-head-bg, var(--theme-bg-secondary, #F9FAFB))",
      borderBottom:
        "1px solid var(--theme-table-border-color, var(--theme-border-color, #EAECF0)) !important",
      color:
        "var(--theme-table-round-head-color, var(--theme-text-secondary, #475467))",
      padding: "5px 5px",
      height: "40px !important",
    },
    [`&.${tableCellClasses.body}`]: {
      color:
        "var(--theme-table-body-color, var(--theme-text-primary, #292D32))",
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
    background:
      "var(--theme-table-scrollbar-track, var(--theme-bg-tertiary, #f1f1f1))",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "var(--theme-table-scrollbar-thumb, #CCCDCF)",
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
  isAgingeport = false,
  withSort = false,
  enableCheckboxes = false,
  isAgingDetailedReport = false,
  withSortBE = false,
  onClickSortBE,
  onSelectionChange,
  rowCheckboxCondition = () => true,
  handleSortAgingReport,
  isDescOrder,
  isDescOrderBE = false,
  isHeaderSortable,
  docType,
  customSortFns, // Optional. Provide column-specific sort functions (by column index). Defaults to basic comparison if not passed.
  sortConfig: externalSortConfig,
  onSortChange,
  defaultSortIndex,
  defaultSortDirection,
  rowMetadata, // Optional. Array of booleans indicating if each row is a sub-product
}: ITableProps & { rowMetadata?: boolean[] }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  const { primarySecondaryBlend } = useGomakeTheme();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // State for sorting (uncontrolled mode)
  const [internalSortConfig, setInternalSortConfig] = useState<{
    key: number;
    direction: "asc" | "desc";
  } | null>(
    withSort && defaultSortIndex !== undefined
      ? {
          key: defaultSortIndex as number,
          direction: defaultSortDirection || "desc",
        }
      : null
  );
  const sortConfig = externalSortConfig ?? internalSortConfig;
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

  // Sorting logic
  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;

    const { key, direction } = sortConfig;
    const sortFn = customSortFns?.[key];

    return [...rows].sort((a, b) => {
      const result = sortFn
        ? sortFn(a, b)
        : a[key] < b[key]
        ? -1
        : a[key] > b[key]
        ? 1
        : 0;
      return direction === "asc" ? result : -result;
    });
  }, [rows, sortConfig, customSortFns]);

  const handleSort = (index: number) => {
    const next = (() => {
      if (sortConfig?.key === index) {
        return {
          key: index,
          direction: sortConfig.direction === "asc" ? "desc" : ("asc" as const),
        };
      }
      return { key: index, direction: "asc" as const };
    })();

    if (onSortChange) {
      onSortChange(next as { key: number; direction: "asc" | "desc" });
    } else {
      setInternalSortConfig(next as { key: number; direction: "asc" | "desc" });
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: withoutShadow && "none",
        height: "100%",
        ...(variant === "RoundTable" && {
          borderRadius: "var(--theme-radius-lg, 12px)",
          border:
            "1px solid var(--theme-table-border-color, var(--theme-border-color, #EAECF0)) !important",
        }),
      }}
    >
      <StyledTableContainer style={classes.tableContainer}>
        <Table data-tour={dataTour} stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {/* Checkbox column */}
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
                  onMouseEnter={() => setHoveredColumn(header)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  style={{
                    cursor: withSort || withSortBE ? "pointer" : "default",
                    userSelect: "none",
                    ...(index === 0 && stickyHeader
                      ? { position: "sticky", top: 0 }
                      : {}),
                  }}
                  onClick={() => {
                    if (withSort) handleSort(index);
                    if (withSortBE) onClickSortBE(header);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isAgingeport ? header?.name : header}
                    {/* Show sorting icon: on hover OR when this header is sorted (for FE sort) */}
                    {withSort &&
                      !isAgingeport &&
                      header !== "" &&
                      (sortConfig?.key === index ||
                        hoveredColumn === header) && (
                        <IconButton
                          size="small"
                          style={{ ...adaptMarginRight(dir, 4) }}
                        >
                          {sortConfig?.key === index ? (
                            sortConfig.direction === "asc" ? (
                              <ArrowUpward sx={{ fontSize: "18px" }} />
                            ) : (
                              <ArrowDownward sx={{ fontSize: "18px" }} />
                            )
                          ) : (
                            <ArrowUpward sx={{ fontSize: "18px" }} />
                          )}
                        </IconButton>
                      )}
                    {isAgingeport &&
                      (header?.key === "cardName" ||
                        header?.key === "cardCode" ||
                        header?.key === "balanceDue") && (
                        <IconButton
                          size="small"
                          style={{ ...adaptMarginRight(dir, 4) }}
                          onClick={() => handleSortAgingReport(header?.key)}
                        >
                          {!isDescOrder ? (
                            <ArrowUpward sx={{ fontSize: "18px" }} />
                          ) : (
                            <ArrowDownward sx={{ fontSize: "18px" }} />
                          )}
                        </IconButton>
                      )}

                    {withSortBE && isHeaderSortable(docType, header) && (
                      <IconButton
                        size="small"
                        style={{
                          ...adaptMarginRight(dir, 4),
                          visibility:
                            hoveredColumn === header ? "visible" : "hidden",
                        }}
                      >
                        {!isDescOrderBE ? (
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
            {sortedRows?.map((row, rowIndex) => {
              // Check if this row is a sub-product row
              const isSubProductRow = rowMetadata && rowMetadata[rowIndex];

              return (
                <TableRow
                  key={`row_${rowIndex}`}
                  style={{
                    backgroundColor: isSubProductRow
                      ? primarySecondaryBlend(300)
                      : isAgingeport && isAgingDetailedReport && row[0] == " "
                      ? "#F6F6F6"
                      : isLastItemTotal && rowIndex === rows.length - 1
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
                          inputProps={{
                            "aria-label": `select row ${rowIndex}`,
                          }}
                        />
                      ) : null}
                    </TableCell>
                  )}
                  {row.map((cell, cellIndex) => {
                    const cellStyle = columnWidths
                      ? { width: columnWidths[cellIndex] }
                      : {};
                    if (cellIndex === 0 && stickyFirstCol) {
                      return (
                        <TableCell style={classes.sticky}>{cell}</TableCell>
                      );
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
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
};

export {
  TableCell,
  TableRow,
  PrimaryTable,
  PrimaryTableCell,
  PrimaryTableRow,
  RoundTableCell,
  RoundTableRow,
};
