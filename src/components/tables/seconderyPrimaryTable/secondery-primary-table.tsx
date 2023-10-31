import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
import styled from "styled-components";
import { ITableProps } from "../interface";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";


const PrimaryTableCell = styled(TableCell)(() => {
  const { primaryColor } = useGomakeTheme();
  return {
    ...FONT_FAMILY.Lexend(500, 14),
    color: primaryColor(500),
    padding: "3px 0",
  };
});

const PrimaryTableRow = styled(TableRow)(() => {
  return {};
});


const SeconderyPrimaryTableRow = ({ rows, headers, maxHeight }: ITableProps) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle(maxHeight, dir);

  return (
        <TableContainer sx={{borderRadius:"10px",border:"1px solid #EAECF0"}} style={classes.tableContainer}>
             <Table >
                <TableHead>
                        <PrimaryTableRow style={classes.HeaderTable}>
                        {headers?.map((header) => {
                        return (
                            <PrimaryTableCell style={classes.HeaderCell} align={"center"}>{header}</PrimaryTableCell>
                        )
                                    
                        })}
                        </PrimaryTableRow>
                </TableHead>
                <TableBody>
                    {rows?.map((row , rowIndex) => {
                        return (
                            <PrimaryTableRow style={{ background: rowIndex % 2 === 0 ? "#ffffff" : "#F9FAFB"}}>
                            {row.map((cell) => {
                                return (
                                    <PrimaryTableCell style={classes.TableRowCell}  align={"center"}>{cell}</PrimaryTableCell>    
                                )
                            })}
                            </PrimaryTableRow>
                        )
                    }
                    )}
                </TableBody>
             </Table>
        </TableContainer>
  );
};

export { SeconderyPrimaryTableRow, PrimaryTableCell, PrimaryTableRow };