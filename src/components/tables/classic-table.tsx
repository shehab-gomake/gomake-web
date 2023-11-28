import { styled } from "@mui/material/styles";
import {
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
import { useTranslation } from "react-i18next";

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
      // hide last border
      "&:last-child td, &:last-child th": {
        border: 0,
      },
      "&:first-child td, &:first-child th": {
        borderBottom: "1px solid #e0e0e0"
    },
    };
  });

const ClassicTable = ({
  rows,
  headers,
  stickyHeader,
  stickyFirstCol,
  maxHeight,
}: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  return (
    <TableContainer style={classes.tableContainer}>
      <Table stickyHeader={stickyHeader}>
        <TableHead>
          <ClassicTableRow>
            {headers?.map((header, index) => {
              if (index === 0 && stickyHeader) {
                return (
                  <ClassicTableCell style={classes.stickyHeader}>
                    {header}
                  </ClassicTableCell>
                );
              } else {
                return (
                  <ClassicTableCell align={"center"}>{header}</ClassicTableCell>
                );
              }
            })}
          </ClassicTableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <ClassicTableRow>
              {row.map((cell, index) => {
                if (index === 0 && stickyFirstCol) {
                  return (
                    <ClassicTableCell style={classes.sticky}>
                      {cell}
                    </ClassicTableCell>
                  );
                } else {
                  return (
                    <ClassicTableCell align={"center"}>{cell}</ClassicTableCell>
                  );
                }
              })}
            </ClassicTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { ClassicTable, ClassicTableCell, ClassicTableRow };
