import { styled } from "@mui/material/styles";
import {
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
import { ITableForOutputsProps, ITableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";

const getFontStyle = (fontStyle: number): React.CSSProperties => {
  switch (fontStyle) {
    case 1: // Bold
      return { fontWeight: "bold" };
    case 2: // Italic
      return { fontStyle: "italic" };
    case 3: // BoldItalic
      return { fontWeight: "bold", fontStyle: "italic" };
    case 4: // Underline
      return { textDecoration: "underline" };
    default: // Standard
      return { fontWeight: "normal", fontStyle: "normal" };
  }
};
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

// Define the PrimaryTableRow styled component
const PrimaryTableRow = styled(TableRow)(() => {
  const { neutralColor } = useGomakeTheme();
  return {
    "&:nth-of-type(even)": {
      backgroundColor: neutralColor(100),
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  };
});

// Define the ClassicTableCell styled component
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

// Define the ClassicTableRow styled component
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

const PrimaryTableForOutputs = ({
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
}: ITableForOutputsProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  const TableCellComponent =
    variant === "ClassicTable" ? ClassicTableCell : PrimaryTableCell;
  const TableRowComponent =
    variant === "ClassicTable" ? ClassicTableRow : PrimaryTableRow;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: withoutShadow && "none" }}>
      <TableContainer style={classes.tableContainer}>
        <Table data-tour={dataTour} stickyHeader={stickyHeader}>
          <TableHead>
            <TableRowComponent>
              {headers?.map((header: any, index) => (
                <TableCellComponent
                  key={index}
                  align={"center"}
                  style={{
                    color: header.fontColor, // Apply font color from data
                    ...getFontStyle(header.fontStyle), // Apply font style from data
                  }}
                >
                  {t("tableHeadersForOutputs." + header.key)}
                </TableCellComponent>
              ))}
            </TableRowComponent>
          </TableHead>
          <TableBody>
            {rows?.map((row, rowIndex) => (
              <TableRowComponent
                key={`row_${rowIndex}`}
                style={{
                  backgroundColor:
                    isLastItemTotal && rowIndex === rows.length - 1
                      ? "#EFDDFF"
                      : "inherit",
                }}
              >
                {row.map((cell: any, cellIndex) => {
                  const cellStyle = columnWidths
                    ? {
                      width: columnWidths?.[cellIndex],
                    }
                    : {};
                  const displayText = cell.addionalNote ? (() => {
                    let translatedString = t("tableHeadersForOutputs." + cell.addionalNote)
                      .replace(/\{\{(\d+)\}\}/g, (_, index) => cell.values?.[index] || "");
                    const usedIndexes = Array.from(translatedString.matchAll(/\{\{(\d+)\}\}/g)).map(match => parseInt(match[1], 10));
                    const remainingValues = cell.values?.filter((_, index) => !usedIndexes.includes(index)) || [];
                    if (remainingValues.length > 0 && usedIndexes.length < cell.values?.length) {
                      translatedString += " | " + remainingValues.join(", ");
                    }

                    return translatedString;
                  })() : cell?.values?.join(", ");

                  return (
                    <TableCellComponent
                      key={cellIndex}
                      align={"center"}
                      style={{
                        color: cell.fontColor,
                        ...getFontStyle(cell.fontStyle),
                        ...cellStyle,
                        paddingLeft: 15,
                        paddingRight: 15
                      }}
                    >
                      {displayText}
                    </TableCellComponent>
                  );
                })}
              </TableRowComponent>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export { PrimaryTableForOutputs };
