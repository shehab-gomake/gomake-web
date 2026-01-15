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
  Skeleton,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/components/tables/style";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { adaptMarginRight } from "@/utils/adapter";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-responsive";

interface IDocumentTableProps {
  rows?: Array<Record<string, any>>; // Optional for safety
  headers: string[];
  stickyHeader?: boolean;
  stickyFirstCol?: boolean;
  maxHeight?: any;
  columnWidths?: string[];
  withSort?: boolean;
  withSortBE?: boolean;
  onClickSortBE?: (key: string) => void;
  isDescOrderBE?: boolean;
  isHeaderSortable?: any;
  docType?: number;
  dataTour?: string;
  loading?: boolean;
  error?: boolean;
  disableSkeleton?: boolean; // do not show skeleton (e.g., during realtime/socket updates)
}

const StyledTableCell = styled(TableCell)(() => {
  const { primaryColor } = useGomakeTheme();
  const isMobile = useIsMobile();

  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor:
        "var(--theme-table-head-bg, var(--theme-primary-100, " +
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

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)(() => {
  return {
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
  };
});

export const DocumentPrimaryTable = ({
  rows = [],
  headers = [],
  stickyHeader = true,
  maxHeight,
  columnWidths,
  withSort = false,
  withSortBE = false,
  onClickSortBE,
  isDescOrderBE = false,
  isHeaderSortable,
  docType,
  dataTour,
  loading = false,
  error = false,
  disableSkeleton = false,
}: IDocumentTableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

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

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <StyledTableContainer style={classes.tableContainer}>
        <Table stickyHeader={stickyHeader} data-tour={dataTour}>
          <TableHead>
            <TableRow>
              {headers.map((key, index) => (
                <StyledTableCell
                  key={`header_${key}`}
                  align="center"
                  onMouseEnter={() => setHoveredColumn(key)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  style={{
                    cursor: withSort || withSortBE ? "pointer" : "default",
                    userSelect: "none",
                    ...(index === 0 && stickyHeader
                      ? { position: "sticky", top: 0 }
                      : {}),
                  }}
                  onClick={() => {
                    if (withSort) handleSort(key);
                    if (withSortBE && onClickSortBE) onClickSortBE(key);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {t(`tableHeaders.${key}`)}
                    {withSort && sortConfig?.key === key && (
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

                    {withSortBE && isHeaderSortable?.(docType, key) && (
                      <IconButton
                        size="small"
                        style={{
                          ...adaptMarginRight(dir, 4),
                          visibility:
                            hoveredColumn === key ? "visible" : "hidden",
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
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.length > 0 ? (
              sortedRows.map((row, rowIndex) => (
                <StyledTableRow key={`row_${rowIndex}`}>
                  {headers.map((key, cellIndex) => {
                    const cellStyle = columnWidths
                      ? { width: columnWidths[cellIndex] }
                      : {};
                    return (
                      <StyledTableCell
                        align="center"
                        key={`cell_${rowIndex}_${cellIndex}`}
                        style={cellStyle}
                      >
                        {row[key]}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell
                  align="center"
                  colSpan={headers.length}
                  style={{ padding: "20px" }}
                >
                  {error ? (
                    <span>{t("skeleton.errorGettingData")}</span>
                  ) : loading && !disableSkeleton ? (
                    <div style={{ width: "100%" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={`sk-${idx}`}
                          style={{ display: "flex", gap: 8, marginBottom: 8 }}
                        >
                          {headers.map((_, cIdx) => (
                            <div key={`sk-${idx}-${cIdx}`} style={{ flex: 1 }}>
                              <Skeleton variant="rounded" height={32} />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span>{t("skeleton.noData")}</span>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
};
