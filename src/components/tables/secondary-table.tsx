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
import { ISecondaryTableProps } from "@/components/tables/interface";
import { useStyle } from "@/components/tables/style";
import { useTranslation } from "react-i18next";

const SecondaryTableCell = styled(TableCell)(() => {
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#FCFCFC",
      color: "#475467",
      ...FONT_FAMILY.Lexend(500, 14),
      padding: "5px",
      borderLeft: "1px solid #EAECF0",
      borderRight: "1px solid #EAECF0",
    },
    [`&.${tableCellClasses.body}`]: {
      ...FONT_FAMILY.Lexend(500, 14),
      color: "#475467",
      padding: "5px",
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #DBDBDB",
      borderLeft: "1px solid #EAECF0",
      borderRight: "1px solid #EAECF0",
    },
  };
});

const SecondaryTableRow = styled(TableRow)(() => {
  return {
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

const SecondaryTable = ({
  rows,
  headers,
  stickyHeader,
  stickyFirstCol,
  maxHeight,
}: ISecondaryTableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);
  return (
    <StyledTableContainer
      style={{
        margin: "auto",
        height: "fit-content",
        maxHeight: "800px",
        ...classes.tableContainer,
      }}
    >
      <Table stickyHeader={false}>
        <TableHead>
          <SecondaryTableRow>
            {headers?.map((header, index) => {
              if (index === 0 && stickyHeader) {
                return (
                  <SecondaryTableCell style={classes.stickyHeader}>
                    {header}
                  </SecondaryTableCell>
                );
              } else {
                return (
                  <SecondaryTableCell align={"center"}>
                    {header}
                  </SecondaryTableCell>
                );
              }
            })}
          </SecondaryTableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <SecondaryTableRow>
              {row?.map((cell, index) => {
                if (index === 0 && stickyFirstCol) {
                  return (
                    <SecondaryTableCell style={classes.sticky}>
                      {cell}
                    </SecondaryTableCell>
                  );
                } else {
                  return (
                    <SecondaryTableCell align={"center"}>
                      {cell}
                    </SecondaryTableCell>
                  );
                }
              })}
            </SecondaryTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export { SecondaryTable, SecondaryTableRow, SecondaryTableCell };
