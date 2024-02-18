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
import { ITableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTranslation } from "react-i18next";

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
  const { neutralColor } = useGomakeTheme();
  return {
    "&:nth-of-type(even)": {
      backgroundColor: neutralColor(100),
    },
    // hide last border
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

const PrimaryTable = ({
  rows,
  headers,
  stickyHeader,
  stickyFirstCol,
  maxHeight,
  variant,
  withoutShadow
}: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  const TableCell =
    variant === "ClassicTable" ? ClassicTableCell : PrimaryTableCell;
  const TableRow =
    variant === "ClassicTable" ? ClassicTableRow : PrimaryTableRow;
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" , boxShadow: withoutShadow && "none" }}>
      <TableContainer style={classes.tableContainer}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow >
              {headers?.map((header, index) => {
                if (index === 0 && stickyHeader) {
                  return (
                    <TableCell align={"center"} >{header}</TableCell>
                  );
                } else {
                  return <TableCell align={"center"}>{header}</TableCell>;
                }
              })}
            </TableRow>
          </TableHead>
          <TableBody  >
            {rows?.map((row, index) => (
              <TableRow key={`row_${index}`}  >
                {row.map((cell, index) => {
                  if (index === 0 && stickyFirstCol) {
                    return <TableCell style={classes.sticky}>{cell}</TableCell>;
                  } else {
                    return <TableCell  align={"center"}>{cell}</TableCell>;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
  );
};

export { TableCell, TableRow, PrimaryTable, PrimaryTableCell, PrimaryTableRow };
