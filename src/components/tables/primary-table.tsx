import {styled} from "@mui/material/styles";
import {Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import {ITableProps} from "@/components/tables/interface";

const PrimaryTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#EBECFF",
        color: "#292929",
        ...FONT_FAMILY.Lexend(500, 14),
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#2E3092",
        padding: 2
    },
}));

const PrimaryTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(even)": {
        backgroundColor: "#F6F6F6",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const PrimaryTable = ({rows, headers}: ITableProps) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            headers?.map(header => <PrimaryTableCell align={"center"}>{header}</PrimaryTableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rows?.map(row => {
                            return <PrimaryTableRow>
                                {
                                    row?.map(cel => {
                                        return <PrimaryTableCell align={"center"}>{cel}</PrimaryTableCell>
                                    })
                                }
                            </PrimaryTableRow>
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export {PrimaryTable, PrimaryTableCell, PrimaryTableRow}